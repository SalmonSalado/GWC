'use client'

import { useSyncExternalStore } from 'react'

// One shared 1-second ticker for the clock and countdown.
// Returns 0 on the server (and during hydration), so callers can
// render a placeholder instead of a time that won't match the client.

let now = 0
let timer: ReturnType<typeof setInterval> | undefined
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (!timer) {
    now = Date.now()
    timer = setInterval(() => {
      now = Date.now()
      listeners.forEach((fn) => fn())
    }, 1000)
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && timer) {
      clearInterval(timer)
      timer = undefined
    }
  }
}

export function useNow(): number {
  return useSyncExternalStore(subscribe, () => now, () => 0)
}
