'use client'

import styles from './IconButton.module.css'

type Props = {
  icon: React.ReactNode
  label: string
  selected: boolean
  onSelect: () => void
  onOpen: () => void
  // Touch screens have no double-click, so a tap opens right away
  tapToOpen: boolean
  variant?: 'desktop' | 'explorer'
}

// Let long file names wrap after "_" or "." instead of mid-word
function breakable(label: string) {
  const parts = label.match(/[^_.]+[_.]?|[_.]/g) ?? [label]
  return parts.map((part, i) => (
    <span key={i}>{part}<wbr /></span>
  ))
}

// A desktop-style icon: click selects, double-click opens.
// Keyboard: Tab to it, Enter or Space opens.
export default function IconButton({
  icon, label, selected, onSelect, onOpen, tapToOpen, variant = 'desktop',
}: Props) {
  return (
    <button
      type="button"
      className={styles.icon}
      aria-label={label}
      data-variant={variant}
      data-selected={selected || undefined}
      onClick={(e) => {
        // detail === 0 means the click came from the keyboard
        if (e.detail === 0 || tapToOpen) onOpen()
        else onSelect()
      }}
      onDoubleClick={onOpen}
    >
      <span className={styles.art}>{icon}</span>
      <span className={styles.label}>{breakable(label)}</span>
    </button>
  )
}
