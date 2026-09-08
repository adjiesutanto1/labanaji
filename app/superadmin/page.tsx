import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getMosques } from '@/lib/data/mosques'
import { getStudies } from '@/lib/data/studies'
import { getTakmirProfiles } from '@/lib/data/takmir'
import { StatusBadge } from '@/components/takmir/status-badge'
import { DeleteDialog } from '@/components/takmir/delete-dialog'
import { formatDateIndonesian, getTodayDateString } from '@/lib/utils'
import {
  ShieldCheck,
  Landmark,
  CalendarDays,
  Calendar,
  Users,
  CalendarCheck,
  ExternalLink,
  MapPin,
  Phone,
  CheckCircle2,
  ArrowRight,
  Edit,
  Plus,
  Clock,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ringkasan Superadmin | LABANAJI',
  description: 'Ringkasan platform, masjid, akun takmir, dan jadwal kajian se-Banyuwangi.',
}

export default async function SuperadminOverviewPage() {
  const [mosques, { studies }, takmirs] = await Promise.all([
    getMosques(),
    getStudies({ pageSize: 100 }),
    getTakmirProfiles(),
  ])

  const today = getTodayDateString()
  const todayStudies = studies.filter((s) => s.study_date === today)
  const recentStudies = studies.slice(0, 6)

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#DDD4C5]/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE7DC] text-[#6B5B49] text-[11px] font-bold tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8A7965]" />
            <span>Superadmin Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24332B] tracking-tight">
            Ringkasan Platform LABANAJI
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6D62]">
            Pantau seluruh masjid, takmir, dan jadwal kajian di Banyuwangi.
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

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Mosques */}
        <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#756B58]">
              Total Masjid
            </span>
            <div className="w-8 h-8 rounded-full bg-[#EFE7DC] text-[#6B5B49] flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#24332B]">
              {mosques.length}
            </span>
            <span className="text-[11px] font-semibold text-[#5C6D62]">Masjid</span>
          </div>
        </div>

        {/* Total Kajian */}
        <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#756B58]">
              Total Kajian
            </span>
            <div className="w-8 h-8 rounded-full bg-[#F4EEE6] text-[#8A7965] flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#24332B]">
              {studies.length}
            </span>
            <span className="text-[11px] font-semibold text-[#5C6D62]">Jadwal</span>
          </div>
        </div>

        {/* Total Takmir */}
        <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#756B58]">
              Total Takmir
            </span>
            <div className="w-8 h-8 rounded-full bg-[#EEE6D8] text-[#24332B] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#24332B]">
              {takmirs.length}
            </span>
            <span className="text-[11px] font-semibold text-[#5C6D62]">Pengurus</span>
          </div>
        </div>

        {/* Kajian Hari Ini */}
        <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#756B58]">
              Kajian Hari Ini
            </span>
            <div className="w-8 h-8 rounded-full bg-[#EFE7DC] text-[#6B5B49] flex items-center justify-center">
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
      </div>

      {/* Section 1: Masjid & Pengurus Takmir */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#24332B]">
              Masjid & Pengurus Takmir
            </h2>
            <p className="text-xs text-[#5C6D62]">
              Daftar masjid terdaftar dan takmir penanggung jawab.
            </p>
          </div>

          <Link
            href="/superadmin/masjid"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#8A7965] hover:text-[#24332B] hover:underline"
          >
            <span>Semua Masjid ({mosques.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl overflow-hidden shadow-2xs">
          <div className="divide-y divide-[#DDD4C5]/60">
            {mosques.slice(0, 4).map((mosque) => {
              const mosqueStudies = studies.filter((s) => s.mosque_id === mosque.id)
              return (
                <div
                  key={mosque.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#F6F1E8]/70 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="relative w-12 h-12 rounded-xl bg-[#EEE6D8] overflow-hidden shrink-0 border border-[#DDD4C5]">
                      <Image
                        src={mosque.image_url || '/images/baiturrahman.jpg'}
                        alt={mosque.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-[#24332B]">
                          {mosque.name}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#6B5B49] bg-[#EFE7DC] px-2 py-0.5 rounded-full border border-[#DDD4C5]/60">
                          <CheckCircle2 className="w-3 h-3 text-[#8A7965]" />
                          <span>Terverifikasi</span>
                        </span>
                      </div>
                      <p className="text-xs text-[#5C6D62] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#8A7965]" />
                        <span>{mosque.address}</span>
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-[#756B58] pt-0.5">
                        <span className="font-medium">
                          Takmir: <strong className="text-[#24332B]">{mosque.takmir_name}</strong> ({mosque.takmir_phone})
                        </span>
                        <span>•</span>
                        <span>{mosqueStudies.length} Kajian</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Link
                      href="/superadmin/masjid"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#24332B] bg-[#EEE6D8] hover:bg-[#E7DED0] px-3.5 py-1.5 rounded-full border border-[#DDD4C5] transition-colors"
                    >
                      <span>Kelola</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Section 2: Jadwal Kajian Terbaru (Platform-Wide) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#24332B]">
              Jadwal Kajian Terbaru
            </h2>
            <p className="text-xs text-[#5C6D62]">
              Seluruh jadwal kajian terbaru dari semua masjid di Banyuwangi.
            </p>
          </div>

          <Link
            href="/superadmin/kajian"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#8A7965] hover:text-[#24332B] hover:underline"
          >
            <span>Semua Kajian ({studies.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentStudies.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs text-[#24332B]">
                <thead className="bg-[#EEE6D8]/60 border-b border-[#DDD4C5] text-[11px] font-bold uppercase tracking-wider text-[#756B58]">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 w-16">
                      Poster
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      Judul Kajian & Pemateri
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      Masjid
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      Tanggal & Waktu
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
                      className="hover:bg-[#F6F1E8]/70 transition-colors"
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
                        <span className="font-semibold text-[#24332B] line-clamp-1">
                          {study.mosque?.name || 'Masjid'}
                        </span>
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

            {/* Mobile Card List */}
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
          <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-8 text-center space-y-2">
            <p className="text-xs text-[#5C6D62]">Belum ada jadwal kajian.</p>
          </div>
        )}
      </div>
    </div>
  )
}
