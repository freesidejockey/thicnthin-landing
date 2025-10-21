'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { lookupUserByEmail, type FormState } from './actions'
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
      {pending ? 'Searching...' : 'Look Up Profile'}
    </button>
  )
}

export default function UserLookupPage() {
  const initialState: FormState = { success: false }
  const [formState, formAction] = useFormState(lookupUserByEmail, initialState)
  const [clientErrors, setClientErrors] = useState<{
    email?: string
  }>({})

  // Client-side validation
  const validateField = (name: string, value: string) => {
    const errors = { ...clientErrors }

    switch (name) {
      case 'email':
        if (!value.trim()) {
          errors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address'
        } else {
          delete errors.email
        }
        break
    }

    setClientErrors(errors)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validateField(e.target.name, e.target.value)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            Find Your Profile Code
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Enter your email address to retrieve your profile code.
          </p>
        </div>

        <form action={formAction} className="mx-auto mt-16 max-w-xl">
          {formState.success && formState.profileCode && (
            <div className="mb-4 rounded-md bg-green-50 p-6 border border-green-200">
              <p className="text-sm font-medium text-green-800 mb-3">
                {formState.message}
              </p>
              <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                <p className="text-sm text-gray-600 mb-1">Your Profile Code:</p>
                <p className="text-4xl font-bold text-green-900 tracking-wider">
                  {formState.profileCode}
                </p>
              </div>
              <p className="text-sm text-green-700 mt-3">
                Save this code to check in and track your progress.
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
                htmlFor="email"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Email Address *
              </label>
              <div className="mt-2.5">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
              {(clientErrors.email || formState.errors?.email) && (
                <p className="mt-2 text-sm text-red-600">
                  {clientErrors.email || formState.errors?.email?.[0]}
                </p>
              )}
            </div>

            <div className="mt-4 mb-8 sm:mb-0">
              <SubmitButton />
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900 font-semibold mb-2">
              Don&apos;t have a profile yet?
            </p>
            <p className="text-sm text-blue-800">
              <a href="/profile" className="underline hover:text-blue-600">
                Create your profile
              </a>{' '}
              to get started on your journey.
            </p>
          </div>
        </form>
      </div>
    </>
  )
}
