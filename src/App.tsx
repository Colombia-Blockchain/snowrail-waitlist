import { useState } from 'react'
import { Header, Hero, SegmentCards, WaitlistForm, ThankYou } from './components'
import { LayoutShell } from './components/ui'
import type { WaitlistResult, Segment } from './types/waitlist'

type AppState = 'landing' | 'form' | 'success'

function App() {
  const [state, setState] = useState<AppState>('landing')
  const [result, setResult] = useState<WaitlistResult | null>(null)
  const [initialSegment, setInitialSegment] = useState<Segment | undefined>()

  const handleJoinWaitlist = () => {
    setInitialSegment(undefined)
    setState('form')
  }

  const handlePartnerClick = () => {
    setInitialSegment('Ramp partner')
    setState('form')
  }

  const handleFormSuccess = (result: WaitlistResult) => {
    setResult(result)
    setState('success')
  }

  const handleClose = () => {
    setState('landing')
    setResult(null)
    setInitialSegment(undefined)
  }

  return (
    <LayoutShell>
      <Header />
      <main>
        <Hero onJoinWaitlist={handleJoinWaitlist} onPartnerClick={handlePartnerClick} />
        <SegmentCards />
      </main>

      {state === 'form' && (
        <WaitlistForm
          onClose={handleClose}
          onSuccess={handleFormSuccess}
          initialSegment={initialSegment}
        />
      )}

      {state === 'success' && result && (
        <ThankYou result={result} onClose={handleClose} />
      )}
    </LayoutShell>
  )
}

export default App
