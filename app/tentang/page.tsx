import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Heart, CheckCircle2, ShieldCheck, Zap, Smartphone, ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tentang LABANAJI — Lare Banyuwangi Demen Ngaji',
  description:
    'Mengenal LABANAJI, platform informasi dan poster kajian Islam untuk masyarakat Banyuwangi.',
}

export default function TentangPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EFE7DC] border border-[#DDD4C5] text-[#6B5B49] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 text-[#8A7965]" />
          <span>Inisiatif Dakwah Lokal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#24332B] tracking-tight">
          Tentang LABANAJI
        </h1>
        <p className="text-base sm:text-lg font-semibold text-[#8A7965]">
          Lare Banyuwangi Demen Ngaji
        </p>
        <p className="text-sm sm:text-base text-[#5C6D62] leading-relaxed">
          Platform independen dan nirlaba yang berdedikasi untuk memudahkan seluruh masyarakat Banyuwangi menemukan informasi dan jadwal majelis ilmu di sekitarnya.
        </p>
      </div>

      {/* Nilai Utama / UX Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#FBF8F2] p-6 rounded-3xl border border-[#DDD4C5] shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#EFE7DC] border border-[#DDD4C5] flex items-center justify-center text-[#8A7965]">
            <Zap className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-base text-[#24332B]">Cepat & Ringan</h2>
          <p className="text-xs sm:text-sm text-[#5C6D62] leading-relaxed">
            Didesain tanpa beban script berlebih agar halaman terbuka seketika bahkan saat koneksi internet sedang lambat.
          </p>
        </div>

        <div className="bg-[#FBF8F2] p-6 rounded-3xl border border-[#DDD4C5] shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#EFE7DC] border border-[#DDD4C5] flex items-center justify-center text-[#8A7965]">
            <Smartphone className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-base text-[#24332B]">Nyaman di HP</h2>
          <p className="text-xs sm:text-sm text-[#5C6D62] leading-relaxed">
            Tampilan mobile-first yang intuitif: buka website, langsung tahu ada kajian apa hari ini, lokasi, dan nomor takmir.
          </p>
        </div>

        <div className="bg-[#FBF8F2] p-6 rounded-3xl border border-[#DDD4C5] shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#EFE7DC] border border-[#DDD4C5] flex items-center justify-center text-[#8A7965]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-base text-[#24332B]">Terverifikasi & Akurat</h2>
          <p className="text-xs sm:text-sm text-[#5C6D62] leading-relaxed">
            Informasi berasal langsung dari takmir masjid dan poster resmi kajian yang bersangkutan.
          </p>
        </div>
      </div>

      {/* Bagian Takmir Masjid */}
      <div className="bg-[#FBF8F2] rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xs border border-[#DDD4C5]">
        <div className="space-y-2">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#8A7965]">
            Kolaborasi Masjid
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#24332B]">
            Bagaimana Takmir Masjid Dapat Berpartisipasi?
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6D62] leading-relaxed">
            Kami mengundang takmir masjid, panitia pengajian, dan remaja masjid se-Banyuwangi untuk memanfaatkan platform ini secara gratis:
          </p>
        </div>

        <ul className="space-y-3 text-xs sm:text-sm text-[#29372F]">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#8A7965] shrink-0 mt-0.5" />
            <span>Unggah poster kajian masjid dengan satu formulir sederhana.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#8A7965] shrink-0 mt-0.5" />
            <span>Informasi jadwal langsung muncul di halaman &ldquo;Kajian Hari Ini&rdquo; dan direktori masjid.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#8A7965] shrink-0 mt-0.5" />
            <span>Jamaah dapat langsung menghubungi kontak takmir atau membuka navigasi arah Google Maps.</span>
          </li>
        </ul>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Link
            href="/takmir"
            className="px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-[#8A7965] hover:bg-[#73624F] text-[#FBF8F2] transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <span>Masuk ke Area Takmir</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm bg-[#EEE6D8] hover:bg-[#E7DED0] text-[#24332B] border border-[#DDD4C5] transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
