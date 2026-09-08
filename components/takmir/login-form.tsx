'use client'

import React, { useState } from 'react'
import { loginTakmirAction } from '@/lib/actions/auth'
import { Loader2 } from 'lucide-react'

export function LoginForm() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    const formData = new FormData(e.currentTarget)
    const res = await loginTakmirAction(formData)

    if (res?.error) {
      setErrorMsg(res.error)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-[#24332B]">
          Email Takmir / Akun
        </label>
        <input
          type="email"
          name="email"
          required
          placeholder="takmir@banyuwangi.id"
          className="w-full px-4 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white transition-all"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-[#24332B]">
          Kata Sandi / Password
        </label>
        <input
          type="password"
          name="password"
          required
          placeholder="••••••••"
          className="w-full px-4 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-[#8A7965] hover:bg-[#73624F] disabled:bg-[#B3A694] text-[#FBF8F2] font-bold text-xs sm:text-sm rounded-full shadow-2xs transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Memeriksa...</span>
          </>
        ) : (
          <span>Masuk ke Dashboard</span>
        )}
      </button>
    </form>
  )
}
