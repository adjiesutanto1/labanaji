'use client'

import React, { useState } from 'react'
import { loginAction } from '@/lib/actions/auth'
import { Loader2, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react'

export function LoginForm() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    const formData = new FormData(e.currentTarget)
    const res = await loginAction(undefined, formData)

    if (res?.error) {
      setErrorMsg(res.error)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Email Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-[#24332B]">
          Email Akun
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-[#8A7965] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="contoh: takmir@baiturrahman.id"
            className="w-full pl-10 pr-4 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-[#24332B]">
            Kata Sandi
          </label>
          <span className="text-[11px] text-[#756B58] hover:text-[#8A7965] cursor-pointer">
            Lupa kata sandi?
          </span>
        </div>
        <div className="relative">
          <Lock className="w-4 h-4 text-[#8A7965] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full pl-10 pr-10 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A7965] hover:text-[#24332B]"
            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-[#8A7965] hover:bg-[#73624F] disabled:bg-[#8A7965]/70 text-[#FBF8F2] font-bold text-xs sm:text-sm rounded-full shadow-2xs transition-colors flex items-center justify-center gap-2 mt-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Memverifikasi Akun...</span>
          </>
        ) : (
          <span>Masuk ke Dashboard</span>
        )}
      </button>
    </form>
  )
}
