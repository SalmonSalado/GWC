'use client'

import { useCallback, useState } from 'react'
import styles from './Taskbar.module.css'
import Clock from './Clock'
import StartMenu from './StartMenu'
import { ChatIcon, GwcMark, NetworkIcon } from './icons'
import type { AppId, Route } from './routes'
import { hackathon } from '@/lib/content'
import { useNow } from '@/lib/useNow'

type TaskbarWindow = { app: AppId; title: string; icon: React.ReactNode; active: boolean }

type Props = {
  windows: TaskbarWindow[]
  onToggle: (app: AppId) => void
  onOpen: (route: Route) => void
  onLock: () => void
}

export default function Taskbar({ windows, onToggle, onOpen, onLock }: Props) {
  const [startOpen, setStartOpen] = useState(false)
  const [balloonOpen, setBalloonOpen] = useState(false)
  const [seen, setSeen] = useState(false)
  const now = useNow()
  const closeStart = useCallback(() => setStartOpen(false), [])
  const days = Math.max(0, Math.ceil((new Date(hackathon.startsAt).getTime() - now) / 86400000))

  return (
    <>
      {startOpen && (
        <StartMenu onOpen={onOpen} onLock={onLock} onClose={closeStart} />
      )}

      {balloonOpen && (
        <div className={styles.balloon} role="status">
          <p className={styles.balloonTitle}>{hackathon.name} is coming up</p>
          <p>{now ? `${days} ${days === 1 ? 'day' : 'days'} to go.` : 'Counting down…'}</p>
          <div className={styles.balloonActions}>
            <button
              type="button"
              className={styles.balloonButton}
              onClick={() => { onOpen({ app: 'hackathon' }); setBalloonOpen(false) }}
            >
              See the countdown
            </button>
            <button type="button" className={styles.balloonDismiss} onClick={() => setBalloonOpen(false)}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      <nav className={styles.taskbar} aria-label="Taskbar">
        <button
          type="button"
          className={styles.start}
          data-start-button
          aria-haspopup="menu"
          aria-expanded={startOpen}
          onClick={() => setStartOpen((o) => !o)}
        >
          <GwcMark size={18} />
          Start
        </button>

        <div className={styles.tasks}>
          {windows.map((w) => (
            <button
              key={w.app}
              type="button"
              className={styles.task}
              aria-pressed={w.active}
              onClick={() => onToggle(w.app)}
            >
              {w.icon}
              <span className={styles.taskLabel}>{w.title}</span>
            </button>
          ))}
        </div>

        <div className={styles.tray}>
          <button
            type="button"
            className={styles.trayButton}
            aria-label={seen ? 'Notifications' : 'Notifications, 1 new'}
            aria-expanded={balloonOpen}
            onClick={() => { setBalloonOpen((o) => !o); setSeen(true) }}
          >
            <ChatIcon size={20} />
            {!seen && <span className={styles.badge} aria-hidden="true">1</span>}
          </button>
          <span className={styles.trayIcon} title="Connected"><NetworkIcon size={20} /></span>
          <Clock className={styles.clock} />
        </div>
      </nav>
    </>
  )
}
