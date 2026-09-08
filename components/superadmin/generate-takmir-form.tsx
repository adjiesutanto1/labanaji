'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import type { Mosque } from '@/lib/supabase/types'
import { createTakmirAccountAction } from '@/lib/actions/superadmin'
import {
  Loader2,
  Lock,
  Mail,
  User,
  Phone,
  Landmark,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  KeyRound,
} from 'lucide-react'

interface GenerateTakmirFormProps {
  mosques: Mosque[]
}

export function GenerateTakmirForm({ mosques }: GenerateTakmirFormProps) {
  const [password, setPassword] = useState('Takmir2026!')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    name: string
    email: string
    mosqueName: string
    tempPassword?: string
  } | null>(null)

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#'
    let res = ''
    for (let i = 0; i < 10; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(res)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    const formData = new FormData(e.currentTarget)
    formData.set('password', password)

    const res = await createTakmirAccountAction(undefined, formData)

    if (res?.error) {
      setErrorMsg(res.error)
      setIsLoading(false)
    } else if (res?.credentials) {
      setGeneratedCredentials(res.credentials)
      setIsLoading(false)
    }
  }

  const handleCopyCredentials = () => {
    if (!generatedCredentials) return
    const text = `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nBerikut akun akses resmi Takmir Masjid di platform LABANAJI (Lare Banyuwangi Demen Ngaji):\n\nNama: ${generatedCredentials.name}\nMasjid: ${generatedCredentials.mosqueName}\nEmail: ${generatedCredentials.email}\nPassword Sementara: ${generatedCredentials.tempPassword}\n\nLogin ke Dashboard: https://labanaji.com/login\n\nSimpan dan ganti password ini setelah berhasil masuk.`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  if (generatedCredentials) {
    return (
      <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6 animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3 pb-4 border-b border-[#DDD4C5]">
          <div className="w-11 h-11 rounded-full bg-[#EFE7DC] text-[#6B5B49] flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6 text-[#8A7965]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#24332B]">
              Akun Takmir Berhasil Dibuat
            </h2>
            <p className="text-xs text-[#5C6D62]">
              Salin dan kirimkan informasi kredensial login ini kepada pengurus masjid.
            </p>
          </div>
        </div>

        {/* Credentials Box */}
        <div className="bg-[#EEE6D8] p-5 rounded-2xl border border-[#DDD4C5] space-y-3 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#DDD4C5]/80 pb-2">
            <span className="text-[#756B58] font-sans font-bold">Nama Takmir:</span>
            <span className="font-bold text-[#24332B]">{generatedCredentials.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#DDD4C5]/80 pb-2">
            <span className="text-[#756B58] font-sans font-bold">Masjid Dikelola:</span>
            <span className="font-bold text-[#24332B]">{generatedCredentials.mosqueName}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#DDD4C5]/80 pb-2">
            <span className="text-[#756B58] font-sans font-bold">Email Login:</span>
            <span className="font-bold text-[#24332B]">{generatedCredentials.email}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-[#756B58] font-sans font-bold">Password Sementara:</span>
            <span className="font-bold text-[#8A7965] bg-white px-2.5 py-1 rounded-md border border-[#DDD4C5]">
              {generatedCredentials.tempPassword}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <Link
            href="/superadmin/takmir"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-[#24332B] bg-[#EEE6D8] hover:bg-[#E7DED0] border border-[#DDD4C5] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Takmir</span>
          </Link>

          <button
            type="button"
            onClick={handleCopyCredentials}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold bg-[#8A7965] hover:bg-[#73624F] text-[#FBF8F2] shadow-2xs transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Informasi Disalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Informasi Akun</span>
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Nama Lengkap */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#24332B]">
            Nama Lengkap Pengurus Takmir <span className="text-[#8A7965]">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-[#8A7965] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="name"
              required
              placeholder="Contoh: Ust. Bambang Sutrisno"
              className="w-full pl-10 pr-4 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white"
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#24332B]">
              Email Login <span className="text-[#8A7965]">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8A7965] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                placeholder="takmir@chenghoo.id"
                className="w-full pl-10 pr-4 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white"
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
                placeholder="081398765432"
                className="w-full pl-10 pr-4 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Mosque Selection */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#24332B]">
            Pilih Masjid yang Ditugaskan <span className="text-[#8A7965]">*</span>
          </label>
          <div className="relative">
            <Landmark className="w-4 h-4 text-[#8A7965] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              name="mosque_id"
              required
              defaultValue={mosques[0]?.id || ''}
              className="w-full pl-10 pr-4 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white appearance-none"
            >
              {mosques.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.address.split(',')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Password Generator */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#24332B]">
              Password Sementara <span className="text-[#8A7965]">*</span>
            </label>
            <button
              type="button"
              onClick={generateRandomPassword}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8A7965] hover:text-[#24332B]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Acak Password</span>
            </button>
          </div>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-[#8A7965] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Minimal 6 karakter"
              className="w-full pl-10 pr-4 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm font-mono text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white"
            />
          </div>
          <p className="text-[11px] text-[#5C6D62]">
            Password ini akan langsung aktif dan dapat diubah oleh Takmir setelah login.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#DDD4C5]/60">
        <Link
          href="/superadmin/takmir"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-[#24332B] bg-[#EEE6D8] hover:bg-[#E7DED0] border border-[#DDD4C5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Batal</span>
        </Link>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-[#8A7965] hover:bg-[#73624F] disabled:bg-[#B3A694] text-[#FBF8F2] shadow-2xs transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Membuat Akun...</span>
            </>
          ) : (
            <span>Generate Akun Takmir</span>
          )}
        </button>
      </div>
    </form>
  )
}
