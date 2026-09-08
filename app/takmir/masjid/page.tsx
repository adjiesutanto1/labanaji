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
    (mosques.length > 0 ? mosques[0] : null)

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

      {/* Mosque Edit Form or Empty State */}
      {defaultMosque ? (
        <MosqueForm mosque={defaultMosque} />
      ) : (
        <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-[#EFE7DC] text-[#6B5B49] flex items-center justify-center mx-auto">
            <Landmark className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-[#24332B]">
              Belum Ada Masjid yang Ditugaskan
            </h3>
            <p className="text-xs sm:text-sm text-[#5C6D62]">
              Akun takmir Anda belum terhubung dengan data masjid di database. Silakan hubungi Superadmin untuk menetapkan masjid Anda.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
