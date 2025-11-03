'use server'

import { createServerClient } from '@/lib/supabase/server'
import { createReportService } from '@/services/report.service'
import type { Tables } from '@/lib/supabase/database.types'

export type Profile = Tables<'profiles'>
export type Report = Tables<'reports'>
export type ReportGroupComparison = Tables<'report_group_comparisons'>

interface ReportWithComparisons extends Report {
  report_group_comparisons: Array<
    ReportGroupComparison & {
      group_reports: {
        group_id: string
        report_data: any
        groups: {
          name: string
        }
      }
    }
  >
}

export async function getProfileByPin(pin: string) {
  try {
    const supabase = createServerClient()

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('profile_code', pin)
      .single()

    if (error) {
      return {
        success: false,
        error: 'Profile not found',
      }
    }

    return {
      success: true,
      profile,
    }
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while fetching the profile',
    }
  }
}

export async function getReportsByProfileId(profileId: string) {
  try {
    const supabase = createServerClient()
    const reportService = createReportService(supabase)

    const reports = await reportService.getReportsByProfile(profileId)

    return {
      success: true,
      reports,
    }
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while fetching reports',
      reports: [],
    }
  }
}

export async function getReportById(reportId: string) {
  try {
    const supabase = createServerClient()

    const { data: report, error } = await supabase
      .from('reports')
      .select(
        `
        *,
        report_group_comparisons (
          *,
          group_reports (
            group_id,
            report_data,
            groups (
              name
            )
          )
        )
      `,
      )
      .eq('id', reportId)
      .single()

    if (error) {
      return {
        success: false,
        error: 'Report not found',
      }
    }

    return {
      success: true,
      report: report as ReportWithComparisons,
    }
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while fetching the report',
    }
  }
}
