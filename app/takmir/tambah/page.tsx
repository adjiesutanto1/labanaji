import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getMosques } from '@/lib/data/mosques'
import { StudyForm } from '@/components/takmir/study-form'
import { ArrowLeft, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tambah Kajian Baru | LABANAJI Takmir',
  description: 'Unggah poster dan publikasikan jadwal pengajian masjid di Banyuwangi.',
}

export default async function TambahKajianPage() {
  const mosques = await getMosques()

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href="/takmir/kajian"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#8A7965] hover:text-[#24332B] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Kajian</span>
        </Link>
      </div>

      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE7DC] text-[#6B5B49] text-[11px] font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#8A7965]" />
          <span>Publikasi Baru</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24332B] tracking-tight">
          Unggah Jadwal Kajian
        </h1>
        <p className="text-xs sm:text-sm text-[#5C6D62]">
          Lengkapi formulir dan unggah poster agar jamaah Banyuwangi dapat melihat informasi kajian ini.
        </p>
      </div>

      <StudyForm mosques={mosques} mode="create" />
    </div>
  )
}
