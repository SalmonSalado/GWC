// Original pixel-style icons, drawn on a 32×32 grid.
// crispEdges keeps the hard pixel look at any size.

type IconProps = { size?: number; className?: string }

function Svg({ size = 32, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

const OUTLINE = '#3b2f1a'

export function FolderIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 7h10l2 3h14v17H3z" fill="#c9922e" stroke={OUTLINE} />
      <path d="M5 12h24v15H5z" fill="#f1f1ea" stroke={OUTLINE} />
      <path d="M3 14h9l2-2h15v15H3z" fill="#f2c24f" stroke={OUTLINE} />
      <path d="M4 15h8l2-2h14v1H14l-2 2H4z" fill="#fbe39a" />
    </Svg>
  )
}

export function ComputerIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 4h22v17H5z" fill="#c9c9c4" stroke="#2b2b2b" />
      <path d="M8 7h16v11H8z" fill="#69c3e8" stroke="#2b2b2b" />
      <path d="M9 8h6v1H9zM9 10h3v1H9z" fill="#c8ecfa" />
      <path d="M3 23h26v5H3z" fill="#d9d9d4" stroke="#2b2b2b" />
      <path d="M18 25h8v1h-8z" fill="#2b2b2b" />
      <path d="M13 21h6v2h-6z" fill="#a9a9a4" />
    </Svg>
  )
}

export function RecycleIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 8h16l-2 21H10z" fill="#e7eaed" stroke="#2b2b2b" />
      <path d="M7 5h18v3H7z" fill="#cfd4d8" stroke="#2b2b2b" />
      <path d="M13 3h6v2h-6z" fill="#cfd4d8" stroke="#2b2b2b" />
      <path d="M14 13h4v2h2v3h-2v-1h-4zM12 17h2v3h4v2h-4v-1h-2z" fill="#2f86d6" />
      <path d="M19 19h2v3h-2z" fill="#2f86d6" />
    </Svg>
  )
}

export function TextFileIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 3h13l6 6v20H7z" fill="#fbfbf8" stroke="#2b2b2b" />
      <path d="M20 3v6h6" fill="#dcdcd6" stroke="#2b2b2b" />
      <path d="M10 13h12v1H10zM10 16h12v1H10zM10 19h12v1H10zM10 22h8v1h-8z" fill="#6a7fa8" />
    </Svg>
  )
}

export function CountdownIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 5h26v22H3z" fill="#e9e9e4" stroke="#2b2b2b" />
      <path d="M3 5h26v4H3z" fill="#1aa5a0" stroke="#2b2b2b" />
      <path d="M24 6h2v2h-2z" fill="#f08bab" />
      <path d="M11 12h10v1h2v10h-2v1H11v-1H9V13h2z" fill="#fff" stroke="#2b2b2b" />
      <path d="M15 14h2v5h3v2h-5z" fill="#2b2b2b" />
    </Svg>
  )
}

export function JoinIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 5h24v22H4z" fill="#fde4ec" stroke="#2b2b2b" />
      <path d="M9 10h5v2h4v-2h5v6h-2v2h-2v2h-2v2h-2v-2h-2v-2h-2v-2H9z" fill="#f08bab" stroke="#8c2b4d" />
      <path d="M11 11h2v2h-2z" fill="#fff" />
      <path d="M4 21h8v6H4z" fill="#fff" stroke="#2b2b2b" />
      <path d="M6 25h2v-2h2v-1h1v3h-1v-1H9v2H6z" fill="#2b2b2b" />
    </Svg>
  )
}

export function CameraIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 10h6l2-3h10l2 3h6v16H3z" fill="#f6a9bf" stroke="#2b2b2b" />
      <path d="M11 12h10v1h1v10h-1v1H11v-1h-1V13h1z" fill="#3a3a44" stroke="#2b2b2b" />
      <path d="M13 15h6v6h-6z" fill="#69c3e8" />
      <path d="M14 16h2v2h-2z" fill="#e8f7fd" />
      <path d="M24 12h3v2h-3z" fill="#fff" />
    </Svg>
  )
}

const PERSON_COLORS = [
  { bg: '#fde4ec', shirt: '#f08bab' },
  { bg: '#d8f1ef', shirt: '#1aa5a0' },
  { bg: '#e3e7f6', shirt: '#33408f' },
]

export function PersonIcon({ variant = 0, ...props }: IconProps & { variant?: number }) {
  const c = PERSON_COLORS[variant % PERSON_COLORS.length]
  return (
    <Svg {...props}>
      <path d="M5 3h22v26H5z" fill={c.bg} stroke="#2b2b2b" />
      <path d="M13 7h6v1h1v6h-1v1h-6v-1h-1V8h1z" fill="#b7835a" stroke="#2b2b2b" />
      <path d="M12 7h8v2h-8z" fill="#3a2a22" />
      <path d="M9 18h14v2h1v6H8v-6h1z" fill={c.shirt} stroke="#2b2b2b" />
      <path d="M14 16h4v2h-4z" fill="#b7835a" />
    </Svg>
  )
}

export function LockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M11 6h10v2h2v6h-3V9h-8v5H9V8h2z" fill="#f4f4f0" />
      <path d="M7 14h18v13H7z" fill="#f4f4f0" />
      <path d="M15 18h2v5h-2z" fill="#44505e" />
    </Svg>
  )
}

export function ChatIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 6h22v14H12l-5 5v-5H3z" fill="#f4d35e" stroke="#2b2b2b" />
      <path d="M7 10h14v2H7zM7 14h9v2H7z" fill="#2b2b2b" />
    </Svg>
  )
}

export function NetworkIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 4h12v10H3z" fill="#e9e9e4" stroke="#2b2b2b" />
      <path d="M5 6h8v6H5z" fill="#69c3e8" />
      <path d="M8 14h2v5h12v3h-2v-1h-10v1H8z" fill="#2b2b2b" />
      <path d="M17 10h12v10H17z" fill="#e9e9e4" stroke="#2b2b2b" />
      <path d="M19 12h8v6h-8z" fill="#69c3e8" />
    </Svg>
  )
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14 8h3v3h-3v3h12v4H14v3h3v3h-3v-3h-3v-3H8v-4h3v-3h3z" fill="currentColor" />
    </Svg>
  )
}

export function GwcMark(props: IconProps) {
  // The Start button mark: a pixel bracket pair, pink and teal.
  return (
    <Svg {...props}>
      <path d="M11 6h5v3h-3v14h3v3h-5v-3H8V9h3z" fill="#f08bab" stroke="#2b2b2b" />
      <path d="M16 6h5v3h3v14h-3v3h-5v-3h3V9h-3z" fill="#1aa5a0" stroke="#2b2b2b" />
    </Svg>
  )
}
