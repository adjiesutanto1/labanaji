import React from 'react'
import type { Metadata } from 'next'
import { getMosques } from '@/lib/data/mosques'
import { getStudies } from '@/lib/data/studies'
import { SuperadminMosqueList } from '@/components/superadmin/superadmin-mosque-list'
import { Landmark } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kelola Masjid | LABANAJI Superadmin',
  description: 'Kelola seluruh data masjid terdaftar di Banyuwangi.',
}

export default async function SuperadminMasjidPage() {
  const [mosques, { studies }] = await Promise.all([
    getMosques(),
    getStudies({ pageSize: 200 }),
  ])

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header */}
      <div className="pb-2 border-b border-[#DDD4C5]/80 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE7DC] text-[#6B5B49] text-[11px] font-bold tracking-wide">
          <Landmark className="w-3.5 h-3.5 text-[#8A7965]" />
          <span>Manajemen Masjid</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24332B] tracking-tight">
          Daftar Seluruh Masjid
        </h1>
        <p className="text-xs sm:text-sm text-[#5C6D62]">
          Pantau, tambah baru, perbarui informasi, dan kelola seluruh masjid di Kabupaten Banyuwangi.
        </p>
      </div>

      {/* Mosque List */}
      <SuperadminMosqueList initialMosques={mosques} studies={studies} />
    </div>
  )
}
