'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { submitContactForm, type FormState } from './actions'
import { useState } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  )
}

export default function ContactPage() {
  const initialState: FormState = { success: false }
  const [formState, formAction] = useFormState(submitContactForm, initialState)
  const [clientErrors, setClientErrors] = useState<{
    name?: string
    email?: string
    message?: string
  }>({})

  // Client-side validation
  const validateField = (name: string, value: string) => {
    const errors = { ...clientErrors }

    switch (name) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Name is required'
        } else if (value.trim().length < 2) {
          errors.name = 'Name must be at least 2 characters'
        } else if (value.trim().length > 100) {
          errors.name = 'Name must be less than 100 characters'
        } else {
          delete errors.name
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

      case 'message':
        if (!value.trim()) {
          errors.message = 'Message is required'
        } else if (value.trim().length < 10) {
          errors.message = 'Message must be at least 10 characters'
        } else if (value.trim().length > 1000) {
          errors.message = 'Message must be less than 1000 characters'
        } else {
          delete errors.message
        }
        break
    }

    setClientErrors(errors)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    validateField(e.target.name, e.target.value)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Clear error on change if field was previously invalid
    if (clientErrors[e.target.name as keyof typeof clientErrors]) {
      validateField(e.target.name, e.target.value)
    }
  }

  return (
    <div className="min-h-screen bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Contact Us
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Send us a message and we&apos;ll get back to you as soon as possible.
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
              htmlFor="name"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="name"
                id="name"
                autoComplete="name"
                onBlur={handleBlur}
                onChange={handleChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
            {(clientErrors.name || formState.errors?.name) && (
              <p className="mt-2 text-sm text-red-600">
                {clientErrors.name || formState.errors?.name?.[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Email
            </label>
            <div className="mt-2.5">
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
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
              htmlFor="message"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Message
            </label>
            <div className="mt-2.5">
              <textarea
                name="message"
                id="message"
                rows={4}
                onBlur={handleBlur}
                onChange={handleChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
            {(clientErrors.message || formState.errors?.message) && (
              <p className="mt-2 text-sm text-red-600">
                {clientErrors.message || formState.errors?.message?.[0]}
              </p>
            )}
          </div>

          <div className="mt-4 mb-8 sm:mb-0">
            <SubmitButton />
          </div>
        </div>
      </form>
    </div>
  )
}
