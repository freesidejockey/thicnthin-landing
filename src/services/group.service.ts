import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Tables } from '@/lib/supabase/database.types'

export type Group = Tables<'groups'>
export type GroupMember = Tables<'group_members'>

export interface GroupWithMembers extends Group {
  members: (GroupMember & {
    profile: Tables<'profiles'>
  })[]
}

export interface GroupService {
  getAllGroups(): Promise<Group[]>
  getGroupById(id: string): Promise<Group | null>
  getGroupWithMembers(id: string): Promise<GroupWithMembers | null>
  getGroupsByProfileId(profileId: string): Promise<Group[]>
}

export function createGroupService(
  supabase: SupabaseClient<Database>,
): GroupService {
  return {
    async getAllGroups(): Promise<Group[]> {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to fetch groups: ${error.message}`)
      }

      return data || []
    },

    async getGroupById(id: string): Promise<Group | null> {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null
        }
        throw new Error(`Failed to fetch group: ${error.message}`)
      }

      return data
    },

    async getGroupWithMembers(id: string): Promise<GroupWithMembers | null> {
      const { data, error } = await supabase
        .from('groups')
        .select(
          `
          *,
          members:group_members(
            *,
            profile:profiles(*)
          )
        `,
        )
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null
        }
        throw new Error(`Failed to fetch group with members: ${error.message}`)
      }

      return data as any
    },

    async getGroupsByProfileId(profileId: string): Promise<Group[]> {
      const { data, error } = await supabase
        .from('groups')
        .select(
          `
          *,
          group_members!inner(profile_id)
        `,
        )
        .eq('group_members.profile_id', profileId)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to fetch groups for profile: ${error.message}`)
      }

      return (data || []) as Group[]
    },
  }
}
