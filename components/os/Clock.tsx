'use client'

import { useNow } from '@/lib/useNow'

const pad = (n: number) => String(n).padStart(2, '0')

// 24-hour clock like the mockup. Empty until the browser knows the time.
export default function Clock({ className }: { className?: string }) {
  const now = useNow()
  if (!now) return <span className={className} />
  const d = new Date(now)
  return (
    <time className={className} dateTime={d.toISOString()}>
      {pad(d.getHours())}:{pad(d.getMinutes())}
    </time>
  )
}
