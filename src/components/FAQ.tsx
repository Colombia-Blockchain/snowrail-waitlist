import { useState } from 'react'

const faqs = [
  {
    question: 'What is SnowRail?',
    answer: 'SnowRail is programmable financial execution infrastructure for B2B payments. It lets you define payment conditions (intents), validate evidence, apply controls, and settle automatically with auditable receipts.',
  },
  {
    question: 'How long until I get access?',
    answer: 'We review every submission within 48-72 hours. High-fit teams (based on use case, volume, and readiness) are invited to a call within a week. Pilot access typically starts 2-4 weeks after qualification.',
  },
  {
    question: 'What does the pilot include?',
    answer: 'Pilot teams get sandbox access, API documentation, integration support, and the ability to run real milestone-based payouts with a capped volume. We work closely with you to ensure success.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="px-6 py-20 md:py-24">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-snow-0 mb-4">
            Questions?
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass-subtle rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="font-medium text-snow-0">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-snow-2 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? 'max-h-48' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-4">
                  <p className="text-sm text-snow-1 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
