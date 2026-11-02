'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import { authLink, supabase } from '../../lib/supabase'
import { PHOTO_BUCKET, photoUrl, type EboardMember } from '../../lib/eboard'

const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_PHOTO_MB = 5

export default function Admin() {
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)

  // login form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState(
    authLink.error ? 'This link has expired or was already used. Ask a board admin to send a new invite.' : ''
  )
  const [loggingIn, setLoggingIn] = useState(false)

  // set-password form state (people arriving from an invite or reset email)
  const [needsPassword, setNeedsPassword] = useState(authLink.setPassword)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  // eboard form state
  const [eboard, setEboard] = useState<EboardMember[]>([])
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [fact, setFact] = useState('')
  const [bio, setBio] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  // bumping this clears the file picker after a save
  const [photoInputKey, setPhotoInputKey] = useState(0)
  // the member being edited; null means the form adds a new one
  const [editing, setEditing] = useState<EboardMember | null>(null)
  const [saving, setSaving] = useState(false)
  const [eboardError, setEboardError] = useState('')

  // Check session on mount
  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setChecking(false)
    }
    checkUser()
  }, [])

  // Load eboard once we're logged in with a password set
  useEffect(() => {
    if (user && !needsPassword) loadEboard()
  }, [user, needsPassword])

  async function loadEboard() {
    const { data, error } = await supabase
      .from('eboard')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) setEboardError(`Couldn't load the board: ${error.message}`)
    else setEboard((data ?? []) as EboardMember[])
  }

  async function handleLogin() {
    setLoginError('')
    setLoggingIn(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setLoginError(error.message)
    } else {
      setUser(data.user)
      setEmail('')
      setPassword('')
    }
    setLoggingIn(false)
  }

  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError('')
    if (newPassword.length < 8) {
      setPasswordError('Use at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('The passwords don’t match.')
      return
    }
    setSavingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setPasswordError(error.message)
    } else {
      setNeedsPassword(false)
      setNewPassword('')
      setConfirmPassword('')
    }
    setSavingPassword(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  function resetForm() {
    setName('')
    setRole('')
    setFact('')
    setBio('')
    setPhoto(null)
    setPhotoInputKey((k) => k + 1)
    setEditing(null)
  }

  function startEditing(m: EboardMember) {
    setEboardError('')
    setName(m.name)
    setRole(m.role)
    setFact(m.fact)
    setBio(m.bio ?? '')
    setPhoto(null)
    setPhotoInputKey((k) => k + 1)
    setEditing(m)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function choosePhoto(file: File | null) {
    setEboardError('')
    if (file && !PHOTO_TYPES.includes(file.type)) {
      setEboardError('Photos must be JPG, PNG, or WebP.')
      setPhotoInputKey((k) => k + 1)
      return
    }
    if (file && file.size > MAX_PHOTO_MB * 1024 * 1024) {
      setEboardError(`Photos must be under ${MAX_PHOTO_MB} MB.`)
      setPhotoInputKey((k) => k + 1)
      return
    }
    setPhoto(file)
  }

  async function handleSave() {
    setEboardError('')
    if (!name || !role || !fact) {
      setEboardError('Fill in the name, role, and fun fact.')
      return
    }
    setSaving(true)

    // Upload the photo first under a random name, so a new photo never
    // overwrites one that's still in use
    let photoPath = editing?.photo_path ?? null
    if (photo) {
      const ext = photo.name.split('.').pop()?.toLowerCase() || 'jpg'
      const path = `${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, photo, { contentType: photo.type })
      if (error) {
        setEboardError(`Couldn't upload the photo: ${error.message}`)
        setSaving(false)
        return
      }
      photoPath = path
    }

    const fields = { name, role, fact, bio: bio || null, photo_path: photoPath }
    // .select() returns the saved rows, so a write blocked by row-level
    // security (which changes nothing, with no error) can be caught
    const { data, error } = editing
      ? await supabase.from('eboard').update(fields).eq('id', editing.id).select()
      : await supabase.from('eboard').insert(fields).select()

    if (error || !data?.length) {
      setEboardError(`Couldn't save the member: ${error?.message ?? "Supabase didn't allow it."}`)
      // Don't leave an unused upload behind
      if (photo && photoPath) await supabase.storage.from(PHOTO_BUCKET).remove([photoPath])
    } else {
      // Replaced photo: delete the old file
      if (photo && editing?.photo_path) await supabase.storage.from(PHOTO_BUCKET).remove([editing.photo_path])
      resetForm()
      await loadEboard()
    }
    setSaving(false)
  }

  async function handleDelete(m: EboardMember) {
    if (!window.confirm(`Delete ${m.name} from the board?`)) return
    setEboardError('')
    // .select() returns the deleted rows, so a delete blocked by row-level
    // security (which deletes nothing, with no error) can be caught
    const { data, error } = await supabase.from('eboard').delete().eq('id', m.id).select()
    if (error) setEboardError(`Couldn't delete the member: ${error.message}`)
    else if (!data?.length) setEboardError("Couldn't delete the member: Supabase didn't allow it.")
    else {
      if (m.photo_path) await supabase.storage.from(PHOTO_BUCKET).remove([m.photo_path])
      if (editing?.id === m.id) resetForm()
      await loadEboard()
    }
  }

  if (checking) {
    return <main className="admin-wrap"><p>Loading…</p></main>
  }

  // LOGGED OUT — login form
  if (!user) {
    return (
      <main className="admin-wrap">
        <h1>Admin Login</h1>
        <div className="field">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn-solid" onClick={handleLogin} disabled={loggingIn}>
            {loggingIn ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
        {loginError && <p className="err">{loginError}</p>}
        <Link href="/" className="back-link">← Back to site</Link>
      </main>
    )
  }

  // ARRIVED FROM INVITE — choose a password before anything else
  if (needsPassword) {
    return (
      <main className="admin-wrap">
        <h1>Create your password</h1>
        <p style={{ marginBottom: '1.5rem' }}>
          Welcome, <strong>{user.email}</strong>. Choose a password you&apos;ll use to sign in to the admin panel.
        </p>
        <form className="field" onSubmit={handleSetPassword}>
          <input
            type="password"
            placeholder="New password (at least 8 characters)"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" className="btn-solid" disabled={savingPassword}>
            {savingPassword ? 'Saving…' : 'Save password'}
          </button>
        </form>
        {passwordError && <p className="err">{passwordError}</p>}
      </main>
    )
  }

  // LOGGED IN — eboard management
  return (
    <main className="admin-wrap">
      <h1>Eboard Admin</h1>
      <p style={{ marginBottom: '1.5rem' }}>
        Signed in as <strong>{user.email}</strong>{' '}
        <button className="btn-ghost" onClick={handleLogout} style={{ marginLeft: '0.5rem' }}>
          Sign out
        </button>
      </p>

      {editing && <h2 className="admin-subhead">Editing {editing.name}</h2>}
      <div className="field">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Role (e.g. President)" value={role} onChange={(e) => setRole(e.target.value)} />
        <textarea
          placeholder="Description (optional): major, year, what they do on the board"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
        />
        <textarea placeholder="Fun fact" value={fact} onChange={(e) => setFact(e.target.value)} rows={3} />
        <label className="photo-pick">
          <span>
            {editing?.photo_path ? 'Replace photo (optional)' : 'Photo (optional, JPG/PNG/WebP, under 5 MB)'}
          </span>
          <input
            key={photoInputKey}
            type="file"
            accept={PHOTO_TYPES.join(',')}
            onChange={(e) => choosePhoto(e.target.files?.[0] ?? null)}
          />
        </label>
        <button className="btn-solid" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : editing ? 'Save changes' : 'Add member'}
        </button>
        {editing && (
          <button className="btn-ghost" onClick={resetForm} disabled={saving}>Cancel editing</button>
        )}
      </div>
      {eboardError && <p className="err">{eboardError}</p>}

      <div className="admin-list">
        {eboard.map((m) => (
          <div className="admin-row" key={m.id}>
            <span className="admin-member">
              {m.photo_path && (
                <Image className="admin-thumb" src={photoUrl(m.photo_path)} alt="" width={36} height={36} />
              )}
              <span><strong>{m.name}</strong> — {m.role}</span>
            </span>
            <span>
              <button className="del edit" onClick={() => startEditing(m)}>edit</button>
              <button className="del" onClick={() => handleDelete(m)}>delete</button>
            </span>
          </div>
        ))}
      </div>

      <Link href="/" className="back-link">← View the site</Link>
    </main>
  )
}
