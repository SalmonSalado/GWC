'use client'

import Image from 'next/image'
import styles from './Apps.module.css'
import { chapter } from '@/lib/content'
import { useEboard } from '@/lib/eboard'
import logo from '@/public/os/gwc-rutgers-logo.webp'

export default function ComputerApp() {
  const { members, status } = useEboard()
  return (
    <div className={styles.pane}>
      <h3>System properties</h3>
      <div className={styles.props}>
        <Image className={styles.logo} src={logo} alt="Girls Who Code, Rutgers University–Newark logo" />
        <dl className={styles.dl}>
          <dt>Chapter</dt>
          <dd>{chapter.name}</dd>
          <dt>School</dt>
          <dd>{chapter.school}</dd>
          <dt>Location</dt>
          <dd>{chapter.location}</dd>
          <dt>Board</dt>
          <dd>{status === 'ready' ? `${members.length} members` : '…'}</dd>
          <dt>Network</dt>
          <dd><a href={chapter.hqUrl} target="_blank" rel="noopener noreferrer">girlswhocode.com</a></dd>
        </dl>
      </div>
    </div>
  )
}
