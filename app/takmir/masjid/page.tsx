import React from 'react'
import type { Metadata } from 'next'
import { getMosques, getMosqueById } from '@/lib/data/mosques'
import { getTakmirSession } from '@/lib/actions/auth'
import { MosqueForm } from '@/components/takmir/mosque-form'
import { Landmark } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Masjid Saya | LABANAJI Takmir',
  description: 'Kelola informasi profil, foto, dan kontak takmir masjid Anda di Banyuwangi.',
}

export default async function TakmirMasjidPage() {
  const session = await getTakmirSession()
  const mosqueId = session?.mosqueId
  const mosques = await getMosques()

  const defaultMosque =
    session?.mosque ||
    (mosqueId ? await getMosqueById(mosqueId) : null) ||
    mosques[0] || {
      id: 'mosque-1',
      name: 'Masjid Agung Baiturrahman',
      slug: 'masjid-agung-baiturrahman',
      address: 'Jl. Jenderal Sudirman No. 1, Temenggungan, Kec. Banyuwangi, Kabupaten Banyuwangi',
      latitude: null,
      longitude: null,
      takmir_name: 'H. Ahmad Fauzi, S.Ag.',
      takmir_phone: '081234567890',
      image_url: '/images/baiturrahman.jpg',
      routine_info: 'Kajian rutin Fiqih dan Tematik setiap malam Ahad dan Ahad Subuh.',
    }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header */}
      <div className="pb-2 border-b border-[#DDD4C5]/80 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE7DC] text-[#6B5B49] text-[11px] font-bold tracking-wide">
          <Landmark className="w-3.5 h-3.5 text-[#8A7965]" />
          <span>Profil Masjid</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24332B] tracking-tight">
          Masjid Saya
        </h1>
        <p className="text-xs sm:text-sm text-[#5C6D62]">
          Informasi profil masjid yang akan ditampilkan kepada masyarakat pada website publik LABANAJI.
        </p>
      </div>

      {/* Mosque Edit Form */}
      <MosqueForm mosque={defaultMosque} />
    </div>
  )
}
