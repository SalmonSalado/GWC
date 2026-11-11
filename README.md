# GWC Rutgers–Newark: desktop prototype

The chapter website as a retro computer. Visitors start at a desk scene,
log in, and the view zooms into the monitor to a working desktop with
windows, a Start menu, and a taskbar.

Built with Next.js 16 (App Router), Supabase, and GSAP. Deployed on Netlify.

## Run it locally

```bash
cp .env.example .env.local   # then paste in the Supabase URL and publishable key
npm install
npm run dev
```

Open http://localhost:3000.

## Where things live

| Path | What it is |
| --- | --- |
| `app/[[...slug]]/page.tsx` | The one page. Serves `/` and every window URL |
| `app/admin/page.tsx` | Board login and eboard editor (`/admin`) |
| `components/os/` | The desk scene, desktop, windows, taskbar, Start menu, icons |
| `components/os/routes.ts` | Every window and its URL. Add new windows here first |
| `components/apps/` | What's inside each window |
| `lib/content.ts` | Meeting times, links, hackathon date, gallery. Edit here |
| `lib/eboard.tsx` | Loads the board from Supabase for the `people` folder |
| `public/os/` | Images used by the desk scene and windows |

## Window URLs

Each window has its own link, so you can share one directly.
Shared links skip the intro.

`/documents` `/gwc` `/people` `/about` `/hackathon` `/join`
`/computer` `/recycle-bin` `/camera-roll`

## Updating content

- **Board members:** sign in at `/admin`. Changes show up on the site right away.
- **Everything else:** edit `lib/content.ts` and push. Empty links show as
  "coming soon" buttons instead of broken links.

## Supabase

Uses the existing `eboard` table (`id`, `name`, `role`, `fact`, `created_at`).
Needs two environment variables, locally in `.env.local` and on Netlify:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Deploying on Netlify

Set the site's **Base directory** to this folder (`testing/gwc-desktop`).
`netlify.toml` handles the rest.
