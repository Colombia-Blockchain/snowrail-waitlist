import { useState, useRef } from 'react'
import {
  Header,
  Hero,
  SegmentCards,
  HowItWorks,
  FAQ,
  WaitlistForm,
  ThankYou,
  type WaitlistQuickFormRef,
  type UserType,
} from './components'
import { LayoutShell } from './components/ui'
import type { WaitlistResult, Segment, Region } from './types/waitlist'

type AppState = 'landing' | 'form' | 'success'

function App() {
  const [state, setState] = useState<AppState>('landing')
  const [result, setResult] = useState<WaitlistResult | null>(null)
  const [initialSegment, setInitialSegment] = useState<Segment | undefined>()
  const [initialEmail, setInitialEmail] = useState<string>('')
  const [initialRegion, setInitialRegion] = useState<Region | undefined>()

  const quickFormRef = useRef<WaitlistQuickFormRef>(null)

  // Called when user submits the quick form in Hero
  const handleExpandForm = (data: { email: string; userType: UserType; region: Region }) => {
    setInitialEmail(data.email)
    setInitialRegion(data.region)
    // Map userType to segment
    const segmentMap: Record<UserType, Segment> = {
      team: 'B2B Treasury/Ops',
      partner: 'Ramp partner',
    }
    setInitialSegment(segmentMap[data.userType])
    setState('form')
  }

  // Called when user clicks a segment card
  const handleSelectSegment = (userType: UserType) => {
    // Set the toggle in the quick form and scroll to it
    if (quickFormRef.current) {
      quickFormRef.current.setUserType(userType)
      quickFormRef.current.scrollIntoView()
    }
  }

  const handleFormSuccess = (result: WaitlistResult) => {
    setResult(result)
    setState('success')
  }

  const handleClose = () => {
    setState('landing')
    setResult(null)
    setInitialSegment(undefined)
    setInitialEmail('')
    setInitialRegion(undefined)
  }

  return (
    <LayoutShell>
      <Header />
      <main>
        <Hero ref={quickFormRef} onExpandForm={handleExpandForm} />
        <SegmentCards onSelectSegment={handleSelectSegment} />
        <HowItWorks />
        <FAQ />
      </main>

      {state === 'form' && (
        <WaitlistForm
          onClose={handleClose}
          onSuccess={handleFormSuccess}
          initialSegment={initialSegment}
          initialEmail={initialEmail}
          initialRegion={initialRegion}
        />
      )}

      {state === 'success' && result && (
        <ThankYou result={result} onClose={handleClose} />
      )}
    </LayoutShell>
  )
}

export default App
