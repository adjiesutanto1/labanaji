'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutTakmirAction } from '@/lib/actions/auth'
import { BrandLogo } from '@/components/brand-logo'
import {
  LayoutDashboard,
  CalendarDays,
  Landmark,
  LogOut,
  Menu,
  X,
  Plus,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'

interface AdminSidebarProps {
  userEmail?: string
  mosqueName?: string
}

export function AdminSidebar({
  userEmail = 'takmir@banyuwangi.id',
  mosqueName = 'Masjid Agung Baiturrahman',
}: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Hide sidebar on login page
  if (pathname === '/takmir/login') {
    return null
  }

  const navItems = [
    {
      name: 'Dashboard',
      href: '/takmir',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'Kajian',
      href: '/takmir/kajian',
      icon: CalendarDays,
      exact: false,
    },
    {
      name: 'Masjid Saya',
      href: '/takmir/masjid',
      icon: Landmark,
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
      <header className="md:hidden sticky top-0 z-40 bg-[#FBF8F2] border-b border-[#DDD4C5] px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <BrandLogo size={32} />
          <div>
            <span className="font-extrabold text-sm text-[#24332B] tracking-tight block leading-tight">
              LABANAJI
            </span>
            <span className="text-[10px] font-semibold text-[#8A7965] block leading-none">
              Area Takmir
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/takmir/tambah"
            className="p-2 rounded-full bg-[#8A7965] text-[#FBF8F2] shadow-2xs hover:bg-[#73624F] transition-colors"
            title="Tambah Kajian"
            aria-label="Tambah Kajian"
          >
            <Plus className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-full bg-[#EEE6D8] text-[#24332B] focus:outline-none"
            aria-label="Menu Admin"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-2xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-[#FBF8F2] border-r border-[#DDD4C5] p-5 flex flex-col justify-between h-full z-10 shadow-lg">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#DDD4C5]/70">
                <div className="flex items-center gap-2.5">
                  <BrandLogo size={32} />
                  <div>
                    <span className="font-bold text-sm text-[#24332B]">LABANAJI</span>
                    <span className="text-[10px] text-[#8A7965] block">Area Takmir</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded-full text-[#756B58] hover:bg-[#EEE6D8]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
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
                          ? 'bg-[#EFE7DC] text-[#6B5B49] shadow-2xs font-bold'
                          : 'text-[#24332B] hover:bg-[#EEE6D8]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-[#8A7965]' : 'text-[#756B58]'}`} />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}

                <div className="pt-2">
                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium text-[#756B58] hover:bg-[#EEE6D8]"
                  >
                    <span>Lihat Website Publik</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </nav>
            </div>

            {/* Bottom User Info */}
            <div className="pt-4 border-t border-[#DDD4C5]/70 space-y-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#756B58]">
                  Masjid Dikelola
                </span>
                <p className="text-xs font-bold text-[#24332B] line-clamp-1">
                  {mosqueName}
                </p>
                <p className="text-[11px] text-[#7A6B5D] truncate">{userEmail}</p>
              </div>

              <form action={logoutTakmirAction}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-full text-xs font-semibold bg-[#EEE6D8] hover:bg-[#E7DED0] text-[#24332B] transition-colors"
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
      <aside className="hidden md:flex flex-col justify-between w-60 shrink-0 bg-[#FBF8F2] border-r border-[#DDD4C5] p-5 h-screen sticky top-0 overflow-y-auto">
        <div className="space-y-6">
          {/* Brand Logo & Area Tag */}
          <div className="space-y-3 pb-4 border-b border-[#DDD4C5]/70">
            <Link href="/takmir" className="flex items-center gap-2.5">
              <BrandLogo size={36} />
              <div>
                <span className="font-extrabold text-base text-[#24332B] tracking-tight block leading-tight">
                  LABANAJI
                </span>
                <span className="text-[11px] font-semibold text-[#8A7965] block leading-none">
                  Area Takmir
                </span>
              </div>
            </Link>

            {/* Quick Action Button */}
            <Link
              href="/takmir/tambah"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full font-bold text-xs bg-[#8A7965] hover:bg-[#73624F] text-[#FBF8F2] shadow-2xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Kajian</span>
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
                      ? 'bg-[#EFE7DC] text-[#6B5B49] shadow-2xs font-bold'
                      : 'text-[#24332B] hover:bg-[#EEE6D8]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#8A7965]' : 'text-[#756B58]'}`} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Profile / Logout Box */}
        <div className="pt-4 border-t border-[#DDD4C5]/70 space-y-3">
          <div className="bg-[#EEE6D8]/80 p-3 rounded-2xl border border-[#DDD4C5]/60 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8A7965]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8A7965]" />
              <span>Takmir Terverifikasi</span>
            </div>
            <p className="text-xs font-bold text-[#24332B] line-clamp-1 leading-snug">
              {mosqueName}
            </p>
            <p className="text-[10px] text-[#7A6B5D] truncate">{userEmail}</p>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#756B58] hover:text-[#24332B]"
              title="Buka Website Publik"
            >
              <span>Web Publik</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <form action={logoutTakmirAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-800 hover:bg-rose-50 border border-rose-200 transition-colors"
                title="Keluar dari Dashboard"
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
