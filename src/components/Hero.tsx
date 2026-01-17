interface HeroProps {
  onJoinWaitlist: () => void
  onPartnerClick: () => void
}

export function Hero({ onJoinWaitlist, onPartnerClick }: HeroProps) {
  return (
    <section className="min-h-[85vh] flex flex-col justify-center px-6 py-16 max-w-5xl mx-auto">
      <div className="mb-6">
        <span className="inline-block px-3 py-1 text-xs font-medium tracking-wide text-accent bg-accent/10 rounded-full uppercase">
          B2B Financial Infrastructure
        </span>
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6 max-w-4xl">
        SnowRail: ejecucion financiera programable para pagos B2B con liquidacion verificable.
      </h1>

      <p className="text-lg md:text-xl text-muted mb-10 max-w-3xl leading-relaxed">
        Define pagos condicionales, valida evidencia y liquida automaticamente: USDC on-chain → USD via partner (nsegundos).
      </p>

      <div className="space-y-4 mb-12">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-accent rounded-full mt-2 shrink-0" />
          <p className="text-base md:text-lg text-secondary">
            <span className="font-semibold">Financial intents:</span> paga solo cuando se cumplan condiciones reales.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-accent rounded-full mt-2 shrink-0" />
          <p className="text-base md:text-lg text-secondary">
            <span className="font-semibold">Controles:</span> limites, whitelists y aprobacion por umbral con trazabilidad.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-accent rounded-full mt-2 shrink-0" />
          <p className="text-base md:text-lg text-secondary">
            <span className="font-semibold">Settlement auditable:</span> registro + receipt del off-ramp para conciliacion.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onJoinWaitlist}
          className="px-8 py-4 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors text-lg shadow-lg shadow-accent/25"
        >
          Join the waitlist
        </button>
        <button
          onClick={onPartnerClick}
          className="px-8 py-4 bg-white hover:bg-gray-50 text-primary font-medium rounded-lg transition-colors text-lg border border-border"
        >
          I'm a partner (ramp / RWA / integrations)
        </button>
      </div>
    </section>
  )
}
