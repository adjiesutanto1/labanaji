-- ==========================================================
-- LABANAJI: PERBAIKAN TOTAL RLS & HAPUS TRIGGER AUTH CONFLICT
-- Jalankan skrip ini di Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Run
-- ==========================================================

-- 1. HAPUS TRIGGER DI AUTH.USERS AGAR TIDAK MEMBLOKIR SIGNUP
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. HAPUS SEMUA POLICY LAMA DARI SEMUA TABEL
DO $$ 
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname, tablename 
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename IN ('profiles', 'mosques', 'studies')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- 3. PASTIKAN RLS AKTIF DENGAN KEBIJAKAN TERBUKA TANPA REKURSI
ALTER TABLE public.mosques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- POLICIES PROFILES (Bebas Rekursi 100%)
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_all" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "profiles_update_all" ON public.profiles FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "profiles_delete_all" ON public.profiles FOR DELETE USING (true);

-- POLICIES MOSQUES
CREATE POLICY "mosques_select_all" ON public.mosques FOR SELECT USING (true);
CREATE POLICY "mosques_insert_all" ON public.mosques FOR INSERT WITH CHECK (true);
CREATE POLICY "mosques_update_all" ON public.mosques FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "mosques_delete_all" ON public.mosques FOR DELETE USING (true);

-- POLICIES STUDIES
CREATE POLICY "studies_select_all" ON public.studies FOR SELECT USING (true);
CREATE POLICY "studies_insert_all" ON public.studies FOR INSERT WITH CHECK (true);
CREATE POLICY "studies_update_all" ON public.studies FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "studies_delete_all" ON public.studies FOR DELETE USING (true);

-- 4. KONFIGURASI STORAGE BUCKET STUDY POSTERS
INSERT INTO storage.buckets (id, name, public)
VALUES ('study-posters', 'study-posters', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$ 
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname LIKE '%study poster%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "Public can view study posters" ON storage.objects FOR SELECT USING (bucket_id = 'study-posters');
CREATE POLICY "Authenticated users can upload study posters" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'study-posters');
CREATE POLICY "Authenticated users can update study posters" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'study-posters');
CREATE POLICY "Authenticated users can delete study posters" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'study-posters');

-- 5. REFRESH SCHEMA CACHE
NOTIFY pgrst, 'reload config';
