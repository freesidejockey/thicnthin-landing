'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { submitCheckInForm, type FormState, type CalorieGoalStatus } from './actions'
import { useState } from 'react'
import { Header } from '@/components/Header'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Submitting...' : 'Submit Check-In'}
    </button>
  )
}

export default function CheckInPage() {
  const initialState: FormState = { success: false }
  const [formState, formAction] = useFormState(submitCheckInForm, initialState)
  const [clientErrors, setClientErrors] = useState<{
    profileCode?: string
    currentWeight?: string
    cravingsScale?: string
    calorieGoalMet?: string
  }>({})

  // Client-side validation
  const validateField = (name: string, value: string) => {
    const errors = { ...clientErrors }

    switch (name) {
      case 'profileCode':
        if (!value.trim()) {
          errors.profileCode = 'Profile code is required'
        } else if (!/^\d{4}$/.test(value.trim())) {
          errors.profileCode = 'Profile code must be a 4-digit number'
        } else {
          delete errors.profileCode
        }
        break

      case 'currentWeight':
        if (!value.trim()) {
          errors.currentWeight = 'Current weight is required'
        } else if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
          errors.currentWeight = 'Please enter a valid weight'
        } else {
          delete errors.currentWeight
        }
        break

      case 'cravingsScale':
        if (!value.trim()) {
          errors.cravingsScale = 'Cravings scale is required'
        } else {
          const scale = parseInt(value)
          if (isNaN(scale) || scale < 1 || scale > 5) {
            errors.cravingsScale = 'Cravings scale must be between 1 and 5'
          } else {
            delete errors.cravingsScale
          }
        }
        break

      case 'calorieGoalMet':
        if (!value) {
          errors.calorieGoalMet = 'Calorie goal status is required'
        } else {
          delete errors.calorieGoalMet
        }
        break
    }

    setClientErrors(errors)
  }

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    validateField(e.target.name, e.target.value)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    // Clear error on change if field was previously invalid
    if (clientErrors[e.target.name as keyof typeof clientErrors]) {
      validateField(e.target.name, e.target.value)
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Daily Check-In
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Track your progress and stay accountable to your goals.
          </p>
        </div>

        <form action={formAction} className="mx-auto mt-16 max-w-xl">
          {formState.success && (
            <div className="mb-4 rounded-md bg-green-50 p-4">
              <p className="text-sm font-medium text-green-800">
                {formState.message}
              </p>
            </div>
          )}

          {formState.errors?._form && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">
                {formState.errors._form[0]}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-y-6">
            <div>
              <label
                htmlFor="profileCode"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Profile Code *
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="profileCode"
                  id="profileCode"
                  required
                  maxLength={4}
                  pattern="\d{4}"
                  placeholder="Enter your 4-digit code"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
              {(clientErrors.profileCode || formState.errors?.profileCode) && (
                <p className="mt-2 text-sm text-red-600">
                  {clientErrors.profileCode || formState.errors?.profileCode?.[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="currentWeight"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Current Weight (lbs) *
              </label>
              <div className="mt-2.5">
                <input
                  type="number"
                  name="currentWeight"
                  id="currentWeight"
                  required
                  step="0.1"
                  min="0"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
              {(clientErrors.currentWeight || formState.errors?.currentWeight) && (
                <p className="mt-2 text-sm text-red-600">
                  {clientErrors.currentWeight || formState.errors?.currentWeight?.[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="cravingsScale"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Cravings Level (Last 24 Hours) *
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Rate your cravings from 1 (minimal) to 5 (intense)
              </p>
              <div className="mt-2.5">
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label
                      key={value}
                      className="flex flex-1 items-center justify-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="cravingsScale"
                        value={value}
                        required
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-300 text-sm font-semibold text-gray-700 peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-checked:text-white hover:border-blue-400 transition-colors">
                        {value}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              {(clientErrors.cravingsScale || formState.errors?.cravingsScale) && (
                <p className="mt-2 text-sm text-red-600">
                  {clientErrors.cravingsScale || formState.errors?.cravingsScale?.[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="calorieGoalMet"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Calorie Goal Status *
              </label>
              <div className="mt-2.5">
                <select
                  name="calorieGoalMet"
                  id="calorieGoalMet"
                  required
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                  <option value="">Select an option</option>
                  <option value="yes">Yes - Met my calorie goal</option>
                  <option value="no">No - Exceeded my calorie goal</option>
                  <option value="did_not_track">Did not track calories</option>
                  <option value="no_calorie_goal">No calorie goal set</option>
                </select>
              </div>
              {(clientErrors.calorieGoalMet || formState.errors?.calorieGoalMet) && (
                <p className="mt-2 text-sm text-red-600">
                  {clientErrors.calorieGoalMet || formState.errors?.calorieGoalMet?.[0]}
                </p>
              )}
            </div>

            <div className="mt-4 mb-8 sm:mb-0">
              <SubmitButton />
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
