'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Mosque, Study } from '@/lib/supabase/types'
import { createMosqueAction, updateMosqueAction, deleteMosqueAction } from '@/lib/actions/mosques'
import {
  Search,
  Plus,
  Landmark,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Upload,
} from 'lucide-react'

interface SuperadminMosqueListProps {
  initialMosques: Mosque[]
  studies: Study[]
}

export function SuperadminMosqueList({ initialMosques, studies }: SuperadminMosqueListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [mosques, setMosques] = useState(initialMosques)

  // Create Mosque Modal
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  // Edit Mosque Modal
  const [editingMosque, setEditingMosque] = useState<Mosque | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  // Delete Mosque Modal
  const [deletingMosque, setDeletingMosque] = useState<Mosque | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const filteredMosques = useMemo(() => {
    return mosques.filter((m) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = m.name.toLowerCase().includes(q)
        const matchAddress = m.address.toLowerCase().includes(q)
        const matchTakmir = m.takmir_name?.toLowerCase().includes(q) || false
        if (!matchName && !matchAddress && !matchTakmir) return false
      }
      return true
    })
  }, [mosques, searchQuery])

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCreateLoading(true)
    setCreateError(null)

    const formData = new FormData(e.currentTarget)
    const res = await createMosqueAction({}, formData)

    if (res?.error) {
      setCreateError(res.error)
      setCreateLoading(false)
    } else {
      setCreateLoading(false)
      setShowCreateModal(false)
      window.location.reload()
    }
  }

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingMosque) return
    setEditLoading(true)
    setEditError(null)

    const formData = new FormData(e.currentTarget)
    const res = await updateMosqueAction(editingMosque.id, {}, formData)

    if (res?.error) {
      setEditError(res.error)
      setEditLoading(false)
    } else {
      setEditLoading(false)
      setEditingMosque(null)
      window.location.reload()
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingMosque) return
    setDeleteLoading(true)
    const res = await deleteMosqueAction(deletingMosque.id)

    if (res?.success) {
      setMosques((prev) => prev.filter((m) => m.id !== deletingMosque.id))
      setDeleteLoading(false)
      setDeletingMosque(null)
    } else {
      setDeleteLoading(false)
      setDeletingMosque(null)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search Bar & Action */}
      <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#756B58] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama masjid, alamat, atau nama takmir..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-full bg-[#F6F1E8] border border-[#DDD4C5] focus:outline-none focus:border-[#8A7965] focus:ring-1 focus:ring-[#8A7965] placeholder:text-[#8A7965] text-[#24332B] transition-all"
            />
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-xs font-semibold text-[#5C6D62] px-3 py-1.5 bg-[#EEE6D8] rounded-full border border-[#DDD4C5]">
              Total: <strong>{filteredMosques.length}</strong> Masjid
            </span>

            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs bg-[#8A7965] hover:bg-[#73624F] text-[#FBF8F2] shadow-2xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Masjid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mosque Cards Grid */}
      {filteredMosques.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMosques.map((mosque) => {
            const mosqueStudies = studies.filter((s) => s.mosque_id === mosque.id)

            return (
              <div
                key={mosque.id}
                className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-5 shadow-2xs flex flex-col justify-between gap-4 hover:border-[#8A7965] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#EEE6D8] overflow-hidden shrink-0 border border-[#DDD4C5]">
                    <Image
                      src={mosque.image_url || '/images/baiturrahman.jpg'}
                      alt={mosque.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#6B5B49] bg-[#EFE7DC] px-2 py-0.5 rounded-full border border-[#DDD4C5]/60">
                        <CheckCircle2 className="w-3 h-3 text-[#8A7965]" />
                        <span>Terverifikasi</span>
                      </span>

                      <Link
                        href={`/masjid/${mosque.slug}`}
                        target="_blank"
                        className="text-[11px] font-semibold text-[#8A7965] hover:text-[#24332B] flex items-center gap-1"
                      >
                        <span>Publik</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-[#24332B] line-clamp-1">
                      {mosque.name}
                    </h3>

                    <p className="text-xs text-[#5C6D62] flex items-start gap-1 line-clamp-2">
                      <MapPin className="w-3.5 h-3.5 text-[#8A7965] shrink-0 mt-0.5" />
                      <span>{mosque.address}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#756B58] pt-1 border-t border-[#DDD4C5]/60">
                      <span>
                        Takmir: <strong className="text-[#24332B]">{mosque.takmir_name}</strong>
                      </span>
                      <span>•</span>
                      <span>{mosqueStudies.length} Kajian</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DDD4C5]/60">
                  <button
                    type="button"
                    onClick={() => setEditingMosque(mosque)}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#24332B] bg-[#EEE6D8] hover:bg-[#E7DED0] border border-[#DDD4C5] transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Profil</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingMosque(mosque)}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-[#EFE7DC] text-[#6B5B49] flex items-center justify-center mx-auto">
            <Landmark className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-[#24332B]">
              Masjid Tidak Ditemukan
            </h3>
            <p className="text-xs text-[#5C6D62]">
              Tidak ada masjid yang cocok dengan kata kunci pencarian Anda.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 rounded-full text-xs font-bold bg-[#EEE6D8] text-[#24332B] border border-[#DDD4C5]"
          >
            Reset Pencarian
          </button>
        </div>
      )}

      {/* Create Mosque Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-6 max-w-lg w-full shadow-xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD4C5]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#EFE7DC] text-[#6B5B49] flex items-center justify-center font-bold">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#24332B]">Tambah Masjid Baru</h3>
                  <p className="text-xs text-[#5C6D62]">Daftarkan masjid baru ke platform LABANAJI</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full text-[#756B58] hover:bg-[#EEE6D8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#24332B]">
                  Nama Lengkap Masjid <span className="text-[#8A7965]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Contoh: Masjid Jami' Al-Hilal"
                  className="w-full px-4 py-2 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#24332B]">
                  Alamat Lengkap Masjid <span className="text-[#8A7965]">*</span>
                </label>
                <textarea
                  name="address"
                  required
                  rows={2}
                  placeholder="Jl. ..., Kelurahan/Desa ..., Kecamatan ..., Banyuwangi"
                  className="w-full px-4 py-2 bg-[#EEE6D8] border border-[#DDD4C5] rounded-2xl text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#24332B]">
                    Nama Ketua Takmir
                  </label>
                  <input
                    type="text"
                    name="takmir_name"
                    placeholder="Contoh: H. M. Ridwan"
                    className="w-full px-4 py-2 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#24332B]">
                    Kontak WhatsApp Takmir <span className="text-[#8A7965]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="takmir_phone"
                    required
                    placeholder="081234567890"
                    className="w-full px-4 py-2 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#24332B]">
                  URL Foto Masjid (Opsional)
                </label>
                <input
                  type="url"
                  name="image_url_input"
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#DDD4C5]/60">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={createLoading}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-[#EEE6D8] hover:bg-[#E7DED0] text-[#24332B] border border-[#DDD4C5]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold bg-[#8A7965] hover:bg-[#73624F] text-[#FBF8F2] shadow-2xs"
                >
                  {createLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Tambahkan Masjid</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Mosque Modal */}
      {editingMosque && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-6 max-w-lg w-full shadow-xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD4C5]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#EFE7DC] text-[#6B5B49] flex items-center justify-center font-bold">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#24332B]">Edit Profil Masjid</h3>
                  <p className="text-xs text-[#5C6D62]">Perbarui data profil & kontak masjid</p>
                </div>
              </div>
              <button
                onClick={() => setEditingMosque(null)}
                className="p-1 rounded-full text-[#756B58] hover:bg-[#EEE6D8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {editError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#24332B]">
                  Nama Lengkap Masjid <span className="text-[#8A7965]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingMosque.name}
                  className="w-full px-4 py-2 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#24332B]">
                  Alamat Lengkap Masjid <span className="text-[#8A7965]">*</span>
                </label>
                <textarea
                  name="address"
                  required
                  rows={2}
                  defaultValue={editingMosque.address}
                  className="w-full px-4 py-2 bg-[#EEE6D8] border border-[#DDD4C5] rounded-2xl text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#24332B]">
                    Nama Ketua Takmir
                  </label>
                  <input
                    type="text"
                    name="takmir_name"
                    defaultValue={editingMosque.takmir_name}
                    className="w-full px-4 py-2 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#24332B]">
                    Kontak WhatsApp Takmir <span className="text-[#8A7965]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="takmir_phone"
                    required
                    defaultValue={editingMosque.takmir_phone}
                    className="w-full px-4 py-2 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#24332B]">
                  URL Foto Masjid
                </label>
                <input
                  type="url"
                  name="image_url_input"
                  defaultValue={editingMosque.image_url}
                  className="w-full px-4 py-2 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#DDD4C5]/60">
                <button
                  type="button"
                  onClick={() => setEditingMosque(null)}
                  disabled={editLoading}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-[#EEE6D8] hover:bg-[#E7DED0] text-[#24332B] border border-[#DDD4C5]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold bg-[#8A7965] hover:bg-[#73624F] text-[#FBF8F2] shadow-2xs"
                >
                  {editLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Perubahan</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Mosque Confirmation */}
      {deletingMosque && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-6 max-w-md w-full shadow-xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 border border-rose-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#24332B]">
                  Hapus Data Masjid?
                </h3>
                <p className="text-xs text-[#756B58]">Konfirmasi tindakan permanen</p>
              </div>
            </div>

            <div className="bg-[#EEE6D8] p-3.5 rounded-2xl border border-[#DDD4C5]/60 text-xs text-[#24332B] space-y-1">
              <p className="font-bold">{deletingMosque.name}</p>
              <p className="text-[#5C6D62]">{deletingMosque.address}</p>
              <p className="text-[#5C6D62] pt-1">
                Seluruh data kajian yang tertaut ke masjid ini juga akan terhapus dari sistem.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingMosque(null)}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-[#EEE6D8] hover:bg-[#E7DED0] text-[#24332B] border border-[#DDD4C5]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold bg-rose-800 hover:bg-rose-900 text-white shadow-2xs"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus Masjid</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
