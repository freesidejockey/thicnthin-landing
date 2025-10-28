import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loadAdminData } from '../actions'
import * as supabaseServer from '@/lib/supabase/server'
import * as profileService from '@/services/profile.service'
import * as groupService from '@/services/group.service'

vi.mock('@/lib/supabase/server')
vi.mock('@/services/profile.service')
vi.mock('@/services/group.service')

describe('Admin Actions', () => {
  let mockSupabase: any
  let mockProfileService: any
  let mockGroupService: any

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn(),
    }

    mockProfileService = {
      getAllProfiles: vi.fn(),
    }

    mockGroupService = {
      getAllGroups: vi.fn(),
    }

    vi.mocked(supabaseServer.createServerClient).mockReturnValue(mockSupabase)
    vi.mocked(profileService.createProfileService).mockReturnValue(mockProfileService)
    vi.mocked(groupService.createGroupService).mockReturnValue(mockGroupService)
  })

  describe('loadAdminData', () => {
    it('should load profiles and groups in parallel', async () => {
      const mockProfiles = [
        {
          id: '1',
          user_id: 'user1',
          profile_code: '1234',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          current_height: 72,
          current_weight: 200,
          goal_weight: 180,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ]

      const mockGroups = [
        {
          id: '1',
          name: 'Alpha Testers',
          description: 'First group',
          created_by: 'user1',
          is_active: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ]

      mockProfileService.getAllProfiles.mockResolvedValue(mockProfiles)
      mockGroupService.getAllGroups.mockResolvedValue(mockGroups)

      const result = await loadAdminData()

      expect(supabaseServer.createServerClient).toHaveBeenCalled()
      expect(profileService.createProfileService).toHaveBeenCalledWith(mockSupabase)
      expect(groupService.createGroupService).toHaveBeenCalledWith(mockSupabase)
      expect(mockProfileService.getAllProfiles).toHaveBeenCalled()
      expect(mockGroupService.getAllGroups).toHaveBeenCalled()
      expect(result).toEqual({
        profiles: mockProfiles,
        groups: mockGroups,
      })
    })

    it('should propagate errors from profile service', async () => {
      const error = new Error('Failed to fetch profiles')
      mockProfileService.getAllProfiles.mockRejectedValue(error)
      mockGroupService.getAllGroups.mockResolvedValue([])

      await expect(loadAdminData()).rejects.toThrow('Failed to fetch profiles')
    })

    it('should propagate errors from group service', async () => {
      const error = new Error('Failed to fetch groups')
      mockProfileService.getAllProfiles.mockResolvedValue([])
      mockGroupService.getAllGroups.mockRejectedValue(error)

      await expect(loadAdminData()).rejects.toThrow('Failed to fetch groups')
    })
  })
})
