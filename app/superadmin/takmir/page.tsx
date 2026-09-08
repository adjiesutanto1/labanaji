import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getTakmirProfiles } from '@/lib/data/takmir'
import { getMosques } from '@/lib/data/mosques'
import { SuperadminTakmirList } from '@/components/superadmin/superadmin-takmir-list'
import { Users, Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kelola Takmir | LABANAJI Superadmin',
  description: 'Kelola akun pengurus masjid yang terdaftar di LABANAJI.',
}

export default async function KelolaTakmirPage() {
  const [takmirs, mosques] = await Promise.all([
    getTakmirProfiles(),
    getMosques(),
  ])

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#DDD4C5]/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE7DC] text-[#6B5B49] text-[11px] font-bold tracking-wide">
            <Users className="w-3.5 h-3.5 text-[#8A7965]" />
            <span>Manajemen Akun Pengurus</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24332B] tracking-tight">
            Kelola Takmir
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6D62]">
            Kelola akun pengurus masjid yang terdaftar di LABANAJI.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/superadmin/takmir/tambah"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-[#8A7965] hover:bg-[#73624F] text-[#FBF8F2] shadow-2xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Takmir</span>
          </Link>
        </div>
      </div>

      {/* Takmir List with Search & Actions */}
      <SuperadminTakmirList initialTakmirs={takmirs} mosques={mosques} />
    </div>
  )
}
