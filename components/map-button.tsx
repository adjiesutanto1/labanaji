import React from 'react'
import { MapPin, ExternalLink } from 'lucide-react'
import { getGoogleMapsUrl } from '@/lib/utils'

interface MapButtonProps {
  address: string
  name?: string
  latitude?: number | null
  longitude?: number | null
  className?: string
  label?: string
}

export function MapButton({
  address,
  name,
  latitude,
  longitude,
  className = '',
  label = 'Buka Google Maps',
}: MapButtonProps) {
  const mapsUrl = getGoogleMapsUrl(address, name, latitude, longitude)

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm bg-[#FBF8F2] hover:bg-white text-[#24332B] border border-[#DDD4C5] hover:border-[#8A7965] shadow-2xs transition-all ${className}`}
    >
      <MapPin className="w-4 h-4 text-[#8A7965] shrink-0" />
      <span>{label}</span>
      <ExternalLink className="w-3.5 h-3.5 text-[#8A7965] shrink-0" />
    </a>
  )
}
