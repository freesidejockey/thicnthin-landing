'use server'

import { createServerClient } from '@/lib/supabase/server'

export interface ContactFormData {
  name: string
  email: string
  message: string
}

export interface FormState {
  success: boolean
  errors?: {
    name?: string[]
    email?: string[]
    message?: string[]
    _form?: string[]
  }
  message?: string
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function submitContactForm(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const message = formData.get('message') as string

  // Server-side validation
  const errors: FormState['errors'] = {}

  if (!name || name.trim().length === 0) {
    errors.name = ['Name is required']
  } else if (name.trim().length < 2) {
    errors.name = ['Name must be at least 2 characters']
  } else if (name.trim().length > 100) {
    errors.name = ['Name must be less than 100 characters']
  }

  if (!email || email.trim().length === 0) {
    errors.email = ['Email is required']
  } else if (!validateEmail(email)) {
    errors.email = ['Please enter a valid email address']
  }

  if (!message || message.trim().length === 0) {
    errors.message = ['Message is required']
  } else if (message.trim().length < 10) {
    errors.message = ['Message must be at least 10 characters']
  } else if (message.trim().length > 1000) {
    errors.message = ['Message must be less than 1000 characters']
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    }
  }

  // Insert into Supabase
  try {
    const supabase = createServerClient()
    const { error } = await supabase.from('contact_submissions').insert({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    })

    if (error) {
      console.error('Supabase error:', error)
      return {
        success: false,
        errors: {
          _form: ['Failed to submit form. Please try again.'],
        },
      }
    }

    return {
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      errors: {
        _form: ['An unexpected error occurred. Please try again.'],
      },
    }
  }
}
