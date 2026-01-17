import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FastSubmitPayload {
  email: string
  segment: string
  region: string
  consent: boolean
  signupId?: string
  userAgent?: string
  referrer?: string
}

interface FullPayload extends FastSubmitPayload {
  role?: string
  isDecisionMaker?: boolean | null
  company?: string
  website?: string
  useCase?: string
  monthlyVolumeBand?: string
  frequency?: string
  triggers?: string[]
  approvals?: string
  auditLevel?: string
  flowDirection?: string
  settlementSla?: string
  notes?: string
  // Ramp partner specific
  regionsSupported?: string[]
  paymentRails?: string
  apiAvailable?: boolean
}

type Track = 'PILOT' | 'DISCOVERY' | 'NURTURE'

function computeScore(form: FullPayload): number {
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
  if (form.useCase && highPainUseCases.includes(form.useCase)) {
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
  volumeSignal = form.monthlyVolumeBand ? (volumeScores[form.monthlyVolumeBand] || 0) : 0

  // Signal 3: Complexity (0-20)
  complexitySignal = form.triggers ? Math.min(form.triggers.length * 4, 20) : 0

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
  const approvalScore = form.approvals ? (approvalScores[form.approvals] || 0) : 0
  const auditScore = form.auditLevel ? (auditScores[form.auditLevel] || 0) : 0
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
  // Ramp partners get bonus for having API
  if (form.segment === 'Ramp partner' && form.apiAvailable === true) {
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

function getNextStep(track: Track, segment: string, isFastSubmit: boolean): string {
  if (isFastSubmit) {
    return 'Thanks for joining! Add more details to improve your pilot priority.'
  }

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

function validateFastSubmit(payload: unknown): payload is FastSubmitPayload {
  if (!payload || typeof payload !== 'object') return false
  const p = payload as Record<string, unknown>

  if (typeof p.email !== 'string' || !p.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return false
  }
  if (p.consent !== true) return false
  if (typeof p.segment !== 'string' || !p.segment) return false
  if (typeof p.region !== 'string' || !p.region) return false

  return true
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json() as FullPayload

    // Validate minimum required fields (fast submit)
    if (!validateFastSubmit(payload)) {
      return new Response(
        JSON.stringify({ error: 'Invalid or incomplete form data. Email, segment, region, and consent are required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Compute score (may be low for fast submit with minimal data)
    const score = computeScore(payload)
    const track = computeTrack(score)

    // Determine if this is a fast submit (minimal fields) or full submission
    const isFastSubmit = !payload.useCase && !payload.role
    const nextStep = getNextStep(track, payload.segment, isFastSubmit)

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Prepare record for upsert
    const record = {
      email: payload.email,
      consent: payload.consent,
      segment: payload.segment,
      region: payload.region,
      role: payload.role || null,
      is_decision_maker: payload.isDecisionMaker ?? null,
      company: payload.company || null,
      website: payload.website || null,
      use_case: payload.useCase || null,
      monthly_volume_band: payload.monthlyVolumeBand || null,
      frequency: payload.frequency || null,
      triggers: payload.triggers || [],
      approvals: payload.approvals || null,
      audit_level: payload.auditLevel || null,
      flow_direction: payload.flowDirection || null,
      settlement_sla: payload.settlementSla || null,
      notes: payload.notes || null,
      // Ramp partner fields
      regions_supported: payload.regionsSupported || null,
      payment_rails: payload.paymentRails || null,
      api_available: payload.apiAvailable ?? null,
      // Scoring
      score,
      track,
      // Metadata
      user_agent: payload.userAgent || null,
      referrer: payload.referrer || null,
    }

    // Upsert: insert or update if email already exists
    const { data: existingRecord } = await supabase
      .from('waitlist_signups')
      .select('id, score')
      .eq('email', payload.email)
      .single()

    let dbError
    if (existingRecord) {
      // Update existing record (add more details)
      // Only update score if new score is higher (more details = better fit)
      const updateRecord = {
        ...record,
        score: Math.max(record.score, existingRecord.score),
        track: computeTrack(Math.max(record.score, existingRecord.score)),
      }
      const { error } = await supabase
        .from('waitlist_signups')
        .update(updateRecord)
        .eq('id', existingRecord.id)
      dbError = error
    } else {
      // Insert new record
      const { error } = await supabase
        .from('waitlist_signups')
        .insert(record)
      dbError = error
    }

    if (dbError) {
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
        score: existingRecord ? Math.max(score, existingRecord.score) : score,
        track: existingRecord ? computeTrack(Math.max(score, existingRecord.score)) : track,
        nextStep,
        isUpdate: !!existingRecord,
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
