import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://labanaji.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/takmir/login', '/takmir/tambah', '/takmir/edit'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
