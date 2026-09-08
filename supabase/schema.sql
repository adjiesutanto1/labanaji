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
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

-- Enable RLS on all private tables
ALTER TABLE public.mosques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------
-- A. MOSQUES POLICIES
-- ----------------------------------------------------------
-- 1. Public can read all mosques
CREATE POLICY "Public can view mosques" 
  ON public.mosques FOR SELECT 
  USING (true);

-- 2. Superadmin can perform all actions on mosques
CREATE POLICY "Superadmin full access to mosques" 
  ON public.mosques FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin'
    )
  );

-- 3. Takmir can only UPDATE their assigned mosque
CREATE POLICY "Takmir can update own mosque" 
  ON public.mosques FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'takmir' 
      AND profiles.mosque_id = mosques.id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'takmir' 
      AND profiles.mosque_id = mosques.id
    )
  );

-- ----------------------------------------------------------
-- B. STUDIES POLICIES
-- ----------------------------------------------------------
-- 1. Public can view all studies
CREATE POLICY "Public can view studies" 
  ON public.studies FOR SELECT 
  USING (true);

-- 2. Superadmin can perform all actions on studies
CREATE POLICY "Superadmin full access to studies" 
  ON public.studies FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin'
    )
  );

-- 3. Takmir can INSERT studies only for their assigned mosque
CREATE POLICY "Takmir can insert studies for own mosque" 
  ON public.studies FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'takmir' 
      AND profiles.mosque_id = studies.mosque_id
    )
  );

-- 4. Takmir can UPDATE studies only for their assigned mosque
CREATE POLICY "Takmir can update studies for own mosque" 
  ON public.studies FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'takmir' 
      AND profiles.mosque_id = studies.mosque_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'takmir' 
      AND profiles.mosque_id = studies.mosque_id
    )
  );

-- 5. Takmir can DELETE studies only for their assigned mosque
CREATE POLICY "Takmir can delete studies for own mosque" 
  ON public.studies FOR DELETE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'takmir' 
      AND profiles.mosque_id = studies.mosque_id
    )
  );

-- ----------------------------------------------------------
-- C. PROFILES POLICIES
-- ----------------------------------------------------------
-- 1. Users can view their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  TO authenticated 
  USING (id = auth.uid());

-- 2. Superadmin can view and manage all profiles
CREATE POLICY "Superadmin full access to profiles" 
  ON public.profiles FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin'
    )
  );

-- 3. Takmir can only update their own name and phone (role and mosque_id are protected)
CREATE POLICY "Takmir can update own contact info" 
  ON public.profiles FOR UPDATE 
  TO authenticated 
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid() 
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    AND (
      mosque_id IS NOT DISTINCT FROM (SELECT mosque_id FROM public.profiles WHERE id = auth.uid())
    )
  );

-- ==========================================================
-- SUPABASE STORAGE BUCKET CONFIGURATION
-- ==========================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('study-posters', 'study-posters', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies:
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
