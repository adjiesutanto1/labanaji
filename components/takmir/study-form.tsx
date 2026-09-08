'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Mosque, Study } from '@/lib/supabase/types'
import { createStudyAction, updateStudyAction } from '@/lib/actions/studies'
import { Upload, ImageIcon, ArrowLeft, Loader2 } from 'lucide-react'

interface StudyFormProps {
  mosques: Mosque[]
  study?: Study | null
  mode: 'create' | 'edit'
}

export function StudyForm({ mosques, study, mode }: StudyFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(study?.poster_url || '')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Format file harus berupa gambar (JPG, PNG, WebP).')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Ukuran poster maksimal 5MB.')
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

    const formData = new FormData(e.currentTarget)
    let res

    if (mode === 'create') {
      res = await createStudyAction({}, formData)
    } else if (study) {
      res = await updateStudyAction(study.id, {}, formData)
    }

    if (res?.error) {
      setErrorMsg(res.error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Poster Upload & Preview */}
      <div className="bg-[#FBF8F2] p-5 sm:p-6 rounded-3xl border border-[#DDD4C5] shadow-2xs space-y-4">
        <label className="block text-sm font-bold text-[#24332B]">
          Poster Kajian <span className="text-[#8A7965]">*</span>
        </label>
        <p className="text-xs text-[#5C6D62]">
          Pilih file foto/poster kajian yang jelas (Format: JPG, PNG, atau WebP, maks. 5MB)
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
          {/* File Input Box */}
          <div className="sm:col-span-7">
            <label className="border-2 border-dashed border-[#DDD4C5] hover:border-[#8A7965] rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-[#EEE6D8]/60 hover:bg-[#EFE7DC]/60 transition-all group">
              <Upload className="w-7 h-7 text-[#8A7965] group-hover:text-[#73624F] mb-2 transition-colors" />
              <span className="text-xs sm:text-sm font-bold text-[#24332B] group-hover:text-[#8A7965]">
                Klik untuk Memilih File Poster
              </span>
              <span className="text-[11px] text-[#5C6D62] mt-1">
                Atau seret gambar ke area ini
              </span>
              <input
                type="file"
                name="poster"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Alternative URL Input (optional) */}
            <div className="mt-3">
              <label className="block text-[11px] font-semibold text-[#5C6D62] mb-1">
                Atau gunakan URL Gambar (opsional):
              </label>
              <input
                type="url"
                name="poster_url_input"
                defaultValue={study?.poster_url || ''}
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
              Preview Tampilan Poster:
            </span>
            <div className="relative aspect-[4/3] w-full rounded-2xl border border-[#DDD4C5] bg-[#EEE6D8] overflow-hidden flex items-center justify-center">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Preview Poster"
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              ) : (
                <div className="text-center p-4 text-[#8A7965]">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span className="text-[11px]">Belum ada gambar terpilih</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Details Card */}
      <div className="bg-[#FBF8F2] p-5 sm:p-6 rounded-3xl border border-[#DDD4C5] shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-[#24332B] border-b border-[#DDD4C5]/60 pb-3">
          Informasi Utama Kajian
        </h3>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#24332B]">
            Judul / Tema Kajian <span className="text-[#8A7965]">*</span>
          </label>
          <input
            type="text"
            name="title"
            required
            defaultValue={study?.title || ''}
            placeholder="Contoh: Kajian Fiqih Muamalah: Meraih Rezeki Berkah"
            className="w-full px-4 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white"
          />
        </div>

        {/* Mosque Selection */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#24332B]">
            Masjid Penyelenggara <span className="text-[#8A7965]">*</span>
          </label>
          <select
            name="mosque_id"
            required
            defaultValue={study?.mosque_id || mosques[0]?.id || ''}
            className="w-full px-4 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white appearance-none"
          >
            {mosques.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — {m.address.split(',')[0]}
              </option>
            ))}
          </select>
        </div>

        {/* Pemateri / Speaker */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#24332B]">
            Pemateri / Ustadz
          </label>
          <input
            type="text"
            name="speaker"
            defaultValue={study?.speaker || ''}
            placeholder="Contoh: Ustadz Dr. Fulan, Lc., M.A."
            className="w-full px-4 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white"
          />
        </div>

        {/* Date & Time Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Study Date */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#24332B]">
              Tanggal Kajian <span className="text-[#8A7965]">*</span>
            </label>
            <input
              type="date"
              name="study_date"
              required
              defaultValue={study?.study_date || ''}
              className="w-full px-4 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white"
            />
          </div>

          {/* Start Time */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#24332B]">
              Waktu / Jam <span className="text-[#8A7965]">*</span>
            </label>
            <input
              type="text"
              name="start_time"
              required
              defaultValue={study?.start_time || '19.30 WIB'}
              placeholder="Contoh: 19.30 WIB atau Ba'da Maghrib"
              className="w-full px-4 py-2.5 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white"
            />
          </div>
        </div>

        {/* Description / Extra Notes */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#24332B]">
            Deskripsi / Catatan Tambahan (Opsional)
          </label>
          <textarea
            name="description"
            rows={3}
            defaultValue={study?.description || ''}
            placeholder="Informasi kitab yang dibahas, fasilitas masjid, atau ketentuan khusus..."
            className="w-full px-4 py-3 bg-[#EEE6D8] border border-[#DDD4C5] rounded-2xl text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <Link
          href="/takmir"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm bg-[#EEE6D8] hover:bg-[#E7DED0] text-[#24332B] border border-[#DDD4C5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Batal</span>
        </Link>

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
            <span>{mode === 'create' ? 'Publikasikan Kajian' : 'Simpan Perubahan'}</span>
          )}
        </button>
      </div>
    </form>
  )
}
