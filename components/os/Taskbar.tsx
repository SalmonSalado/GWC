'use client'

import { useCallback, useState } from 'react'
import styles from './Taskbar.module.css'
import Clock from './Clock'
import StartMenu from './StartMenu'
import { GwcMark, NetworkIcon } from './icons'
import type { AppId, Route } from './routes'

type TaskbarWindow = { app: AppId; title: string; icon: React.ReactNode; active: boolean }

type Props = {
  windows: TaskbarWindow[]
  onToggle: (app: AppId) => void
  onOpen: (route: Route) => void
  onLock: () => void
}

export default function Taskbar({ windows, onToggle, onOpen, onLock }: Props) {
  const [startOpen, setStartOpen] = useState(false)
  const closeStart = useCallback(() => setStartOpen(false), [])

  return (
    <>
      {startOpen && (
        <StartMenu onOpen={onOpen} onLock={onLock} onClose={closeStart} />
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
          <span className={styles.trayIcon} title="Connected"><NetworkIcon size={20} /></span>
          <Clock className={styles.clock} />
        </div>
      </nav>
    </>
  )
}
