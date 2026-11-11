'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import styles from './Stage.module.css'
import Desktop from './Desktop'
import LockScreen from './LockScreen'
import { ROUTES, type Route, type Slug } from './routes'
import { useMediaQuery } from '@/lib/useMediaQuery'
import tulip from '@/public/os/tulip.webp'
import notebook from '@/public/os/notebook.webp'
import sticky from '@/public/os/sticky-note.webp'
import wordmark from '@/public/os/gwc-wordmark.webp'

// desk: the whole scene, screen locked
// zooming: camera flying into the screen
// desktop: the screen fills the viewport and the OS is live
type Phase = 'desk' | 'zooming' | 'desktop'

const KEYS = Array.from({ length: 23 })

export default function Stage({ initialSlug }: { initialSlug: Slug | null }) {
  const initialRoute: Route | null = initialSlug ? ROUTES[initialSlug] : null
  // Shared links skip the intro and open straight to their window
  const [phase, setPhase] = useState<Phase>(initialRoute ? 'desktop' : 'desk')
  const [pending, setPending] = useState<Route | null>(initialRoute)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const sceneRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const firstRect = useRef<DOMRect | null>(null)
  const openInDesktop = useRef<((route: Route) => void) | null>(null)

  // FLIP: remember where the screen is, switch layouts, then animate
  // from the old spot to the new one. Both layouts are the same scene
  // at different scales, so one transform covers the whole move.
  const goTo = useCallback(
    (next: Phase) => {
      if (reducedMotion) {
        setPhase(next === 'zooming' ? 'desktop' : next)
        return
      }
      firstRect.current = screenRef.current?.getBoundingClientRect() ?? null
      setPhase(next)
    },
    [reducedMotion]
  )

  useLayoutEffect(() => {
    const first = firstRect.current
    const scene = sceneRef.current
    const screen = screenRef.current
    firstRect.current = null
    if (!first || !scene || !screen) return

    const last = screen.getBoundingClientRect()
    const tween = gsap.fromTo(
      scene,
      {
        x: first.left + first.width / 2 - (last.left + last.width / 2),
        y: first.top + first.height / 2 - (last.top + last.height / 2),
        scale: first.width / last.width,
      },
      {
        x: 0,
        y: 0,
        scale: 1,
        transformOrigin: '0 0',
        duration: phase === 'zooming' ? 1.4 : 0.9,
        ease: 'power3.inOut',
        onComplete: () => {
          gsap.set(scene, { clearProps: 'transform' })
          if (phase === 'zooming') setPhase('desktop')
        },
      }
    )
    return () => { tween.kill() }
  }, [phase])

  const enter = useCallback(
    (route: Route | null = null) => {
      setPending(route)
      goTo('zooming')
    },
    [goTo]
  )

  const lock = useCallback(() => {
    window.history.pushState(null, '', '/')
    document.title = 'Girls Who Code | Rutgers–Newark'
    setPending(null)
    goTo('desk')
  }, [goTo])

  // Enter logs in from the lock screen
  useEffect(() => {
    if (phase !== 'desk') return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement)) enter()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, enter])

  const registerOpener = useCallback((open: (route: Route) => void) => {
    openInDesktop.current = open
  }, [])

  function openCameraRoll() {
    const route: Route = { app: 'camera' }
    if (phase === 'desk') enter(route)
    else openInDesktop.current?.(route)
  }

  const showDesktop = phase !== 'desk'

  return (
    <main className={styles.stage} data-phase={phase}>
      <div ref={sceneRef} className={styles.scene}>
        <Image className={styles.notebook} src={notebook} alt="" sizes="30vw" priority />

        <button type="button" className={styles.sticky} onClick={openCameraRoll} aria-label="Open the camera roll">
          <Image src={sticky} alt="" sizes="25vw" priority />
          <span className={styles.stickyText}>
            <svg viewBox="0 0 48 36" aria-hidden="true" className={styles.stickyCamera}>
              <path d="M4 10h9l4-6h14l4 6h9v22H4z M24 14a8 8 0 1 0 .01 0z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2 1.5" />
            </svg>
            Camera roll
          </span>
        </button>

        <div className={styles.monitor}>
          <div
            ref={screenRef}
            className={styles.screen}
            onClick={phase === 'desk' ? () => enter() : undefined}
          >
            {showDesktop && (
              <Desktop initialRoute={pending} onLock={lock} registerOpener={registerOpener} />
            )}
            {phase !== 'desktop' && <LockScreen onEnter={() => enter()} leaving={phase === 'zooming'} />}
            <div className={styles.glass} aria-hidden="true" />
          </div>
          <Image className={styles.wordmark} src={wordmark} alt="Girls Who Code" sizes="15vw" />
          <span className={styles.drive} aria-hidden="true" />
        </div>

        <div className={styles.base} aria-hidden="true">
          <span className={styles.floppy} />
        </div>
        <button
          type="button"
          className={styles.power}
          onClick={phase === 'desk' ? () => enter() : lock}
          aria-label={phase === 'desk' ? 'Power on' : 'Lock screen'}
        />
        <div className={styles.keyboard} aria-hidden="true">
          {KEYS.map((_, i) => <span key={i} className={i === 17 ? styles.space : undefined} />)}
        </div>

        <Image className={styles.tulip} src={tulip} alt="" sizes="30vw" priority />
      </div>

      <p className={styles.hint} aria-hidden={phase !== 'desk'}>
        <span className={styles.hintPointer}>Click the screen or press Enter to log in</span>
        <span className={styles.hintTouch}>Tap the screen to log in</span>
      </p>
    </main>
  )
}
