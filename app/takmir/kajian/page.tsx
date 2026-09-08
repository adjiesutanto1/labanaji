import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getStudies } from '@/lib/data/studies'
import { getTakmirSession } from '@/lib/actions/auth'
import { KajianList } from '@/components/takmir/kajian-list'
import { Plus, CalendarDays } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kelola Kajian | LABANAJI Takmir',
  description: 'Kelola dan publikasikan jadwal kajian masjid Anda di Banyuwangi.',
}

export default async function TakmirKajianPage() {
  const session = await getTakmirSession()
  const mosqueId = session?.mosqueId || undefined
  const { studies } = await getStudies({ mosqueId, pageSize: 100 })

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#DDD4C5]/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE7DC] text-[#6B5B49] text-[11px] font-bold tracking-wide">
            <CalendarDays className="w-3.5 h-3.5 text-[#8A7965]" />
            <span>Manajemen Jadwal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24332B] tracking-tight">
            Kajian Masjid
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6D62]">
            Kelola, perbarui, dan unggah poster kajian yang diselenggarakan oleh masjid Anda.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/takmir/tambah"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-[#8A7965] hover:bg-[#73624F] text-[#FBF8F2] shadow-2xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Kajian</span>
          </Link>
        </div>
      </div>

      {/* Kajian List with Search and Filter */}
      <KajianList initialStudies={studies} />
    </div>
  )
}
