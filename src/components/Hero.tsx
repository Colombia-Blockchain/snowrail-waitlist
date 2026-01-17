import { GlassCard } from './ui'
import { PrimaryButton, SecondaryButton } from './ui/Button'

interface HeroProps {
  onJoinWaitlist: () => void
  onPartnerClick: () => void
}

export function Hero({ onJoinWaitlist, onPartnerClick }: HeroProps) {
  return (
    <section className="min-h-[85vh] flex flex-col justify-center px-6 py-16 max-w-5xl mx-auto">
      <GlassCard glow className="max-w-4xl">
        <div className="mb-6">
          <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-wide text-cyan bg-cyan/10 rounded-full uppercase border border-cyan/20">
            B2B Financial Infrastructure
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-snow-0 leading-tight mb-6">
          <span className="text-gradient">SnowRail:</span> ejecucion financiera programable para pagos B2B con liquidacion verificable.
        </h1>

        <p className="text-lg md:text-xl text-snow-1 mb-10 leading-relaxed">
          Define pagos condicionales, valida evidencia y liquida automaticamente: USDC on-chain → USD via partner (nsegundos).
        </p>

        <div className="space-y-4 mb-10">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-cyan rounded-full mt-2 shrink-0 shadow-[0_0_8px_rgba(90,240,255,0.5)]" />
            <p className="text-base md:text-lg text-snow-1">
              <span className="font-semibold text-snow-0">Financial intents:</span> paga solo cuando se cumplan condiciones reales.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-cyan rounded-full mt-2 shrink-0 shadow-[0_0_8px_rgba(90,240,255,0.5)]" />
            <p className="text-base md:text-lg text-snow-1">
              <span className="font-semibold text-snow-0">Controles:</span> limites, whitelists y aprobacion por umbral con trazabilidad.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-cyan rounded-full mt-2 shrink-0 shadow-[0_0_8px_rgba(90,240,255,0.5)]" />
            <p className="text-base md:text-lg text-snow-1">
              <span className="font-semibold text-snow-0">Settlement auditable:</span> registro + receipt del off-ramp para conciliacion.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <PrimaryButton onClick={onJoinWaitlist} className="text-base px-8 py-4">
            Join the waitlist
          </PrimaryButton>
          <SecondaryButton onClick={onPartnerClick} className="text-base px-8 py-4">
            I'm a partner (ramp / RWA / integrations)
          </SecondaryButton>
        </div>
      </GlassCard>
    </section>
  )
}
