import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getMosques } from '@/lib/data/mosques'
import { RegisterForm } from '@/components/auth/register-form'
import { ArrowLeft } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'

export const metadata: Metadata = {
  title: 'Daftar sebagai Takmir | LABANAJI',
  description: 'Daftarkan akun Takmir untuk mengelola masjid dan mempublikasikan jadwal kajian di Banyuwangi.',
}

export default async function RegisterPage() {
  const mosques = await getMosques()

  return (
    <div className="min-h-screen py-10 sm:py-14 px-4 sm:px-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl space-y-6">
        <div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#8A7965] hover:text-[#24332B] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Halaman Masuk</span>
          </Link>
        </div>

        <div className="bg-[#FBF8F2] rounded-3xl border border-[#DDD4C5] p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <BrandLogo size={52} priority />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#24332B]">
              Daftar sebagai Takmir Masjid
            </h1>
            <p className="text-xs sm:text-sm text-[#5C6D62] max-w-md mx-auto">
              Kelola informasi profil masjid dan publikasikan jadwal pengajian agar dapat dijangkau oleh jamaah se-Banyuwangi.
            </p>
          </div>

          <RegisterForm mosques={mosques} />

          <div className="pt-3 text-center border-t border-[#DDD4C5]/60">
            <p className="text-xs text-[#5C6D62]">
              Sudah memiliki akun pengurus Takmir?{' '}
              <Link
                href="/login"
                className="font-bold text-[#8A7965] hover:text-[#24332B] hover:underline"
              >
                Masuk di sini &rarr;
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
