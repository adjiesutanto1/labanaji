'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Study, Mosque } from '@/lib/supabase/types'
import { StatusBadge } from '@/components/takmir/status-badge'
import { DeleteDialog } from '@/components/takmir/delete-dialog'
import { formatDateIndonesian, getTodayDateString } from '@/lib/utils'
import {
  Search,
  Plus,
  Calendar,
  Clock,
  Edit,
  Landmark,
  Building2,
  Filter,
} from 'lucide-react'

interface SuperadminKajianListProps {
  initialStudies: Study[]
  mosques: Mosque[]
}

export function SuperadminKajianList({ initialStudies, mosques }: SuperadminKajianListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMosqueId, setSelectedMosqueId] = useState<string>('all')
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past'>('all')

  const today = getTodayDateString()

  const filteredStudies = useMemo(() => {
    return initialStudies.filter((study) => {
      // Filter by Mosque
      if (selectedMosqueId !== 'all' && study.mosque_id !== selectedMosqueId) {
        return false
      }

      // Filter by status tab
      if (activeFilter === 'upcoming' && study.study_date < today) return false
      if (activeFilter === 'past' && study.study_date >= today) return false

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = study.title.toLowerCase().includes(q)
        const matchSpeaker = study.speaker?.toLowerCase().includes(q) || false
        const matchMosque = study.mosque?.name.toLowerCase().includes(q) || false
        const matchDesc = study.description?.toLowerCase().includes(q) || false
        if (!matchTitle && !matchSpeaker && !matchMosque && !matchDesc) return false
      }

      return true
    })
  }, [initialStudies, searchQuery, selectedMosqueId, activeFilter, today])

  const upcomingCount = initialStudies.filter((s) => s.study_date >= today).length
  const pastCount = initialStudies.filter((s) => s.study_date < today).length

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3 sm:space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#756B58] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul kajian, ustadz, atau nama masjid..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-full bg-[#F6F1E8] border border-[#DDD4C5] focus:outline-none focus:border-[#8A7965] focus:ring-1 focus:ring-[#8A7965] placeholder:text-[#8A7965] text-[#24332B] transition-all"
            />
          </div>

          {/* Mosque Filter Dropdown */}
          <div className="relative w-full md:w-64 shrink-0">
            <Landmark className="w-4 h-4 text-[#8A7965] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedMosqueId}
              onChange={(e) => setSelectedMosqueId(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] appearance-none"
            >
              <option value="all">Semua Masjid ({mosques.length})</option>
              {mosques.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#EEE6D8] rounded-full border border-[#DDD4C5] shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#8A7965] text-[#FBF8F2] shadow-2xs'
                  : 'text-[#24332B] hover:text-[#8A7965]'
              }`}
            >
              Semua ({initialStudies.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('upcoming')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeFilter === 'upcoming'
                  ? 'bg-[#8A7965] text-[#FBF8F2] shadow-2xs'
                  : 'text-[#24332B] hover:text-[#8A7965]'
              }`}
            >
              Mendatang ({upcomingCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('past')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeFilter === 'past'
                  ? 'bg-[#8A7965] text-[#FBF8F2] shadow-2xs'
                  : 'text-[#24332B] hover:text-[#8A7965]'
              }`}
            >
              Selesai ({pastCount})
            </button>
          </div>
        </div>
      </div>

      {/* Studies Results */}
      {filteredStudies.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs text-[#24332B]">
              <thead className="bg-[#EEE6D8] border-b border-[#DDD4C5] text-[11px] font-bold uppercase tracking-wider text-[#756B58]">
                <tr>
                  <th scope="col" className="px-5 py-3.5 w-16">
                    Poster
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Judul Kajian
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Masjid
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Waktu & Tanggal
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right">
                    Aksi Superadmin
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD4C5]/60">
                {filteredStudies.map((study) => (
                  <tr
                    key={study.id}
                    className="hover:bg-[#F6F1E8] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="relative w-12 h-12 rounded-xl bg-[#EEE6D8] overflow-hidden shrink-0 border border-[#DDD4C5]">
                        <Image
                          src={study.poster_url || '/images/default-poster.jpg'}
                          alt={study.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-sm text-[#24332B] line-clamp-1">
                        {study.title}
                      </p>
                      <p className="text-[11px] text-[#5C6D62] line-clamp-1">
                        {study.speaker || 'Ustadz Banyuwangi'}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Landmark className="w-3.5 h-3.5 text-[#8A7965] shrink-0" />
                        <span className="font-semibold text-[#24332B] line-clamp-1">
                          {study.mosque?.name || 'Masjid Banyuwangi'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <p className="font-medium text-[#24332B]">
                        {formatDateIndonesian(study.study_date)}
                      </p>
                      <p className="text-[11px] text-[#5C6D62]">
                        {study.start_time} WIB
                      </p>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <StatusBadge studyDate={study.study_date} />
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-2">
                        <Link
                          href={`/takmir/edit/${study.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-[#24332B] hover:text-[#8A7965] bg-[#EEE6D8] hover:bg-[#E7DED0] border border-[#DDD4C5] transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>
                        <DeleteDialog
                          studyId={study.id}
                          studyTitle={study.title}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-3">
            {filteredStudies.map((study) => (
              <div
                key={study.id}
                className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-4 shadow-2xs space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-16 h-16 rounded-2xl bg-[#EEE6D8] overflow-hidden shrink-0 border border-[#DDD4C5]">
                    <Image
                      src={study.poster_url || '/images/default-poster.jpg'}
                      alt={study.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <StatusBadge studyDate={study.study_date} />
                    </div>
                    <h3 className="font-bold text-sm text-[#24332B] line-clamp-2 leading-snug">
                      {study.title}
                    </h3>
                    <p className="text-xs text-[#5C6D62] line-clamp-1">
                      {study.speaker || 'Ustadz Banyuwangi'}
                    </p>
                    <p className="text-[11px] font-semibold text-[#8A7965] flex items-center gap-1 truncate pt-0.5">
                      <Landmark className="w-3 h-3 shrink-0" />
                      <span>{study.mosque?.name || 'Masjid'}</span>
                    </p>
                    <div className="flex items-center gap-2.5 text-[11px] text-[#756B58] pt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#8A7965]" />
                        {formatDateIndonesian(study.study_date)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#8A7965]" />
                        {study.start_time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DDD4C5]/60">
                  <Link
                    href={`/takmir/edit/${study.id}`}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#24332B] bg-[#EEE6D8] hover:bg-[#E7DED0] border border-[#DDD4C5] transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>
                  <DeleteDialog studyId={study.id} studyTitle={study.title} />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-[#EFE7DC] text-[#6B5B49] flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-[#24332B]">
              {searchQuery || selectedMosqueId !== 'all'
                ? 'Kajian Tidak Ditemukan'
                : 'Belum Ada Jadwal Kajian'}
            </h3>
            <p className="text-xs text-[#5C6D62]">
              {searchQuery || selectedMosqueId !== 'all'
                ? 'Tidak ada kajian yang sesuai dengan kriteria filter pencarian Anda.'
                : 'Belum ada kajian yang dipublikasikan di platform LABANAJI.'}
            </p>
          </div>
          {searchQuery || selectedMosqueId !== 'all' ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setSelectedMosqueId('all')
                setActiveFilter('all')
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs bg-[#EEE6D8] hover:bg-[#E7DED0] text-[#24332B] border border-[#DDD4C5] transition-colors"
            >
              Reset Filter
            </button>
          ) : (
            <Link
              href="/takmir/tambah"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs bg-[#8A7965] hover:bg-[#73624F] text-[#FBF8F2] shadow-2xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Kajian Baru</span>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
