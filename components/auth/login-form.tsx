'use client'

import React, { useState, useRef } from 'react'
import { loginAction } from '@/lib/actions/auth'
import { Loader2, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react'

export function LoginForm() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const formRef = useRef<HTMLFormElement>(null)

  const validate = (formData: FormData): boolean => {
    const newErrors: Record<string, string> = {}
    const email = ((formData.get('email') as string) || '').trim()
    const password = ((formData.get('password') as string) || '').trim()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email) {
      newErrors.email = 'Email akun wajib diisi.'
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Format email tidak valid (contoh: takmir@baiturrahman.id).'
    }

    if (!password) {
      newErrors.password = 'Kata sandi wajib diisi.'
    } else if (password.length < 5) {
      newErrors.password = 'Kata sandi minimal 5 karakter.'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      const firstKey = Object.keys(newErrors)[0]
      const element = formRef.current?.querySelector(`[name="${firstKey}"]`) as HTMLElement | null
      if (element) {
        element.focus()
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg(null)

    const formData = new FormData(e.currentTarget)
    if (!validate(formData)) {
      return
    }

    setIsLoading(true)
    const res = await loginAction(undefined, formData)

    if (res?.error) {
      setErrorMsg(res.error)
      setIsLoading(false)
    } else if (res?.redirectUrl) {
      window.location.href = res.redirectUrl
    }
  }

  const clearFieldError = (name: string) => {
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev }
        delete copy[name]
        return copy
      })
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Email Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-[#24332B]">
          Email Akun <span className="text-[#8A7965]">*</span>
        </label>
        <div className="relative">
          <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
            errors.email ? 'text-rose-500' : 'text-[#8A7965]'
          }`} />
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="contoh: takmir@baiturrahman.id"
            onChange={() => clearFieldError('email')}
            className={`w-full pl-10 pr-4 py-2.5 rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none transition-all ${
              errors.email
                ? 'bg-rose-50 border border-rose-500 ring-1 ring-rose-500 focus:ring-rose-500 text-rose-900'
                : 'bg-[#EEE6D8] border border-[#DDD4C5] focus:ring-1 focus:ring-[#8A7965] focus:bg-white'
            }`}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1 animate-in fade-in">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.email}</span>
          </p>
        )}
      </div>

      {/* Password Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-[#24332B]">
            Kata Sandi <span className="text-[#8A7965]">*</span>
          </label>
          <span className="text-[11px] text-[#756B58] hover:text-[#8A7965] cursor-pointer">
            Lupa kata sandi?
          </span>
        </div>
        <div className="relative">
          <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
            errors.password ? 'text-rose-500' : 'text-[#8A7965]'
          }`} />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            onChange={() => clearFieldError('password')}
            className={`w-full pl-10 pr-10 py-2.5 rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none transition-all ${
              errors.password
                ? 'bg-rose-50 border border-rose-500 ring-1 ring-rose-500 focus:ring-rose-500 text-rose-900'
                : 'bg-[#EEE6D8] border border-[#DDD4C5] focus:ring-1 focus:ring-[#8A7965] focus:bg-white'
            }`}
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
        {errors.password && (
          <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1 animate-in fade-in">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.password}</span>
          </p>
        )}
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
