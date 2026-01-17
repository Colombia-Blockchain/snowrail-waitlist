export function Header() {
  return (
    <header className="px-6 py-4 border-b border-stroke glass-subtle sticky top-0 z-40">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan/30 to-blue/20 rounded-xl flex items-center justify-center border border-stroke-strong">
            <svg className="w-5 h-5 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-snow-0">SnowRail</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-snow-1">
          <a href="#features" className="hover:text-snow-0 transition-colors">Features</a>
          <a href="#use-cases" className="hover:text-snow-0 transition-colors">Use Cases</a>
        </nav>
      </div>
    </header>
  )
}
