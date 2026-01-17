import { useState } from 'react'
import { ProgressBar } from './ProgressBar'
import type {
  WaitlistFormData,
  Segment,
  Region,
  UseCase,
  VolumeRange,
  Frequency,
  Trigger,
  Approval,
  AuditLevel,
  FlowDirection,
  SettlementSLA,
  WaitlistResult,
} from '../types/waitlist'
import {
  SEGMENTS,
  REGIONS,
  USE_CASES,
  VOLUME_RANGES,
  FREQUENCIES,
  TRIGGERS,
  APPROVALS,
  AUDIT_LEVELS,
  FLOW_DIRECTIONS,
  SETTLEMENT_SLAS,
} from '../types/waitlist'
import { submitWaitlist } from '../lib/supabase'

interface WaitlistFormProps {
  onClose: () => void
  onSuccess: (result: WaitlistResult) => void
  initialSegment?: Segment
}

const initialFormData: WaitlistFormData = {
  email: '',
  consent: false,
  segment: '',
  role: '',
  isDecisionMaker: null,
  company: '',
  website: '',
  region: '',
  useCase: '',
  monthlyVolumeBand: '',
  frequency: '',
  triggers: [],
  approvals: '',
  auditLevel: '',
  flowDirection: '',
  settlementSla: '',
  notes: '',
}

export function WaitlistForm({ onClose, onSuccess, initialSegment }: WaitlistFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<WaitlistFormData>({
    ...initialFormData,
    segment: initialSegment || '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof WaitlistFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const totalSteps = 5

  const updateField = <K extends keyof WaitlistFormData>(
    field: K,
    value: WaitlistFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const toggleTrigger = (trigger: Trigger) => {
    setFormData((prev) => ({
      ...prev,
      triggers: prev.triggers.includes(trigger)
        ? prev.triggers.filter((t) => t !== trigger)
        : [...prev.triggers, trigger],
    }))
  }

  const validateStep = (): boolean => {
    const newErrors: Partial<Record<keyof WaitlistFormData, string>> = {}

    switch (step) {
      case 1:
        if (!formData.segment) newErrors.segment = 'Please select a segment'
        if (!formData.role.trim()) newErrors.role = 'Please enter your role'
        if (formData.isDecisionMaker === null) newErrors.isDecisionMaker = 'Please select an option'
        break
      case 2:
        if (!formData.company.trim()) newErrors.company = 'Please enter your company name'
        if (!formData.region) newErrors.region = 'Please select a region'
        break
      case 3:
        if (!formData.useCase) newErrors.useCase = 'Please select a use case'
        if (!formData.monthlyVolumeBand) newErrors.monthlyVolumeBand = 'Please select a volume range'
        if (!formData.frequency) newErrors.frequency = 'Please select a frequency'
        break
      case 4:
        if (formData.triggers.length === 0) newErrors.triggers = 'Please select at least one trigger'
        if (!formData.approvals) newErrors.approvals = 'Please select an approval type'
        if (!formData.auditLevel) newErrors.auditLevel = 'Please select an audit level'
        break
      case 5:
        if (!formData.email.trim()) {
          newErrors.email = 'Please enter your email'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address'
        }
        if (!formData.consent) {
          newErrors.consent = 'Please accept to continue'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const result = await submitWaitlist(formData)
      onSuccess(result)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const showOffRampQuestions =
    formData.segment === 'B2B Treasury/Ops' ||
    formData.useCase === 'Milestone-based vendor payouts' ||
    formData.useCase === 'Recurring contractor payroll' ||
    formData.useCase === 'Invoice settlement / AP automation'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary">Join the Waitlist</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <ProgressBar currentStep={step} totalSteps={totalSteps} />

          {/* Step 1: Segment & Role */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  What describes you best? *
                </label>
                <select
                  value={formData.segment}
                  onChange={(e) => updateField('segment', e.target.value as Segment)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${
                    errors.segment ? 'border-red-500' : 'border-border'
                  }`}
                >
                  <option value="">Select a segment</option>
                  {SEGMENTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.segment && <p className="text-red-500 text-sm mt-1">{errors.segment}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Your role *
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => updateField('role', e.target.value)}
                  placeholder="e.g., CFO, Engineering Lead, Founder"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${
                    errors.role ? 'border-red-500' : 'border-border'
                  }`}
                />
                {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Do you make purchasing decisions? *
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => updateField('isDecisionMaker', true)}
                    className={`flex-1 px-4 py-3 border rounded-lg transition-colors ${
                      formData.isDecisionMaker === true
                        ? 'bg-accent text-white border-accent'
                        : 'border-border hover:border-accent'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('isDecisionMaker', false)}
                    className={`flex-1 px-4 py-3 border rounded-lg transition-colors ${
                      formData.isDecisionMaker === false
                        ? 'bg-accent text-white border-accent'
                        : 'border-border hover:border-accent'
                    }`}
                  >
                    No
                  </button>
                </div>
                {errors.isDecisionMaker && <p className="text-red-500 text-sm mt-1">{errors.isDecisionMaker}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Company & Region */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Company / Project *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => updateField('company', e.target.value)}
                  placeholder="Your company or project name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${
                    errors.company ? 'border-red-500' : 'border-border'
                  }`}
                />
                {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Website (optional)
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Primary region *
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => updateField('region', e.target.value as Region)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${
                    errors.region ? 'border-red-500' : 'border-border'
                  }`}
                >
                  <option value="">Select a region</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Use Case & Volume */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Primary use case *
                </label>
                <select
                  value={formData.useCase}
                  onChange={(e) => updateField('useCase', e.target.value as UseCase)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${
                    errors.useCase ? 'border-red-500' : 'border-border'
                  }`}
                >
                  <option value="">Select a use case</option>
                  {USE_CASES.map((uc) => (
                    <option key={uc} value={uc}>{uc}</option>
                  ))}
                </select>
                {errors.useCase && <p className="text-red-500 text-sm mt-1">{errors.useCase}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Estimated monthly volume (USD) *
                </label>
                <select
                  value={formData.monthlyVolumeBand}
                  onChange={(e) => updateField('monthlyVolumeBand', e.target.value as VolumeRange)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${
                    errors.monthlyVolumeBand ? 'border-red-500' : 'border-border'
                  }`}
                >
                  <option value="">Select volume range</option>
                  {VOLUME_RANGES.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
                {errors.monthlyVolumeBand && <p className="text-red-500 text-sm mt-1">{errors.monthlyVolumeBand}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Payment frequency *
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => updateField('frequency', e.target.value as Frequency)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${
                    errors.frequency ? 'border-red-500' : 'border-border'
                  }`}
                >
                  <option value="">Select frequency</option>
                  {FREQUENCIES.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                {errors.frequency && <p className="text-red-500 text-sm mt-1">{errors.frequency}</p>}
              </div>
            </div>
          )}

          {/* Step 4: Conditions & Controls */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  What triggers a payment? (select all that apply) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TRIGGERS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTrigger(t)}
                      className={`px-4 py-2 text-left text-sm border rounded-lg transition-colors ${
                        formData.triggers.includes(t)
                          ? 'bg-accent text-white border-accent'
                          : 'border-border hover:border-accent'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {errors.triggers && <p className="text-red-500 text-sm mt-1">{errors.triggers}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Do you require human approvals? *
                </label>
                <select
                  value={formData.approvals}
                  onChange={(e) => updateField('approvals', e.target.value as Approval)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${
                    errors.approvals ? 'border-red-500' : 'border-border'
                  }`}
                >
                  <option value="">Select an option</option>
                  {APPROVALS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                {errors.approvals && <p className="text-red-500 text-sm mt-1">{errors.approvals}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Audit / reconciliation needs *
                </label>
                <select
                  value={formData.auditLevel}
                  onChange={(e) => updateField('auditLevel', e.target.value as AuditLevel)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${
                    errors.auditLevel ? 'border-red-500' : 'border-border'
                  }`}
                >
                  <option value="">Select audit level</option>
                  {AUDIT_LEVELS.map((al) => (
                    <option key={al} value={al}>{al}</option>
                  ))}
                </select>
                {errors.auditLevel && <p className="text-red-500 text-sm mt-1">{errors.auditLevel}</p>}
              </div>

              {showOffRampQuestions && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Flow direction (optional)
                    </label>
                    <select
                      value={formData.flowDirection}
                      onChange={(e) => updateField('flowDirection', e.target.value as FlowDirection)}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    >
                      <option value="">Select flow direction</option>
                      {FLOW_DIRECTIONS.map((fd) => (
                        <option key={fd} value={fd}>{fd}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Settlement SLA (optional)
                    </label>
                    <select
                      value={formData.settlementSla}
                      onChange={(e) => updateField('settlementSla', e.target.value as SettlementSLA)}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    >
                      <option value="">Select SLA</option>
                      {SETTLEMENT_SLAS.map((sla) => (
                        <option key={sla} value={sla}>{sla}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 5: Contact & Consent */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="you@company.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-border'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Describe your scenario (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Tell us more about your use case in 2-3 lines..."
                  rows={3}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consent"
                  checked={formData.consent}
                  onChange={(e) => updateField('consent', e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-border text-accent focus:ring-accent"
                />
                <label htmlFor="consent" className="text-sm text-muted">
                  I agree to be contacted about pilots and updates from SnowRail. *
                </label>
              </div>
              {errors.consent && <p className="text-red-500 text-sm">{errors.consent}</p>}

              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {submitError}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <button
              onClick={step === 1 ? onClose : handleBack}
              className="px-6 py-3 text-muted hover:text-primary transition-colors"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>
            {step < totalSteps ? (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
