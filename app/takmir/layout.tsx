import React from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/takmir/admin-sidebar'
import { getCurrentUserAndProfile, logoutTakmirAction } from '@/lib/actions/auth'
import { getMosqueById, getMosques } from '@/lib/data/mosques'
import { Landmark, LogOut, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: {
    default: 'Area Takmir | LABANAJI',
    template: '%s | LABANAJI Takmir',
  },
  description: 'Portal operasional takmir masjid untuk mengelola informasi masjid dan publikasi jadwal kajian di Banyuwangi.',
}

export default async function TakmirLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getCurrentUserAndProfile()

  // 1. Unauthenticated -> redirect to /login
  if (!session || !session.authenticated) {
    redirect('/login?redirectTo=/takmir')
  }

  // 2. Superadmin accessing /takmir -> redirect to /superadmin
  if (session.role === 'superadmin') {
    redirect('/superadmin')
  }

  // 3. Invalid role check
  if (session.role !== 'takmir') {
    redirect('/login?error=invalid_role')
  }

  // 4. Check if Takmir has an assigned mosque
  let mosqueName = session.mosque?.name
  if (!mosqueName && session.mosqueId) {
    const mosqueData = await getMosqueById(session.mosqueId)
    mosqueName = mosqueData?.name
  }

  if (!mosqueName) {
    const allMosques = await getMosques()
    mosqueName = allMosques[0]?.name || 'Masjid Banyuwangi'
  }

  const userEmail = session.user.email || 'takmir@banyuwangi.id'

  return (
    <div className="min-h-screen bg-[#F6F1E8] text-[#24332B] flex flex-col md:flex-row antialiased selection:bg-[#DDD4C5]">
      <AdminSidebar userEmail={userEmail} mosqueName={mosqueName} />
      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
