import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStudyBySlug } from '@/lib/data/studies'
import { formatDateIndonesian, getRelativeDayLabel } from '@/lib/utils'
import { MapButton } from '@/components/map-button'
import { ContactTakmir } from '@/components/contact-takmir'
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ArrowLeft,
  Landmark,
} from 'lucide-react'

interface StudyDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: StudyDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const study = await getStudyBySlug(slug)

  if (!study) {
    return {
      title: 'Kajian Tidak Ditemukan | LABANAJI',
    }
  }

  const mosqueName = study.mosque?.name || 'Masjid di Banyuwangi'
  const title = `${study.title} — ${mosqueName}`
  const description =
    study.description ||
    `Informasi jadwal kajian ${study.title} di ${mosqueName}, Banyuwangi pada ${formatDateIndonesian(
      study.study_date
    )} pukul ${study.start_time}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: study.poster_url,
          width: 800,
          height: 600,
          alt: study.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [study.poster_url],
    },
  }
}

export default async function StudyDetailPage({ params }: StudyDetailPageProps) {
  const { slug } = await params
  const study = await getStudyBySlug(slug)

  if (!study) {
    notFound()
  }

  const relativeDay = getRelativeDayLabel(study.study_date)
  const mosque = study.mosque

  // Structured Data (Schema.org Event)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: study.title,
    startDate: `${study.study_date}T19:30:00+07:00`,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: mosque?.name || 'Masjid di Banyuwangi',
      address: {
        '@type': 'PostalAddress',
        streetAddress: mosque?.address || 'Banyuwangi',
        addressLocality: 'Banyuwangi',
        addressRegion: 'Jawa Timur',
        addressCountry: 'ID',
      },
      geo: mosque?.latitude && mosque?.longitude ? {
        '@type': 'GeoCoordinates',
        latitude: mosque.latitude,
        longitude: mosque.longitude,
      } : undefined,
    },
    image: [study.poster_url],
    description: study.description || study.title,
    performer: {
      '@type': 'Person',
      name: study.speaker || 'Pemateri Kajian',
    },
    organizer: {
      '@type': 'Organization',
      name: mosque?.name || 'Takmir Masjid',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/kajian"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#8A7965] hover:text-[#24332B] hover:underline transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Jadwal Kajian</span>
          </Link>
        </div>

        {/* Main Content Card */}
        <article className="bg-[#FBF8F2] rounded-3xl border border-[#DDD4C5] shadow-2xs overflow-hidden">
          {/* Header Banner */}
          <div className="p-5 sm:p-8 space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {relativeDay && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold shadow-2xs ${
                    relativeDay === 'Hari Ini'
                      ? 'bg-[#8A7965] text-[#FBF8F2]'
                      : 'bg-[#B38E5D] text-white'
                  }`}
                >
                  {relativeDay}
                </span>
              )}
              <span className="inline-flex items-center gap-1 bg-[#EFE7DC] text-[#6B5B49] px-3 py-1 rounded-full text-xs font-bold border border-[#DDD4C5]">
                <Clock className="w-3.5 h-3.5 text-[#8A7965]" />
                {study.start_time}
              </span>
              <span className="text-xs font-medium text-[#5C6D62] bg-[#EEE6D8] px-3 py-1 rounded-full border border-[#DDD4C5]">
                {formatDateIndonesian(study.study_date)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#24332B] tracking-tight leading-tight">
              {study.title}
            </h1>

            {/* Pemateri / Speaker */}
            {study.speaker && (
              <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-[#29372F] bg-[#EEE6D8] p-3.5 rounded-2xl border border-[#DDD4C5]/60">
                <User className="w-5 h-5 text-[#8A7965] shrink-0" />
                <span>Pemateri: {study.speaker}</span>
              </div>
            )}
          </div>

          {/* Full Poster Display */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full bg-[#18221C] overflow-hidden">
            <Image
              src={study.poster_url}
              alt={`Poster lengkap ${study.title}`}
              fill
              priority
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-contain"
            />
          </div>

          {/* Details & Location Section */}
          <div className="p-5 sm:p-8 space-y-8">
            {/* Description if any */}
            {study.description && (
              <div className="space-y-2">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#8A7965]">
                  Deskripsi & Pembahasan
                </span>
                <p className="text-sm sm:text-base text-[#29372F] leading-relaxed whitespace-pre-line">
                  {study.description}
                </p>
              </div>
            )}

            {/* Mosque Location Box */}
            <div className="bg-[#EEE6D8] rounded-3xl border border-[#DDD4C5] p-5 sm:p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-[#EFE7DC] text-[#6B5B49] border border-[#DDD4C5] shrink-0">
                  <Landmark className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#8A7965]">
                    Lokasi Kajian
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#24332B]">
                    {mosque?.name || 'Masjid di Banyuwangi'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C6D62] leading-relaxed">
                    {mosque?.address || 'Kabupaten Banyuwangi, Jawa Timur'}
                  </p>
                </div>
              </div>

              {/* Action Buttons for Map */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <MapButton
                  address={mosque?.address || 'Banyuwangi'}
                  name={mosque?.name}
                  latitude={mosque?.latitude}
                  longitude={mosque?.longitude}
                  className="w-full sm:w-auto"
                />

                {mosque?.slug && (
                  <Link
                    href={`/masjid/${mosque.slug}`}
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-full font-semibold text-xs sm:text-sm text-[#8A7965] hover:text-[#24332B] hover:underline transition-colors"
                  >
                    Lihat Profil Masjid &rarr;
                  </Link>
                )}
              </div>
            </div>

            {/* Takmir Information & Contact */}
            {mosque && mosque.takmir_phone && (
              <ContactTakmir
                takmirName={mosque.takmir_name || 'Takmir Masjid'}
                takmirPhone={mosque.takmir_phone}
                studyTitle={study.title}
                mosqueName={mosque.name}
              />
            )}
          </div>
        </article>
      </div>
    </>
  )
}
