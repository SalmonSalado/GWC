// Every window on the desktop has a URL, so a link like /people
// opens the site straight to that window. This file is the single
// list of what exists; add a new window here first.

export type AppId =
  | 'explorer'
  | 'about'
  | 'hackathon'
  | 'join'
  | 'computer'
  | 'recycle'
  | 'camera'

export type FolderId = 'documents' | 'gwc' | 'people'

export type Route = { app: AppId; folder?: FolderId }

export const ROUTES = {
  documents: { app: 'explorer', folder: 'documents' },
  gwc: { app: 'explorer', folder: 'gwc' },
  people: { app: 'explorer', folder: 'people' },
  about: { app: 'about' },
  hackathon: { app: 'hackathon' },
  join: { app: 'join' },
  computer: { app: 'computer' },
  'recycle-bin': { app: 'recycle' },
  'camera-roll': { app: 'camera' },
} satisfies Record<string, Route>

export type Slug = keyof typeof ROUTES

export const SLUGS = Object.keys(ROUTES) as Slug[]

export function isSlug(value: string): value is Slug {
  return value in ROUTES
}

export function slugFor(route: Route): Slug {
  if (route.app === 'explorer') return route.folder ?? 'documents'
  const match = SLUGS.find((s) => ROUTES[s].app === route.app)
  return match ?? 'documents'
}

export function routeFromPath(pathname: string): Route | null {
  const slug = pathname.replace(/^\/+|\/+$/g, '')
  return isSlug(slug) ? ROUTES[slug] : null
}

// The file-style names shown in title bars and on the taskbar
export const FOLDER_NAMES: Record<FolderId, string> = {
  documents: 'my_documents',
  gwc: 'gwc',
  people: 'people',
}

export const APP_TITLES: Record<Exclude<AppId, 'explorer'>, string> = {
  about: 'about_us.txt',
  hackathon: 'next_hackathon.exe',
  join: 'join_us',
  computer: 'my_computer',
  recycle: 'recycle_bin',
  camera: 'camera_roll',
}

export function titleFor(route: Route): string {
  if (route.app === 'explorer') return FOLDER_NAMES[route.folder ?? 'documents']
  return APP_TITLES[route.app]
}

// Plain-language page titles for the browser tab and search results
export const PAGE_TITLES: Record<Slug, string> = {
  documents: 'Documents',
  gwc: 'About the chapter',
  people: 'Meet the board',
  about: 'About us',
  hackathon: 'Next hackathon',
  join: 'Join us',
  computer: 'Chapter info',
  'recycle-bin': 'Recycle bin',
  'camera-roll': 'Camera roll',
}
