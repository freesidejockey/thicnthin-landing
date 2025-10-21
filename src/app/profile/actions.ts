'use server'

import { createServerClient } from '@/lib/supabase/server'

export interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  currentHeight: string
  currentWeight: string
  goalWeight: string
}

export interface FormState {
  success: boolean
  errors?: {
    firstName?: string[]
    lastName?: string[]
    email?: string[]
    phone?: string[]
    currentHeight?: string[]
    currentWeight?: string[]
    goalWeight?: string[]
    _form?: string[]
  }
  message?: string
  profileCode?: string
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePhone(phone: string): boolean {
  // Basic phone validation - adjust based on your requirements
  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

function generateProfileCode(): string {
  // Generate a random 4-digit code
  return Math.floor(1000 + Math.random() * 9000).toString()
}

async function ensureUniqueProfileCode(supabase: any): Promise<string> {
  let code = generateProfileCode()
  let attempts = 0
  const maxAttempts = 10

  while (attempts < maxAttempts) {
    const { data, error } = await supabase
      .from('profiles')
      .select('profile_code')
      .eq('profile_code', code)
      .single()

    if (error && error.code === 'PGRST116') {
      // No row found - code is unique
      return code
    }

    // Code exists, generate a new one
    code = generateProfileCode()
    attempts++
  }

  // If we've exhausted attempts, throw an error
  throw new Error('Unable to generate unique profile code')
}

export async function submitProfileForm(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const currentHeight = formData.get('currentHeight') as string
  const currentWeight = formData.get('currentWeight') as string
  const goalWeight = formData.get('goalWeight') as string

  // Server-side validation
  const errors: FormState['errors'] = {}

  if (!firstName || firstName.trim().length === 0) {
    errors.firstName = ['First name is required']
  } else if (firstName.trim().length < 2) {
    errors.firstName = ['First name must be at least 2 characters']
  } else if (firstName.trim().length > 50) {
    errors.firstName = ['First name must be less than 50 characters']
  }

  if (!lastName || lastName.trim().length === 0) {
    errors.lastName = ['Last name is required']
  } else if (lastName.trim().length < 2) {
    errors.lastName = ['Last name must be at least 2 characters']
  } else if (lastName.trim().length > 50) {
    errors.lastName = ['Last name must be less than 50 characters']
  }

  if (!email || email.trim().length === 0) {
    errors.email = ['Email is required']
  } else if (!validateEmail(email)) {
    errors.email = ['Please enter a valid email address']
  }

  if (!phone || phone.trim().length === 0) {
    errors.phone = ['Phone number is required']
  } else if (!validatePhone(phone)) {
    errors.phone = ['Please enter a valid phone number']
  }

  if (!currentHeight || currentHeight.trim().length === 0) {
    errors.currentHeight = ['Current height is required']
  } else if (isNaN(parseFloat(currentHeight)) || parseFloat(currentHeight) <= 0) {
    errors.currentHeight = ['Please enter a valid height']
  }

  if (!currentWeight || currentWeight.trim().length === 0) {
    errors.currentWeight = ['Current weight is required']
  } else if (isNaN(parseFloat(currentWeight)) || parseFloat(currentWeight) <= 0) {
    errors.currentWeight = ['Please enter a valid weight']
  }

  if (!goalWeight || goalWeight.trim().length === 0) {
    errors.goalWeight = ['Goal weight is required']
  } else if (isNaN(parseFloat(goalWeight)) || parseFloat(goalWeight) <= 0) {
    errors.goalWeight = ['Please enter a valid weight']
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

    // Generate a unique profile code
    const profileCode = await ensureUniqueProfileCode(supabase)

    // Generate a UUID for user_id
    const userId = crypto.randomUUID()

    const { error } = await supabase.from('profiles').insert({
      user_id: userId,
      profile_code: profileCode,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      current_height: parseFloat(currentHeight),
      current_weight: parseFloat(currentWeight),
      goal_weight: parseFloat(goalWeight),
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
      message: `Profile created successfully! Your profile code is: ${profileCode}. Please save this code for future reference.`,
      profileCode,
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
