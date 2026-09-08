import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMosqueBySlug } from '@/lib/data/mosques'
import { getStudiesByMosque } from '@/lib/data/studies'
import { MapButton } from '@/components/map-button'
import { ContactTakmir } from '@/components/contact-takmir'
import { StudyGrid } from '@/components/study-grid'
import { ArrowLeft, Landmark, MapPin, CalendarDays } from 'lucide-react'

interface MosqueDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: MosqueDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const mosque = await getMosqueBySlug(slug)

  if (!mosque) {
    return {
      title: 'Masjid Tidak Ditemukan | LABANAJI',
    }
  }

  return {
    title: `${mosque.name} — Jadwal Kajian & Informasi`,
    description: `Jadwal kajian rutin dan profil ${mosque.name}, beralamat di ${mosque.address}, Banyuwangi.`,
    openGraph: {
      title: `${mosque.name} — LABANAJI`,
      description: `Informasi dan jadwal kajian di ${mosque.name}, Banyuwangi.`,
      images: [{ url: mosque.image_url, width: 1200, height: 800 }],
    },
  }
}

export default async function MosqueDetailPage({ params }: MosqueDetailPageProps) {
  const { slug } = await params
  const mosque = await getMosqueBySlug(slug)

  if (!mosque) {
    notFound()
  }

  const studies = await getStudiesByMosque(mosque.id)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href="/masjid"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#8A7965] hover:text-[#24332B] hover:underline transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Masjid</span>
        </Link>
      </div>

      {/* Mosque Profile Hero Card */}
      <article className="bg-[#FBF8F2] rounded-3xl border border-[#DDD4C5] shadow-2xs overflow-hidden">
        {/* Photo */}
        <div className="relative aspect-[16/9] w-full bg-[#18221C] overflow-hidden">
          <Image
            src={mosque.image_url}
            alt={mosque.name}
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 text-white space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8A7965]/90 backdrop-blur-xs text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Landmark className="w-3.5 h-3.5" />
              <span>Masjid Banyuwangi</span>
            </div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-xs">
              {mosque.name}
            </h1>
          </div>
        </div>

        {/* Info Body */}
        <div className="p-5 sm:p-8 space-y-6">
          {/* Address & Direction */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#EEE6D8] border border-[#DDD4C5]">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#8A7965] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#8A7965]">
                  Alamat Lengkap
                </span>
                <p className="text-xs sm:text-sm text-[#24332B] font-semibold leading-relaxed">
                  {mosque.address}
                </p>
              </div>
            </div>

            <MapButton
              address={mosque.address}
              name={mosque.name}
              latitude={mosque.latitude}
              longitude={mosque.longitude}
              className="w-full sm:w-auto shrink-0"
            />
          </div>

          {/* Routine Info */}
          {mosque.routine_info && (
            <div className="space-y-2">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#8A7965]">
                Jadwal Kajian Rutin
              </span>
              <div className="p-4 rounded-3xl bg-[#EFE7DC] border border-[#DDD4C5] flex items-start gap-3">
                <CalendarDays className="w-5 h-5 text-[#8A7965] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-[#29372F] leading-relaxed font-medium">
                  {mosque.routine_info}
                </p>
              </div>
            </div>
          )}

          {/* Takmir Contact */}
          {mosque.takmir_phone && (
            <ContactTakmir
              takmirName={mosque.takmir_name}
              takmirPhone={mosque.takmir_phone}
              mosqueName={mosque.name}
            />
          )}
        </div>
      </article>

      {/* Studies at this mosque */}
      <section className="space-y-4 pt-4">
        <div className="border-b border-[#DDD4C5] pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#24332B] tracking-tight">
            Kajian Terjadwal di {mosque.name}
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6D62]">
            Daftar kajian yang akan datang di masjid ini
          </p>
        </div>

        {studies.length > 0 ? (
          <StudyGrid studies={studies} />
        ) : (
          <div className="bg-[#FBF8F2] rounded-3xl border border-[#DDD4C5] p-8 text-center text-xs sm:text-sm text-[#5C6D62]">
            Belum ada jadwal kajian spesifik yang terdaftar untuk masjid ini dalam waktu dekat.
          </div>
        )}
      </section>
    </div>
  )
}
