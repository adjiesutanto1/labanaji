import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'
import { ArrowLeft } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'

export const metadata: Metadata = {
  title: 'Masuk Area Takmir | LABANAJI',
  description: 'Portal masuk takmir masjid Banyuwangi untuk mengelola poster dan jadwal kajian.',
}

export default function TakmirLoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 space-y-6">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#8A7965] hover:text-[#24332B] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      <div className="bg-[#FBF8F2] rounded-3xl border border-[#DDD4C5] p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo size={52} priority />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#24332B]">Area Takmir Masjid</h1>
          <p className="text-xs text-[#5C6D62]">
            Masuk untuk mempublikasikan dan mengelola jadwal kajian masjid Anda di Banyuwangi.
          </p>
        </div>

        <LoginForm />

        <div className="pt-2 text-center border-t border-[#DDD4C5]/60">
          <p className="text-[11px] text-[#756B58]">
            Belum memiliki akses takmir untuk masjid Anda? Hubungi admin komunitas LABANAJI Banyuwangi.
          </p>
        </div>
      </div>
    </div>
  )
}
