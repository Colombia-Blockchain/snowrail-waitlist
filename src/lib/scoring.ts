import type {
  WaitlistFormData,
  Track,
  UseCase,
  VolumeRange,
  Approval,
  AuditLevel,
} from '../types/waitlist'

interface ScoreBreakdown {
  painSignal: number
  volumeSignal: number
  complexitySignal: number
  controlsSignal: number
  implementabilitySignal: number
  total: number
}

export function computeScore(form: WaitlistFormData): ScoreBreakdown {
  let painSignal = 0
  let volumeSignal = 0
  let complexitySignal = 0
  let controlsSignal = 0
  let implementabilitySignal = 0

  // Signal 1: Pain (0-20) - Use case alignment
  const highPainUseCases: UseCase[] = [
    'Invoice settlement / AP automation',
    'Milestone-based vendor payouts',
    'Recurring contractor payroll',
  ]
  if (highPainUseCases.includes(form.useCase as UseCase)) {
    painSignal = 15
  } else if (form.useCase === 'Other') {
    painSignal = 5
  } else if (form.useCase) {
    painSignal = 10
  }

  // Signal 2: Volume (0-20)
  const volumeScores: Record<VolumeRange, number> = {
    '<5k': 2,
    '5k-25k': 8,
    '25k-100k': 14,
    '100k-500k': 18,
    '>500k': 20,
  }
  volumeSignal = volumeScores[form.monthlyVolumeBand as VolumeRange] || 0

  // Signal 3: Complexity (0-20) - +4 per trigger, max 20
  complexitySignal = Math.min(form.triggers.length * 4, 20)

  // Signal 4: Controls/Audit (0-20) - max of approvals and audit scores
  const approvalScores: Record<Approval, number> = {
    'No, fully automatic': 6,
    'Yes, above threshold': 12,
    'Yes, always': 16,
  }
  const auditScores: Record<AuditLevel, number> = {
    Basic: 8,
    'Standard (exportable logs)': 14,
    'High (receipt + policy trail)': 20,
  }
  const approvalScore = approvalScores[form.approvals as Approval] || 0
  const auditScore = auditScores[form.auditLevel as AuditLevel] || 0
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

  const total = painSignal + volumeSignal + complexitySignal + controlsSignal + implementabilitySignal

  return {
    painSignal,
    volumeSignal,
    complexitySignal,
    controlsSignal,
    implementabilitySignal,
    total,
  }
}

export function computeTrack(score: number): Track {
  if (score >= 70) return 'PILOT'
  if (score >= 40) return 'DISCOVERY'
  return 'NURTURE'
}

export function getNextStep(track: Track, segment: string): string {
  switch (track) {
    case 'PILOT':
      return segment === 'Ramp partner'
        ? 'Our partnerships team will reach out within 48 hours to discuss integration.'
        : 'You qualify for early pilot access. Expect a follow-up email to schedule a technical demo.'
    case 'DISCOVERY':
      return 'We\'ll send you updates and case studies relevant to your use case. Reply to any email to fast-track to pilot.'
    case 'NURTURE':
      return 'You\'re on the list! We\'ll keep you posted on public launches and educational content.'
  }
}
