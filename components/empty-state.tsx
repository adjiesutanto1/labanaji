import React from 'react'
import Link from 'next/link'
import { CalendarSearch, Sparkles } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  variant?: 'today' | 'general'
}

export function EmptyState({
  title = 'Belum ada kajian hari ini.',
  description = 'Cek kembali nanti atau jelajahi jadwal kajian mendatang di Banyuwangi.',
  actionLabel = 'Lihat Semua Kajian',
  actionHref = '/kajian',
  variant = 'today',
}: EmptyStateProps) {
  return (
    <div className="w-full bg-[#FBF8F2] rounded-3xl border border-[#DDD4C5] p-8 sm:p-12 text-center shadow-2xs">
      <div className="w-14 h-14 rounded-full bg-[#EFE7DC] border border-[#DDD4C5] mx-auto flex items-center justify-center text-[#8A7965] mb-4">
        {variant === 'today' ? (
          <Sparkles className="w-6 h-6 text-[#8A7965]" />
        ) : (
          <CalendarSearch className="w-6 h-6 text-[#8A7965]" />
        )}
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-[#24332B] mb-2">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-[#5C6D62] max-w-md mx-auto mb-6 leading-relaxed">
        {description}
      </p>

      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-[#8A7965] hover:bg-[#73624F] text-[#FBF8F2] shadow-2xs transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
