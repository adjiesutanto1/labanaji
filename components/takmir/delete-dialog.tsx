'use client'

import React, { useState } from 'react'
import { deleteStudyAction } from '@/lib/actions/studies'
import { Trash2, Loader2, AlertTriangle, X } from 'lucide-react'

interface DeleteDialogProps {
  studyId: string
  studyTitle: string
}

export function DeleteDialog({ studyId, studyTitle }: DeleteDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    const res = await deleteStudyAction(studyId)
    if (res?.error) {
      alert(res.error)
      setIsDeleting(false)
    } else {
      setIsDeleting(false)
      setIsOpen(false)
      window.location.reload()
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-800 hover:text-rose-900 bg-rose-50/80 hover:bg-rose-100 border border-rose-200 transition-colors"
        title="Hapus Kajian"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Hapus</span>
      </button>

      {/* Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-in fade-in duration-200">
          <div className="bg-[#FBF8F2] border border-[#DDD4C5] rounded-3xl p-6 max-w-md w-full shadow-lg space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 border border-rose-200">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#24332B]">
                    Hapus Jadwal Kajian?
                  </h3>
                  <p className="text-xs text-[#756B58]">Konfirmasi tindakan permanen</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="p-1 rounded-full text-[#756B58] hover:bg-[#EEE6D8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#EEE6D8] p-3.5 rounded-2xl border border-[#DDD4C5]/60 text-xs text-[#24332B] space-y-1">
              <p className="font-bold line-clamp-1">{studyTitle}</p>
              <p className="text-[#5C6D62]">
                Data kajian ini akan dihapus dari sistem dan tidak akan tampil lagi di halaman publik.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-[#EEE6D8] hover:bg-[#E7DED0] text-[#24332B] border border-[#DDD4C5] transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold bg-rose-800 hover:bg-rose-900 disabled:bg-rose-400 text-white shadow-2xs transition-colors"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus Kajian</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
