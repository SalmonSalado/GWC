'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './Taskbar.module.css'
import {
  CameraIcon, CountdownIcon, FolderIcon, JoinIcon, LockIcon, PersonIcon, TextFileIcon,
} from './icons'
import type { Route } from './routes'

type Props = {
  onOpen: (route: Route) => void
  onLock: () => void
  onClose: () => void
}

// The Start menu is the site's real navigation: every section is one click away.
const ITEMS: { label: string; route: Route; icon: React.ReactNode }[] = [
  { label: 'About us', route: { app: 'about' }, icon: <TextFileIcon size={22} /> },
  { label: 'Next hackathon', route: { app: 'hackathon' }, icon: <CountdownIcon size={22} /> },
  { label: 'Meet the board', route: { app: 'explorer', folder: 'people' }, icon: <PersonIcon size={22} /> },
  { label: 'Join us', route: { app: 'join' }, icon: <JoinIcon size={22} /> },
  { label: 'Camera roll', route: { app: 'camera' }, icon: <CameraIcon size={22} /> },
  { label: 'All documents', route: { app: 'explorer', folder: 'documents' }, icon: <FolderIcon size={22} /> },
]

export default function StartMenu({ onOpen, onLock, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const menu = ref.current
    menu?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()

    function onPointer(e: PointerEvent) {
      const target = e.target as HTMLElement
      if (!menu?.contains(target) && !target.closest('[data-start-button]')) onClose()
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [onClose])

  function onKeyDown(e: React.KeyboardEvent) {
    const items = Array.from(ref.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])
    const i = items.indexOf(document.activeElement as HTMLElement)
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length]?.focus() }
    if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length]?.focus() }
    if (e.key === 'Escape') { e.stopPropagation(); onClose() }
  }

  return (
    <div ref={ref} className={styles.startMenu} role="menu" aria-label="Start" onKeyDown={onKeyDown}>
      <div className={styles.startBrand} aria-hidden="true">girls who code</div>
      <div className={styles.startItems}>
        {ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            className={styles.startItem}
            onClick={() => { onOpen(item.route); onClose() }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
        <hr className={styles.startDivider} />
        <Link role="menuitem" className={styles.startItem} href="/admin">
          <PersonIcon size={22} variant={2} />
          Board login
        </Link>
        <button type="button" role="menuitem" className={styles.startItem} onClick={onLock}>
          <span className={styles.lockSwatch}><LockIcon size={18} /></span>
          Lock screen
        </button>
      </div>
    </div>
  )
}
