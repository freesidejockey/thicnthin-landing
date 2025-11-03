'use server'

import { createServerClient } from '@/lib/supabase/server'
import { createProfileService, type Profile } from '@/services/profile.service'
import { createGroupService, type Group } from '@/services/group.service'
import { createGroupReportService } from '@/services/group-report.service'
import { createReportService, type ReportPeriodType } from '@/services/report.service'

export interface AdminData {
  profiles: Profile[]
  groups: Group[]
}

export interface ReportGenerationResult {
  success: boolean
  message: string
  groupReportsGenerated: number
  individualReportsGenerated: number
  errors?: string[]
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

/**
 * Calculate date range based on period type
 */
function calculateDateRange(periodType: ReportPeriodType): { startDate: string; endDate: string } {
  const today = new Date()
  let startDate: Date
  let endDate: Date = today

  switch (periodType) {
    case 'weekly':
      // Last 7 days
      startDate = new Date(today)
      startDate.setDate(today.getDate() - 7)
      break

    case 'monthly':
      // Current month
      startDate = new Date(today.getFullYear(), today.getMonth(), 1)
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0) // Last day of month
      break

    case 'yearly':
      // Current year
      startDate = new Date(today.getFullYear(), 0, 1)
      endDate = new Date(today.getFullYear(), 11, 31)
      break

    default:
      throw new Error(`Invalid period type: ${periodType}`)
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  }
}

/**
 * Generate reports for all users and groups
 */
export async function generateReports(
  periodType: ReportPeriodType,
): Promise<ReportGenerationResult> {
  try {
    const supabase = createServerClient()
    const groupService = createGroupService(supabase)
    const profileService = createProfileService(supabase)
    const groupReportService = createGroupReportService(supabase)
    const reportService = createReportService(supabase)

    const { startDate, endDate } = calculateDateRange(periodType)

    // Step 1: Generate group reports
    const groups = await groupService.getAllGroups()
    const groupReports = []
    const errors: string[] = []

    for (const group of groups) {
      try {
        const groupReport = await groupReportService.generateGroupReport(
          group.id,
          periodType,
          startDate,
          endDate,
        )
        groupReports.push(groupReport)
      } catch (error) {
        const errorMsg = `Failed to generate report for group ${group.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
        errors.push(errorMsg)
        console.error(errorMsg)
      }
    }

    // Step 2: Generate individual reports
    const profiles = await profileService.getAllProfiles()
    let individualReportsGenerated = 0

    for (const profile of profiles) {
      try {
        await reportService.generateReportForProfile(
          profile.id,
          periodType,
          startDate,
          endDate,
          groupReports,
        )
        individualReportsGenerated++
      } catch (error) {
        const errorMsg = `Failed to generate report for profile ${profile.first_name} ${profile.last_name}: ${error instanceof Error ? error.message : 'Unknown error'}`
        errors.push(errorMsg)
        console.error(errorMsg)
      }
    }

    return {
      success: errors.length === 0,
      message:
        errors.length === 0
          ? `Successfully generated ${groupReports.length} group reports and ${individualReportsGenerated} individual reports!`
          : `Generated reports with ${errors.length} errors. See details below.`,
      groupReportsGenerated: groupReports.length,
      individualReportsGenerated,
      errors: errors.length > 0 ? errors : undefined,
    }
  } catch (error) {
    console.error('Failed to generate reports:', error)
    return {
      success: false,
      message: `Failed to generate reports: ${error instanceof Error ? error.message : 'Unknown error'}`,
      groupReportsGenerated: 0,
      individualReportsGenerated: 0,
    }
  }
}

/**
 * Generate weekly reports (last 7 days)
 */
export async function generateWeeklyReports(): Promise<ReportGenerationResult> {
  return generateReports('weekly')
}

/**
 * Generate monthly reports (current month)
 */
export async function generateMonthlyReports(): Promise<ReportGenerationResult> {
  return generateReports('monthly')
}

/**
 * Generate yearly reports (current year)
 */
export async function generateYearlyReports(): Promise<ReportGenerationResult> {
  return generateReports('yearly')
}
