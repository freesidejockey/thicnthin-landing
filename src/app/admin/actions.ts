'use server'

import { createServerClient } from '@/lib/supabase/server'
import { createProfileService, type Profile } from '@/services/profile.service'
import { createGroupService, type Group } from '@/services/group.service'

export interface AdminData {
  profiles: Profile[]
  groups: Group[]
}

export async function loadAdminData(): Promise<AdminData> {
  const supabase = createServerClient()
  const profileService = createProfileService(supabase)
  const groupService = createGroupService(supabase)

  const [profiles, groups] = await Promise.all([
    profileService.getAllProfiles(),
    groupService.getAllGroups(),
  ])

  return {
    profiles,
    groups,
  }
}

export async function loadProfiles(): Promise<Profile[]> {
  const supabase = createServerClient()
  const profileService = createProfileService(supabase)
  return profileService.getAllProfiles()
}

export async function loadGroups(): Promise<Group[]> {
  const supabase = createServerClient()
  const groupService = createGroupService(supabase)
  return groupService.getAllGroups()
}
