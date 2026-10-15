'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './Explorer.module.css'
import IconButton from '../os/IconButton'
import {
  ArrowLeftIcon, CameraIcon, CountdownIcon, FolderIcon, JoinIcon, PersonIcon, TextFileIcon,
} from '../os/icons'
import { FOLDER_NAMES, type FolderId, type Route } from '../os/routes'
import { useEboard, type EboardMember } from '@/lib/eboard'

type Item = {
  key: string
  label: string
  icon: (size: number) => React.ReactNode
  description: string
  opens?: Route // omitted for people, whose details show in the side pane
  member?: EboardMember
}

const PARENT: Record<FolderId, FolderId | null> = {
  documents: null,
  gwc: 'documents',
  people: 'documents',
}

const STATIC_ITEMS: Record<Exclude<FolderId, 'people'>, Item[]> = {
  documents: [
    {
      key: 'gwc', label: 'gwc', icon: (s) => <FolderIcon size={s} />,
      description: 'Who we are, the next hackathon, and how to join.',
      opens: { app: 'explorer', folder: 'gwc' },
    },
    {
      key: 'people', label: 'people', icon: (s) => <FolderIcon size={s} />,
      description: 'Meet the students who run the chapter.',
      opens: { app: 'explorer', folder: 'people' },
    },
  ],
  gwc: [
    {
      key: 'about', label: 'about_us.txt', icon: (s) => <TextFileIcon size={s} />,
      description: 'What the chapter is and what we do.', opens: { app: 'about' },
    },
    {
      key: 'hackathon', label: 'next_hackathon.exe', icon: (s) => <CountdownIcon size={s} />,
      description: 'Countdown to the next hackathon.', opens: { app: 'hackathon' },
    },
    {
      key: 'join', label: 'join_us', icon: (s) => <JoinIcon size={s} />,
      description: 'Sign up and find our links.', opens: { app: 'join' },
    },
    {
      key: 'camera', label: 'camera_roll', icon: (s) => <CameraIcon size={s} />,
      description: 'Photos from chapter events.', opens: { app: 'camera' },
    },
  ],
}

function pathLabel(folder: FolderId) {
  return folder === 'documents' ? 'my_documents' : `my_documents/${FOLDER_NAMES[folder]}`
}

type Props = {
  folder: FolderId
  tapToOpen: boolean
  onNavigate: (folder: FolderId) => void
  onOpen: (route: Route) => void
}

export default function Explorer(props: Props) {
  // Keying by folder resets the selection whenever the folder changes
  return <FolderView key={props.folder} {...props} />
}

function FolderView({ folder, tapToOpen, onNavigate, onOpen }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const eboard = useEboard()
  const parent = PARENT[folder]

  const items: Item[] =
    folder === 'people'
      ? eboard.members.map((m, i) => ({
          key: m.id,
          label: m.name,
          icon: (s) => <PersonIcon size={s} variant={i} />,
          description: m.role,
          member: m,
        }))
      : STATIC_ITEMS[folder]

  const current = items.find((i) => i.key === selected) ?? null

  function open(item: Item) {
    if (item.opens?.app === 'explorer' && item.opens.folder) onNavigate(item.opens.folder)
    else if (item.opens) onOpen(item.opens)
    else setSelected(item.key)
  }

  return (
    <div className={styles.explorer}>
      <div className={styles.addressRow}>
        <button
          type="button"
          className={styles.back}
          disabled={!parent}
          onClick={() => parent && onNavigate(parent)}
          aria-label="Back"
        >
          <ArrowLeftIcon size={16} />
        </button>
        <div className={styles.address}>
          <span className={styles.addressLabel}>Address</span>
          <span className={styles.addressPath}>{pathLabel(folder)}</span>
        </div>
      </div>

      <div className={styles.panes}>
        <aside className={styles.side} aria-live="polite">
          {current ? (
            <>
              <span className={styles.sideArt}>{current.icon(72)}</span>
              {current.member ? (
                <>
                  <p className={styles.sideName}>{current.member.name}</p>
                  <p className={styles.sideRole}>{current.member.role}</p>
                  {current.member.fact && <p className={styles.sideText}>{current.member.fact}</p>}
                </>
              ) : (
                <>
                  <p className={styles.sideName}>{current.label}</p>
                  <p className={styles.sideText}>{current.description}</p>
                </>
              )}
            </>
          ) : (
            <>
              <span className={styles.sideArt}><FolderIcon size={72} /></span>
              <p className={styles.sideText}>
                {folder === 'people'
                  ? 'Select someone to read about them.'
                  : `${items.length} items. ${tapToOpen ? 'Tap' : 'Double-click'} to open.`}
              </p>
            </>
          )}
        </aside>

        <div className={styles.grid} role="list">
          {folder === 'people' && eboard.status === 'loading' && (
            <p className={styles.message}>Loading the board…</p>
          )}
          {folder === 'people' && eboard.status === 'error' && (
            <div className={styles.message}>
              <p>The board couldn&apos;t be loaded. Check your connection and try again.</p>
              <button type="button" className={styles.retry} onClick={eboard.retry}>Try again</button>
            </div>
          )}
          {folder === 'people' && eboard.status === 'ready' && items.length === 0 && (
            <p className={styles.message}>
              No board members yet. Add them from the <Link href="/admin">admin panel</Link>.
            </p>
          )}
          {items.map((item) => (
            <div role="listitem" key={item.key}>
              <IconButton
                variant="explorer"
                icon={item.icon(48)}
                label={item.label}
                selected={selected === item.key}
                tapToOpen={tapToOpen}
                onSelect={() => setSelected(item.key)}
                onOpen={() => open(item)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
