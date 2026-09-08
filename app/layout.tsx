import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#8a7965',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'LABANAJI — Lare Banyuwangi Demen Ngaji | Informasi Kajian Islam Banyuwangi',
    template: '%s | LABANAJI',
  },
  description:
    'Pusat informasi jadwal dan poster kajian Islam di masjid-masjid se-Banyuwangi. Cepat, ringan, dan mudah diakses melalui HP.',
  keywords: [
    'Kajian Banyuwangi',
    'Jadwal Kajian Banyuwangi',
    'LABANAJI',
    'Lare Banyuwangi Demen Ngaji',
    'Masjid Banyuwangi',
    'Kajian Islam Banyuwangi',
    'Info Pengajian Banyuwangi',
  ],
  authors: [{ name: 'LABANAJI Community' }],
  creator: 'LABANAJI',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://labanaji.com',
    siteName: 'LABANAJI',
    title: 'LABANAJI — Jadwal Kajian Islam Banyuwangi',
    description:
      'Temukan jadwal dan poster kajian Islam hari ini di masjid-masjid sekitar Banyuwangi dengan mudah dan cepat.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LABANAJI — Jadwal Kajian Islam Banyuwangi',
    description: 'Pusat informasi kajian Islam di wilayah Banyuwangi.',
  },
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: ['/logo.png'],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${fontSans.variable} font-sans antialiased h-full`}>
      <body className="min-h-full flex flex-col bg-[#F6F1E8] text-[#24332B] selection:bg-[#EFE7DC] selection:text-[#6B5B49]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
