import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Tables } from '@/lib/supabase/database.types'

export type Profile = Tables<'profiles'>

export interface ProfileService {
  getAllProfiles(): Promise<Profile[]>
  getProfileById(id: string): Promise<Profile | null>
  getProfileByCode(code: string): Promise<Profile | null>
}

export function createProfileService(
  supabase: SupabaseClient<Database>,
): ProfileService {
  return {
    async getAllProfiles(): Promise<Profile[]> {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to fetch profiles: ${error.message}`)
      }

      return data || []
    },

    async getProfileById(id: string): Promise<Profile | null> {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null
        }
        throw new Error(`Failed to fetch profile: ${error.message}`)
      }

      return data
    },

    async getProfileByCode(code: string): Promise<Profile | null> {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('profile_code', code)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null
        }
        throw new Error(`Failed to fetch profile: ${error.message}`)
      }

      return data
    },
  }
}
