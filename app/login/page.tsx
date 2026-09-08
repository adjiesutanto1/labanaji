import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'
import { ArrowLeft } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'

export const metadata: Metadata = {
  title: 'Masuk Akun | LABANAJI',
  description: 'Portal masuk Takmir Masjid dan Superadmin platform LABANAJI Banyuwangi.',
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-md space-y-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#8A7965] hover:text-[#24332B] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda Publik</span>
          </Link>
        </div>

        <div className="bg-[#FBF8F2] rounded-3xl border border-[#DDD4C5] p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <BrandLogo size={52} priority />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#24332B]">
              Masuk Area Manajemen
            </h1>
            <p className="text-xs text-[#5C6D62]">
              Silakan masuk menggunakan akun Takmir Masjid atau Superadmin yang telah terdaftar.
            </p>
          </div>

          <LoginForm />

          <div className="pt-3 text-center border-t border-[#DDD4C5]/60 space-y-2">
            <p className="text-xs text-[#5C6D62]">
              Belum punya akun Takmir?{' '}
              <span className="font-semibold text-[#24332B]">Daftar sebagai Takmir</span>
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-full text-xs font-bold text-[#6B5B49] bg-[#EFE7DC] hover:bg-[#DDD4C5]/70 border border-[#DDD4C5] transition-colors shadow-2xs"
            >
              <span>Daftar Sekarang &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
