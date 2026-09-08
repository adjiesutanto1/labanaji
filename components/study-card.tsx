import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, MapPin, User, ArrowUpRight } from 'lucide-react'
import { Study } from '@/lib/supabase/types'
import { formatDateIndonesian, getRelativeDayLabel } from '@/lib/utils'

interface StudyCardProps {
  study: Study
  priority?: boolean
}

export function StudyCard({ study, priority = false }: StudyCardProps) {
  const relativeDay = getRelativeDayLabel(study.study_date)

  return (
    <article className="group bg-[#FBF8F2] rounded-3xl border border-[#DDD4C5] shadow-2xs hover:shadow-xs hover:border-[#8A7965] transition-all duration-200 overflow-hidden flex flex-col h-full">
      {/* Poster Image Container (Visual Focal Point) */}
      <Link
        href={`/kajian/${study.slug}`}
        className="relative aspect-[4/3] w-full bg-[#EEE6D8] block overflow-hidden"
        aria-label={`Lihat detail kajian: ${study.title}`}
      >
        <Image
          src={study.poster_url || '/images/default-poster.jpg'}
          alt={`Poster Kajian: ${study.title}`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
          loading={priority ? 'eager' : 'lazy'}
        />

        {/* Date / Day Floating Pill */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {relativeDay && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-2xs ${
                relativeDay === 'Hari Ini'
                  ? 'bg-[#8A7965] text-[#FBF8F2]'
                  : 'bg-[#6B5B49] text-white'
              }`}
            >
              {relativeDay}
            </span>
          )}
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#24332B]/85 text-[#FBF8F2] backdrop-blur-xs shadow-2xs">
            {formatDateIndonesian(study.study_date)}
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Time & Location Metadata */}
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 bg-[#EFE7DC] text-[#6B5B49] px-2.5 py-0.5 rounded-full text-[11px] font-bold">
              <Clock className="w-3 h-3 text-[#8A7965]" />
              {study.start_time}
            </span>
            <span className="inline-flex items-center gap-1 text-[#756B58] text-[11px]">
              <MapPin className="w-3 h-3 text-[#8A7965]" />
              Banyuwangi
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base sm:text-lg text-[#24332B] leading-snug line-clamp-2 group-hover:text-[#8A7965] transition-colors">
            <Link href={`/kajian/${study.slug}`}>{study.title}</Link>
          </h3>

          {/* Speaker / Pemateri */}
          {study.speaker && (
            <div className="flex items-center gap-1.5 text-xs text-[#5C6D62] font-medium">
              <User className="w-3.5 h-3.5 text-[#8A7965] shrink-0" />
              <span className="line-clamp-1">{study.speaker}</span>
            </div>
          )}

          {/* Mosque Name */}
          <p className="text-xs text-[#29372F] font-semibold line-clamp-1 pt-0.5">
            📍 {study.mosque?.name || 'Masjid di Banyuwangi'}
          </p>
        </div>

        {/* Bottom Clean Link */}
        <div className="pt-3 border-t border-[#DDD4C5]/60 flex items-center justify-between text-xs font-bold text-[#8A7965]">
          <span>Lihat Detail Kajian</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </article>
  )
}
