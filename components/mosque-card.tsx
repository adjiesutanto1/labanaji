import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mosque } from '@/lib/supabase/types'
import { MapPin, CalendarDays, ArrowUpRight } from 'lucide-react'

interface MosqueCardProps {
  mosque: Mosque
}

export function MosqueCard({ mosque }: MosqueCardProps) {
  return (
    <Link
      href={`/masjid/${mosque.slug}`}
      className="group block flex-shrink-0 w-[260px] sm:w-[280px] bg-[#FCFAF6] rounded-2xl border border-[#DDD5C7] shadow-2xs hover:shadow-xs hover:border-[#8A7965] transition-all duration-200 overflow-hidden text-left"
    >
      {/* Mosque Image (Dominant Visual) */}
      <div className="relative aspect-[16/10] w-full bg-[#EFE8DA] overflow-hidden">
        <Image
          src={mosque.image_url || '/images/default-mosque.jpg'}
          alt={mosque.name}
          fill
          sizes="280px"
          className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-1 text-white text-[11px] font-medium drop-shadow-xs">
          <MapPin className="w-3 h-3 text-[#FBF5EA] shrink-0" />
          <span className="line-clamp-1">{mosque.address.split(',')[0]}</span>
        </div>
      </div>

      {/* Mosque Details */}
      <div className="p-4 space-y-2.5">
        <div className="flex items-start justify-between gap-1">
          <h4 className="font-bold text-sm text-[#1D2922] group-hover:text-[#8A7965] transition-colors line-clamp-1 leading-snug">
            {mosque.name}
          </h4>
          <ArrowUpRight className="w-4 h-4 text-[#756B58] group-hover:text-[#8A7965] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        {mosque.routine_info && (
          <div className="flex items-start gap-1.5 text-[11px] text-[#5C6D62] bg-[#F3EEE3] p-2.5 rounded-xl border border-[#EAE4D9] leading-relaxed">
            <CalendarDays className="w-3.5 h-3.5 text-[#8A7965] shrink-0 mt-0.5" />
            <span className="line-clamp-2">
              {mosque.routine_info}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
