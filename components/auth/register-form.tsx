'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import type { Mosque } from '@/lib/supabase/types'
import { registerTakmirAction } from '@/lib/actions/auth'
import {
  Loader2,
  Lock,
  Mail,
  User,
  Phone,
  Landmark,
  MapPin,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Building2,
  PlusCircle,
} from 'lucide-react'

interface RegisterFormProps {
  mosques: Mosque[]
}

export function RegisterForm({ mosques }: RegisterFormProps) {
  const [mosqueType, setMosqueType] = useState<'existing' | 'new'>('existing')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    const formData = new FormData(e.currentTarget)
    formData.set('mosque_selection_type', mosqueType)

    const res = await registerTakmirAction(undefined, formData)

    if (res?.error) {
      setErrorMsg(res.error)
      setIsLoading(false)
    } else if (res?.redirectUrl) {
      window.location.href = res.redirectUrl
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Takmir Personal Info */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#756B58]">
          1. Data Pribadi Pengurus Takmir
        </h3>

        {/* Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#24332B]">
            Nama Lengkap <span className="text-[#8A7965]">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-[#8A7965] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="name"
              required
              placeholder="Contoh: H. Ahmad Fauzi, S.Ag."
              className="w-full pl-10 pr-4 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#24332B]">
              Email Takmir <span className="text-[#8A7965]">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8A7965] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="takmir@banyuwangi.id"
                className="w-full pl-10 pr-4 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#24332B]">
              Nomor WhatsApp / HP <span className="text-[#8A7965]">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#8A7965] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                name="phone"
                required
                placeholder="081234567890"
                className="w-full pl-10 pr-4 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mosque Assignment Info */}
      <div className="space-y-3 pt-2 border-t border-[#DDD4C5]/60">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#756B58]">
            2. Masjid yang Dikelola
          </h3>
        </div>

        {/* Switcher: Existing vs New */}
        <div className="flex p-1 bg-[#EEE6D8] rounded-full border border-[#DDD4C5] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMosqueType('existing')}
            className={`flex-1 py-1.5 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all ${
              mosqueType === 'existing'
                ? 'bg-[#8A7965] text-[#FBF8F2] shadow-2xs'
                : 'text-[#24332B] hover:text-[#8A7965]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Pilih Masjid Terdaftar</span>
          </button>
          <button
            type="button"
            onClick={() => setMosqueType('new')}
            className={`flex-1 py-1.5 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all ${
              mosqueType === 'new'
                ? 'bg-[#8A7965] text-[#FBF8F2] shadow-2xs'
                : 'text-[#24332B] hover:text-[#8A7965]'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Daftarkan Masjid Baru</span>
          </button>
        </div>

        {mosqueType === 'existing' ? (
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#24332B]">
              Pilih Masjid <span className="text-[#8A7965]">*</span>
            </label>
            <div className="relative">
              <Landmark className="w-4 h-4 text-[#8A7965] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                name="existing_mosque_id"
                defaultValue={mosques[0]?.id || ''}
                className="w-full pl-10 pr-4 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white appearance-none"
              >
                {mosques.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {m.address.split(',')[0]}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-[#5C6D62]">
              Masjid Anda belum ada di daftar? Klik tab &quot;Daftarkan Masjid Baru&quot; di atas.
            </p>
          </div>
        ) : (
          <div className="space-y-3 p-4 bg-[#EEE6D8]/50 rounded-2xl border border-[#DDD4C5]">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#24332B]">
                Nama Masjid Baru <span className="text-[#8A7965]">*</span>
              </label>
              <input
                type="text"
                name="new_mosque_name"
                placeholder="Contoh: Masjid Jami' Al-Muhajirin"
                className="w-full px-4 py-2 bg-white border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#24332B]">
                Alamat Lengkap Masjid <span className="text-[#8A7965]">*</span>
              </label>
              <textarea
                name="new_mosque_address"
                rows={2}
                placeholder="Jl. Raya ..., Kelurahan/Desa ..., Kec. ..., Banyuwangi"
                className="w-full px-4 py-2 bg-white border border-[#DDD4C5] rounded-2xl text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Security / Password Info */}
      <div className="space-y-3 pt-2 border-t border-[#DDD4C5]/60">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#756B58]">
          3. Keamanan Akun
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#24332B]">
              Kata Sandi <span className="text-[#8A7965]">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8A7965] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                autoComplete="new-password"
                placeholder="Min. 6 karakter"
                className="w-full pl-10 pr-10 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A7965] hover:text-[#24332B]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#24332B]">
              Konfirmasi Kata Sandi <span className="text-[#8A7965]">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8A7965] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirm_password"
                required
                autoComplete="new-password"
                placeholder="Ulangi kata sandi"
                className="w-full pl-10 pr-10 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A7965] hover:text-[#24332B]"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Helper Note */}
      <div className="p-3 bg-[#EFE7DC]/80 rounded-2xl border border-[#DDD4C5] flex items-start gap-2 text-[11px] text-[#6B5B49]">
        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#8A7965]" />
        <span>
          Dengan mendaftar, Anda membuat akun pengelola (Takmir) resmi di LABANAJI dan dapat langsung mengunggah poster serta jadwal kajian masjid.
        </span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-[#8A7965] hover:bg-[#73624F] disabled:bg-[#8A7965]/70 text-[#FBF8F2] font-bold text-xs sm:text-sm rounded-full shadow-2xs transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Mendaftarkan Akun Takmir...</span>
          </>
        ) : (
          <span>Daftar sebagai Takmir</span>
        )}
      </button>
    </form>
  )
}
