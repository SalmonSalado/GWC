import type { MetadataRoute } from 'next'

// Served at /robots.txt. Keeps search engines out of the admin panel.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin',
    },
  }
}
