-- ==========================================================
-- LABANAJI (Lare Banyuwangi Demen Ngaji) Database Schema
-- Multi-Takmir & Superadmin Role-Based Security Architecture
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. MOSQUES TABLE
CREATE TABLE IF NOT EXISTS public.mosques (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  takmir_name TEXT NOT NULL,
  takmir_phone TEXT NOT NULL,
  routine_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for mosques
CREATE INDEX IF NOT EXISTS idx_mosques_slug ON public.mosques (slug);

-- 2. STUDIES TABLE
CREATE TABLE IF NOT EXISTS public.studies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mosque_id UUID NOT NULL REFERENCES public.mosques(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  speaker TEXT NOT NULL,
  poster_url TEXT NOT NULL,
  description TEXT,
  study_date DATE NOT NULL,
  start_time TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for studies query performance
CREATE INDEX IF NOT EXISTS idx_studies_date ON public.studies (study_date);
CREATE INDEX IF NOT EXISTS idx_studies_mosque_id ON public.studies (mosque_id);
CREATE INDEX IF NOT EXISTS idx_studies_slug ON public.studies (slug);

-- 3. PROFILES TABLE (Strict Roles: 'superadmin' | 'takmir')
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('superadmin', 'takmir')),
  mosque_id UUID REFERENCES public.mosques(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for profiles lookup
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);
CREATE INDEX IF NOT EXISTS idx_profiles_mosque_id ON public.profiles (mosque_id);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES & HELPER FUNCTIONS
-- ==========================================================

-- Enable RLS on all private tables
ALTER TABLE public.mosques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------
-- SECURITY DEFINER HELPER FUNCTIONS (Avoid RLS Recursion)
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_auth_mosque_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT mosque_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    (SELECT role = 'superadmin' FROM public.profiles WHERE id = auth.uid() LIMIT 1),
    false
  );
$$;

-- ----------------------------------------------------------
-- A. PROFILES POLICIES
-- ----------------------------------------------------------
CREATE POLICY "Allow users and superadmin to view profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Allow users to insert profile"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid() OR public.is_superadmin() OR auth.uid() IS NULL);

CREATE POLICY "Allow users to update own profile or superadmin"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid() OR public.is_superadmin())
  WITH CHECK (id = auth.uid() OR public.is_superadmin());

CREATE POLICY "Allow superadmin to delete profiles"
  ON public.profiles FOR DELETE
  USING (public.is_superadmin());

-- ----------------------------------------------------------
-- B. MOSQUES POLICIES
-- ----------------------------------------------------------
CREATE POLICY "Public can view mosques"
  ON public.mosques FOR SELECT
  USING (true);

CREATE POLICY "Public and authenticated can insert mosques"
  ON public.mosques FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Superadmin or assigned takmir can update mosque"
  ON public.mosques FOR UPDATE
  USING (public.is_superadmin() OR (public.get_auth_role() = 'takmir' AND id = public.get_auth_mosque_id()))
  WITH CHECK (public.is_superadmin() OR (public.get_auth_role() = 'takmir' AND id = public.get_auth_mosque_id()));

CREATE POLICY "Superadmin can delete mosques"
  ON public.mosques FOR DELETE
  USING (public.is_superadmin());

-- ----------------------------------------------------------
-- C. STUDIES POLICIES
-- ----------------------------------------------------------
CREATE POLICY "Public can view studies"
  ON public.studies FOR SELECT
  USING (true);

CREATE POLICY "Superadmin or takmir can insert studies"
  ON public.studies FOR INSERT
  WITH CHECK (public.is_superadmin() OR (public.get_auth_role() = 'takmir' AND (mosque_id = public.get_auth_mosque_id() OR public.get_auth_mosque_id() IS NULL)));

CREATE POLICY "Superadmin or takmir can update studies"
  ON public.studies FOR UPDATE
  USING (public.is_superadmin() OR (public.get_auth_role() = 'takmir' AND (mosque_id = public.get_auth_mosque_id() OR public.get_auth_mosque_id() IS NULL)))
  WITH CHECK (public.is_superadmin() OR (public.get_auth_role() = 'takmir' AND (mosque_id = public.get_auth_mosque_id() OR public.get_auth_mosque_id() IS NULL)));

CREATE POLICY "Superadmin or takmir can delete studies"
  ON public.studies FOR DELETE
  USING (public.is_superadmin() OR (public.get_auth_role() = 'takmir' AND (mosque_id = public.get_auth_mosque_id() OR public.get_auth_mosque_id() IS NULL)));

-- ----------------------------------------------------------
-- D. SUPABASE STORAGE BUCKET CONFIGURATION
-- ----------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) 
VALUES ('study-posters', 'study-posters', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public can view study posters" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'study-posters');

CREATE POLICY "Authenticated users can upload study posters" 
  ON storage.objects FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id = 'study-posters');

CREATE POLICY "Authenticated users can update study posters" 
  ON storage.objects FOR UPDATE 
  TO authenticated 
  USING (bucket_id = 'study-posters');

CREATE POLICY "Authenticated users can delete study posters" 
  ON storage.objects FOR DELETE 
  TO authenticated 
  USING (bucket_id = 'study-posters');
