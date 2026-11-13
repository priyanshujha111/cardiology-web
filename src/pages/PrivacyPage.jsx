import { useEffect, useRef, useState } from 'react'

const serif = "font-['Playfair_Display',serif]"

const linkClass = 'font-medium text-[#16274a] underline decoration-[#c9a24a]/60 underline-offset-4 hover:text-[#c9a24a] transition-colors'

const EMAIL = 'support@medicalglobalacademy.com'

function Email() {
  return (
    <a href={`mailto:${EMAIL}`} className={`${linkClass} break-all`}>
      {EMAIL}
    </a>
  )
}

function Bullets({ items }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a24a]" />
          <span>
            {item.label ? (
              <>
                <strong className="font-semibold text-[#0a1428]">{item.label}:</strong> {item.text}
              </>
            ) : (
              item
            )}
          </span>
        </li>
      ))}
    </ul>
  )
}

function SubHeading({ children }) {
  return <h3 className="mt-6 text-lg font-bold text-[#0a1428]">{children}</h3>
}

const sections = [
  {
    id: 'who-we-are',
    title: 'Who We Are',
    body: (
      <>
        <p>
          Medical Global Academy (&quot;MGA&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
          operates{' '}
          <a href="https://medicalglobalacademy.com" className={linkClass}>
            medicalglobalacademy.com
          </a>{' '}
          and associated learning platforms.
        </p>
        <p className="mt-4">
          This Privacy Policy explains how we collect, use, store and share information when you use
          our services.
        </p>
        <p className="mt-4">
          For questions about this policy, contact us at <Email />.
        </p>
      </>
    ),
  },
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    body: (
      <>
        <SubHeading>Information You Provide</SubHeading>
        <Bullets
          items={[
            'Name, email address and phone number.',
            'Professional details such as medical registration number, qualification and speciality when required.',
            'Payment information processed securely by our payment partners.',
            'Support messages, feedback and other communications.',
          ]}
        />
        <SubHeading>Information Collected Automatically</SubHeading>
        <Bullets
          items={[
            'IP address, browser and device information.',
            'Pages visited and general website usage.',
            'Cookies and similar technologies.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Information',
    body: (
      <Bullets
        items={[
          'To process enrolments and provide our programmes.',
          'To manage accounts, assessments and certifications.',
          'To send programme updates and relevant educational content.',
          'To improve our website and learning platform.',
          'To meet legal and regulatory requirements.',
        ]}
      />
    ),
  },
  {
    id: 'sharing',
    title: 'Sharing Your Information',
    body: (
      <>
        <p>
          We do not sell your personal data to third parties. Information may be shared when
          necessary with:
        </p>
        <Bullets
          items={[
            { label: 'Service providers', text: 'Payment processors, email services and hosting providers.' },
            { label: 'Faculty or partners', text: 'Where required for programme coordination.' },
            { label: 'Legal authorities', text: 'When disclosure is required by law or legal process.' },
          ]}
        />
      </>
    ),
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    body: (
      <>
        <p>
          We retain personal information for as long as necessary to provide our services and meet
          legal obligations.
        </p>
        <p className="mt-4">
          Programme records and certifications may be retained for the period required by applicable
          obligations. You may request deletion of your account data, subject to legal requirements.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies',
    body: (
      <>
        <p>
          We use cookies to maintain sessions, remember preferences and understand how visitors use
          our website.
        </p>
        <p className="mt-4">
          You can control cookies through your browser settings. Disabling certain cookies may affect
          website functionality.
        </p>
        <p className="mt-4">
          We may use analytics services such as Google Analytics to understand general website usage.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    body: (
      <>
        <p>You may have the right to:</p>
        <Bullets
          items={[
            'Access the personal information we hold about you.',
            'Request correction of inaccurate information.',
            'Request deletion of your information, where applicable.',
            'Opt out of marketing communications.',
            'Raise a complaint with the relevant authority.',
          ]}
        />
        <p className="mt-4">
          To exercise your rights, contact us at <Email />.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to This Policy',
    body: (
      <>
        <p>
          We may update this Privacy Policy from time to time. Material changes may be communicated
          through email or a notice on our website.
        </p>
        <p className="mt-4">
          The date shown at the top of this page indicates when the policy was most recently updated.
        </p>
      </>
    ),
  },
  {
    id: 'mobile-application',
    title: 'Mobile Application',
    body: (
      <p>
        This Privacy Policy also applies to the MGA Academy mobile application and its employee
        attendance features. The information we collect depends on the features you use.
      </p>
    ),
  },
  {
    id: 'attendance-location',
    title: 'Employee Attendance and Location',
    body: (
      <>
        <p>
          The MGA Academy app uses foreground location access to verify an employee&apos;s proximity
          to their assigned workplace for check-in and check-out.
        </p>
        <p className="mt-4">
          Location is accessed only while the employee uses the check-in or check-out feature.
          Location coordinates are used to calculate the distance to the assigned workplace and are
          not stored beyond what is required for attendance records.
        </p>
        <p className="mt-4">
          Attendance records include employee identification, check-in and check-out times,
          attendance status and, where retained, location information. These records are accessible
          only to authorized personnel and service providers who require access for attendance
          administration.
        </p>
        <p className="mt-4">
          You can disable location permission through your device settings. Doing so may prevent
          location-based check-in and check-out. Unrelated app features do not require attendance
          location access.
        </p>
      </>
    ),
  },
  {
    id: 'app-permissions',
    title: 'Mobile App Permissions',
    body: (
      <>
        <p>Depending on the features you use, the app may request:</p>
        <Bullets
          items={[
            { label: 'Location', text: 'To verify workplace proximity for employee check-in and check-out.' },
            {
              label: 'Camera and Photos',
              text: 'To capture or select images for supported profile, work-update or document-submission features.',
            },
            {
              label: 'Notifications',
              text: 'To deliver relevant reminders, account notifications and service updates.',
            },
          ]}
        />
        <p className="mt-4">
          You can manage permissions through your device settings. Disabling a permission may limit
          the related feature.
        </p>
      </>
    ),
  },
  {
    id: 'mobile-service-providers',
    title: 'Mobile Service Providers',
    body: (
      <>
        <p>
          We use third-party service providers for authentication, hosting, storage and
          notifications. These providers process the information necessary to deliver their services
          and are required to provide appropriate protection for personal information.
        </p>
        <p className="mt-4">
          Where analytics or advertising services receive personal information, we disclose the
          information shared, its purpose and applicable consent choices. If no such services are
          used, this sentence does not apply.
        </p>
      </>
    ),
  },
  {
    id: 'account-deletion',
    title: 'Retention and Account Deletion',
    body: (
      <>
        <p>
          We retain attendance records and stored location information for the period required to
          administer attendance and meet legal obligations.
        </p>
        <p className="mt-4">
          You can initiate account deletion within the app through the account settings menu. For
          assistance, contact <Email />.
        </p>
        <p className="mt-4">
          Requests are processed within a reasonable timeframe. Associated personal information is
          deleted unless retention is required by law. Any retained records are limited to the
          applicable legal purpose and retention period.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    title: 'Security and Data Processing',
    body: (
      <>
        <p>
          We use appropriate technical and organizational security measures to protect personal
          information against unauthorized access, disclosure, alteration and loss.
        </p>
        <p className="mt-4">
          Personal information may be stored or processed in the countries or regions where our
          service providers operate. Where international transfers occur, we apply safeguards
          required by applicable law.
        </p>
      </>
    ),
  },
  {
    id: 'payments',
    title: 'Payments on Different Platforms',
    body: (
      <p>
        Programme payments may be available through our website and processed by our payment
        partners. Course purchases and payment checkout are not available within the MGA Academy iOS
        app.
      </p>
    ),
  },
]

function TocList({ activeId, onSelect }) {
  return (
    <ol className="space-y-1 text-sm">
      {sections.map((s, i) => {
        const isActive = activeId === s.id
        return (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              onClick={(e) => onSelect(e, s.id)}
              aria-current={isActive ? 'true' : undefined}
              className={`flex gap-2 border-l-2 py-1.5 pl-3 transition-colors ${
                isActive
                  ? 'border-[#c9a24a] font-semibold text-[#0a1428]'
                  : 'border-transparent text-slate-500 hover:text-[#0a1428]'
              }`}
            >
              <span className={isActive ? 'text-[#c9a24a]' : 'text-slate-400'}>{i + 1}.</span>
              {s.title}
            </a>
          </li>
        )
      })}
    </ol>
  )
}

function PrivacyPage() {
  const [activeId, setActiveId] = useState(sections[0].id)
  const visibleRef = useRef(new Set())

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Privacy Policy | Medical Global Academy'
    return () => {
      document.title = previousTitle
    }
  }, [])

  useEffect(() => {
    const visible = visibleRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        })
        const first = sections.find((s) => visible.has(s.id))
        if (first) setActiveId(first.id)
      },
      // Top margin clears the sticky navbar; bottom margin makes the upper part of the viewport count
      { rootMargin: '-120px 0px -55% 0px' }
    )
    sections.forEach((s) => {
      const node = document.getElementById(s.id)
      if (node) observer.observe(node)
    })
    return () => {
      observer.disconnect()
      visible.clear()
    }
  }, [])

  const handleSelect = (e, id) => {
    const node = document.getElementById(id)
    if (!node) return
    e.preventDefault()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    node.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${id}`)
    setActiveId(id)
  }

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
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-white/60">Last updated: September 25, 2026</p>
          <p className="mt-6 max-w-3xl text-base md:text-lg leading-relaxed text-white/85">
            This Privacy Policy explains how we collect, use, store and share information when you
            use our services.
          </p>
        </div>
      </section>

      {/* 2. Body */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:grid lg:grid-cols-[260px_1fr] lg:gap-16">
          {/* On this page — desktop */}
          <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#c9a24a]">
                On this page
              </p>
              <TocList activeId={activeId} onSelect={handleSelect} />
            </nav>
          </aside>

          <div className="min-w-0">
            {/* On this page — mobile */}
            <details className="group mb-10 rounded-xl border border-slate-200 bg-slate-50 lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#0a1428] [&::-webkit-details-marker]:hidden">
                On this page
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#c9a24a] transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <nav aria-label="On this page" className="px-3 pb-4">
                <TocList activeId={activeId} onSelect={handleSelect} />
              </nav>
            </details>

            <div className="max-w-3xl space-y-12 text-base md:text-[17px] leading-[1.8] text-slate-600">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-28 md:scroll-mt-32">
                  <h2 className={`${serif} mb-4 text-2xl md:text-3xl font-bold text-[#0a1428]`}>
                    <span className="text-[#c9a24a]">{i + 1}.</span> {s.title}
                  </h2>
                  {s.body}
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPage
