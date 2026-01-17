export type Segment = 'B2B Treasury/Ops' | 'Agent builder' | 'Ramp partner' | 'RWA/Connector'

export type Region = 'LATAM' | 'US/CA' | 'EU' | 'APAC' | 'Other'

export type UseCase =
  | 'Milestone-based vendor payouts'
  | 'Recurring contractor payroll'
  | 'Invoice settlement / AP automation'
  | 'On-chain invoices (x402)'
  | 'RWA / yield allocation connector'
  | 'Other'

export type VolumeRange = '<5k' | '5k-25k' | '25k-100k' | '100k-500k' | '>500k'

export type Frequency = 'one-off' | 'weekly' | 'biweekly' | 'monthly' | 'event-based'

export type Trigger =
  | 'Invoice approved'
  | 'Milestone delivered (manual approval)'
  | 'GitHub merge + CI green'
  | 'Jira/Linear ticket closed'
  | 'KPI reached'
  | 'Proof/attestation submitted'

export type Approval = 'No, fully automatic' | 'Yes, above threshold' | 'Yes, always'

export type AuditLevel = 'Basic' | 'Standard (exportable logs)' | 'High (receipt + policy trail)'

export type FlowDirection = 'USDC → USD (off-ramp)' | 'USD → USDC (on-ramp)' | 'Both'

export type SettlementSLA = 'Sub-hour' | 'Same day' | '1-2 business days' | 'Flexible'

export type Track = 'PILOT' | 'DISCOVERY' | 'NURTURE'

export type PaymentRails = 'ACH' | 'Wire' | 'SEPA' | 'Other'

// Fast submit - minimum fields for quick conversion
export interface FastSubmitData {
  email: string
  segment: Segment
  region: Region
  consent: boolean
}

// Full form data with optional fields
export interface WaitlistFormData {
  email: string
  consent: boolean
  segment: Segment | ''
  role: string
  isDecisionMaker: boolean | null
  company: string
  website: string
  region: Region | ''
  useCase: UseCase | ''
  monthlyVolumeBand: VolumeRange | ''
  frequency: Frequency | ''
  triggers: Trigger[]
  approvals: Approval | ''
  auditLevel: AuditLevel | ''
  flowDirection: FlowDirection | ''
  settlementSla: SettlementSLA | ''
  notes: string
  // Ramp partner specific fields
  regionsSupported: Region[]
  paymentRails: PaymentRails | ''
  apiAvailable: boolean | null
}

export interface WaitlistSubmission extends WaitlistFormData {
  score: number
  track: Track
  userAgent: string
  referrer: string
}

export interface WaitlistResult {
  segment: Segment
  score: number
  track: Track
  nextStep: string
  isUpdate?: boolean
}

export const SEGMENTS: Segment[] = [
  'B2B Treasury/Ops',
  'Agent builder',
  'Ramp partner',
  'RWA/Connector',
]

export const REGIONS: Region[] = ['LATAM', 'US/CA', 'EU', 'APAC', 'Other']

export const USE_CASES: UseCase[] = [
  'Milestone-based vendor payouts',
  'Recurring contractor payroll',
  'Invoice settlement / AP automation',
  'On-chain invoices (x402)',
  'RWA / yield allocation connector',
  'Other',
]

export const VOLUME_RANGES: VolumeRange[] = ['<5k', '5k-25k', '25k-100k', '100k-500k', '>500k']

export const FREQUENCIES: Frequency[] = ['one-off', 'weekly', 'biweekly', 'monthly', 'event-based']

export const TRIGGERS: Trigger[] = [
  'Invoice approved',
  'Milestone delivered (manual approval)',
  'GitHub merge + CI green',
  'Jira/Linear ticket closed',
  'KPI reached',
  'Proof/attestation submitted',
]

export const APPROVALS: Approval[] = ['No, fully automatic', 'Yes, above threshold', 'Yes, always']

export const AUDIT_LEVELS: AuditLevel[] = [
  'Basic',
  'Standard (exportable logs)',
  'High (receipt + policy trail)',
]

export const FLOW_DIRECTIONS: FlowDirection[] = [
  'USDC → USD (off-ramp)',
  'USD → USDC (on-ramp)',
  'Both',
]

export const SETTLEMENT_SLAS: SettlementSLA[] = [
  'Sub-hour',
  'Same day',
  '1-2 business days',
  'Flexible',
]

export const PAYMENT_RAILS: PaymentRails[] = ['ACH', 'Wire', 'SEPA', 'Other']
