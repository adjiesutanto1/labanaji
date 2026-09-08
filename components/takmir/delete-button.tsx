'use client'

import React, { useState } from 'react'
import { deleteStudyAction } from '@/lib/actions/studies'
import { Trash2, Loader2 } from 'lucide-react'

interface DeleteButtonProps {
  studyId: string
  studyTitle: string
}

export function DeleteButton({ studyId, studyTitle }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    const confirm = window.confirm(`Apakah Anda yakin ingin menghapus kajian "${studyTitle}"?`)
    if (!confirm) return

    setIsDeleting(true)
    await deleteStudyAction(studyId)
    setIsDeleting(false)
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-800 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50"
      title="Hapus Kajian"
    >
      {isDeleting ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
      <span>Hapus</span>
    </button>
  )
}
