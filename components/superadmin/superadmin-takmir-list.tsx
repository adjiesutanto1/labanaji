'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import type { TakmirWithMosque } from '@/lib/data/takmir'
import type { Mosque } from '@/lib/supabase/types'
import { updateTakmirAction, deleteTakmirAction } from '@/lib/actions/superadmin'
import {
  Search,
  Plus,
  Landmark,
  Phone,
  Mail,
  Calendar,
  Edit,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Building2,
} from 'lucide-react'

interface SuperadminTakmirListProps {
  initialTakmirs: TakmirWithMosque[]
  mosques: Mosque[]
}

export function SuperadminTakmirList({ initialTakmirs, mosques }: SuperadminTakmirListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTakmirs, setSelectedTakmirs] = useState(initialTakmirs)

  // Edit Modal State
  const [editingTakmir, setEditingTakmir] = useState<TakmirWithMosque | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  // Delete Modal State
  const [deletingTakmir, setDeletingTakmir] = useState<TakmirWithMosque | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const filteredTakmirs = useMemo(() => {
    return selectedTakmirs.filter((t) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = t.name.toLowerCase().includes(q)
        const matchEmail = t.email?.toLowerCase().includes(q) || false
        const matchPhone = t.phone?.toLowerCase().includes(q) || false
        const matchMosque = t.mosque?.name.toLowerCase().includes(q) || false
        if (!matchName && !matchEmail && !matchPhone && !matchMosque) return false
      }
      return true
    })
  }, [selectedTakmirs, searchQuery])

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingTakmir) return
    setEditLoading(true)
    setEditError(null)

    const formData = new FormData(e.currentTarget)
    const res = await updateTakmirAction(editingTakmir.id, undefined, formData)

    if (res?.error) {
      setEditError(res.error)
      setEditLoading(false)
    } else {
      const updatedMosqueId = formData.get('mosque_id') as string
      const updatedName = formData.get('name') as string
      const updatedPhone = formData.get('phone') as string
      const newMosque = mosques.find((m) => m.id === updatedMosqueId) || editingTakmir.mosque

      setSelectedTakmirs((prev) =>
        prev.map((item) =>
          item.id === editingTakmir.id
            ? {
                ...item,
                name: updatedName,
                phone: updatedPhone,
                mosque_id: updatedMosqueId,
                mosque: newMosque,
              }
            : item
        )
      )
      setEditLoading(false)
      setEditingTakmir(null)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingTakmir) return
    setDeleteLoading(true)
    const res = await deleteTakmirAction(deletingTakmir.id)

    if (res?.success) {
      setSelectedTakmirs((prev) => prev.filter((t) => t.id !== deletingTakmir.id))
      setDeleteLoading(false)
      setDeletingTakmir(null)
    } else {
      setDeleteLoading(false)
      setDeletingTakmir(null)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search & Actions Bar */}
      <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#756B58] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama takmir, email, atau nama masjid..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-full bg-[#F6F1E8] border border-[#DDD4C5] focus:outline-none focus:border-[#8A7965] focus:ring-1 focus:ring-[#8A7965] placeholder:text-[#8A7965] text-[#24332B] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-[#5C6D62] px-3 py-1.5 bg-[#EEE6D8] rounded-full border border-[#DDD4C5]">
              Total: <strong>{filteredTakmirs.length}</strong> Takmir
            </span>
          </div>
        </div>
      </div>

      {/* Takmir List */}
      {filteredTakmirs.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs text-[#24332B]">
              <thead className="bg-[#EEE6D8]/60 border-b border-[#DDD4C5] text-[11px] font-bold uppercase tracking-wider text-[#756B58]">
                <tr>
                  <th scope="col" className="px-5 py-3.5">
                    Pengurus Takmir
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Kontak & Email
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Masjid yang Dikelola
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD4C5]/60">
                {filteredTakmirs.map((takmir) => {
                  const initials = takmir.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()

                  return (
                    <tr
                      key={takmir.id}
                      className="hover:bg-[#F6F1E8]/70 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#8A7965] text-[#FBF8F2] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            {initials || 'TK'}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[#24332B] line-clamp-1">
                              {takmir.name}
                            </p>
                            <span className="text-[10px] font-semibold text-[#6B5B49] bg-[#EFE7DC] px-2 py-0.5 rounded-full border border-[#DDD4C5]/60">
                              Takmir Terdaftar
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-[#24332B] flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-[#8A7965]" />
                          <span>{takmir.email || '-'}</span>
                        </p>
                        <p className="text-[11px] text-[#5C6D62] flex items-center gap-1.5 pt-0.5">
                          <Phone className="w-3 h-3 text-[#8A7965]" />
                          <span>{takmir.phone || '-'}</span>
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Landmark className="w-3.5 h-3.5 text-[#8A7965] shrink-0" />
                          <span className="font-bold text-[#24332B] line-clamp-1">
                            {takmir.mosque?.name || 'Belum Ditugaskan'}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EFE7DC] text-[#6B5B49] border border-[#DDD4C5]/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8A7965]" />
                          <span>Aktif</span>
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingTakmir(takmir)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-[#24332B] hover:text-[#8A7965] bg-[#EEE6D8] hover:bg-[#E7DED0] border border-[#DDD4C5] transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingTakmir(takmir)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-800 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-3">
            {filteredTakmirs.map((takmir) => {
              const initials = takmir.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()

              return (
                <div
                  key={takmir.id}
                  className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-4 shadow-2xs space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#8A7965] text-[#FBF8F2] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      {initials || 'TK'}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-sm text-[#24332B] truncate">
                          {takmir.name}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#6B5B49] bg-[#EFE7DC] px-2 py-0.5 rounded-full">
                          Aktif
                        </span>
                      </div>
                      <p className="text-xs text-[#5C6D62] flex items-center gap-1">
                        <Landmark className="w-3 h-3 text-[#8A7965]" />
                        <span className="font-semibold text-[#24332B] truncate">
                          {takmir.mosque?.name || 'Belum Ditugaskan'}
                        </span>
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#756B58] pt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {takmir.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {takmir.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DDD4C5]/60">
                    <button
                      type="button"
                      onClick={() => setEditingTakmir(takmir)}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#24332B] bg-[#EEE6D8] hover:bg-[#E7DED0] border border-[#DDD4C5] transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingTakmir(takmir)}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-[#EFE7DC] text-[#6B5B49] flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-[#24332B]">
              {searchQuery ? 'Takmir Tidak Ditemukan' : 'Belum Ada Akun Takmir'}
            </h3>
            <p className="text-xs text-[#5C6D62]">
              {searchQuery
                ? 'Tidak ada akun takmir yang sesuai dengan kata kunci pencarian Anda.'
                : 'Buat akun takmir pertama untuk mengelola masjid di Banyuwangi.'}
            </p>
          </div>
          <Link
            href="/superadmin/takmir/tambah"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs bg-[#8A7965] hover:bg-[#73624F] text-[#FBF8F2] shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Akun Takmir</span>
          </Link>
        </div>
      )}

      {/* Edit Takmir Modal */}
      {editingTakmir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-6 max-w-lg w-full shadow-xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD4C5]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#EFE7DC] text-[#6B5B49] flex items-center justify-center font-bold">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#24332B]">Edit Akun Takmir</h3>
                  <p className="text-xs text-[#5C6D62]">Perbarui data dan masjid yang ditugaskan</p>
                </div>
              </div>
              <button
                onClick={() => setEditingTakmir(null)}
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
                  Nama Lengkap Takmir
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingTakmir.name}
                  className="w-full px-4 py-2 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#24332B]">
                  Nomor WhatsApp / HP
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  defaultValue={editingTakmir.phone || ''}
                  className="w-full px-4 py-2 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#24332B]">
                  Masjid yang Ditugaskan
                </label>
                <select
                  name="mosque_id"
                  required
                  defaultValue={editingTakmir.mosque_id || mosques[0]?.id || ''}
                  className="w-full px-4 py-2 bg-[#EEE6D8] border border-[#DDD4C5] rounded-full text-xs sm:text-sm text-[#24332B] focus:outline-none focus:ring-1 focus:ring-[#8A7965] focus:bg-white appearance-none"
                >
                  {mosques.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.address.split(',')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#DDD4C5]/60">
                <button
                  type="button"
                  onClick={() => setEditingTakmir(null)}
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

      {/* Delete Confirmation Modal */}
      {deletingTakmir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-6 max-w-md w-full shadow-xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 border border-rose-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#24332B]">
                  Hapus Akun Takmir?
                </h3>
                <p className="text-xs text-[#756B58]">Konfirmasi tindakan permanen</p>
              </div>
            </div>

            <div className="bg-[#EEE6D8] p-3.5 rounded-2xl border border-[#DDD4C5]/60 text-xs text-[#24332B] space-y-1">
              <p className="font-bold">{deletingTakmir.name}</p>
              <p className="text-[#5C6D62]">
                Masjid: {deletingTakmir.mosque?.name || 'Tidak ada masjid'}
              </p>
              <p className="text-[#5C6D62] pt-1">
                Akun takmir ini akan dihapus dan tidak lagi memiliki akses ke dashboard pengelolaan masjid.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingTakmir(null)}
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
                  <span>Ya, Hapus Takmir</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
