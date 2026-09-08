import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMosques } from '@/lib/data/mosques'
import { getStudies } from '@/lib/data/studies'
import { getCurrentUserAndProfile } from '@/lib/actions/auth'
import { StudyForm } from '@/components/takmir/study-form'
import { ArrowLeft, Edit } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Edit Jadwal Kajian | LABANAJI Takmir',
  description: 'Perbarui informasi dan poster kajian masjid Anda.',
}

interface EditKajianPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditKajianPage({ params }: EditKajianPageProps) {
  const { id } = await params
  const [session, mosques, { studies }] = await Promise.all([
    getCurrentUserAndProfile(),
    getMosques(),
    getStudies({ pageSize: 100 }),
  ])

  const study = studies.find((s) => s.id === id)

  // Strict Ownership Check: Takmir can only access their own mosque's study
  if (!study) {
    notFound()
  }

  if (session?.role === 'takmir' && session.mosqueId && study.mosque_id !== session.mosqueId) {
    notFound()
  }

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
          <Edit className="w-3.5 h-3.5 text-[#8A7965]" />
          <span>Perbarui Data</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24332B] tracking-tight">
          Edit Jadwal Kajian
        </h1>
        <p className="text-xs sm:text-sm text-[#5C6D62]">
          Perbarui informasi atau ganti poster kajian jika ada perubahan jadwal.
        </p>
      </div>

      <StudyForm mosques={mosques} study={study} mode="edit" />
    </div>
  )
}
