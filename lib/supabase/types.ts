export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Mosque {
  id: string
  name: string
  slug: string
  image_url: string
  address: string
  latitude: number | null
  longitude: number | null
  takmir_name: string
  takmir_phone: string
  routine_info?: string | null
  created_at?: string
  updated_at?: string
}

export interface Study {
  id: string
  mosque_id: string
  title: string
  slug: string
  speaker: string
  poster_url: string
  description: string | null
  study_date: string // YYYY-MM-DD
  start_time: string // e.g. "19:30 WIB"
  created_at?: string
  updated_at?: string
  mosque?: Mosque
}

export interface Profile {
  id: string
  role: 'superadmin' | 'takmir'
  mosque_id: string | null
  name: string
  phone: string | null
  created_at?: string
  updated_at?: string
  mosque?: Mosque
}

export interface Database {
  public: {
    Tables: {
      mosques: {
        Row: Mosque
        Insert: Omit<Mosque, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Mosque>
      }
      studies: {
        Row: Study
        Insert: Omit<Study, 'id' | 'created_at' | 'updated_at' | 'mosque'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Study, 'mosque'>>
      }
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at' | 'mosque'> & {
          id: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Profile, 'id' | 'mosque'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
