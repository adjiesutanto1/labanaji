import React from 'react'
import { Phone, MessageSquare } from 'lucide-react'
import { formatPhoneNumber } from '@/lib/utils'

interface ContactTakmirProps {
  takmirName: string
  takmirPhone: string
  studyTitle?: string
  mosqueName?: string
}

export function ContactTakmir({
  takmirName,
  takmirPhone,
  studyTitle,
  mosqueName,
}: ContactTakmirProps) {
  const { display, telUrl, waUrl } = formatPhoneNumber(takmirPhone)

  // Construct friendly WhatsApp greeting
  let waText = `Assalamu'alaikum Warahmatullahi Wabarakatuh, Ust. ${takmirName}.`
  if (studyTitle && mosqueName) {
    waText += ` Saya ingin bertanya seputar jadwal kajian "${studyTitle}" di ${mosqueName}.`
  } else if (mosqueName) {
    waText += ` Saya ingin bertanya seputar jadwal kajian di ${mosqueName}.`
  }
  const fullWaUrl = `${waUrl}?text=${encodeURIComponent(waText)}`

  return (
    <div className="bg-[#FBF8F2] rounded-3xl border border-[#DDD4C5] p-5 sm:p-6 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#756B58]">
            Informasi Takmir
          </span>
          <h4 className="text-sm sm:text-base font-bold text-[#24332B]">
            {takmirName}
          </h4>
        </div>
        <span className="text-xs font-mono font-medium text-[#5C6D62] bg-[#EEE6D8] px-3 py-1 rounded-full border border-[#DDD4C5]">
          {display}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Direct Call Button */}
        <a
          href={telUrl}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm bg-white hover:bg-[#EEE6D8] text-[#24332B] border border-[#DDD4C5] shadow-2xs transition-colors"
        >
          <Phone className="w-4 h-4 text-[#8A7965] shrink-0" />
          <span>Telepon Takmir</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={fullWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm bg-[#8A7965] hover:bg-[#73624F] text-[#FBF8F2] shadow-2xs transition-colors"
        >
          <MessageSquare className="w-4 h-4 shrink-0" />
          <span>WhatsApp Takmir</span>
        </a>
      </div>
    </div>
  )
}
