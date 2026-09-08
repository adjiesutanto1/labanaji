'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutTakmirAction } from '@/lib/actions/auth'
import { BrandLogo } from '@/components/brand-logo'
import {
  LayoutDashboard,
  Landmark,
  CalendarDays,
  Users,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  Plus,
} from 'lucide-react'

interface SuperadminSidebarProps {
  userEmail?: string
  userName?: string
}

export function SuperadminSidebar({
  userEmail = 'admin@labanaji.com',
  userName = 'Superadmin LABANAJI',
}: SuperadminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    {
      name: 'Ringkasan Utama',
      href: '/superadmin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'Masjid',
      href: '/superadmin/masjid',
      icon: Landmark,
      exact: false,
    },
    {
      name: 'Kajian',
      href: '/superadmin/kajian',
      icon: CalendarDays,
      exact: false,
    },
    {
      name: 'Kelola Takmir',
      href: '/superadmin/takmir',
      icon: Users,
      exact: false,
    },
  ]

  const isLinkActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-[#26201B] text-[#FBF8F2] border-b border-[#3D332B] px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <BrandLogo size={32} />
          <div>
            <span className="font-extrabold text-sm text-[#FAF7F0] tracking-tight block leading-tight">
              LABANAJI
            </span>
            <span className="text-[10px] font-semibold text-[#B38E5D] block leading-none">
              Superadmin Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/superadmin/takmir/tambah"
            className="p-2 rounded-full bg-[#8A7965] hover:bg-[#73624F] text-[#FAF7F0] shadow-2xs transition-colors"
            title="Tambah Takmir"
            aria-label="Tambah Takmir"
          >
            <Plus className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-full bg-[#1B1613] text-[#FAF7F0] focus:outline-none"
            aria-label="Menu Superadmin"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-2xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-[#26201B] text-[#FBF8F2] border-r border-[#3D332B] p-5 flex flex-col justify-between h-full z-10 shadow-xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#3D332B]">
                <div className="flex items-center gap-2.5">
                  <BrandLogo size={32} />
                  <div>
                    <span className="font-bold text-sm text-[#FAF7F0]">LABANAJI</span>
                    <span className="text-[10px] text-[#B38E5D] block">Superadmin Portal</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded-full text-[#B38E5D] hover:bg-[#332A24]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const active = isLinkActive(item.href, item.exact)
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                        active
                          ? 'bg-[#8A7965] text-[#FAF7F0] shadow-2xs font-bold'
                          : 'text-[#C9BFB5] hover:text-[#FAF7F0] hover:bg-[#332A24]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-[#FAF7F0]' : 'text-[#B38E5D]'}`} />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}

                <div className="pt-2">
                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium text-[#C9BFB5] hover:bg-[#332A24]"
                  >
                    <span>Lihat Website Publik</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </nav>
            </div>

            <div className="pt-4 border-t border-[#3D332B] space-y-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B38E5D]">
                  Hak Akses Superadmin
                </span>
                <p className="text-xs font-bold text-[#FAF7F0] truncate">{userName}</p>
                <p className="text-[11px] text-[#C9BFB5] truncate">{userEmail}</p>
              </div>

              <form action={logoutTakmirAction}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-full text-xs font-semibold bg-[#1B1613] hover:bg-[#332A24] text-rose-300 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (240–260px) */}
      <aside className="hidden md:flex flex-col justify-between w-60 shrink-0 bg-[#26201B] text-[#FBF8F2] border-r border-[#3D332B] p-5 h-screen sticky top-0 overflow-y-auto">
        <div className="space-y-6">
          {/* Brand Emblem */}
          <div className="space-y-3 pb-4 border-b border-[#3D332B]">
            <Link href="/superadmin" className="flex items-center gap-2.5">
              <BrandLogo size={36} />
              <div>
                <span className="font-extrabold text-base tracking-tight text-[#FAF7F0] block leading-tight">
                  LABANAJI
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B38E5D] block">
                  Superadmin Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const active = isLinkActive(item.href, item.exact)
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#8A7965] text-[#FAF7F0] shadow-2xs font-bold'
                      : 'text-[#C9BFB5] hover:text-[#FAF7F0] hover:bg-[#332A24]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#FAF7F0]' : 'text-[#B38E5D]'}`} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="pt-4 border-t border-[#3D332B] space-y-3">
          <div className="bg-[#1B1613] p-3 rounded-2xl border border-[#3D332B] space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#B38E5D]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B38E5D]" />
              <span>Akses Penuh (Superadmin)</span>
            </div>
            <p className="text-xs font-bold text-[#FAF7F0] truncate leading-snug">
              {userName}
            </p>
            <p className="text-[10px] text-[#C9BFB5] truncate">{userEmail}</p>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C9BFB5] hover:text-[#FAF7F0]"
              title="Buka Website Publik"
            >
              <span>Web Publik</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <form action={logoutTakmirAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-300 hover:bg-rose-950/80 border border-rose-900/40 transition-colors"
                title="Keluar dari Portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  )
}
