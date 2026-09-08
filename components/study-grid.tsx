import React from 'react'
import { Study } from '@/lib/supabase/types'
import { StudyCard } from './study-card'

interface StudyGridProps {
  studies: Study[]
  priorityFirst?: boolean
}

export function StudyGrid({ studies, priorityFirst = false }: StudyGridProps) {
  if (!studies || studies.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {studies.map((study, idx) => (
        <StudyCard
          key={study.id || study.slug}
          study={study}
          priority={priorityFirst && idx < 2}
        />
      ))}
    </div>
  )
}
