'use server'

import { createServerClient } from '@/lib/supabase/server'

export type CalorieGoalStatus = 'yes' | 'no' | 'did_not_track' | 'no_calorie_goal'

export interface CheckInFormData {
  profileCode: string
  currentWeight: string
  cravingsScale: string
  calorieGoalMet: CalorieGoalStatus
}

export interface FormState {
  success: boolean
  errors?: {
    profileCode?: string[]
    currentWeight?: string[]
    cravingsScale?: string[]
    calorieGoalMet?: string[]
    _form?: string[]
  }
  message?: string
}

export async function submitCheckInForm(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const profileCode = formData.get('profileCode') as string
  const currentWeight = formData.get('currentWeight') as string
  const cravingsScale = formData.get('cravingsScale') as string
  const calorieGoalMet = formData.get('calorieGoalMet') as CalorieGoalStatus

  // Server-side validation
  const errors: FormState['errors'] = {}

  if (!profileCode || profileCode.trim().length === 0) {
    errors.profileCode = ['Profile code is required']
  } else if (!/^\d{4}$/.test(profileCode.trim())) {
    errors.profileCode = ['Profile code must be a 4-digit number']
  }

  if (!currentWeight || currentWeight.trim().length === 0) {
    errors.currentWeight = ['Current weight is required']
  } else if (isNaN(parseFloat(currentWeight)) || parseFloat(currentWeight) <= 0) {
    errors.currentWeight = ['Please enter a valid weight']
  }

  if (!cravingsScale || cravingsScale.trim().length === 0) {
    errors.cravingsScale = ['Cravings scale is required']
  } else {
    const scale = parseInt(cravingsScale)
    if (isNaN(scale) || scale < 1 || scale > 5) {
      errors.cravingsScale = ['Cravings scale must be between 1 and 5']
    }
  }

  if (!calorieGoalMet) {
    errors.calorieGoalMet = ['Calorie goal status is required']
  } else if (!['yes', 'no', 'did_not_track', 'no_calorie_goal'].includes(calorieGoalMet)) {
    errors.calorieGoalMet = ['Invalid calorie goal status']
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

    // Look up profile by profile_code
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('profile_code', profileCode.trim())
      .single()

    if (profileError || !profile) {
      return {
        success: false,
        errors: {
          profileCode: ['Profile code not found. Please check your code and try again.'],
        },
      }
    }

    // Insert check-in record
    const { error: insertError } = await supabase.from('check_ins').insert({
      profile_id: profile.id,
      current_weight: parseFloat(currentWeight),
      cravings_scale: parseInt(cravingsScale),
      calorie_goal_met: calorieGoalMet,
    })

    if (insertError) {
      console.error('Supabase error:', insertError)
      return {
        success: false,
        errors: {
          _form: ['Failed to submit check-in. Please try again.'],
        },
      }
    }

    return {
      success: true,
      message: 'Check-in submitted successfully! Keep up the great work!',
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
