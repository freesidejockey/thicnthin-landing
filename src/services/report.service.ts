import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Tables, TablesInsert, Enums } from '@/lib/supabase/database.types'
import {
  getWeightObjectComparison,
  generateGroupComparisonMessage,
  generatePersonalMessage,
  identifyPeersToShoutout,
  generateShoutoutMessage,
} from './utils/weight-comparisons'

export type Report = Tables<'reports'>
export type ReportGroupComparison = Tables<'report_group_comparisons'>
export type ReportPeriodType = Enums<'report_period_type'>
export type GroupReport = Tables<'group_reports'>

interface CheckInForReport {
  current_weight: number
  check_in_date: string
  cravings_scale: number | null
  calorie_goal_met: string | null
}

export interface ReportService {
  generateReportForProfile(
    profileId: string,
    periodType: ReportPeriodType,
    startDate: string,
    endDate: string,
    groupReports: GroupReport[],
  ): Promise<Report>
  getReportsByProfile(profileId: string, limit?: number): Promise<Report[]>
}

export function createReportService(supabase: SupabaseClient<Database>): ReportService {
  return {
    async generateReportForProfile(
      profileId: string,
      periodType: ReportPeriodType,
      startDate: string,
      endDate: string,
      groupReports: GroupReport[],
    ): Promise<Report> {
      // Get profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single()

      if (profileError) {
        throw new Error(`Failed to fetch profile: ${profileError.message}`)
      }

      // Get check-ins for the period
      const { data: checkIns, error: checkInsError } = await supabase
        .from('check_ins')
        .select('current_weight, check_in_date, cravings_scale, calorie_goal_met')
        .eq('profile_id', profileId)
        .gte('check_in_date', startDate)
        .lte('check_in_date', endDate)
        .order('check_in_date', { ascending: true })

      if (checkInsError) {
        throw new Error(`Failed to fetch check-ins: ${checkInsError.message}`)
      }

      // Calculate metrics
      const metrics = calculateIndividualMetrics(
        checkIns as CheckInForReport[],
        startDate,
        endDate,
        profile.goal_weight,
      )

      // Create personal fun fact
      const funFactWeightObject = getWeightObjectComparison(Math.abs(metrics.weightChange))

      // Generate personal message
      const personalMessage = generatePersonalMessage({
        weightChange: metrics.weightChange,
        checkInConsistency: metrics.checkInConsistencyRate,
        avgCravings: metrics.avgCravingsScale,
        calorieGoalAdherence: metrics.calorieGoalAdherenceRate,
      })

      // Create the report
      const reportData: TablesInsert<'reports'> = {
        profile_id: profileId,
        report_period_type: periodType,
        period_start_date: startDate,
        period_end_date: endDate,
        status: 'completed',
        starting_weight: metrics.startingWeight,
        ending_weight: metrics.endingWeight,
        weight_change: metrics.weightChange,
        total_check_ins: metrics.totalCheckIns,
        possible_check_ins: metrics.possibleCheckIns,
        check_in_consistency_rate: metrics.checkInConsistencyRate,
        avg_cravings_scale: metrics.avgCravingsScale,
        calorie_goal_adherence_rate: metrics.calorieGoalAdherenceRate,
        current_goal_weight: profile.goal_weight,
        progress_to_goal_percentage: metrics.progressToGoalPercentage,
        report_data: {
          fun_fact_weight_object: funFactWeightObject,
          personal_message: personalMessage,
          weight_trend: metrics.weightTrend,
        },
      }

      const { data: report, error: insertError } = await supabase
        .from('reports')
        .insert(reportData)
        .select()
        .single()

      if (insertError) {
        throw new Error(`Failed to create report: ${insertError.message}`)
      }

      // Create group comparisons
      await createGroupComparisons(supabase, report.id, profileId, groupReports, metrics)

      return report
    },

    async getReportsByProfile(profileId: string, limit: number = 10): Promise<Report[]> {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('profile_id', profileId)
        .order('generated_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw new Error(`Failed to fetch reports: ${error.message}`)
      }

      return data || []
    },
  }
}

interface IndividualMetrics {
  startingWeight: number | null
  endingWeight: number | null
  weightChange: number
  totalCheckIns: number
  possibleCheckIns: number
  checkInConsistencyRate: number
  avgCravingsScale: number
  calorieGoalAdherenceRate: number
  progressToGoalPercentage: number
  weightTrend: Array<{ date: string; weight: number }>
}

/**
 * Calculate individual metrics from check-ins
 */
function calculateIndividualMetrics(
  checkIns: CheckInForReport[],
  startDate: string,
  endDate: string,
  goalWeight: number | null,
): IndividualMetrics {
  const totalCheckIns = checkIns.length

  // Calculate possible check-ins (days in period)
  const start = new Date(startDate)
  const end = new Date(endDate)
  const possibleCheckIns = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const startingWeight = checkIns.length > 0 ? checkIns[0].current_weight : null
  const endingWeight = checkIns.length > 0 ? checkIns[checkIns.length - 1].current_weight : null
  const weightChange =
    startingWeight !== null && endingWeight !== null ? endingWeight - startingWeight : 0

  // Check-in consistency rate
  const checkInConsistencyRate = (totalCheckIns / possibleCheckIns) * 100

  // Average cravings scale
  const cravingsData = checkIns.filter(c => c.cravings_scale !== null)
  const avgCravingsScale =
    cravingsData.length > 0
      ? cravingsData.reduce((sum, c) => sum + (c.cravings_scale || 0), 0) / cravingsData.length
      : 0

  // Calorie goal adherence rate
  const calorieGoalData = checkIns.filter(c => c.calorie_goal_met !== null)
  const calorieGoalMet = calorieGoalData.filter(c => c.calorie_goal_met === 'yes').length
  const calorieGoalAdherenceRate =
    calorieGoalData.length > 0 ? (calorieGoalMet / calorieGoalData.length) * 100 : 0

  // Progress to goal percentage
  let progressToGoalPercentage = 0
  if (startingWeight && goalWeight && endingWeight) {
    const totalWeightToLose = startingWeight - goalWeight
    const weightLostSoFar = startingWeight - endingWeight
    if (totalWeightToLose > 0) {
      progressToGoalPercentage = (weightLostSoFar / totalWeightToLose) * 100
    }
  }

  // Weight trend
  const weightTrend = checkIns.map(c => ({
    date: c.check_in_date,
    weight: c.current_weight,
  }))

  return {
    startingWeight,
    endingWeight,
    weightChange,
    totalCheckIns,
    possibleCheckIns,
    checkInConsistencyRate,
    avgCravingsScale,
    calorieGoalAdherenceRate,
    progressToGoalPercentage,
    weightTrend,
  }
}

/**
 * Create group comparisons for a report
 */
async function createGroupComparisons(
  supabase: SupabaseClient<Database>,
  reportId: string,
  profileId: string,
  groupReports: GroupReport[],
  metrics: IndividualMetrics,
): Promise<void> {
  // Get user's groups
  const { data: userGroups, error: groupsError } = await supabase
    .from('group_members')
    .select('group_id')
    .eq('profile_id', profileId)

  if (groupsError) {
    throw new Error(`Failed to fetch user groups: ${groupsError.message}`)
  }

  const userGroupIds = new Set(userGroups?.map(g => g.group_id) || [])

  // Filter group reports for this user's groups
  const relevantGroupReports = groupReports.filter(gr => userGroupIds.has(gr.group_id))

  // Create comparisons for each group
  const comparisons: TablesInsert<'report_group_comparisons'>[] = []

  for (const groupReport of relevantGroupReports) {
    const memberRankings = (groupReport.report_data as any)?.member_rankings || []
    const userRanking = memberRankings.find(
      (r: any) => r.profile_id === profileId,
    )

    const userRank = userRanking?.rank || memberRankings.length + 1
    const isTopPerformer = groupReport.top_performer_profile_id === profileId
    const totalMembers = groupReport.total_member_count || 0

    // Calculate percentile
    const weightLostPercentile =
      totalMembers > 0 ? ((totalMembers - userRank + 1) / totalMembers) * 100 : 0

    // Generate comparison message
    const comparisonMessage = generateGroupComparisonMessage({
      userRank,
      totalMembers,
      isTopPerformer,
      weightLost: Math.abs(metrics.weightChange),
      groupTotalWeightLost: groupReport.total_weight_lost || 0,
    })

    // Get group name for context
    const { data: group } = await supabase
      .from('groups')
      .select('name')
      .eq('id', groupReport.group_id)
      .single()

    // Identify peers to shoutout
    // weight_change: negative = loss (good), positive = gain (not for shoutout)
    // Only pass the absolute value if they actually lost weight (negative change)
    const peersToShoutout = identifyPeersToShoutout(
      memberRankings.map((r: any) => {
        const weightChange = r.weight_change ?? 0
        return {
          profileId: r.profile_id,
          firstName: r.name.split(' ')[0],
          lastName: r.name.split(' ').slice(1).join(' '),
          weightLost: weightChange < 0 ? Math.abs(weightChange) : 0,
        }
      }),
      profileId,
      2,
    )

    const shoutoutMessages = peersToShoutout.map(peer => generateShoutoutMessage(peer))

    const comparison: TablesInsert<'report_group_comparisons'> = {
      report_id: reportId,
      group_report_id: groupReport.id,
      user_rank_in_group: userRank,
      weight_lost_percentile: weightLostPercentile,
      is_top_performer: isTopPerformer,
      comparison_notes: {
        group_name: group?.name || 'Unknown Group',
        comparison_message: comparisonMessage,
        shoutouts: shoutoutMessages,
        group_total_weight_lost: groupReport.total_weight_lost,
        group_fun_fact: (groupReport.report_data as any)?.fun_fact_weight_object || '',
      },
    }

    comparisons.push(comparison)
  }

  if (comparisons.length > 0) {
    const { error: insertError } = await supabase
      .from('report_group_comparisons')
      .insert(comparisons)

    if (insertError) {
      throw new Error(`Failed to create group comparisons: ${insertError.message}`)
    }
  }
}
