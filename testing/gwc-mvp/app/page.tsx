'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [eboard, setEboard] = useState<any[]>([])

  // Fetch eboard cards from Supabase on mount
  useEffect(() => {
    async function loadEboard() {
      const { data, error } = await supabase
        .from('eboard')
        .select('*')
        .order('created_at', { ascending: true })
      if (error) console.error(error)
      else setEboard(data)
    }
    loadEboard()
  }, [])

  // All the cinematic effects from the demo, ported into one effect.
  // Runs once after mount. Cleans up its listeners on unmount.
  useEffect(() => {
    /* ---- 1. CUSTOM CURSOR ---- */
    const dot = document.getElementById('cursor-dot')!
    const ring = document.getElementById('cursor-ring')!
    const ringLabel = ring.querySelector('span')!

    let mouseX = -100, mouseY = -100
    let ringX = -100, ringY = -100
    let rafId = 0

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`
    }
    window.addEventListener('mousemove', onMouseMove)

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15
      ring.style.transform = `translate(${ringX - 22}px, ${ringY - 22}px)`
      rafId = requestAnimationFrame(animateRing)
    }
    animateRing()

    // Cursor hover targets
    const cursorTargets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-cursor]')
    )
    const enterHandlers = new Map<HTMLElement, () => void>()
    const leaveHandlers = new Map<HTMLElement, () => void>()
    cursorTargets.forEach((el) => {
      const enter = () => {
        ring.classList.add('is-active')
        ringLabel.textContent = el.dataset.cursor || ''
      }
      const leave = () => ring.classList.remove('is-active')
      enterHandlers.set(el, enter)
      leaveHandlers.set(el, leave)
      el.addEventListener('mouseenter', enter)
      el.addEventListener('mouseleave', leave)
    })

    /* ---- 2. TEXT REVEAL ---- */
    const revealTimer = setTimeout(
      () => document.body.classList.add('is-loaded'),
      150
    )

    /* ---- 3. MAGNETIC BUTTONS ---- */
    const wraps = Array.from(document.querySelectorAll<HTMLElement>('.magnet-wrap'))
    const wrapMove = new Map<HTMLElement, (e: MouseEvent) => void>()
    const wrapLeave = new Map<HTMLElement, () => void>()
    wraps.forEach((wrap) => {
      const btn = wrap.querySelector<HTMLElement>('.magnet')!
      const move = (e: MouseEvent) => {
        const r = wrap.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        btn.style.transform = `translate(${dx * 0.35}px, ${dy * 0.35}px)`
      }
      const leave = () => { btn.style.transform = 'translate(0, 0)' }
      wrapMove.set(wrap, move)
      wrapLeave.set(wrap, leave)
      wrap.addEventListener('mousemove', move)
      wrap.addEventListener('mouseleave', leave)
    })

    /* ---- 5. COUNTDOWN ---- */
    const target = new Date('2026-10-17T09:00:00-04:00') // ← change me
    const pad = (n: number) => String(n).padStart(2, '0')
    function tick() {
      const diff = Math.max(0, target.getTime() - Date.now())
      const d = document.getElementById('cd-d')
      const h = document.getElementById('cd-h')
      const m = document.getElementById('cd-m')
      const s = document.getElementById('cd-s')
      if (d) d.textContent = pad(Math.floor(diff / 86400000))
      if (h) h.textContent = pad(Math.floor(diff / 3600000) % 24)
      if (m) m.textContent = pad(Math.floor(diff / 60000) % 60)
      if (s) s.textContent = pad(Math.floor(diff / 1000) % 60)
    }
    tick()
    const cdInterval = setInterval(tick, 1000)

    /* ---- 6. MARQUEE (duplicate the track) ---- */
    const track = document.getElementById('marquee-track')
    if (track && !track.dataset.doubled) {
      track.innerHTML += track.innerHTML
      track.dataset.doubled = 'true'
    }

    /* ---- CLEANUP ---- */
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
      clearTimeout(revealTimer)
      clearInterval(cdInterval)
      cursorTargets.forEach((el) => {
        el.removeEventListener('mouseenter', enterHandlers.get(el)!)
        el.removeEventListener('mouseleave', leaveHandlers.get(el)!)
      })
      wraps.forEach((wrap) => {
        wrap.removeEventListener('mousemove', wrapMove.get(wrap)!)
        wrap.removeEventListener('mouseleave', wrapLeave.get(wrap)!)
      })
    }
  }, [eboard]) // re-run so cursor targets on freshly-rendered cards get wired

  return (
    <>
      {/* Custom cursor */}
      <div id="cursor-dot" />
      <div id="cursor-ring"><span /></div>

      {/* Top bar with login button */}
      <div className="topbar">
        <a href="/admin" className="login-link" data-cursor="Admin">Login</a>
      </div>

      {/* HERO */}
      <section className="hero">
        <p className="eyebrow">Girls Who Code · Rutgers–Newark</p>
        <div className="reveal-mask"><h1 className="line">Girls</h1></div>
        <div className="reveal-mask"><h1 className="line">Who</h1></div>
        <div className="reveal-mask"><h1 className="line"><span className="voice">Code</span></h1></div>
        <p className="sub">A community inclusive to all, we welcome you right here in the center of Newark.</p>
      </section>

      {/* Cursor targets + magnetic buttons */}
      <section>
        <p className="eyebrow">Hover these — watch the cursor</p>
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', fontSize: '1.5rem', fontWeight: 500, marginBottom: '3rem' }}>
          <a href="#" data-cursor="Read" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '2px solid var(--ink)' }}>The blog</a>
          <a href="#" data-cursor="View" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '2px solid var(--ink)' }}>Events</a>
          <a href="#" data-cursor="Meet" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '2px solid var(--ink)' }}>The eboard</a>
        </div>
        <div className="magnet-wrap"><button className="magnet">Join the chapter</button></div>
        <div className="magnet-wrap"><button className="magnet">Register for HackRU</button></div>
      </section>

      {/* Marquee */}
      <div className="marquee" aria-hidden="true">
        <div className="track" id="marquee-track">
          <span>Workshops <i className="dot">●</i></span>
          <span>Hack nights <i className="dot">●</i></span>
          <span>Mentorship <i className="dot">●</i></span>
          <span>Sisterhood <i className="dot">●</i></span>
          <span>Create Academy <i className="dot">●</i></span>
        </div>
      </div>

      {/* Countdown */}
      <section>
        <p className="eyebrow">Next hackathon</p>
        <div className="countdown" id="countdown">
          <div className="unit"><b id="cd-d">00</b><span>days</span></div>
          <div className="unit"><b id="cd-h">00</b><span>hours</span></div>
          <div className="unit"><b id="cd-m">00</b><span>minutes</span></div>
          <div className="unit"><b id="cd-s">00</b><span>seconds</span></div>
        </div>
      </section>

      {/* Eboard cards — now driven by Supabase */}
      <section>
        <p className="eyebrow">Get to know us</p>
        {eboard.length === 0 ? (
          <p style={{ opacity: 0.6 }}>
            No eboard members yet — add some from the{' '}
            <a href="/admin" style={{ color: 'var(--teal)' }}>admin panel</a>.
          </p>
        ) : (
          <div className="cards">
            {eboard.map((m) => (
              <div className="card" key={m.id} data-cursor="Hi!">
                <div className="cover"><p className="fact">{m.fact}</p></div>
                <h3>{m.name}</h3><small>{m.role}</small>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
