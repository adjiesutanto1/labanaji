'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MapPin } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'

export function Footer() {
  const pathname = usePathname()

  if (
    pathname?.startsWith('/takmir') ||
    pathname?.startsWith('/superadmin') ||
    pathname === '/login' ||
    pathname === '/register'
  ) {
    return null
  }

  return (
    <footer className="bg-[#1F1A17] text-[#EFE8DA] border-t border-[#332A24] mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <BrandLogo size={32} />
              <span className="text-lg font-bold tracking-tight text-[#FAF7F0]">
                LABANAJI
              </span>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#B38E5D]">
              Lare Banyuwangi Demen Ngaji
            </p>
            <p className="text-xs sm:text-sm text-[#C9BFB5] leading-relaxed max-w-sm">
              Platform pusat informasi jadwal dan poster kajian Islam se-wilayah Banyuwangi. Sederhana, cepat, dan terpercaya untuk masyarakat.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#9E9081] pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#B38E5D] shrink-0" />
              <span>Banyuwangi, Jawa Timur, Indonesia</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FAF7F0]">
              Navigasi Cepat
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#C9BFB5]">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/kajian" className="hover:text-white transition-colors">
                  Semua Kajian
                </Link>
              </li>
              <li>
                <Link href="/masjid" className="hover:text-white transition-colors">
                  Daftar Masjid
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-white transition-colors">
                  Tentang LABANAJI
                </Link>
              </li>
            </ul>
          </div>

          {/* Takmir & Community */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FAF7F0]">
              Untuk Takmir Masjid
            </h3>
            <p className="text-xs text-[#C9BFB5] leading-relaxed">
              Ingin mempublikasikan poster kajian masjid Anda? Masuk ke area takmir atau hubungi pengelola.
            </p>
            <div>
              <Link
                href="/takmir"
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-[#FAF7F0] bg-[#332A24] hover:bg-[#43372F] border border-[#52443A] rounded-full transition-colors"
              >
                Masuk Area Takmir &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#332A24] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9E9081]">
          <p>© {new Date().getFullYear()} LABANAJI. Dedikasi untuk Umat di Banyuwangi.</p>
          <div className="flex items-center gap-1">
            <span>Dibuat untuk masyarakat Banyuwangi</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
