import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yupinitiative.com'
  const pages = [
    '',
    '/about',
    '/contact',
    '/events',
    '/gallery',
    '/programs',
    '/volunteer',
  ]
  const lastModified = new Date()
  return pages.map((page) => ({ url: `${baseUrl}${page}`, lastModified }))
}
