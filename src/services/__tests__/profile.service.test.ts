import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createProfileService } from '../profile.service'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database.types'

describe('ProfileService', () => {
  let mockSupabase: SupabaseClient<Database>
  let profileService: ReturnType<typeof createProfileService>

  beforeEach(() => {
    // Create a mock Supabase client
    mockSupabase = {
      from: vi.fn(),
    } as any

    profileService = createProfileService(mockSupabase)
  })

  describe('getAllProfiles', () => {
    it('should return all profiles ordered by created_at', async () => {
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
        {
          id: '2',
          user_id: 'user2',
          profile_code: '5678',
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane@example.com',
          phone: '0987654321',
          current_height: 65,
          current_weight: 150,
          goal_weight: 140,
          created_at: '2025-01-02T00:00:00Z',
          updated_at: '2025-01-02T00:00:00Z',
        },
      ]

      const mockOrder = vi.fn().mockResolvedValue({ data: mockProfiles, error: null })
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder })
      vi.mocked(mockSupabase.from).mockReturnValue({ select: mockSelect } as any)

      const result = await profileService.getAllProfiles()

      expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false })
      expect(result).toEqual(mockProfiles)
    })

    it('should throw error when fetch fails', async () => {
      const mockError = { message: 'Database error' }
      const mockOrder = vi.fn().mockResolvedValue({ data: null, error: mockError })
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder })
      vi.mocked(mockSupabase.from).mockReturnValue({ select: mockSelect } as any)

      await expect(profileService.getAllProfiles()).rejects.toThrow(
        'Failed to fetch profiles: Database error',
      )
    })
  })

  describe('getProfileById', () => {
    it('should return a profile when found', async () => {
      const mockProfile = {
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
      }

      const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null })
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      vi.mocked(mockSupabase.from).mockReturnValue({ select: mockSelect } as any)

      const result = await profileService.getProfileById('1')

      expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockEq).toHaveBeenCalledWith('id', '1')
      expect(result).toEqual(mockProfile)
    })

    it('should return null when profile not found', async () => {
      const mockError = { code: 'PGRST116', message: 'No rows found' }
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: mockError })
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      vi.mocked(mockSupabase.from).mockReturnValue({ select: mockSelect } as any)

      const result = await profileService.getProfileById('999')

      expect(result).toBeNull()
    })

    it('should throw error when fetch fails with non-404 error', async () => {
      const mockError = { code: 'OTHER_ERROR', message: 'Database error' }
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: mockError })
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      vi.mocked(mockSupabase.from).mockReturnValue({ select: mockSelect } as any)

      await expect(profileService.getProfileById('1')).rejects.toThrow(
        'Failed to fetch profile: Database error',
      )
    })
  })

  describe('getProfileByCode', () => {
    it('should return a profile when found by code', async () => {
      const mockProfile = {
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
      }

      const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null })
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      vi.mocked(mockSupabase.from).mockReturnValue({ select: mockSelect } as any)

      const result = await profileService.getProfileByCode('1234')

      expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockEq).toHaveBeenCalledWith('profile_code', '1234')
      expect(result).toEqual(mockProfile)
    })

    it('should return null when profile not found by code', async () => {
      const mockError = { code: 'PGRST116', message: 'No rows found' }
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: mockError })
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      vi.mocked(mockSupabase.from).mockReturnValue({ select: mockSelect } as any)

      const result = await profileService.getProfileByCode('9999')

      expect(result).toBeNull()
    })
  })
})
