import { notFound } from 'next/navigation'
import { getProfileByPin, getReportById } from '../actions'
import { Header } from '@/components/Header'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'

interface PageProps {
  params: Promise<{ pin: string; reportId: string }>
}

export default async function ReportDetailPage({ params }: PageProps) {
  const { pin, reportId } = await params

  const profileResult = await getProfileByPin(pin)

  if (!profileResult.success || !profileResult.profile) {
    notFound()
  }

  const { profile } = profileResult
  const reportResult = await getReportById(reportId)

  if (!reportResult.success || !reportResult.report) {
    notFound()
  }

  // Verify the report belongs to this profile
  if (reportResult.report.profile_id !== profile.id) {
    notFound()
  }

  const { report } = reportResult

  // Fetch profile names for leaderboard members
  const supabase = createServerClient()
  const allProfileIds: string[] = []

  report.report_group_comparisons?.forEach(comparison => {
    const groupReportData = comparison.group_reports?.report_data as any
    const memberRankings = groupReportData?.member_rankings || []
    memberRankings.forEach((member: any) => {
      if (member.profile_id && !allProfileIds.includes(member.profile_id)) {
        allProfileIds.push(member.profile_id)
      }
    })
  })

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, first_name')
    .in('id', allProfileIds)

  const profileMap = new Map(profiles?.map(p => [p.id, p.first_name]) || [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getPeriodLabel = (periodType: string) => {
    return periodType.charAt(0).toUpperCase() + periodType.slice(1)
  }

  const reportData = report.report_data as any

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href={`/${pin}`}
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 mb-4"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Reports
            </Link>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {getPeriodLabel(report.report_period_type)} Report
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              {formatDate(report.period_start_date)} -{' '}
              {formatDate(report.period_end_date)}
            </p>
          </div>

          {/* Personal Progress Section */}
          <div className="mb-8 rounded-lg bg-white p-8 shadow">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Your Progress
            </h2>

            {/* Key Metrics Grid */}
            <div className="mb-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-600">Weight Change</p>
                <p
                  className={`mt-1 text-2xl font-bold ${
                    (report.weight_change || 0) < 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {report.weight_change !== null
                    ? `${report.weight_change > 0 ? '+' : ''}${report.weight_change.toFixed(1)} lbs`
                    : 'N/A'}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-600">Check-in Rate</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {report.check_in_consistency_rate !== null
                    ? `${report.check_in_consistency_rate.toFixed(0)}%`
                    : 'N/A'}
                </p>
                <p className="text-xs text-gray-500">
                  {report.total_check_ins} / {report.possible_check_ins} days
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-600">Calorie Goal</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {report.calorie_goal_adherence_rate !== null
                    ? `${report.calorie_goal_adherence_rate.toFixed(0)}%`
                    : 'N/A'}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-600">Avg Cravings</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {report.avg_cravings_scale !== null
                    ? report.avg_cravings_scale.toFixed(1)
                    : 'N/A'}
                </p>
                <p className="text-xs text-gray-500">out of 10</p>
              </div>
            </div>

            {/* Weight Progress */}
            <div className="mb-6 rounded-lg bg-blue-50 p-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Weight Journey
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Starting Weight</p>
                  <p className="text-xl font-bold text-gray-900">
                    {report.starting_weight !== null
                      ? `${report.starting_weight.toFixed(1)} lbs`
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ending Weight</p>
                  <p className="text-xl font-bold text-gray-900">
                    {report.ending_weight !== null
                      ? `${report.ending_weight.toFixed(1)} lbs`
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Goal Weight</p>
                  <p className="text-xl font-bold text-gray-900">
                    {report.current_goal_weight !== null
                      ? `${report.current_goal_weight.toFixed(1)} lbs`
                      : 'N/A'}
                  </p>
                </div>
              </div>
              {report.progress_to_goal_percentage !== null && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress to Goal</span>
                    <span className="font-semibold text-blue-700">
                      {report.progress_to_goal_percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-blue-600 transition-all"
                      style={{
                        width: `${Math.min(100, Math.max(0, report.progress_to_goal_percentage))}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Fun Fact */}
            {reportData?.fun_fact_weight_object && (
              <div className="rounded-lg bg-purple-50 p-4">
                <p className="text-sm font-medium text-purple-900">
                  Fun Fact
                </p>
                <p className="mt-1 text-lg text-purple-800">
                  You lost the equivalent of {reportData.fun_fact_weight_object}
                </p>
              </div>
            )}

            {/* Personal Message */}
            {reportData?.personal_message && (
              <div className="mt-6 rounded-lg bg-green-50 p-6">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Your Summary
                </h3>
                <p className="text-gray-700">{reportData.personal_message}</p>
              </div>
            )}
          </div>

          {/* Group Comparisons Section */}
          {report.report_group_comparisons &&
            report.report_group_comparisons.length > 0 && (
              <div className="rounded-lg bg-white p-8 shadow">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  Group Performance
                </h2>

                <div className="space-y-6">
                  {report.report_group_comparisons.map(comparison => {
                    const comparisonNotes = comparison.comparison_notes as any
                    const groupName =
                      comparison.group_reports?.groups?.name ||
                      comparisonNotes?.group_name ||
                      'Unknown Group'

                    return (
                      <div
                        key={comparison.id}
                        className="rounded-lg border border-gray-200 p-6"
                      >
                        <div className="mb-4 flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {groupName}
                            </h3>
                            {comparison.is_top_performer && (
                              <span className="mt-2 inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                                Top Performer
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Your Rank</p>
                            <p className="text-3xl font-bold text-blue-600">
                              #{comparison.user_rank_in_group}
                            </p>
                          </div>
                        </div>

                        {/* Group Stats */}
                        <div className="mb-4 grid grid-cols-2 gap-4">
                          <div className="rounded-lg bg-gray-50 p-4">
                            <p className="text-sm text-gray-600">Percentile</p>
                            <p className="text-xl font-bold text-gray-900">
                              {comparison.weight_lost_percentile !== null
                                ? `${comparison.weight_lost_percentile.toFixed(0)}%`
                                : 'N/A'}
                            </p>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-4">
                            <p className="text-sm text-gray-600">
                              Group Total Lost
                            </p>
                            <p className="text-xl font-bold text-green-600">
                              {comparisonNotes?.group_total_weight_lost
                                ? `${comparisonNotes.group_total_weight_lost.toFixed(1)} lbs`
                                : 'N/A'}
                            </p>
                          </div>
                        </div>

                        {/* Comparison Message */}
                        {comparisonNotes?.comparison_message && (
                          <div className="mb-4 rounded-lg bg-blue-50 p-4">
                            <p className="text-sm text-gray-900">
                              {comparisonNotes.comparison_message}
                            </p>
                          </div>
                        )}

                        {/* Leaderboard */}
                        {comparison.group_reports?.report_data && (
                          (() => {
                            const groupReportData = comparison.group_reports.report_data as any
                            const memberRankings = groupReportData?.member_rankings || []

                            if (memberRankings.length > 0) {
                              return (
                                <div className="mb-4 rounded-lg bg-gray-50 p-4">
                                  <h4 className="mb-3 text-sm font-semibold text-gray-900">
                                    Leaderboard
                                  </h4>
                                  <div className="space-y-2">
                                    {memberRankings.map((member: any, index: number) => {
                                      const isCurrentUser = member.profile_id === report.profile_id
                                      const firstName = profileMap.get(member.profile_id)
                                      // Use the same logic as "Your Progress" section
                                      // weight_change: negative = loss, positive = gain
                                      const weightChange = member.weight_change ?? 0

                                      return (
                                        <div
                                          key={member.profile_id}
                                          className={`flex items-center justify-between rounded-md p-3 ${
                                            isCurrentUser
                                              ? 'bg-blue-100 border border-blue-300'
                                              : 'bg-white'
                                          }`}
                                        >
                                          <div className="flex items-center gap-3">
                                            <span
                                              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                                                index === 0
                                                  ? 'bg-yellow-400 text-yellow-900'
                                                  : index === 1
                                                    ? 'bg-gray-300 text-gray-700'
                                                    : index === 2
                                                      ? 'bg-orange-300 text-orange-900'
                                                      : 'bg-gray-200 text-gray-600'
                                              }`}
                                            >
                                              {member.rank}
                                            </span>
                                            <span
                                              className={`text-sm ${
                                                isCurrentUser
                                                  ? 'font-semibold text-blue-900'
                                                  : 'text-gray-700'
                                              }`}
                                            >
                                              {isCurrentUser ? 'You' : firstName || 'Anonymous'}
                                            </span>
                                          </div>
                                          <span
                                            className={`text-sm font-semibold ${
                                              weightChange < 0
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                            }`}
                                          >
                                            {weightChange !== null
                                              ? `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} lbs`
                                              : 'N/A'}
                                          </span>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              )
                            }
                            return null
                          })()
                        )}

                        {/* Group Fun Fact */}
                        {comparisonNotes?.group_fun_fact && (
                          <div className="mb-4 rounded-lg bg-purple-50 p-4">
                            <p className="text-sm font-medium text-purple-900">
                              Group Fun Fact
                            </p>
                            <p className="mt-1 text-sm text-purple-800">
                              The group lost the equivalent of {comparisonNotes.group_fun_fact}
                            </p>
                          </div>
                        )}

                        {/* Shoutouts */}
                        {comparisonNotes?.shoutouts &&
                          comparisonNotes.shoutouts.length > 0 && (
                            <div className="rounded-lg bg-green-50 p-4">
                              <p className="mb-2 text-sm font-medium text-green-900">
                                Shoutouts
                              </p>
                              <ul className="space-y-1">
                                {comparisonNotes.shoutouts.map(
                                  (shoutout: string, index: number) => (
                                    <li
                                      key={index}
                                      className="text-sm text-green-800"
                                    >
                                      {shoutout}
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  )
}
