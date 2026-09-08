import { MetadataRoute } from 'next'
import { getStudies } from '@/lib/data/studies'
import { getMosques } from '@/lib/data/mosques'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://labanaji.com'

  const [mosques, { studies }] = await Promise.all([
    getMosques(),
    getStudies({ pageSize: 100 }),
  ])

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/kajian`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/masjid`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Dynamic study detail routes
  const studyRoutes: MetadataRoute.Sitemap = studies.map((study) => ({
    url: `${baseUrl}/kajian/${study.slug}`,
    lastModified: new Date(study.updated_at || study.created_at || new Date()),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  // Dynamic mosque detail routes
  const mosqueRoutes: MetadataRoute.Sitemap = mosques.map((mosque) => ({
    url: `${baseUrl}/masjid/${mosque.slug}`,
    lastModified: new Date(mosque.updated_at || mosque.created_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...studyRoutes, ...mosqueRoutes]
}
