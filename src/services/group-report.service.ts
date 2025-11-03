import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Tables, TablesInsert, Enums } from '@/lib/supabase/database.types'
import { getWeightObjectComparison } from './utils/weight-comparisons'

export type GroupReport = Tables<'group_reports'>
export type ReportPeriodType = Enums<'report_period_type'>

interface CheckInData {
  profile_id: string
  current_weight: number
  check_in_date: string
  first_name: string | null
  last_name: string | null
}

interface MemberPerformance {
  profileId: string
  firstName: string
  lastName: string
  startingWeight: number | null
  endingWeight: number | null
  weightChange: number
  checkInCount: number
}

export interface GroupReportService {
  generateGroupReport(
    groupId: string,
    periodType: ReportPeriodType,
    startDate: string,
    endDate: string,
  ): Promise<GroupReport>
  getGroupReport(
    groupId: string,
    periodType: ReportPeriodType,
    startDate: string,
  ): Promise<GroupReport | null>
}

export function createGroupReportService(
  supabase: SupabaseClient<Database>,
): GroupReportService {
  return {
    async generateGroupReport(
      groupId: string,
      periodType: ReportPeriodType,
      startDate: string,
      endDate: string,
    ): Promise<GroupReport> {
      // Get all group members
      const { data: members, error: membersError } = await supabase
        .from('group_members')
        .select('profile_id, profiles!inner(id, first_name, last_name)')
        .eq('group_id', groupId)

      if (membersError) {
        throw new Error(`Failed to fetch group members: ${membersError.message}`)
      }

      const totalMemberCount = members?.length || 0

      // Get all check-ins for group members in the period
      const memberIds = members?.map(m => m.profile_id) || []

      if (memberIds.length === 0) {
        // No members, create empty report
        const emptyReport: TablesInsert<'group_reports'> = {
          group_id: groupId,
          report_period_type: periodType,
          period_start_date: startDate,
          period_end_date: endDate,
          status: 'completed',
          total_member_count: 0,
          active_member_count: 0,
          total_check_ins: 0,
          total_weight_lost: 0,
          avg_weight_lost_per_member: 0,
          participation_rate: 0,
          group_consistency_score: 0,
          report_data: {},
        }

        const { data: report, error: insertError } = await supabase
          .from('group_reports')
          .insert(emptyReport)
          .select()
          .single()

        if (insertError) {
          throw new Error(`Failed to create empty group report: ${insertError.message}`)
        }

        return report
      }

      // Get check-ins for the period
      const { data: checkIns, error: checkInsError } = await supabase
        .from('check_ins')
        .select(
          `
          profile_id,
          current_weight,
          check_in_date,
          profiles!inner(first_name, last_name)
        `,
        )
        .in('profile_id', memberIds)
        .gte('check_in_date', startDate)
        .lte('check_in_date', endDate)
        .order('check_in_date', { ascending: true })

      if (checkInsError) {
        throw new Error(`Failed to fetch check-ins: ${checkInsError.message}`)
      }

      // Calculate member performances
      const memberPerformances = calculateMemberPerformances(checkIns as any[], memberIds)

      // Calculate group metrics
      const activeMemberCount = memberPerformances.filter(m => m.checkInCount > 0).length
      const totalCheckIns = memberPerformances.reduce((sum, m) => sum + m.checkInCount, 0)
      const totalWeightLost = memberPerformances
        .filter(m => m.weightChange < 0)
        .reduce((sum, m) => sum + Math.abs(m.weightChange), 0)

      const avgWeightLostPerMember =
        activeMemberCount > 0 ? totalWeightLost / activeMemberCount : 0
      const participationRate = (activeMemberCount / totalMemberCount) * 100
      const groupConsistencyScore = calculateGroupConsistencyScore(
        memberPerformances,
        startDate,
        endDate,
      )

      // Find top performer
      const topPerformer = memberPerformances.reduce((best, current) => {
        if (!best || Math.abs(current.weightChange) > Math.abs(best.weightChange)) {
          return current
        }
        return best
      }, null as MemberPerformance | null)

      // Generate member rankings for report_data
      // Sort by weight change (negative is weight loss, which is better)
      const memberRankings = memberPerformances
        .filter(m => m.checkInCount > 0)
        .sort((a, b) => a.weightChange - b.weightChange)
        .map((m, index) => ({
          profile_id: m.profileId,
          name: `${m.firstName || ''} ${m.lastName || ''}`.trim(),
          weight_change: m.weightChange,
          rank: index + 1,
        }))

      const funFactWeightObject = getWeightObjectComparison(totalWeightLost)

      // Create the group report
      const groupReportData: TablesInsert<'group_reports'> = {
        group_id: groupId,
        report_period_type: periodType,
        period_start_date: startDate,
        period_end_date: endDate,
        status: 'completed',
        total_member_count: totalMemberCount,
        active_member_count: activeMemberCount,
        total_check_ins: totalCheckIns,
        total_weight_lost: totalWeightLost,
        avg_weight_lost_per_member: avgWeightLostPerMember,
        participation_rate: participationRate,
        group_consistency_score: groupConsistencyScore,
        top_performer_profile_id: topPerformer?.profileId || null,
        top_performer_name: topPerformer
          ? `${topPerformer.firstName || ''} ${topPerformer.lastName || ''}`.trim()
          : null,
        top_performer_weight_lost: topPerformer ? Math.abs(topPerformer.weightChange) : null,
        report_data: {
          member_rankings: memberRankings,
          fun_fact_weight_object: funFactWeightObject,
        },
      }

      const { data: report, error: insertError } = await supabase
        .from('group_reports')
        .insert(groupReportData)
        .select()
        .single()

      if (insertError) {
        throw new Error(`Failed to create group report: ${insertError.message}`)
      }

      return report
    },

    async getGroupReport(
      groupId: string,
      periodType: ReportPeriodType,
      startDate: string,
    ): Promise<GroupReport | null> {
      const { data, error } = await supabase
        .from('group_reports')
        .select('*')
        .eq('group_id', groupId)
        .eq('report_period_type', periodType)
        .eq('period_start_date', startDate)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        throw new Error(`Failed to fetch group report: ${error.message}`)
      }

      return data
    },
  }
}

/**
 * Calculate performance metrics for each member
 */
function calculateMemberPerformances(
  checkIns: CheckInData[],
  memberIds: string[],
): MemberPerformance[] {
  const performanceMap = new Map<string, MemberPerformance>()

  // Initialize all members
  memberIds.forEach(id => {
    performanceMap.set(id, {
      profileId: id,
      firstName: '',
      lastName: '',
      startingWeight: null,
      endingWeight: null,
      weightChange: 0,
      checkInCount: 0,
    })
  })

  // Process check-ins
  checkIns.forEach(checkIn => {
    const perf = performanceMap.get(checkIn.profile_id)
    if (!perf) return

    // Update name from first check-in
    if (!perf.firstName && checkIn.first_name) {
      perf.firstName = checkIn.first_name
      perf.lastName = checkIn.last_name || ''
    }

    perf.checkInCount++

    // Set starting weight (first check-in)
    if (perf.startingWeight === null) {
      perf.startingWeight = checkIn.current_weight
    }

    // Always update ending weight (last check-in)
    perf.endingWeight = checkIn.current_weight
  })

  // Calculate weight change
  performanceMap.forEach(perf => {
    if (perf.startingWeight !== null && perf.endingWeight !== null) {
      perf.weightChange = perf.endingWeight - perf.startingWeight
    }
  })

  return Array.from(performanceMap.values())
}

/**
 * Calculate group consistency score (avg check-ins per member per week)
 */
function calculateGroupConsistencyScore(
  performances: MemberPerformance[],
  startDate: string,
  endDate: string,
): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const daysInPeriod = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const weeksInPeriod = daysInPeriod / 7

  const totalCheckIns = performances.reduce((sum, p) => sum + p.checkInCount, 0)
  const activeMemberCount = performances.filter(p => p.checkInCount > 0).length

  if (activeMemberCount === 0 || weeksInPeriod === 0) return 0

  return totalCheckIns / activeMemberCount / weeksInPeriod
}
