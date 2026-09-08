-- ==============================================================================
-- LABANAJI (Lare Banyuwangi Demen Ngaji)
-- Panduan & Skrip SQL Pembuatan Akun Superadmin & Takmir Pertama
-- ==============================================================================

-- LANGKAH 1: Buat user di Supabase Auth (bisa lewat Dashboard -> Authentication -> Users -> Add User)
-- Contoh:
-- Email: admin@labanaji.com
-- Password: [Password Kuat Anda]

-- LANGKAH 2: Daftarkan role 'superadmin' ke tabel public.profiles menggunakan User ID dari auth.users:

-- A. Membuat Superadmin (Akses Penuh Platform):
INSERT INTO public.profiles (id, role, name, phone, mosque_id)
VALUES (
  'PASTE-UUID-USER-DARI-AUTH-USERS-DISINI', 
  'superadmin', 
  'Superadmin LABANAJI', 
  '081299998888', 
  NULL
)
ON CONFLICT (id) DO UPDATE 
SET role = 'superadmin', name = EXCLUDED.name;


-- B. Membuat Akun Takmir Masjid (Hanya mengelola 1 masjid yang ditugaskan):
-- Contoh: Takmir Masjid Agung Baiturrahman
INSERT INTO public.profiles (id, role, name, phone, mosque_id)
VALUES (
  'PASTE-UUID-USER-TAKMIR-DARI-AUTH-USERS',
  'takmir',
  'H. Ahmad Fauzi (Takmir)',
  '081234567891',
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c01' -- UUID Masjid Agung Baiturrahman
)
ON CONFLICT (id) DO UPDATE 
SET role = 'takmir', mosque_id = EXCLUDED.mosque_id, name = EXCLUDED.name;

-- ==============================================================================
-- VERIFIKASI HAK AKSES:
-- ==============================================================================
-- 1. Jalankan query berikut untuk melihat daftar role:
-- SELECT p.id, p.role, p.name, m.name AS nama_masjid 
-- FROM public.profiles p 
-- LEFT JOIN public.mosques m ON p.mosque_id = m.id;
