'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Calendar, Landmark, Info, UserCheck } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { name: 'Beranda', href: '/', icon: null },
    { name: 'Kajian', href: '/kajian', icon: Calendar },
    { name: 'Masjid', href: '/masjid', icon: Landmark },
    { name: 'Tentang', href: '/tentang', icon: Info },
  ]

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  // Hide public navbar on takmir, superadmin, login, and register routes
  if (
    pathname?.startsWith('/takmir') ||
    pathname?.startsWith('/superadmin') ||
    pathname === '/login' ||
    pathname === '/register'
  ) {
    return null
  }

  return (
    <header className="sticky top-0 z-40 px-3 sm:px-6 pt-3 sm:pt-4 pointer-events-none">
      <div className="max-w-5xl mx-auto pointer-events-auto">
        {/* Floating Rounded Panel Container */}
        <div className="bg-[#FBF8F2]/95 backdrop-blur-sm border border-[#DDD4C5] rounded-2xl sm:rounded-full px-3.5 sm:px-5 py-2.5 shadow-2xs transition-all">
          <div className="flex items-center justify-between">
            {/* Minimal Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-none rounded-full p-0.5"
              aria-label="LABANAJI Beranda"
            >
              {/* Brand Logo Image with logo-nobg.png */}
              <BrandLogo src="/logo-nobg.png" size={50} priority noBg />
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-[#24332B] leading-none">
                  LABANAJI
                </span>
                <span className="text-[10px] font-medium text-[#756B58] tracking-normal leading-tight mt-0.5">
                  Lare Banyuwangi Demen Ngaji
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${active
                        ? 'bg-[#EFE7DC] text-[#6B5B49] font-bold shadow-2xs'
                        : 'text-[#29372F] hover:text-[#8A7965] hover:bg-[#EEE6D8]'
                      }`}
                  >
                    {link.name}
                  </Link>
                )
              })}

              <div className="h-4 w-px bg-[#DDD4C5] mx-1.5" />

              <Link
                href="/takmir"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#24332B] bg-[#F6F1E8] hover:bg-white border border-[#DDD4C5] hover:border-[#8A7965] hover:text-[#8A7965] transition-all shadow-2xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#8A7965]" />
                <span>Area Takmir</span>
              </Link>
            </nav>

            {/* Mobile Navigation Trigger */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/takmir"
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#6B5B49] bg-[#EFE7DC] border border-[#DDD4C5]"
                aria-label="Area Takmir"
              >
                Takmir
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="p-1.5 rounded-full text-[#24332B] hover:bg-[#EEE6D8] focus:outline-none transition-colors"
                aria-expanded={isOpen}
                aria-label="Buka Menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          {isOpen && (
            <div className="md:hidden pt-3 mt-2 border-t border-[#DDD4C5] space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.href)
                const Icon = link.icon
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${active
                        ? 'bg-[#EFE7DC] text-[#6B5B49] font-bold'
                        : 'text-[#29372F] hover:bg-[#EEE6D8]'
                      }`}
                  >
                    {Icon && <Icon className="w-4 h-4 text-[#8A7965]" />}
                    <span>{link.name}</span>
                  </Link>
                )
              })}
              <div className="pt-2 border-t border-[#DDD4C5]">
                <Link
                  href="/takmir"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-full text-xs font-bold bg-[#8A7965] hover:bg-[#73624F] text-[#FBF8F2] transition-colors shadow-2xs"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Masuk sebagai Takmir</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
