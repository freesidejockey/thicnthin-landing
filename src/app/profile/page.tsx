'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { submitProfileForm, type FormState } from './actions'
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
      {pending ? 'Submitting...' : 'Create Profile'}
    </button>
  )
}

export default function ProfilePage() {
  const initialState: FormState = { success: false }
  const [formState, formAction] = useFormState(submitProfileForm, initialState)
  const [clientErrors, setClientErrors] = useState<{
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    currentHeight?: string
    currentWeight?: string
    goalWeight?: string
  }>({})

  // Client-side validation
  const validateField = (name: string, value: string) => {
    const errors = { ...clientErrors }

    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          errors.firstName = 'First name is required'
        } else if (value.trim().length < 2) {
          errors.firstName = 'First name must be at least 2 characters'
        } else if (value.trim().length > 50) {
          errors.firstName = 'First name must be less than 50 characters'
        } else {
          delete errors.firstName
        }
        break

      case 'lastName':
        if (!value.trim()) {
          errors.lastName = 'Last name is required'
        } else if (value.trim().length < 2) {
          errors.lastName = 'Last name must be at least 2 characters'
        } else if (value.trim().length > 50) {
          errors.lastName = 'Last name must be less than 50 characters'
        } else {
          delete errors.lastName
        }
        break

      case 'email':
        if (!value.trim()) {
          errors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address'
        } else {
          delete errors.email
        }
        break

      case 'phone':
        if (!value.trim()) {
          errors.phone = 'Phone number is required'
        } else if (!/^[\d\s\-\+\(\)]+$/.test(value) || value.replace(/\D/g, '').length < 10) {
          errors.phone = 'Please enter a valid phone number'
        } else {
          delete errors.phone
        }
        break

      case 'currentHeight':
        if (!value.trim()) {
          errors.currentHeight = 'Current height is required'
        } else if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
          errors.currentHeight = 'Please enter a valid height'
        } else {
          delete errors.currentHeight
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

      case 'goalWeight':
        if (!value.trim()) {
          errors.goalWeight = 'Goal weight is required'
        } else if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
          errors.goalWeight = 'Please enter a valid weight'
        } else {
          delete errors.goalWeight
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
            Create Your Profile
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Fill out the form below to get started on your journey.
          </p>
        </div>

        <form action={formAction} className="mx-auto mt-16 max-w-xl">
          {formState.success && (
            <div className="mb-4 rounded-md bg-green-50 p-4">
              <p className="text-sm font-medium text-green-800">
                {formState.message}
              </p>
              {formState.profileCode && (
                <p className="mt-2 text-lg font-bold text-green-900">
                  Profile Code: {formState.profileCode}
                </p>
              )}
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
            <div className="grid grid-cols-2 gap-x-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  First Name *
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    autoComplete="given-name"
                    required
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
                {(clientErrors.firstName || formState.errors?.firstName) && (
                  <p className="mt-2 text-sm text-red-600">
                    {clientErrors.firstName || formState.errors?.firstName?.[0]}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Last Name *
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    autoComplete="family-name"
                    required
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
                {(clientErrors.lastName || formState.errors?.lastName) && (
                  <p className="mt-2 text-sm text-red-600">
                    {clientErrors.lastName || formState.errors?.lastName?.[0]}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Email *
              </label>
              <div className="mt-2.5">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
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

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Phone *
              </label>
              <div className="mt-2.5">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  autoComplete="tel"
                  required
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
              {(clientErrors.phone || formState.errors?.phone) && (
                <p className="mt-2 text-sm text-red-600">
                  {clientErrors.phone || formState.errors?.phone?.[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="currentHeight"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Current Height (inches) *
              </label>
              <div className="mt-2.5">
                <input
                  type="number"
                  name="currentHeight"
                  id="currentHeight"
                  required
                  step="0.1"
                  min="0"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
              {(clientErrors.currentHeight || formState.errors?.currentHeight) && (
                <p className="mt-2 text-sm text-red-600">
                  {clientErrors.currentHeight || formState.errors?.currentHeight?.[0]}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-4">
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
                  htmlFor="goalWeight"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Goal Weight (lbs) *
                </label>
                <div className="mt-2.5">
                  <input
                    type="number"
                    name="goalWeight"
                    id="goalWeight"
                    required
                    step="0.1"
                    min="0"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
                {(clientErrors.goalWeight || formState.errors?.goalWeight) && (
                  <p className="mt-2 text-sm text-red-600">
                    {clientErrors.goalWeight || formState.errors?.goalWeight?.[0]}
                  </p>
                )}
              </div>
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
