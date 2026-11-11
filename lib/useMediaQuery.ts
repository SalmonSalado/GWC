'use client'

import { useSyncExternalStore } from 'react'

// Returns true when the CSS media query matches. Always false on the
// server, then updates on the client without a hydration mismatch.
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false
  )
}
