import styles from './Apps.module.css'

// A link styled as a button. With no URL it renders as a disabled
// button with an explanation, so there are never dead links.
export default function ExternalButton({
  href, children, missing, primary,
}: { href: string; children: React.ReactNode; missing: string; primary?: boolean }) {
  const className = `${styles.button} ${primary ? styles.primary : ''}`
  if (!href) {
    return (
      <span className={className} aria-disabled="true" title={missing}>
        {missing}
      </span>
    )
  }
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}
