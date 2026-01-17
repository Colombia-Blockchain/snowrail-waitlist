import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WaitlistPayload {
  email: string
  consent: boolean
  segment: string
  role: string
  isDecisionMaker: boolean | null
  company: string
  website: string
  region: string
  useCase: string
  monthlyVolumeBand: string
  frequency: string
  triggers: string[]
  approvals: string
  auditLevel: string
  flowDirection: string
  settlementSla: string
  notes: string
  userAgent: string
  referrer: string
}

type Track = 'PILOT' | 'DISCOVERY' | 'NURTURE'

function computeScore(form: WaitlistPayload): number {
  let painSignal = 0
  let volumeSignal = 0
  let complexitySignal = 0
  let controlsSignal = 0
  let implementabilitySignal = 0

  // Signal 1: Pain (0-20)
  const highPainUseCases = [
    'Invoice settlement / AP automation',
    'Milestone-based vendor payouts',
    'Recurring contractor payroll',
  ]
  if (highPainUseCases.includes(form.useCase)) {
    painSignal = 15
  } else if (form.useCase === 'Other') {
    painSignal = 5
  } else if (form.useCase) {
    painSignal = 10
  }

  // Signal 2: Volume (0-20)
  const volumeScores: Record<string, number> = {
    '<5k': 2,
    '5k-25k': 8,
    '25k-100k': 14,
    '100k-500k': 18,
    '>500k': 20,
  }
  volumeSignal = volumeScores[form.monthlyVolumeBand] || 0

  // Signal 3: Complexity (0-20)
  complexitySignal = Math.min(form.triggers.length * 4, 20)

  // Signal 4: Controls/Audit (0-20)
  const approvalScores: Record<string, number> = {
    'No, fully automatic': 6,
    'Yes, above threshold': 12,
    'Yes, always': 16,
  }
  const auditScores: Record<string, number> = {
    'Basic': 8,
    'Standard (exportable logs)': 14,
    'High (receipt + policy trail)': 20,
  }
  const approvalScore = approvalScores[form.approvals] || 0
  const auditScore = auditScores[form.auditLevel] || 0
  controlsSignal = Math.min(Math.max(approvalScore, auditScore), 20)

  // Signal 5: Implementability (0-20)
  if (form.website && form.website.trim() !== '') {
    implementabilitySignal += 5
  }
  if (form.isDecisionMaker === true) {
    implementabilitySignal += 10
  }
  if (form.segment === 'B2B Treasury/Ops') {
    implementabilitySignal += 5
  }
  implementabilitySignal = Math.min(implementabilitySignal, 20)

  return painSignal + volumeSignal + complexitySignal + controlsSignal + implementabilitySignal
}

function computeTrack(score: number): Track {
  if (score >= 70) return 'PILOT'
  if (score >= 40) return 'DISCOVERY'
  return 'NURTURE'
}

function getNextStep(track: Track, segment: string): string {
  switch (track) {
    case 'PILOT':
      return segment === 'Ramp partner'
        ? 'Our partnerships team will reach out within 48 hours to discuss integration.'
        : 'You qualify for early pilot access. Expect a follow-up email to schedule a technical demo.'
    case 'DISCOVERY':
      return "We'll send you updates and case studies relevant to your use case. Reply to any email to fast-track to pilot."
    case 'NURTURE':
      return "You're on the list! We'll keep you posted on public launches and educational content."
  }
}

function validatePayload(payload: unknown): payload is WaitlistPayload {
  if (!payload || typeof payload !== 'object') return false
  const p = payload as Record<string, unknown>

  if (typeof p.email !== 'string' || !p.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return false
  }
  if (p.consent !== true) return false
  if (typeof p.segment !== 'string' || !p.segment) return false
  if (typeof p.region !== 'string' || !p.region) return false
  if (typeof p.useCase !== 'string' || !p.useCase) return false
  if (typeof p.monthlyVolumeBand !== 'string' || !p.monthlyVolumeBand) return false
  if (typeof p.frequency !== 'string' || !p.frequency) return false
  if (!Array.isArray(p.triggers) || p.triggers.length === 0) return false
  if (typeof p.approvals !== 'string' || !p.approvals) return false
  if (typeof p.auditLevel !== 'string' || !p.auditLevel) return false

  return true
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()

    // Validate payload
    if (!validatePayload(payload)) {
      return new Response(
        JSON.stringify({ error: 'Invalid or incomplete form data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Compute score server-side
    const score = computeScore(payload)
    const track = computeTrack(score)
    const nextStep = getNextStep(track, payload.segment)

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Insert into database
    const { error: dbError } = await supabase.from('waitlist_signups').insert({
      email: payload.email,
      consent: payload.consent,
      segment: payload.segment,
      role: payload.role || null,
      is_decision_maker: payload.isDecisionMaker,
      company: payload.company || null,
      website: payload.website || null,
      region: payload.region,
      use_case: payload.useCase,
      monthly_volume_band: payload.monthlyVolumeBand,
      frequency: payload.frequency,
      triggers: payload.triggers,
      approvals: payload.approvals,
      audit_level: payload.auditLevel,
      flow_direction: payload.flowDirection || null,
      settlement_sla: payload.settlementSla || null,
      notes: payload.notes || null,
      score,
      track,
      user_agent: payload.userAgent || null,
      referrer: payload.referrer || null,
    })

    if (dbError) {
      // Handle duplicate email
      if (dbError.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'This email is already registered on the waitlist.' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to save submission. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Return result
    return new Response(
      JSON.stringify({
        segment: payload.segment,
        score,
        track,
        nextStep,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Error processing request:', err)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
