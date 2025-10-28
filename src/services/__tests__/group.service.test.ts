import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createGroupService } from '../group.service'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database.types'

describe('GroupService', () => {
  let mockSupabase: SupabaseClient<Database>
  let groupService: ReturnType<typeof createGroupService>

  beforeEach(() => {
    // Create a mock Supabase client
    mockSupabase = {
      from: vi.fn(),
    } as any

    groupService = createGroupService(mockSupabase)
  })

  describe('getAllGroups', () => {
    it('should return all groups ordered by created_at', async () => {
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
        {
          id: '2',
          name: 'Beta Squad',
          description: 'Second group',
          created_by: 'user2',
          is_active: true,
          created_at: '2025-01-02T00:00:00Z',
          updated_at: '2025-01-02T00:00:00Z',
        },
      ]

      const mockOrder = vi.fn().mockResolvedValue({ data: mockGroups, error: null })
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder })
      vi.mocked(mockSupabase.from).mockReturnValue({ select: mockSelect } as any)

      const result = await groupService.getAllGroups()

      expect(mockSupabase.from).toHaveBeenCalledWith('groups')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false })
      expect(result).toEqual(mockGroups)
    })

    it('should throw error when fetch fails', async () => {
      const mockError = { message: 'Database error' }
      const mockOrder = vi.fn().mockResolvedValue({ data: null, error: mockError })
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder })
      vi.mocked(mockSupabase.from).mockReturnValue({ select: mockSelect } as any)

      await expect(groupService.getAllGroups()).rejects.toThrow(
        'Failed to fetch groups: Database error',
      )
    })
  })

  describe('getGroupById', () => {
    it('should return a group when found', async () => {
      const mockGroup = {
        id: '1',
        name: 'Alpha Testers',
        description: 'First group',
        created_by: 'user1',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      }

      const mockSingle = vi.fn().mockResolvedValue({ data: mockGroup, error: null })
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      vi.mocked(mockSupabase.from).mockReturnValue({ select: mockSelect } as any)

      const result = await groupService.getGroupById('1')

      expect(mockSupabase.from).toHaveBeenCalledWith('groups')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockEq).toHaveBeenCalledWith('id', '1')
      expect(result).toEqual(mockGroup)
    })

    it('should return null when group not found', async () => {
      const mockError = { code: 'PGRST116', message: 'No rows found' }
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: mockError })
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      vi.mocked(mockSupabase.from).mockReturnValue({ select: mockSelect } as any)

      const result = await groupService.getGroupById('999')

      expect(result).toBeNull()
    })

    it('should throw error when fetch fails with non-404 error', async () => {
      const mockError = { code: 'OTHER_ERROR', message: 'Database error' }
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: mockError })
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      vi.mocked(mockSupabase.from).mockReturnValue({ select: mockSelect } as any)

      await expect(groupService.getGroupById('1')).rejects.toThrow(
        'Failed to fetch group: Database error',
      )
    })
  })

  describe('getGroupWithMembers', () => {
    it('should return a group with members when found', async () => {
      const mockGroupWithMembers = {
        id: '1',
        name: 'Alpha Testers',
        description: 'First group',
        created_by: 'user1',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        members: [
          {
            id: 'member1',
            group_id: '1',
            profile_id: 'profile1',
            role: 'owner',
            joined_at: '2025-01-01T00:00:00Z',
            profile: {
              id: 'profile1',
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
          },
        ],
      }

      const mockSingle = vi.fn().mockResolvedValue({ data: mockGroupWithMembers, error: null })
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      vi.mocked(mockSupabase.from).mockReturnValue({ select: mockSelect } as any)

      const result = await groupService.getGroupWithMembers('1')

      expect(mockSupabase.from).toHaveBeenCalledWith('groups')
      expect(mockEq).toHaveBeenCalledWith('id', '1')
      expect(result).toEqual(mockGroupWithMembers)
    })

    it('should return null when group not found', async () => {
      const mockError = { code: 'PGRST116', message: 'No rows found' }
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: mockError })
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      vi.mocked(mockSupabase.from).mockReturnValue({ select: mockSelect } as any)

      const result = await groupService.getGroupWithMembers('999')

      expect(result).toBeNull()
    })
  })

  describe('getGroupsByProfileId', () => {
    it('should return all groups for a profile', async () => {
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

      const mockOrder = vi.fn().mockResolvedValue({ data: mockGroups, error: null })
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      vi.mocked(mockSupabase.from).mockReturnValue({ select: mockSelect } as any)

      const result = await groupService.getGroupsByProfileId('profile1')

      expect(mockSupabase.from).toHaveBeenCalledWith('groups')
      expect(mockEq).toHaveBeenCalledWith('group_members.profile_id', 'profile1')
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false })
      expect(result).toEqual(mockGroups)
    })

    it('should throw error when fetch fails', async () => {
      const mockError = { message: 'Database error' }
      const mockOrder = vi.fn().mockResolvedValue({ data: null, error: mockError })
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      vi.mocked(mockSupabase.from).mockReturnValue({ select: mockSelect } as any)

      await expect(groupService.getGroupsByProfileId('profile1')).rejects.toThrow(
        'Failed to fetch groups for profile: Database error',
      )
    })
  })
})
