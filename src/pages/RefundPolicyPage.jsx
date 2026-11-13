import { useEffect } from 'react'

const serif = "font-['Playfair_Display',serif]"

const linkClass =
  'font-medium text-[#16274a] underline decoration-[#c9a24a]/60 underline-offset-4 hover:text-[#c9a24a] transition-colors'

const SUPPORT_EMAIL = 'support@medicalglobalacademy.com'
const SUPPORT_PHONE_DISPLAY = '+91 9289994218'
const SUPPORT_PHONE_TEL = '+919289994218'

const sections = [
  { id: 'overview', title: 'Overview' },
  { id: 'no-refunds', title: 'No Refunds' },
  { id: 'course-cancellation', title: 'Course Cancellation' },
  { id: 'duplicate-payment', title: 'Duplicate Payment' },
  { id: 'technical-issues', title: 'Technical Issues' },
  { id: 'exceptions', title: 'Exceptions' },
  { id: 'refund-processing', title: 'Refund Processing' },
  { id: 'contact-us', title: 'Contact Us' },
]

function EmailLink() {
  return (
    <a href={`mailto:${SUPPORT_EMAIL}`} className={linkClass}>
      {SUPPORT_EMAIL}
    </a>
  )
}

function PolicySection({ index, id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-slate-200 pt-10 first:border-t-0 first:pt-0">
      <h2 className={`${serif} flex items-baseline gap-3 text-2xl md:text-3xl font-bold text-[#16274a]`}>
        <span className="text-[#c9a24a]">{index}.</span>
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}

function RefundPolicyPage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Refund Policy | Medical Global Academy'
    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <div className="font-['DM_Sans',sans-serif] text-slate-800">
      {/* 1. Header */}
      <section className="bg-gradient-to-br from-[#0a1428] via-[#16274a] to-[#2b4a85] text-white">
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6 py-16 md:py-20">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#c9a24a]" />
            <span className="rounded-full border border-[#c9a24a]/40 bg-[#c9a24a]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a24a]">
              Legal
            </span>
          </div>
          <h1 className={`${serif} mt-6 text-4xl sm:text-5xl md:text-6xl font-bold leading-tight`}>
            Refund Policy
          </h1>
          <p className="mt-4 text-sm font-medium uppercase tracking-[0.2em] text-[#c9a24a]">
            Last updated: 2026
          </p>
          <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-white/80">
            Please read our refund policy carefully before enrolling in any course. By enrolling in any of our
            courses, you acknowledge that you have read, understood, and agreed to this refund policy.
          </p>
        </div>
      </section>

      {/* 2. Body */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
            {/* Table of contents */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a24a]">On this page</p>
                <ol className="mt-4 space-y-2.5 text-sm">
                  {sections.map((s, i) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="flex gap-2 text-slate-600 hover:text-[#16274a] transition-colors"
                      >
                        <span className="font-semibold text-[#c9a24a]">{i + 1}.</span>
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>

            {/* Policy content */}
            <div className="max-w-3xl space-y-10 text-base md:text-[17px] leading-[1.8] text-slate-600">
              <PolicySection index={1} id="overview" title="Overview">
                <p>
                  At Medical Global Academy, we strive to provide high-quality training and educational content for
                  MBBS, MD, and other degree holders in the medical field. However, we understand that there may be
                  circumstances where you may request a refund. Please read our refund policy carefully before
                  enrolling in any course.
                </p>
              </PolicySection>

              <PolicySection index={2} id="no-refunds" title="No Refunds">
                <p>
                  Due to the nature of digital educational content, once access to the course materials has been
                  granted, no refunds will be issued. By completing the registration and payment process, you agree
                  that all sales are final.
                </p>
              </PolicySection>

              <PolicySection index={3} id="course-cancellation" title="Course Cancellation">
                <p>
                  In the event that Medical Global Academy cancels a course due to unforeseen circumstances or
                  technical issues, we will provide a full refund to all registered participants. The refund will be
                  processed within 10 business days from the date of cancellation.
                </p>
              </PolicySection>

              <PolicySection index={4} id="duplicate-payment" title="Duplicate Payment">
                <p>
                  If you mistakenly make multiple payments for the same course, please notify us immediately at{' '}
                  <EmailLink />. We will process a refund for the duplicate payment after verifying the details,
                  typically within 7 business days.
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Email:</span> <EmailLink />
                </p>
              </PolicySection>

              <PolicySection index={5} id="technical-issues" title="Technical Issues">
                <p>
                  If you experience any technical issues that prevent you from accessing course content, please
                  contact our support team. While we do not offer refunds for technical problems, we will make every
                  effort to resolve the issue and ensure you have access to the course material.
                </p>
              </PolicySection>

              <PolicySection index={6} id="exceptions" title="Exceptions">
                <p>Refunds will only be considered under exceptional circumstances, such as:</p>
                <ul className="space-y-2 pl-1">
                  {[
                    'Incorrect payment made due to system error.',
                    'Special cases with documented medical emergencies.',
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-[0.7em] h-1.5 w-1.5 flex-none rounded-full bg-[#c9a24a]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  All exceptions will be considered on a case-by-case basis, and the decision of Medical Global
                  Academy will be final.
                </p>
              </PolicySection>

              <PolicySection index={7} id="refund-processing" title="Refund Processing">
                <p>
                  Approved refunds will be processed back to the original payment method. Depending on the payment
                  provider, it may take up to 7–10 business days for the refund to reflect in your account.
                </p>
              </PolicySection>

              <PolicySection index={8} id="contact-us" title="Contact Us">
                <p>For any inquiries related to refunds or payments, please contact us at:</p>
                <div className="rounded-2xl border border-[#c9a24a]/30 bg-gradient-to-br from-slate-50 to-white p-6 md:p-8">
                  <p className={`${serif} text-xl font-bold text-[#16274a]`}>Medical Global Academy — Support</p>
                  <div className="mt-4 space-y-2">
                    <p>
                      <span className="font-semibold text-slate-800">Email:</span> <EmailLink />
                    </p>
                    <p>
                      <span className="font-semibold text-slate-800">Phone:</span>{' '}
                      <a href={`tel:${SUPPORT_PHONE_TEL}`} className={linkClass}>
                        {SUPPORT_PHONE_DISPLAY}
                      </a>
                    </p>
                  </div>
                </div>
              </PolicySection>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default RefundPolicyPage
