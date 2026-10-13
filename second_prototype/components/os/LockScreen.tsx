'use client'

import Image from 'next/image'
import styles from './Stage.module.css'
import { LockIcon } from './icons'
import { useNow } from '@/lib/useNow'
import logo from '@/public/os/gwc-rutgers-logo.webp'

const pad = (n: number) => String(n).padStart(2, '0')

export default function LockScreen({ onEnter, leaving }: { onEnter: () => void; leaving: boolean }) {
  const now = useNow()
  const d = now ? new Date(now) : null
  const time = d ? `${d.getHours() % 12 || 12}:${pad(d.getMinutes())}` : ''
  const ampm = d ? (d.getHours() < 12 ? 'am' : 'pm') : ''
  const date = d
    ? `${d.getDate()} ${d.toLocaleString('en-US', { month: 'short' })}`
    : ''
  const weekday = d ? d.toLocaleString('en-US', { weekday: 'long' }) : ''

  return (
    <div className={styles.lock} data-leaving={leaving || undefined}>
      <span className={styles.lockIcon}><LockIcon size={32} /></span>
      <button type="button" className={styles.login} onClick={onEnter} aria-label="Log in to the site" autoFocus>
        <Image className={styles.avatar} src={logo} alt="" priority />
        <span className={styles.loginLabel}>Log in</span>
      </button>
      <p className={styles.lockTime}>{time}<small>{ampm}</small></p>
      <p className={styles.lockDate}>{date} <span>{weekday}</span></p>
    </div>
  )
}
