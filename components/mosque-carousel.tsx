'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mosque } from '@/lib/supabase/types'
import { ChevronLeft, ChevronRight, MapPin, CalendarDays, ArrowUpRight } from 'lucide-react'

interface MosqueCarouselProps {
  mosques: Mosque[]
}

export function MosqueCarousel({ mosques }: MosqueCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)
  const [containerWidth, setContainerWidth] = useState<number>(1000)
  const containerRef = useRef<HTMLDivElement>(null)

  // Measure container width for exact centering
  const updateWidth = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth)
    }
  }, [])

  useEffect(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [updateWidth])

  if (!mosques || mosques.length === 0) {
    return null
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : mosques.length - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev < mosques.length - 1 ? prev + 1 : 0))
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrev()
    } else if (e.key === 'ArrowRight') {
      handleNext()
    }
  }

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX)
    setTouchEndX(null)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return
    const distance = touchStartX - touchEndX
    const minSwipeDistance = 45

    if (distance > minSwipeDistance) {
      // Swiped left -> Next
      handleNext()
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> Prev
      handlePrev()
    }
    setTouchStartX(null)
    setTouchEndX(null)
  }

  // Responsive slide metrics
  const isMobile = containerWidth < 640
  const isTablet = containerWidth >= 640 && containerWidth < 1024

  // Slide width in px
  const slideWidth = isMobile
    ? Math.min(containerWidth * 0.84, 340)
    : isTablet
    ? 440
    : 540

  const gap = isMobile ? 14 : 24

  // Calculate track translateX to precisely center activeIndex
  const trackOffset =
    containerWidth / 2 - slideWidth / 2 - activeIndex * (slideWidth + gap)

  return (
    <section
      className="py-10 sm:py-14 bg-[#F2EBDD]/70 border-y border-[#DDD4C5]/80 overflow-hidden relative"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Masjid yang Rutin Mengadakan Kajian di Banyuwangi"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-6 sm:mb-8">
        {/* Editorial Header */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#756B58]">
              Masjid di Banyuwangi
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#24332B] tracking-tight">
              Masjid yang Rutin Mengadakan Kajian
            </h2>
            <p className="text-xs sm:text-sm text-[#5C6D62]">
              Jadwal pengajian rutin dari masjid-masjid di Banyuwangi
            </p>
          </div>

          {/* Desktop Arrow Controls */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/masjid"
              className="text-xs font-semibold text-[#8A7965] hover:text-[#24332B] underline underline-offset-4 mr-3"
            >
              Lihat Semua Masjid &rarr;
            </Link>
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-[#FBF8F2] hover:bg-white text-[#24332B] border border-[#DDD4C5] shadow-2xs hover:border-[#8A7965] focus:outline-none focus:ring-1 focus:ring-[#8A7965] transition-all"
              aria-label="Masjid Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-full bg-[#FBF8F2] hover:bg-white text-[#24332B] border border-[#DDD4C5] shadow-2xs hover:border-[#8A7965] focus:outline-none focus:ring-1 focus:ring-[#8A7965] transition-all"
              aria-label="Masjid Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Container with Edge Fades */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Subtle Left & Right Edge Fade Overlays */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-20 md:w-32 bg-gradient-to-r from-[#F2EBDD] via-[#F2EBDD]/60 to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-20 md:w-32 bg-gradient-to-l from-[#F2EBDD] via-[#F2EBDD]/60 to-transparent z-20" />

        {/* Carousel Moving Track */}
        <div
          className="flex items-center transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] py-2"
          style={{
            transform: `translateX(${trackOffset}px)`,
          }}
        >
          {mosques.map((mosque, idx) => {
            const isActive = idx === activeIndex
            const distance = Math.abs(idx - activeIndex)
            const isNeighbor = distance === 1

            return (
              <div
                key={mosque.id || mosque.slug}
                onClick={() => {
                  if (!isActive) setActiveIndex(idx)
                }}
                className={`shrink-0 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer ${
                  isActive
                    ? 'scale-100 opacity-100 z-10'
                    : isNeighbor
                    ? 'scale-[0.88] opacity-70 hover:opacity-90 z-0'
                    : 'scale-[0.78] opacity-35 z-0'
                }`}
                style={{
                  width: `${slideWidth}px`,
                  marginRight: `${gap}px`,
                }}
              >
                {/* Center-Focused Mosque Card */}
                <article
                  className={`bg-[#FBF8F2] rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col ${
                    isActive
                      ? 'border-[#DDD4C5] shadow-xs hover:border-[#8A7965]'
                      : 'border-[#DDD4C5]/70 shadow-2xs'
                  }`}
                >
                  {/* Dominant Mosque Image (16/10 aspect ratio) */}
                  <Link
                    href={`/masjid/${mosque.slug}`}
                    className="relative aspect-[16/10] w-full bg-[#EEE6D8] block overflow-hidden"
                    aria-label={`Lihat profil ${mosque.name}`}
                  >
                    <Image
                      src={mosque.image_url || '/images/default-mosque.jpg'}
                      alt={mosque.name}
                      fill
                      sizes="(max-width: 640px) 85vw, 540px"
                      priority={isActive}
                      className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                      loading={isActive ? 'eager' : 'lazy'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                    
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs drop-shadow-xs">
                      <span className="inline-flex items-center gap-1 font-medium text-[11px] sm:text-xs">
                        <MapPin className="w-3.5 h-3.5 text-[#FBF5EA] shrink-0" />
                        <span className="line-clamp-1">{mosque.address.split(',')[0]}</span>
                      </span>

                      {isActive && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8A7965]/90 text-white backdrop-blur-xs">
                          Pusat Kajian
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Mosque Details */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base sm:text-lg text-[#24332B] hover:text-[#8A7965] transition-colors line-clamp-1 leading-snug">
                        <Link href={`/masjid/${mosque.slug}`}>{mosque.name}</Link>
                      </h3>
                      <Link
                        href={`/masjid/${mosque.slug}`}
                        className="p-1 rounded-full text-[#756B58] hover:text-[#24332B] hover:bg-[#EEE6D8] transition-colors shrink-0"
                        title="Lihat Detail Masjid"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>

                    {mosque.routine_info && (
                      <div className="flex items-start gap-2 text-xs text-[#5C6D62] bg-[#F2EBDD] p-3 rounded-2xl border border-[#DDD4C5]/60 leading-relaxed">
                        <CalendarDays className="w-3.5 h-3.5 text-[#8A7965] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{mosque.routine_info}</span>
                      </div>
                    )}

                    {/* Bottom CTA for Active Card */}
                    {isActive && (
                      <div className="pt-2 border-t border-[#DDD4C5]/50 flex items-center justify-between text-xs font-semibold text-[#8A7965]">
                        <span>Lihat Jadwal & Info Takmir</span>
                        <Link
                          href={`/masjid/${mosque.slug}`}
                          className="hover:underline font-bold"
                        >
                          Buka Profil &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                </article>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Controls & Indicator Dots */}
      <div className="max-w-5xl mx-auto px-4 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Pagination Dots */}
        <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
          {mosques.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setActiveIndex(dotIdx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                dotIdx === activeIndex
                  ? 'w-6 bg-[#8A7965]'
                  : 'w-2 bg-[#DDD4C5] hover:bg-[#8A7965]'
              }`}
              aria-label={`Pindah ke masjid ke-${dotIdx + 1}`}
            />
          ))}
        </div>

        {/* Mobile Left / Right Buttons */}
        <div className="flex sm:hidden items-center justify-center gap-3 w-full">
          <button
            onClick={handlePrev}
            className="flex-1 py-2 px-4 rounded-full bg-[#FBF8F2] border border-[#DDD4C5] text-xs font-semibold text-[#24332B] flex items-center justify-center gap-1.5 shadow-2xs"
            aria-label="Masjid Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-2 px-4 rounded-full bg-[#FBF8F2] border border-[#DDD4C5] text-xs font-semibold text-[#24332B] flex items-center justify-center gap-1.5 shadow-2xs"
            aria-label="Masjid Berikutnya"
          >
            <span>Berikutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile View All Link */}
        <div className="sm:hidden text-center">
          <Link
            href="/masjid"
            className="text-xs font-semibold text-[#8A7965] hover:underline"
          >
            Lihat Semua Masjid di Banyuwangi &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
