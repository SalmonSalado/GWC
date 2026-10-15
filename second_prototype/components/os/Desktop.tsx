'use client'

import { useCallback, useEffect, useState } from 'react'
import styles from './Desktop.module.css'
import IconButton from './IconButton'
import Taskbar from './Taskbar'
import Window from './Window'
import {
  CameraIcon, ComputerIcon, CountdownIcon, FolderIcon, JoinIcon, RecycleIcon, TextFileIcon,
} from './icons'
import { activeWindow, useWindowManager, type WindowState } from './useWindowManager'
import { PAGE_TITLES, routeFromPath, slugFor, titleFor, type AppId, type Route } from './routes'
import Explorer from '../apps/Explorer'
import AboutApp from '../apps/AboutApp'
import HackathonApp from '../apps/HackathonApp'
import JoinApp from '../apps/JoinApp'
import ComputerApp from '../apps/ComputerApp'
import RecycleApp from '../apps/RecycleApp'
import CameraApp from '../apps/CameraApp'
import { EboardProvider } from '@/lib/eboard'
import { useMediaQuery } from '@/lib/useMediaQuery'

// Window sizes. Percentages are of the screen, so windows shrink on small screens.
const SIZES: Record<AppId, { w: string; h: string }> = {
  explorer: { w: 'min(660px, 90%)', h: 'min(440px, 76%)' },
  about: { w: 'min(520px, 90%)', h: 'min(430px, 78%)' },
  hackathon: { w: 'min(540px, 90%)', h: 'min(380px, 78%)' },
  join: { w: 'min(460px, 90%)', h: 'min(400px, 78%)' },
  computer: { w: 'min(500px, 90%)', h: 'min(340px, 78%)' },
  recycle: { w: 'min(440px, 90%)', h: 'min(300px, 78%)' },
  camera: { w: 'min(620px, 90%)', h: 'min(440px, 78%)' },
}

function iconFor(app: AppId, size: number) {
  switch (app) {
    case 'explorer': return <FolderIcon size={size} />
    case 'about': return <TextFileIcon size={size} />
    case 'hackathon': return <CountdownIcon size={size} />
    case 'join': return <JoinIcon size={size} />
    case 'computer': return <ComputerIcon size={size} />
    case 'recycle': return <RecycleIcon size={size} />
    case 'camera': return <CameraIcon size={size} />
  }
}

const DESKTOP_ICONS: { key: string; label: string; route: Route; app: AppId }[] = [
  { key: 'documents', label: 'my_documents', route: { app: 'explorer', folder: 'documents' }, app: 'explorer' },
  { key: 'computer', label: 'my_computer', route: { app: 'computer' }, app: 'computer' },
  { key: 'recycle', label: 'recycle_bin', route: { app: 'recycle' }, app: 'recycle' },
  { key: 'join', label: 'join_us', route: { app: 'join' }, app: 'join' },
]

type Props = {
  initialRoute: Route | null
  onLock: () => void
  // Lets the Stage (e.g. the sticky note outside the screen) open windows
  registerOpener: (open: (route: Route) => void) => void
}

export default function Desktop({ initialRoute, onLock, registerOpener }: Props) {
  const [state, dispatch] = useWindowManager(initialRoute)
  const [selected, setSelected] = useState<string | null>(null)
  const tapToOpen = useMediaQuery('(pointer: coarse)')
  const canDrag = !useMediaQuery('(max-width: 700px)')

  const open = useCallback((route: Route) => dispatch({ type: 'open', route }), [dispatch])
  useEffect(() => registerOpener(open), [registerOpener, open])

  const active = activeWindow(state.windows)
  const activeRoute: Route | null = active ? { app: active.app, folder: active.folder } : null
  const path = activeRoute ? `/${slugFor(activeRoute)}` : '/'

  // Keep the address bar and tab title in sync with the front window,
  // so every window can be shared as a link.
  useEffect(() => {
    if (window.location.pathname !== path) window.history.pushState(null, '', path)
    const slug = path.slice(1)
    document.title = slug
      ? `${PAGE_TITLES[slug as keyof typeof PAGE_TITLES]} | GWC Rutgers–Newark`
      : 'Girls Who Code | Rutgers–Newark'
  }, [path])

  // Browser back/forward: reopen whatever window the URL points to
  useEffect(() => {
    function onPop() {
      const route = routeFromPath(window.location.pathname)
      dispatch(route ? { type: 'open', route } : { type: 'minimizeAll' })
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [dispatch])

  function renderApp(w: WindowState) {
    switch (w.app) {
      case 'explorer':
        return (
          <Explorer
            folder={w.folder ?? 'documents'}
            tapToOpen={tapToOpen}
            onNavigate={(folder) => dispatch({ type: 'navigate', folder })}
            onOpen={open}
          />
        )
      case 'about': return <AboutApp />
      case 'hackathon': return <HackathonApp />
      case 'join': return <JoinApp />
      case 'computer': return <ComputerApp />
      case 'recycle': return <RecycleApp />
      case 'camera': return <CameraApp />
    }
  }

  return (
    <EboardProvider>
      <div
        className={styles.desktop}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) setSelected(null)
        }}
      >
        <h1 className="sr-only">Girls Who Code at Rutgers University–Newark</h1>

        <ul className={styles.icons} aria-label="Desktop">
          {DESKTOP_ICONS.map((icon) => (
            <li key={icon.key}>
              <IconButton
                icon={iconFor(icon.app, 40)}
                label={icon.label}
                selected={selected === icon.key}
                tapToOpen={tapToOpen}
                onSelect={() => setSelected(icon.key)}
                onOpen={() => { setSelected(icon.key); open(icon.route) }}
              />
            </li>
          ))}
        </ul>

        {state.windows.map((w) => {
          const route = { app: w.app, folder: w.folder }
          const title = titleFor(route)
          return (
            <Window
              key={w.app}
              win={w}
              title={title}
              icon={iconFor(w.app, 20)}
              active={active?.app === w.app}
              size={SIZES[w.app]}
              canDrag={canDrag}
              onFocus={() => dispatch({ type: 'focus', app: w.app })}
              onClose={() => dispatch({ type: 'close', app: w.app })}
              onMinimize={() => dispatch({ type: 'minimize', app: w.app })}
              onMove={(x, y) => dispatch({ type: 'move', app: w.app, x, y })}
            >
              {renderApp(w)}
            </Window>
          )
        })}

        <Taskbar
          windows={state.windows.map((w) => ({
            app: w.app,
            title: titleFor({ app: w.app, folder: w.folder }),
            icon: iconFor(w.app, 16),
            active: active?.app === w.app,
          }))}
          onToggle={(app) => dispatch({ type: 'toggle', app })}
          onOpen={open}
          onLock={onLock}
        />
      </div>
    </EboardProvider>
  )
}
