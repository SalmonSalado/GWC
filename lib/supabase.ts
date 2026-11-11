import { createClient } from '@supabase/supabase-js'

// Invite and password-reset emails link back with details in the URL hash
// (#access_token=...&type=invite, or #error=...). Supabase clears the hash
// once it signs the user in, so read it first.
const hash = typeof window === 'undefined' ? null : new URLSearchParams(window.location.hash.slice(1))
const linkType = hash?.get('type')

export const authLink = {
  // true when the user arrived from an invite or reset link and needs to pick a password
  setPassword: linkType === 'invite' || linkType === 'recovery',
  // e.g. "Email link is invalid or has expired"
  error: hash?.get('error_description') ?? null,
}

// Invite emails link to the Site URL ("/"), but passwords are set on /admin.
// Forward the link there and let /admin sign the user in.
const forwardToAdmin =
  typeof window !== 'undefined' &&
  window.location.pathname !== '/admin' &&
  (authLink.setPassword || authLink.error !== null)

if (forwardToAdmin) window.location.replace('/admin' + window.location.hash)

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  { auth: { detectSessionInUrl: !forwardToAdmin } }
)
