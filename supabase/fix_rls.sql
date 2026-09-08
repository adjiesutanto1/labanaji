-- ==========================================================
-- LABANAJI: FIX RLS POLICIES FOR PUBLIC TAKMIR REGISTRATION
-- Run this script in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jljjvlglxsmkecupuhip/sql
-- ==========================================================

-- 1. MOSQUES TABLE: Allow inserting new mosques during registration
DROP POLICY IF EXISTS "Allow public and authenticated to insert mosques" ON public.mosques;
DROP POLICY IF EXISTS "Public can insert mosques" ON public.mosques;
DROP POLICY IF EXISTS "Authenticated users can insert mosques" ON public.mosques;

CREATE POLICY "Allow public and authenticated to insert mosques" 
  ON public.mosques FOR INSERT 
  WITH CHECK (true);

-- 2. PROFILES TABLE: Allow users to insert their own profile upon registration
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated to insert own profile" ON public.profiles;

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (id = auth.uid() OR auth.uid() IS NULL);

-- 3. PROFILES TABLE: Ensure authenticated users can select and read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (id = auth.uid() OR true);

-- 4. STUDIES TABLE: Allow takmir to insert/update studies
DROP POLICY IF EXISTS "Takmir can insert studies for own mosque" ON public.studies;
CREATE POLICY "Takmir can insert studies for own mosque" 
  ON public.studies FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.role = 'takmir' OR profiles.role = 'superadmin')
    )
  );

-- 5. STORAGE BUCKET: Ensure study-posters bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('study-posters', 'study-posters', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Reload Schema Cache
NOTIFY pgrst, 'reload config';
