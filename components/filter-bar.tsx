'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mosque } from '@/lib/supabase/types'
import { Search, Landmark, X } from 'lucide-react'
import { getTodayDateString, formatDateToYYYYMMDD } from '@/lib/utils'

interface FilterBarProps {
  mosques: Mosque[]
}

export function FilterBar({ mosques }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentQuery = searchParams.get('q') || ''
  const currentDate = searchParams.get('date') || ''
  const currentMosque = searchParams.get('mosque') || ''

  const [query, setQuery] = useState(currentQuery)
  const [date, setDate] = useState(currentDate)
  const [mosque, setMosque] = useState(currentMosque)

  const todayStr = getTodayDateString()
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = formatDateToYYYYMMDD(tomorrow)

  const handleApplyFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (date) params.set('date', date)
    if (mosque) params.set('mosque', mosque)
    params.set('page', '1')

    router.push(`/kajian?${params.toString()}`)
  }

  const handleDateShortcut = (selectedDate: string) => {
    setDate(selectedDate)
    const params = new URLSearchParams(searchParams.toString())
    if (selectedDate) {
      params.set('date', selectedDate)
    } else {
      params.delete('date')
    }
    params.set('page', '1')
    router.push(`/kajian?${params.toString()}`)
  }

  const handleReset = () => {
    setQuery('')
    setDate('')
    setMosque('')
    router.push('/kajian')
  }

  const hasActiveFilters = Boolean(currentQuery || currentDate || currentMosque)

  return (
    <div className="bg-[#FBF8F2] rounded-3xl border border-[#DDD4C5] p-4 sm:p-5 shadow-2xs space-y-4">
      {/* Date Shortcuts Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#756B58] mr-1">
          Waktu:
        </span>
        <button
          type="button"
          onClick={() => handleDateShortcut('')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
            !currentDate
              ? 'bg-[#8A7965] text-[#FBF8F2] shadow-2xs'
              : 'bg-[#EEE6D8] text-[#24332B] hover:bg-[#E7DED0]'
          }`}
        >
          Semua Jadwal
        </button>
        <button
          type="button"
          onClick={() => handleDateShortcut(todayStr)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
            currentDate === todayStr
              ? 'bg-[#8A7965] text-[#FBF8F2] shadow-2xs'
              : 'bg-[#EEE6D8] text-[#24332B] hover:bg-[#E7DED0]'
          }`}
        >
          Hari Ini
        </button>
        <button
          type="button"
          onClick={() => handleDateShortcut(tomorrowStr)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
            currentDate === tomorrowStr
              ? 'bg-[#8A7965] text-[#FBF8F2] shadow-2xs'
              : 'bg-[#EEE6D8] text-[#24332B] hover:bg-[#E7DED0]'
          }`}
        >
          Besok
        </button>
      </div>

      {/* Main Filter Form */}
      <form onSubmit={handleApplyFilter} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-[#8A7965] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari tema atau pemateri..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] placeholder:text-[#8A7965] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white transition-all"
          />
        </div>

        {/* Mosque Select */}
        <div className="sm:col-span-4 relative">
          <Landmark className="w-4 h-4 text-[#8A7965] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={mosque}
            onChange={(e) => setMosque(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white transition-all appearance-none"
          >
            <option value="">Semua Masjid</option>
            {mosques.map((m) => (
              <option key={m.id} value={m.slug}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="sm:col-span-3 flex items-center gap-2">
          <button
            type="submit"
            className="flex-1 py-2 px-4 bg-[#8A7965] hover:bg-[#73624F] text-[#FBF8F2] font-bold text-xs sm:text-sm rounded-full shadow-2xs transition-colors"
          >
            Terapkan
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="p-2 text-[#5C6D62] hover:text-[#24332B] bg-[#EEE6D8] hover:bg-[#E7DED0] rounded-full transition-colors"
              title="Reset Filter"
              aria-label="Reset Filter"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
