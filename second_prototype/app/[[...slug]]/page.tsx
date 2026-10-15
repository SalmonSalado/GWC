import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Stage from '@/components/os/Stage'
import { PAGE_TITLES, SLUGS, isSlug, type Slug } from '@/components/os/routes'

// One page serves "/" and every window URL ("/people", "/hackathon", ...).
// The server only checks the URL; the desktop itself runs in the browser.

type Props = { params: Promise<{ slug?: string[] }> }

export const dynamicParams = false

export function generateStaticParams() {
  return [{ slug: [] }, ...SLUGS.map((s) => ({ slug: [s] }))]
}

async function resolveSlug(params: Props['params']): Promise<Slug | null> {
  const { slug } = await params
  if (!slug || slug.length === 0) return null
  if (slug.length > 1 || !isSlug(slug[0])) notFound()
  return slug[0]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = await resolveSlug(params)
  return slug ? { title: `${PAGE_TITLES[slug]} | GWC Rutgers–Newark` } : {}
}

export default async function Page({ params }: Props) {
  const slug = await resolveSlug(params)
  return <Stage initialSlug={slug} />
}
