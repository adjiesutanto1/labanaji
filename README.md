# LABANAJI (Lare Banyuwangi Demen Ngaji)

Platform pusat informasi jadwal dan poster kajian Islam di wilayah Kabupaten Banyuwangi. Ringan, cepat, mobile-first, dan terpercaya.

---

## 🌟 Fitur Utama

- **Kajian Hari Ini**: Pusat informasi utama di halaman depan yang menampilkan jadwal pengajian hari ini secara otomatis.
- **Carousel Masjid Rutin**: Swipe horizontal di mobile & tombol navigasi desktop untuk masjid-masjid aktif di Banyuwangi.
- **Pencarian & Filter Lengkap**: Filter kajian berdasarkan tanggal (Hari Ini, Besok, Kalender), nama/lokasi masjid, dan kata kunci pemateri/tema.
- **Detail Kajian Lengkap**:
  - Poster resolusi optimal dengan `next/image`
  - Tombol langsung **Buka Google Maps** menuju lokasi masjid
  - Tombol **Telepon Langsung** (`tel:`) dan **Chat WhatsApp Takmir** dengan pesan sapaan otomatis
  - Metadata SEO dinamis & Schema.org `Event` JSON-LD
- **Direktori Masjid Banyuwangi**: Profil masjid, jadwal kajian rutin, dan daftar kajian terjadwal.
- **Area Takmir Sederhana**:
  - Login takmir
  - Unggah poster kajian (validasi format & ukuran maksimal 5MB)
  - Formulir tambah, edit, dan hapus jadwal kajian
- **Arsitektur Cepat & SEO-Ready**:
  - Server Components (minim client-side JavaScript)
  - Next.js Image Optimization
  - `sitemap.xml` dan `robots.txt` otomatis

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router, Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database & Storage**: Supabase (PostgreSQL, Storage Bucket `study-posters`, RLS Security)

---

## 🚀 Panduan Menjalankan Proyek

### 1. Menjalankan Mode Development
```bash
npm install
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### 2. Build Production
```bash
npm run build
npm run start
```

---

## 🗄️ Setup Supabase (Database & Storage)

Aplikasi dilengkapi fallback data awal Banyuwangi sehingga dapat langsung berjalan. Untuk menghubungkan ke database Supabase Anda sendiri:

1. Buat project baru di [Supabase Dashboard](https://supabase.com).
2. Salin isi file `supabase/schema.sql` lalu jalankan di **Supabase SQL Editor**.
3. (Opsional) Jalankan isi file `supabase/seed.sql` untuk mengisi data awal masjid & kajian Banyuwangi.
4. Buat file `.env.local` dari `.env.example`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
5. Restart dev server (`npm run dev`). Sistem akan otomatis menggunakan Supabase!

---

## 👥 Hak Cipta & Komunitas

Dibuat untuk masyarakat dan jamaah pengajian di Kabupaten Banyuwangi.
© 2026 LABANAJI — Lare Banyuwangi Demen Ngaji.
