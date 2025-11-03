'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  generateWeeklyReports,
  generateMonthlyReports,
  generateYearlyReports,
  type ReportGenerationResult,
} from './actions'

type ReportType = 'weekly' | 'monthly' | 'yearly'

export function ReportGenerationSection() {
  const [loading, setLoading] = useState<ReportType | null>(null)
  const [result, setResult] = useState<ReportGenerationResult | null>(null)

  const handleGenerateReports = async (type: ReportType) => {
    setLoading(type)
    setResult(null)

    try {
      let generationResult: ReportGenerationResult

      switch (type) {
        case 'weekly':
          generationResult = await generateWeeklyReports()
          break
        case 'monthly':
          generationResult = await generateMonthlyReports()
          break
        case 'yearly':
          generationResult = await generateYearlyReports()
          break
      }

      setResult(generationResult)
    } catch (error) {
      setResult({
        success: false,
        message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        groupReportsGenerated: 0,
        individualReportsGenerated: 0,
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Generate Reports</h2>
      <p className="mb-6 text-sm text-gray-600">
        Generate reports for all users and groups. This will create group reports first, then
        individual reports with group comparisons.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button
          onClick={() => handleGenerateReports('weekly')}
          disabled={loading !== null}
          className="flex-1"
        >
          {loading === 'weekly' ? 'Generating...' : 'Generate Weekly Reports'}
        </Button>

        <Button
          onClick={() => handleGenerateReports('monthly')}
          disabled={loading !== null}
          className="flex-1"
        >
          {loading === 'monthly' ? 'Generating...' : 'Generate Monthly Reports'}
        </Button>

        <Button
          onClick={() => handleGenerateReports('yearly')}
          disabled={loading !== null}
          className="flex-1"
        >
          {loading === 'yearly' ? 'Generating...' : 'Generate Yearly Reports'}
        </Button>
      </div>

      {result && (
        <div
          className={`mt-6 rounded-lg border p-4 ${
            result.success
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          <h3 className="mb-2 font-semibold">
            {result.success ? 'Success!' : 'Generation Complete with Errors'}
          </h3>
          <p className="mb-2">{result.message}</p>

          <div className="mt-3 space-y-1 text-sm">
            <p>
              <strong>Group reports generated:</strong> {result.groupReportsGenerated}
            </p>
            <p>
              <strong>Individual reports generated:</strong> {result.individualReportsGenerated}
            </p>
          </div>

          {result.errors && result.errors.length > 0 && (
            <div className="mt-4">
              <h4 className="mb-2 font-semibold">Errors:</h4>
              <ul className="list-inside list-disc space-y-1 text-sm">
                {result.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
