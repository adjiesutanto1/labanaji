import React from 'react'
import { getTodayDateString } from '@/lib/utils'

interface StatusBadgeProps {
  studyDate: string
}

export function StatusBadge({ studyDate }: StatusBadgeProps) {
  const today = getTodayDateString()

  if (studyDate === today) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EFE7DC] text-[#6B5B49] border border-[#DDD4C5]/60">
        <span className="w-1.5 h-1.5 rounded-full bg-[#8A7965]" />
        <span>Hari Ini</span>
      </span>
    )
  }

  if (studyDate > today) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F4EEE6] text-[#8A7965] border border-[#DDD4C5]/60">
        <span className="w-1.5 h-1.5 rounded-full bg-[#8A7965]" />
        <span>Mendatang</span>
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EEE6D8] text-[#756B58] border border-[#DDD4C5]/40">
      <span className="w-1.5 h-1.5 rounded-full bg-[#756B58]" />
      <span>Selesai</span>
    </span>
  )
}
