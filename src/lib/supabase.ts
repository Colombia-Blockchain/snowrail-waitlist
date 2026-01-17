import { createClient } from '@supabase/supabase-js'
import type { WaitlistFormData, WaitlistResult } from '../types/waitlist'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not set. Using mock mode.')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export async function submitWaitlist(formData: WaitlistFormData): Promise<WaitlistResult> {
  const payload = {
    ...formData,
    userAgent: navigator.userAgent,
    referrer: document.referrer || 'direct',
  }

  if (supabase) {
    const { data, error } = await supabase.functions.invoke('submit-waitlist', {
      body: payload,
    })

    if (error) {
      throw new Error(error.message || 'Failed to submit waitlist form')
    }

    return data as WaitlistResult
  }

  // Mock mode for local development without Supabase
  const { computeScore, computeTrack, getNextStep } = await import('./scoring')
  const scoreResult = computeScore(formData)
  const track = computeTrack(scoreResult.total)

  return {
    segment: formData.segment as WaitlistResult['segment'],
    score: scoreResult.total,
    track,
    nextStep: getNextStep(track, formData.segment),
  }
}
