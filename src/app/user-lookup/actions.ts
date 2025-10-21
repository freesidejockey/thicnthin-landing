'use server'

import { createServerClient } from '@/lib/supabase/server'

export interface UserLookupFormData {
  email: string
}

export interface FormState {
  success: boolean
  errors?: {
    email?: string[]
    _form?: string[]
  }
  message?: string
  profileCode?: string
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function lookupUserByEmail(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get('email') as string

  // Server-side validation
  const errors: FormState['errors'] = {}

  if (!email || email.trim().length === 0) {
    errors.email = ['Email is required']
  } else if (!validateEmail(email)) {
    errors.email = ['Please enter a valid email address']
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    }
  }

  // Look up profile by email
  try {
    const supabase = createServerClient()

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('profile_code, first_name, last_name')
      .eq('email', email.trim().toLowerCase())
      .single()

    if (profileError || !profile) {
      return {
        success: false,
        errors: {
          email: ['No profile found with this email address. Please check your email and try again.'],
        },
      }
    }

    return {
      success: true,
      message: `Found profile for ${profile.first_name} ${profile.last_name}`,
      profileCode: profile.profile_code,
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
