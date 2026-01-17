import { useState, useRef } from 'react'
import {
  Header,
  Hero,
  SegmentCards,
  HowItWorks,
  FAQ,
  WaitlistForm,
  WaitlistSuccessModal,
  type WaitlistQuickFormRef,
  type UserType,
} from './components'
import { LayoutShell, ToastProvider } from './components/ui'
import type { WaitlistResult, Segment, Region } from './types/waitlist'

type AppState = 'landing' | 'form' | 'success'

function App() {
  const [state, setState] = useState<AppState>('landing')
  const [result, setResult] = useState<WaitlistResult | null>(null)
  const [initialSegment, setInitialSegment] = useState<Segment | undefined>()
  const [initialEmail, setInitialEmail] = useState<string>('')
  const [initialRegion, setInitialRegion] = useState<Region | undefined>()

  const quickFormRef = useRef<WaitlistQuickFormRef>(null)

  // Called when user wants to add details (after fast submit or clicking link)
  const handleAddDetails = (data: { email: string; segment: Segment; region: Region }) => {
    setInitialEmail(data.email)
    setInitialRegion(data.region)
    setInitialSegment(data.segment)
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
    <ToastProvider>
      <LayoutShell>
        <Header />
        <main>
          <Hero ref={quickFormRef} onAddDetails={handleAddDetails} />
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
          <WaitlistSuccessModal result={result} onClose={handleClose} />
        )}
      </LayoutShell>
    </ToastProvider>
  )
}

export default App
