import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getMosques } from '@/lib/data/mosques'
import { GenerateTakmirForm } from '@/components/superadmin/generate-takmir-form'
import { ArrowLeft, UserPlus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tambah Akun Takmir | LABANAJI Superadmin',
  description: 'Buat akun Takmir baru dan tugaskan ke masjid yang bersangkutan.',
}

export default async function TambahTakmirSuperadminPage() {
  const mosques = await getMosques()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/superadmin/takmir"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#8A7965] hover:text-[#24332B] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Kelola Takmir</span>
        </Link>
      </div>

      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE7DC] text-[#6B5B49] text-[11px] font-bold tracking-wide">
          <UserPlus className="w-3.5 h-3.5 text-[#8A7965]" />
          <span>Akun Takmir Baru</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24332B] tracking-tight">
          Generate Akun Takmir
        </h1>
        <p className="text-xs sm:text-sm text-[#5C6D62]">
          Buat akun login pengurus Takmir dan tautkan secara otomatis ke masjid yang dikelola.
        </p>
      </div>

      <GenerateTakmirForm mosques={mosques} />
    </div>
  )
}
