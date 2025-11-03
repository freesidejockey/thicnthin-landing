import { notFound } from 'next/navigation'
import { getProfileByPin, getReportsByProfileId } from './actions'
import { Header } from '@/components/Header'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ pin: string }>
}

export default async function ReportListPage({ params }: PageProps) {
  const { pin } = await params

  const profileResult = await getProfileByPin(pin)

  if (!profileResult.success || !profileResult.profile) {
    notFound()
  }

  const { profile } = profileResult
  const reportsResult = await getReportsByProfileId(profile.id)

  const reports = reportsResult.success ? reportsResult.reports : []

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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {profile.first_name} {profile.last_name}
            </h1>
            <p className="mt-2 text-lg text-gray-600">Your Progress Reports</p>
            {profile.email && (
              <p className="mt-1 text-sm text-gray-500">{profile.email}</p>
            )}
          </div>

          {reports.length === 0 ? (
            <div className="rounded-lg bg-white p-12 text-center shadow">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No reports yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Reports will appear here once they&apos;re generated.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map(report => (
                <Link
                  key={report.id}
                  href={`/${pin}/${report.id}`}
                  className="block rounded-lg bg-white p-6 shadow transition-all hover:shadow-md hover:scale-[1.01]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                          {getPeriodLabel(report.report_period_type)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(report.period_start_date)} -{' '}
                          {formatDate(report.period_end_date)}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div>
                          <p className="text-xs text-gray-500">Weight Change</p>
                          <p
                            className={`text-lg font-semibold ${
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

                        <div>
                          <p className="text-xs text-gray-500">Check-ins</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {report.total_check_ins || 0} /{' '}
                            {report.possible_check_ins || 0}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Consistency</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {report.check_in_consistency_rate !== null
                              ? `${report.check_in_consistency_rate.toFixed(0)}%`
                              : 'N/A'}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Progress</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {report.progress_to_goal_percentage !== null
                              ? `${report.progress_to_goal_percentage.toFixed(0)}%`
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <svg
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
