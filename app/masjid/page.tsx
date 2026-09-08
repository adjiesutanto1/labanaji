import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getMosques } from '@/lib/data/mosques'
import { Landmark, MapPin, CalendarDays, ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Daftar Masjid di Banyuwangi | LABANAJI',
  description:
    'Daftar masjid-masjid di Banyuwangi yang rutin menyelenggarakan kajian Islam, fiqih, tafsir, dan majelis ilmu.',
}

export default async function MosquesDirectoryPage() {
  const mosques = await getMosques()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-[#DDD4C5] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EFE7DC] border border-[#DDD4C5] text-[#6B5B49] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
          <Landmark className="w-3.5 h-3.5 text-[#8A7965]" />
          <span>Direktori Masjid</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#24332B] tracking-tight">
          Masjid Penyelenggara Kajian di Banyuwangi
        </h1>
        <p className="text-xs sm:text-sm text-[#5C6D62] max-w-xl">
          Informasi masjid-masjid di Banyuwangi yang aktif mengadakan kegiatan kajian rutin dan majelis ilmu untuk umat.
        </p>
      </div>

      {/* Grid of Mosques or Empty State */}
      {mosques.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mosques.map((mosque) => (
            <article
              key={mosque.id || mosque.slug}
              className="group bg-[#FBF8F2] rounded-3xl border border-[#DDD4C5] shadow-2xs hover:shadow-xs hover:border-[#8A7965] transition-all duration-200 overflow-hidden flex flex-col"
            >
              {/* Mosque Image */}
              <Link
                href={`/masjid/${mosque.slug}`}
                className="relative aspect-[16/10] w-full bg-[#EEE6D8] block overflow-hidden"
                aria-label={`Lihat profil ${mosque.name}`}
              >
                <Image
                  src={mosque.image_url || '/images/default-mosque.jpg'}
                  alt={mosque.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                />
              </Link>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <h2 className="font-bold text-base sm:text-lg text-[#24332B] group-hover:text-[#8A7965] transition-colors leading-snug">
                    <Link href={`/masjid/${mosque.slug}`}>{mosque.name}</Link>
                  </h2>

                  <div className="flex items-start gap-1.5 text-xs text-[#5C6D62]">
                    <MapPin className="w-3.5 h-3.5 text-[#8A7965] shrink-0 mt-0.5" />
                    <p className="line-clamp-2 leading-relaxed">{mosque.address}</p>
                  </div>

                  {mosque.routine_info && (
                    <div className="flex items-start gap-1.5 text-xs text-[#29372F] bg-[#EEE6D8] p-3 rounded-2xl border border-[#DDD4C5]/60">
                      <CalendarDays className="w-3.5 h-3.5 text-[#8A7965] shrink-0 mt-0.5" />
                      <span className="line-clamp-2 leading-relaxed">
                        {mosque.routine_info}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Link */}
                <div className="pt-3 border-t border-[#DDD4C5]/60 flex items-center justify-between text-xs font-bold text-[#8A7965]">
                  <span>Lihat Jadwal & Info Takmir</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-10 sm:p-16 text-center space-y-4 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-[#EFE7DC] text-[#6B5B49] flex items-center justify-center mx-auto">
            <Landmark className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-[#24332B]">
              Belum Ada Masjid Terdaftar
            </h3>
            <p className="text-xs sm:text-sm text-[#5C6D62]">
              Daftarkan masjid Anda untuk mulai mempublikasikan jadwal kajian dan majelis ilmu di Banyuwangi.
            </p>
          </div>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs bg-[#8A7965] hover:bg-[#73624F] text-[#FBF8F2] shadow-2xs transition-colors"
          >
            <span>Daftar Sebagai Takmir</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  )
}
