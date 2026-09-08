import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getStudies } from '@/lib/data/studies'
import { getMosques } from '@/lib/data/mosques'
import { StudyGrid } from '@/components/study-grid'
import { FilterBar } from '@/components/filter-bar'
import { EmptyState } from '@/components/empty-state'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Semua Jadwal Kajian Islam Banyuwangi',
  description:
    'Daftar lengkap jadwal kajian dan pengajian rutin di masjid-masjid Banyuwangi. Temukan kajian berdasarkan tanggal dan lokasi masjid.',
}

interface KajianPageProps {
  searchParams: Promise<{
    q?: string
    date?: string
    mosque?: string
    page?: string
  }>
}

export default async function KajianPage({ searchParams }: KajianPageProps) {
  const params = await searchParams
  const query = params.q || ''
  const date = params.date || ''
  const mosqueSlug = params.mosque || ''
  const page = parseInt(params.page || '1', 10) || 1

  const [mosques, { studies, totalCount, totalPages }] = await Promise.all([
    getMosques(),
    getStudies({
      query,
      date,
      mosqueSlug,
      page,
      pageSize: 9,
    }),
  ])

  // Build pagination links
  const createPageUrl = (newPage: number) => {
    const urlParams = new URLSearchParams()
    if (query) urlParams.set('q', query)
    if (date) urlParams.set('date', date)
    if (mosqueSlug) urlParams.set('mosque', mosqueSlug)
    urlParams.set('page', String(newPage))
    return `/kajian?${urlParams.toString()}`
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="space-y-2 border-b border-[#DDD4C5] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EFE7DC] border border-[#DDD4C5] text-[#6B5B49] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
          <CalendarDays className="w-3.5 h-3.5 text-[#8A7965]" />
          <span>Jadwal Pengajian</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#24332B] tracking-tight">
          Semua Kajian di Banyuwangi
        </h1>
        <p className="text-xs sm:text-sm text-[#5C6D62] max-w-xl">
          Jelajahi dan temukan informasi pengajian rutin dari berbagai masjid di wilayah Banyuwangi.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <FilterBar mosques={mosques} />

      {/* Results Header / Stats */}
      <div className="flex items-center justify-between text-xs text-[#5C6D62] font-medium">
        <span>
          Menampilkan <strong className="text-[#24332B]">{studies.length}</strong> dari{' '}
          <strong className="text-[#24332B]">{totalCount}</strong> jadwal kajian
        </span>
        {date && (
          <span className="bg-[#EFE7DC] text-[#6B5B49] px-3 py-1 rounded-full text-xs font-bold border border-[#DDD4C5]">
            Filter Tanggal Aktif
          </span>
        )}
      </div>

      {/* Studies Grid or Empty State */}
      {studies.length > 0 ? (
        <StudyGrid studies={studies} />
      ) : (
        <EmptyState
          title="Tidak ada kajian yang sesuai."
          description="Coba ubah kata kunci pencarian, tanggal, atau pilihan masjid untuk melihat kajian lainnya."
          actionLabel="Reset Pencarian"
          actionHref="/kajian"
          variant="general"
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6 border-t border-[#DDD4C5]">
          {page > 1 ? (
            <Link
              href={createPageUrl(page - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#FBF8F2] border border-[#DDD4C5] hover:bg-white text-[#24332B] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#EEE6D8] border border-[#DDD4C5] text-[#756B58] cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </span>
          )}

          <span className="text-xs font-medium text-[#5C6D62] px-2">
            Halaman {page} dari {totalPages}
          </span>

          {page < totalPages ? (
            <Link
              href={createPageUrl(page + 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#FBF8F2] border border-[#DDD4C5] hover:bg-white text-[#24332B] transition-colors"
            >
              <span>Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#EEE6D8] border border-[#DDD4C5] text-[#756B58] cursor-not-allowed">
              <span>Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </div>
      )}
    </div>
  )
}
