import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getStudies } from '@/lib/data/studies'
import { getMosques } from '@/lib/data/mosques'
import { SuperadminKajianList } from '@/components/superadmin/superadmin-kajian-list'
import { CalendarDays, Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kelola Seluruh Kajian | LABANAJI Superadmin',
  description: 'Kelola, filter, dan edit seluruh jadwal kajian masjid di Banyuwangi.',
}

export default async function SuperadminKajianPage() {
  const [{ studies }, mosques] = await Promise.all([
    getStudies({ pageSize: 200 }),
    getMosques(),
  ])

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#DDD4C5]/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE7DC] text-[#6B5B49] text-[11px] font-bold tracking-wide">
            <CalendarDays className="w-3.5 h-3.5 text-[#8A7965]" />
            <span>Manajemen Jadwal Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24332B] tracking-tight">
            Seluruh Jadwal Kajian
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6D62]">
            Pantau dan kelola seluruh jadwal kajian dari semua masjid di Banyuwangi.
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

      {/* Kajian List */}
      <SuperadminKajianList initialStudies={studies} mosques={mosques} />
    </div>
  )
}
