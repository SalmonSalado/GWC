'use client'

import { useEffect, useRef } from 'react'
import styles from './Window.module.css'
import type { WindowState } from './useWindowManager'

type Props = {
  win: WindowState
  title: string
  icon: React.ReactNode
  active: boolean
  size: { w: string; h: string }
  canDrag: boolean
  onFocus: () => void
  onClose: () => void
  onMinimize: () => void
  onMove: (x: number, y: number) => void
  children: React.ReactNode
}

const TASKBAR = 40

export default function Window({
  win, title, icon, active, size, canDrag, onFocus, onClose, onMinimize, onMove, children,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const titleId = `win-title-${win.app}`

  // Move keyboard focus into a window when it opens
  useEffect(() => {
    ref.current?.focus({ preventScroll: true })
  }, [])

  function startDrag(e: React.PointerEvent<HTMLDivElement>) {
    if (!canDrag || e.button !== 0) return
    if ((e.target as HTMLElement).closest('button')) return
    const el = ref.current
    const screen = el?.offsetParent as HTMLElement | null
    if (!el || !screen) return

    const startX = e.clientX
    const startY = e.clientY
    const originX = el.offsetLeft
    const originY = el.offsetTop
    // The screen may be scaled during the intro zoom; divide it out
    const scale = screen.getBoundingClientRect().width / screen.offsetWidth || 1
    const handle = e.currentTarget
    handle.setPointerCapture(e.pointerId)

    const move = (ev: PointerEvent) => {
      const x = originX + (ev.clientX - startX) / scale
      const y = originY + (ev.clientY - startY) / scale
      // Keep at least part of the title bar on screen so it can be grabbed again
      const maxX = screen.offsetWidth - 80
      const minX = 80 - el.offsetWidth
      const maxY = screen.offsetHeight - TASKBAR - 32
      onMove(Math.min(maxX, Math.max(minX, x)), Math.min(maxY, Math.max(0, y)))
    }
    const up = () => {
      handle.removeEventListener('pointermove', move)
      handle.removeEventListener('pointerup', up)
      handle.removeEventListener('pointercancel', up)
    }
    handle.addEventListener('pointermove', move)
    handle.addEventListener('pointerup', up)
    handle.addEventListener('pointercancel', up)
  }

  const style = {
    '--w': size.w,
    '--h': size.h,
    '--cascade': `${win.cascade * 26}px`,
    zIndex: win.z,
    ...(win.x !== null && win.y !== null ? { '--x': `${win.x}px`, '--y': `${win.y}px` } : {}),
  } as React.CSSProperties

  return (
    <section
      ref={ref}
      className={styles.window}
      data-active={active || undefined}
      hidden={win.minimized}
      style={style}
      tabIndex={-1}
      aria-labelledby={titleId}
      onPointerDown={onFocus}
      onFocus={onFocus}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          onClose()
        }
      }}
    >
      <div className={styles.titlebar} onPointerDown={startDrag} data-draggable={canDrag || undefined}>
        <span className={styles.titleIcon}>{icon}</span>
        <h2 id={titleId} className={styles.title}>{title}</h2>
        <button type="button" className={styles.minimize} onClick={onMinimize} aria-label={`Minimize ${title}`} />
        <button type="button" className={styles.close} onClick={onClose} aria-label={`Close ${title}`} />
      </div>
      <div className={styles.body}>{children}</div>
    </section>
  )
}
