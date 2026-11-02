import { supabase } from '@/lib/supabase'

const BUCKET = 'eboard-photos'
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB, matches the bucket limit

// Only these types are allowed (matches the bucket settings). No SVG.
const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

/** Check the file before uploading so admins get a clear error message. */
export function validatePhoto(file: File): string | null {
  if (!EXT_BY_TYPE[file.type]) return 'Photo must be a JPG, PNG, or WebP.'
  if (file.size > MAX_BYTES) return 'Photo must be 5 MB or smaller.'
  return null
}

/**
 * Replace (or add) a board member's photo.
 * Order: upload new file → point the row at it → delete the old file.
 * If anything fails midway, the member never ends up with a broken photo.
 */
export async function replacePhoto(
  memberId: string,
  oldPath: string | null,
  file: File
): Promise<{ path?: string; error?: string }> {
  const problem = validatePhoto(file)
  if (problem) return { error: problem }

  // 1. Unique filename: extension comes from the file type, not the file name
  const path = `eboard/${memberId}-${Date.now()}.${EXT_BY_TYPE[file.type]}`

  // 2. Upload (never overwrite)
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type })
  if (uploadError) return { error: uploadError.message }

  // 3. Save the new path on the member's row.
  //    .select() returns the updated row, so we can tell if RLS blocked it
  //    (a blocked update "succeeds" on 0 rows instead of throwing an error).
  const { data, error: updateError } = await supabase
    .from('eboard')
    .update({ photo_path: path })
    .eq('id', memberId)
    .select('id')
  if (updateError || !data?.length) {
    await supabase.storage.from(BUCKET).remove([path]) // clean up the new file
    return { error: updateError?.message ?? 'You do not have permission to edit this member.' }
  }

  // 4. Delete the old photo (failure here just leaves a harmless extra file)
  if (oldPath) await supabase.storage.from(BUCKET).remove([oldPath])

  return { path }
}

/**
 * Delete a board member and their photo.
 * Row first, then the file, so a failed delete never leaves a member without a photo.
 */
export async function deleteMember(
  memberId: string,
  photoPath: string | null
): Promise<{ error?: string }> {
  const { data, error } = await supabase
    .from('eboard')
    .delete()
    .eq('id', memberId)
    .select('id')
  if (error || !data?.length) {
    return { error: error?.message ?? 'You do not have permission to delete this member.' }
  }
  if (photoPath) await supabase.storage.from(BUCKET).remove([photoPath])
  return {}
}

/** Turn a stored path into an image URL for the public site. */
export function photoUrl(path: string | null): string | null {
  if (!path) return null
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}
