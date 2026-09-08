'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Mosque } from '@/lib/supabase/types'
import { updateMosqueAction } from '@/lib/actions/mosques'
import { Upload, ImageIcon, Loader2, CheckCircle2, Landmark, Phone, MapPin, CalendarDays } from 'lucide-react'

interface MosqueFormProps {
  mosque: Mosque
}

export function MosqueForm({ mosque }: MosqueFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(mosque.image_url || '')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Format file harus berupa gambar (JPG, PNG, WebP).')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Ukuran foto maksimal 5MB.')
        return
      }

      setErrorMsg(null)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    const formData = new FormData(e.currentTarget)
    const res = await updateMosqueAction(mosque.id, {}, formData)

    if (res?.error) {
      setErrorMsg(res.error)
    } else {
      setSuccessMsg('Profil masjid berhasil diperbarui.')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-[#EFE7DC] border border-[#DDD4C5] text-[#6B5B49] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#8A7965]" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Mosque Photo Upload & Preview */}
      <div className="bg-[#FBF8F2] p-5 sm:p-6 rounded-3xl border border-[#DDD4C5] shadow-2xs space-y-4">
        <label className="block text-sm font-bold text-[#24332B]">
          Foto Profil Masjid <span className="text-[#8A7965]">*</span>
        </label>
        <p className="text-xs text-[#5C6D62]">
          Foto tampak depan atau suasana masjid yang jelas dan terang (maks. 5MB)
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
          {/* File Input Box */}
          <div className="sm:col-span-7">
            <label className="border-2 border-dashed border-[#DDD4C5] hover:border-[#8A7965] rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-[#EEE6D8]/60 hover:bg-[#EFE7DC]/60 transition-all group">
              <Upload className="w-7 h-7 text-[#8A7965] group-hover:text-[#73624F] mb-2 transition-colors" />
              <span className="text-xs sm:text-sm font-bold text-[#24332B] group-hover:text-[#8A7965]">
                Pilih Foto Masjid Baru
              </span>
              <span className="text-[11px] text-[#5C6D62] mt-1">
                JPG, PNG atau WebP
              </span>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* URL input fallback */}
            <div className="mt-3">
              <label className="block text-[11px] font-semibold text-[#5C6D62] mb-1">
                Atau masukkan URL Foto (opsional):
              </label>
              <input
                type="url"
                name="image_url_input"
                defaultValue={mosque.image_url || ''}
                onChange={(e) => {
                  if (e.target.value) setPreviewUrl(e.target.value)
                }}
                placeholder="https://..."
                className="w-full px-4 py-2 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white"
              />
            </div>
          </div>

          {/* Live Preview */}
          <div className="sm:col-span-5">
            <span className="block text-xs font-semibold text-[#5C6D62] mb-2">
              Preview Foto Masjid:
            </span>
            <div className="relative aspect-[16/10] w-full rounded-2xl border border-[#DDD4C5] bg-[#EEE6D8] overflow-hidden flex items-center justify-center">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Preview Foto Masjid"
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              ) : (
                <div className="text-center p-4 text-[#8A7965]">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span className="text-[11px]">Belum ada foto</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Mosque Information */}
      <div className="bg-[#FBF8F2] p-5 sm:p-6 rounded-3xl border border-[#DDD4C5] shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-[#24332B] border-b border-[#DDD4C5]/60 pb-3">
          Informasi & Alamat Masjid
        </h3>

        {/* Mosque Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#24332B]">
            Nama Lengkap Masjid <span className="text-[#8A7965]">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            defaultValue={mosque.name}
            placeholder="Contoh: Masjid Agung Baiturrahman Banyuwangi"
            className="w-full px-4 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white"
          />
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#24332B]">
            Alamat Lengkap Masjid <span className="text-[#8A7965]">*</span>
          </label>
          <textarea
            name="address"
            required
            rows={2}
            defaultValue={mosque.address}
            placeholder="Jl. Jenderal Sudirman No. 1, Temenggungan, Kec. Banyuwangi, Kabupaten Banyuwangi"
            className="w-full px-4 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-2xl text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white"
          />
        </div>

        {/* Takmir Contact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#24332B]">
              Nama Ketua / Pengurus Takmir
            </label>
            <input
              type="text"
              name="takmir_name"
              defaultValue={mosque.takmir_name}
              placeholder="Contoh: H. Ahmad Fauzi, S.Ag."
              className="w-full px-4 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#24332B]">
              Nomor WhatsApp / HP Takmir <span className="text-[#8A7965]">*</span>
            </label>
            <input
              type="tel"
              name="takmir_phone"
              required
              defaultValue={mosque.takmir_phone}
              placeholder="Contoh: 081234567890"
              className="w-full px-4 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white"
            />
          </div>
        </div>

        {/* Routine Schedule Info */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#24332B]">
            Jadwal Kajian Rutin Masjid
          </label>
          <textarea
            name="routine_info"
            rows={2}
            defaultValue={mosque.routine_info || ''}
            placeholder="Contoh: Kajian Fiqih setiap malam Ahad, Ba'da Subuh hari Ahad, dan Tafsir Al-Qur'an setiap malam Kamis."
            className="w-full px-4 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-2xl text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-[#8A7965] hover:bg-[#73624F] disabled:bg-[#8A7965]/70 text-[#FBF8F2] shadow-2xs transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <span>Simpan Perubahan Profil</span>
          )}
        </button>
      </div>
    </form>
  )
}
