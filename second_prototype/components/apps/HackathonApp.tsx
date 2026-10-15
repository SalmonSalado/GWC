'use client'

import styles from './Apps.module.css'
import ExternalButton from './ExternalButton'
import { hackathon } from '@/lib/content'
import { useNow } from '@/lib/useNow'

const target = new Date(hackathon.startsAt).getTime()

// Fixed time zone so the server and browser print the same date
const dateLabel = new Intl.DateTimeFormat('en-US', {
  weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  timeZone: 'America/New_York',
}).format(target)

const pad = (n: number) => String(n).padStart(2, '0')

export default function HackathonApp() {
  const now = useNow()
  const diff = Math.max(0, target - now)
  const units = [
    { label: 'days', value: Math.floor(diff / 86400000) },
    { label: 'hours', value: Math.floor(diff / 3600000) % 24 },
    { label: 'minutes', value: Math.floor(diff / 60000) % 60 },
    { label: 'seconds', value: Math.floor(diff / 1000) % 60 },
  ]
  const started = now > 0 && diff === 0

  return (
    <div className={styles.pane}>
      <div className={styles.skyHeader}>
        <h3>{hackathon.name}</h3>
        <p>{started ? 'Happening now.' : `Starts ${dateLabel} (Eastern)`}</p>
      </div>
      <div className={styles.countdown} role="timer" aria-label={`Time until ${hackathon.name}`}>
        {units.map((u) => (
          <div className={styles.unit} key={u.label}>
            <b>{now === 0 ? '--' : pad(u.value)}</b>
            <span>{u.label}</span>
          </div>
        ))}
      </div>
      <div className={styles.actions}>
        <ExternalButton href={hackathon.registerUrl} missing="Registration opens soon" primary>
          Register for {hackathon.name}
        </ExternalButton>
      </div>
    </div>
  )
}
