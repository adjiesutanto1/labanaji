import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUserAndProfile, logoutTakmirAction } from '@/lib/actions/auth'
import {
  ShieldCheck,
  LayoutDashboard,
  Landmark,
  CalendarDays,
  Users,
  LogOut,
  ExternalLink,
} from 'lucide-react'

import { SuperadminSidebar } from '@/components/superadmin/superadmin-sidebar'

export const metadata: Metadata = {
  title: {
    default: 'Superadmin Dashboard | LABANAJI',
    template: '%s | LABANAJI Superadmin',
  },
  description: 'Portal kendali utama platform LABANAJI Banyuwangi.',
}

export default async function SuperadminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getCurrentUserAndProfile()

  // 1. Unauthenticated -> redirect to /login
  if (!session || !session.authenticated) {
    redirect('/login?redirectTo=/superadmin')
  }

  // 2. Strict Superadmin Role Verification
  if (session.role !== 'superadmin') {
    redirect('/takmir')
  }

  const userEmail = session.user.email || 'admin@labanaji.com'
  const userName = session.user.name || 'Superadmin LABANAJI'

  return (
    <div className="min-h-screen bg-[#F6F1E8] text-[#24332B] flex flex-col md:flex-row antialiased selection:bg-[#DDD4C5]">
      <SuperadminSidebar userEmail={userEmail} userName={userName} />
      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
