'use client'

import { useReducer } from 'react'
import type { AppId, FolderId, Route } from './routes'

// Each app has at most one window. The explorer window changes folder
// instead of opening a second copy, like a real file browser.

export type WindowState = {
  app: AppId
  folder?: FolderId
  z: number
  minimized: boolean
  // null until the user drags it; CSS handles the default position
  x: number | null
  y: number | null
  // how many windows were open when this one appeared, for cascading
  cascade: number
}

type State = { windows: WindowState[]; topZ: number }

type Action =
  | { type: 'open'; route: Route }
  | { type: 'close'; app: AppId }
  | { type: 'focus'; app: AppId }
  | { type: 'minimize'; app: AppId }
  | { type: 'minimizeAll' }
  | { type: 'toggle'; app: AppId }
  | { type: 'move'; app: AppId; x: number; y: number }
  | { type: 'navigate'; folder: FolderId }

function update(windows: WindowState[], app: AppId, patch: Partial<WindowState>) {
  return windows.map((w) => (w.app === app ? { ...w, ...patch } : w))
}

export function activeWindow(windows: WindowState[]): WindowState | null {
  let top: WindowState | null = null
  for (const w of windows) {
    if (!w.minimized && (!top || w.z > top.z)) top = w
  }
  return top
}

function reducer(state: State, action: Action): State {
  const z = state.topZ + 1
  switch (action.type) {
    case 'open': {
      const { app, folder } = action.route
      const existing = state.windows.find((w) => w.app === app)
      if (existing) {
        return {
          topZ: z,
          windows: update(state.windows, app, { z, minimized: false, folder: folder ?? existing.folder }),
        }
      }
      const win: WindowState = {
        app,
        folder,
        z,
        minimized: false,
        x: null,
        y: null,
        cascade: state.windows.length,
      }
      return { topZ: z, windows: [...state.windows, win] }
    }
    case 'close':
      return { ...state, windows: state.windows.filter((w) => w.app !== action.app) }
    case 'focus': {
      const current = activeWindow(state.windows)
      if (current?.app === action.app) return state
      return { topZ: z, windows: update(state.windows, action.app, { z, minimized: false }) }
    }
    case 'minimize':
      return { ...state, windows: update(state.windows, action.app, { minimized: true }) }
    case 'minimizeAll':
      return { ...state, windows: state.windows.map((w) => ({ ...w, minimized: true })) }
    case 'toggle': {
      // Taskbar button: minimize the active window, otherwise bring it forward
      const isActive = activeWindow(state.windows)?.app === action.app
      if (isActive) return reducer(state, { type: 'minimize', app: action.app })
      return reducer(state, { type: 'focus', app: action.app })
    }
    case 'move':
      return { ...state, windows: update(state.windows, action.app, { x: action.x, y: action.y }) }
    case 'navigate':
      return {
        topZ: z,
        windows: update(state.windows, 'explorer', { folder: action.folder, z, minimized: false }),
      }
  }
}

export function useWindowManager(initial: Route | null) {
  return useReducer(reducer, initial, (route): State => {
    const empty: State = { windows: [], topZ: 10 }
    return route ? reducer(empty, { type: 'open', route }) : empty
  })
}
