'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Admin() {
  const [user, setUser] = useState<any>(null)
  const [checking, setChecking] = useState(true)

  // login form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  // eboard form state
  const [eboard, setEboard] = useState<any[]>([])
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [fact, setFact] = useState('')
  const [saving, setSaving] = useState(false)

  // Check session on mount
  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setChecking(false)
    }
    checkUser()
  }, [])

  // Load eboard whenever we become logged in
  useEffect(() => {
    if (user) loadEboard()
  }, [user])

  async function loadEboard() {
    const { data, error } = await supabase
      .from('eboard')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) console.error(error)
    else setEboard(data)
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

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  async function handleAdd() {
    if (!name || !role || !fact) return
    setSaving(true)
    const { error } = await supabase.from('eboard').insert({ name, role, fact })
    if (error) {
      console.error(error)
    } else {
      setName('')
      setRole('')
      setFact('')
      await loadEboard()
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('eboard').delete().eq('id', id)
    if (error) console.error(error)
    else await loadEboard()
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
        <a href="/" className="back-link">← Back to site</a>
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

      <div className="field">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Role (e.g. President)" value={role} onChange={(e) => setRole(e.target.value)} />
        <textarea placeholder="Fun fact" value={fact} onChange={(e) => setFact(e.target.value)} rows={3} />
        <button className="btn-solid" onClick={handleAdd} disabled={saving}>
          {saving ? 'Adding…' : 'Add member'}
        </button>
      </div>

      <div className="admin-list">
        {eboard.map((m) => (
          <div className="admin-row" key={m.id}>
            <span><strong>{m.name}</strong> — {m.role}</span>
            <button className="del" onClick={() => handleDelete(m.id)}>delete</button>
          </div>
        ))}
      </div>

      <a href="/" className="back-link">← View the site</a>
    </main>
  )
}
