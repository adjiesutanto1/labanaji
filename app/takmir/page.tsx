import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getStudies } from '@/lib/data/studies'
import { getMosques, getMosqueById } from '@/lib/data/mosques'
import { getTakmirSession } from '@/lib/actions/auth'
import { StatusBadge } from '@/components/takmir/status-badge'
import { DeleteDialog } from '@/components/takmir/delete-dialog'
import { formatDateIndonesian, getTodayDateString } from '@/lib/utils'
import {
  Plus,
  Calendar,
  Clock,
  Edit,
  Landmark,
  ArrowRight,
  Sparkles,
  CalendarCheck,
  CalendarDays,
  ShieldCheck,
  MapPin,
  Phone,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard Takmir | LABANAJI',
  description: 'Ringkasan aktivitas kajian dan manajemen profil masjid Banyuwangi.',
}

export default async function TakmirDashboardPage() {
  const session = await getTakmirSession()
  const mosqueId = session?.mosqueId || undefined

  const [{ studies }, mosques] = await Promise.all([
    getStudies({ mosqueId, pageSize: 50 }),
    getMosques(),
  ])

  const assignedMosque =
    session?.mosque ||
    (mosqueId ? await getMosqueById(mosqueId) : null) ||
    mosques[0] || {
      id: 'mosque-1',
      name: 'Masjid Agung Baiturrahman',
      address: 'Jl. Sudirman No. 1, Kepatihan',
      takmir_phone: '081234567890',
      image_url: '/images/baiturrahman.jpg',
    }

  const defaultMosque = assignedMosque

  const today = getTodayDateString()
  const upcomingStudies = studies.filter((s) => s.study_date >= today)
  const todayStudies = studies.filter((s) => s.study_date === today)
  const totalStudies = studies.length

  // Recent 6 studies for dashboard overview
  const recentStudies = studies.slice(0, 6)

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#DDD4C5]/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE7DC] text-[#6B5B49] text-[11px] font-bold tracking-wide">
            <Sparkles className="w-3 h-3 text-[#8A7965]" />
            <span>Selamat datang, Takmir</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24332B] tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6D62]">
            Ringkasan aktivitas kajian dan informasi masjid Anda.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/takmir/tambah"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-[#8A7965] hover:bg-[#73624F] text-[#FBF8F2] shadow-2xs hover:shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Kajian</span>
          </Link>
        </div>
      </div>

      {/* 4 Compact Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Mendatang */}
        <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#756B58]">
              Kajian Mendatang
            </span>
            <div className="w-8 h-8 rounded-full bg-[#EFE7DC] text-[#6B5B49] flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#24332B]">
              {upcomingStudies.length}
            </span>
            <span className="text-[11px] font-semibold text-[#5C6D62]">Jadwal</span>
          </div>
        </div>

        {/* Card 2: Hari Ini */}
        <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#756B58]">
              Kajian Hari Ini
            </span>
            <div className="w-8 h-8 rounded-full bg-[#F4EEE6] text-[#8A7965] flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#24332B]">
              {todayStudies.length}
            </span>
            <span className="text-[11px] font-semibold text-[#5C6D62]">Aktif</span>
          </div>
        </div>

        {/* Card 3: Total Kajian */}
        <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#756B58]">
              Total Kajian
            </span>
            <div className="w-8 h-8 rounded-full bg-[#EEE6D8] text-[#24332B] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#24332B]">
              {totalStudies}
            </span>
            <span className="text-[11px] font-semibold text-[#5C6D62]">Terdaftar</span>
          </div>
        </div>

        {/* Card 4: Status Masjid */}
        <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#756B58]">
              Status Masjid
            </span>
            <div className="w-8 h-8 rounded-full bg-[#EFE7DC] text-[#6B5B49] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8A7965] animate-pulse" />
            <span className="text-base sm:text-lg font-bold text-[#24332B]">
              Aktif
            </span>
          </div>
        </div>
      </div>

      {/* Mosque Quick Preview Card */}
      <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#EEE6D8] overflow-hidden shrink-0 border border-[#DDD4C5]">
            <Image
              src={defaultMosque.image_url || '/images/baiturrahman.jpg'}
              alt={defaultMosque.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#8A7965] bg-[#EFE7DC] px-2.5 py-0.5 rounded-full">
              <Landmark className="w-3 h-3" />
              <span>Masjid Anda</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#24332B] leading-tight">
              {defaultMosque.name}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5C6D62]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#8A7965]" />
                {defaultMosque.address}
              </span>
              {defaultMosque.takmir_phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#8A7965]" />
                  {defaultMosque.takmir_phone}
                </span>
              )}
            </div>
          </div>
        </div>

        <Link
          href="/takmir/masjid"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-[#24332B] bg-[#EEE6D8] hover:bg-[#E7DED0] border border-[#DDD4C5] transition-colors self-end md:self-center shrink-0"
        >
          <span>Kelola Profil Masjid</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Recent Studies Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#24332B]">
              Kajian Terbaru
            </h2>
            <p className="text-xs text-[#5C6D62]">
              Daftar kajian yang baru saja Anda jadwalkan.
            </p>
          </div>

          <Link
            href="/takmir/kajian"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#8A7965] hover:text-[#24332B] hover:underline"
          >
            <span>Lihat Semua Kajian</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentStudies.length > 0 ? (
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
                      Judul Kajian & Pemateri
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      Tanggal
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      Waktu
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      Status
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD4C5]/60">
                  {recentStudies.map((study) => (
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
                      <td className="px-5 py-3.5 font-medium text-[#24332B] whitespace-nowrap">
                        {formatDateIndonesian(study.study_date)}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-[#5C6D62] whitespace-nowrap">
                        {study.start_time} WIB
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
              {recentStudies.map((study) => (
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
                Belum Ada Jadwal Kajian
              </h3>
              <p className="text-xs text-[#5C6D62]">
                Tambahkan jadwal kajian pertama untuk mulai membagikan informasi kepada jamaah di Banyuwangi.
              </p>
            </div>
            <Link
              href="/takmir/tambah"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs bg-[#8A7965] hover:bg-[#73624F] text-[#FBF8F2] shadow-2xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Kajian Pertama</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
