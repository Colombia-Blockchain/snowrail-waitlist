export function Header() {
  return (
    <header className="px-6 py-4 border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-primary">SnowRail</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#use-cases" className="hover:text-primary transition-colors">Use Cases</a>
        </nav>
      </div>
    </header>
  )
}
