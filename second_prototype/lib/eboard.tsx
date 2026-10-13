'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

export type EboardMember = {
  id: string
  name: string
  role: string
  fact: string
  created_at: string
}

type EboardState = {
  members: EboardMember[]
  status: 'loading' | 'ready' | 'error'
  retry: () => void
}

const EboardContext = createContext<EboardState | null>(null)

// Fetches the eboard once for the whole desktop, so the people folder
// and my_computer share one request.
export function EboardProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<EboardMember[]>([])
  const [status, setStatus] = useState<EboardState['status']>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    supabase
      .from('eboard')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error(error)
          setStatus('error')
        } else {
          setMembers((data ?? []) as EboardMember[])
          setStatus('ready')
        }
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = useCallback(() => {
    setStatus('loading')
    setAttempt((n) => n + 1)
  }, [])

  return (
    <EboardContext.Provider value={{ members, status, retry }}>
      {children}
    </EboardContext.Provider>
  )
}

export function useEboard(): EboardState {
  const value = useContext(EboardContext)
  if (!value) throw new Error('useEboard must be used inside <EboardProvider>')
  return value
}
