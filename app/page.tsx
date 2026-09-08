import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getFeaturedMosques } from '@/lib/data/mosques'
import { getTodayStudies } from '@/lib/data/studies'
import { MosqueCarousel } from '@/components/mosque-carousel'
import { StudyGrid } from '@/components/study-grid'
import { EmptyState } from '@/components/empty-state'
import { Calendar, Sparkles, ArrowRight, ArrowUpRight } from 'lucide-react'

// Revalidate every 60 seconds
export const revalidate = 60

export default async function HomePage() {
  const [featuredMosques, todayStudies] = await Promise.all([
    getFeaturedMosques(6),
    getTodayStudies(6),
  ])

  return (
    <div className="space-y-10 sm:space-y-14 pb-16">
      {/* 1. EDITORIAL SPLIT HERO SECTION (Blended Atmospheric Photography) */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-4 sm:pb-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center min-h-[460px] lg:min-h-[520px]">
          {/* Left Column: Editorial Text (Left Aligned) */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center text-left space-y-5 sm:space-y-6 z-20">
            {/* Editorial Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFE7DC] border border-[#DDD4C5] text-[#6B5B49] text-[11px] font-bold uppercase tracking-wider w-fit shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8A7965]" />
              <span>Pusat Informasi Kajian Banyuwangi</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#24332B] leading-[1.14]">
              Temukan Kajian <br className="hidden sm:inline" />
              <span className="text-[#8A7965]">di Banyuwangi</span>
            </h1>

            {/* Supporting Description */}
            <p className="text-sm sm:text-base text-[#5C6D62] max-w-[480px] leading-relaxed">
              Informasi jadwal dan poster kajian rutin dari masjid-masjid di seluruh Banyuwangi. Sederhana, cepat, dan nyaman diakses dari ponsel.
            </p>

            {/* Action Buttons (Quiet, Warm, Rounded-Full) */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <a
                href="#kajian-hari-ini"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-xs sm:text-sm bg-[#8A7965] hover:bg-[#73624F] text-[#FBF8F2] shadow-2xs transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#FBF5EA]" />
                <span>Lihat Kajian Hari Ini</span>
              </a>

              <Link
                href="/kajian"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold text-xs sm:text-sm bg-[#FBF8F2] hover:bg-white text-[#24332B] border border-[#D8CFBF] hover:border-[#8A7965] transition-all shadow-2xs"
              >
                <Calendar className="w-4 h-4 text-[#756B58]" />
                <span>Semua Jadwal</span>
              </Link>
            </div>

            {/* Subtle Editorial Marker */}
            <div className="pt-2 flex items-center gap-2 text-[11px] text-[#8A7965] font-mono">
              <span className="font-semibold tracking-wider">KAB. BANYUWANGI</span>
              <span>·</span>
              <span>8.2104° S, 114.3685° E</span>
            </div>
          </div>

          {/* Right Column: Atmospheric Photograph of Mosque Emerging & Dissolving into Cream Canvas */}
          <div className="lg:col-span-6 xl:col-span-7 relative w-full flex items-center justify-center lg:justify-end">
            <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[480px] xl:h-[520px]">
              {/* Soft Multi-Directional Gradient Feathers to Dissolve into Cream (#F6F1E8) */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-44 bg-gradient-to-r from-[#F6F1E8] via-[#F6F1E8]/70 to-transparent z-10" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 sm:h-32 bg-gradient-to-t from-[#F6F1E8] via-[#F6F1E8]/80 to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#F6F1E8] via-[#F6F1E8]/50 to-transparent z-10" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-12 sm:h-16 bg-gradient-to-b from-[#F6F1E8]/60 to-transparent z-10" />

              {/* The Atmospheric Mosque Photo with Feathered Mask */}
              <div
                className="relative w-full h-full overflow-hidden select-none rounded-3xl"
                style={{
                  maskImage:
                    'radial-gradient(ellipse 92% 88% at 58% 48%, black 45%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0.2) 88%, transparent 100%)',
                  WebkitMaskImage:
                    'radial-gradient(ellipse 92% 88% at 58% 48%, black 45%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0.2) 88%, transparent 100%)',
                }}
              >
                <Image
                  src="/images/hero-mosque.jpg"
                  alt="Masjid di Banyuwangi"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 760px"
                  className="object-cover object-[center_40%] opacity-95 brightness-[0.98] contrast-[0.98]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CENTER-FOCUSED MOSQUE CAROUSEL */}
      <MosqueCarousel mosques={featuredMosques} />

      {/* 3. KAJIAN HARI INI (Primary Section - Main Focal Point) */}
      <section
        id="kajian-hari-ini"
        className="max-w-5xl mx-auto px-4 sm:px-6 scroll-mt-24 space-y-6"
      >
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#DDD4C5] pb-4">
          <div className="space-y-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#756B58]">
              Jadwal Hari Ini
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24332B] tracking-tight">
              Kajian Hari Ini
            </h2>
            <p className="text-xs sm:text-sm text-[#5C6D62]">
              Jadwal kajian yang berlangsung hari ini di Banyuwangi.
            </p>
          </div>

          <Link
            href="/kajian"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#8A7965] hover:underline"
          >
            <span>Lihat Semua Jadwal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Study Cards Grid or Empty State */}
        {todayStudies.length > 0 ? (
          <StudyGrid studies={todayStudies} priorityFirst={true} />
        ) : (
          <EmptyState
            title="Belum ada kajian hari ini."
            description="Cek kembali nanti atau jelajahi jadwal kajian mendatang di masjid-masjid Banyuwangi."
            actionLabel="Lihat Semua Kajian"
            actionHref="/kajian"
            variant="today"
          />
        )}
      </section>

      {/* 4. COMMUNITY BANNER FOR TAKMIR */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-2">
        <div className="bg-[#FBF8F2] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#DDD4C5] shadow-2xs">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#756B58]">
              Untuk Takmir Masjid
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#24332B]">
              Anda Takmir Masjid di Banyuwangi?
            </h3>
            <p className="text-xs sm:text-sm text-[#5C6D62] max-w-lg leading-relaxed">
              Publikasikan poster dan jadwal pengajian masjid Anda secara gratis agar diketahui oleh seluruh jamaah di Banyuwangi.
            </p>
          </div>

          <Link
            href="/takmir"
            className="shrink-0 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-[#8A7965] hover:bg-[#73624F] text-[#FBF8F2] transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <span>Masuk / Unggah Kajian</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
