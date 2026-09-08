import React from 'react'

interface BanyuwangiMapFrameProps {
  className?: string
}

export function BanyuwangiMapFrame({ className = '' }: BanyuwangiMapFrameProps) {
  return (
    <div
      className={`relative w-full h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[460px] rounded-3xl overflow-hidden border border-[#DDD4C5] bg-[#EFE7DC] shadow-xs ${className}`}
    >
      {/* Interactive Google Map Frame of Kabupaten Banyuwangi */}
      <iframe
        title="Peta Wilayah Kabupaten Banyuwangi"
        src="https://maps.google.com/maps?q=Kabupaten+Banyuwangi,+Jawa+Timur&t=&z=11&ie=UTF8&iwloc=&output=embed"
        className="w-full h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[460px] border-0 contrast-[102%] opacity-95 hover:opacity-100 transition-opacity"
        loading="lazy"
        allowFullScreen
      />
    </div>
  )
}
