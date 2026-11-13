import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { eligibilityAnswer } from '../data/faqs.js'

const serif = "font-['Playfair_Display',serif]"

const sections = [
  { id: 'acceptance', title: 'Acceptance of Terms' },
  { id: 'eligibility', title: 'Eligibility' },
  { id: 'services', title: 'Services Offered' },
  { id: 'user-responsibilities', title: 'User Responsibilities' },
  { id: 'payment', title: 'Payment and Fees' },
  { id: 'ip', title: 'Intellectual Property' },
  { id: 'privacy', title: 'Privacy Policy' },
  { id: 'liability', title: 'Limitation of Liability' },
  { id: 'termination', title: 'Termination of Access' },
  { id: 'changes', title: 'Changes to the Terms' },
  { id: 'governing', title: 'Governing Law' },
  { id: 'contact', title: 'Contact Us' },
]

const linkClass = 'font-medium text-[#16274a] underline decoration-[#c9a24a]/60 underline-offset-4 hover:text-[#c9a24a] transition-colors'

function sectionBody(id) {
  switch (id) {
    case 'acceptance':
      return (
        <p>
          Welcome to Medical Global Academy. These terms and conditions outline the rules and
          regulations for the use of our website and services. By accessing this website, we assume
          you accept these terms and conditions. Do not continue to use Medical Global Academy if you
          do not agree to all the terms and conditions stated on this page.
        </p>
      )
    case 'eligibility':
      return <p>{eligibilityAnswer}</p>
    case 'services':
      return (
        <p>
          Medical Global Academy offers professional training programs aimed at enhancing the skills
          and knowledge of medical professionals. Our training programs are developed by experts in
          the field, but they do not substitute for any medical board certification or licensing
          requirements.
        </p>
      )
    case 'user-responsibilities':
      return (
        <>
          <p>By using our website and enrolling in our courses, you agree to:</p>
          <ul className="mt-4 space-y-3">
            {[
              'Provide accurate information during registration.',
              'Use the website and training materials solely for your personal, professional development.',
              'Comply with all applicable laws and regulations.',
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a24a]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      )
    case 'payment':
      return (
        <p>
          All courses offered by Medical Global Academy are subject to fees, which are listed on the
          website. Payments must be made in full at the time of registration. No refunds will be
          issued once access to the course materials has been granted.
        </p>
      )
    case 'ip':
      return (
        <>
          <p>
            All content on the Medical Global Academy website, including course materials, videos,
            and resources, is the property of Medical Global Academy.
          </p>
          <p className="mt-4">
            Users may not reproduce, distribute, or use the content for any purpose other than
            personal education without prior written consent.
          </p>
        </>
      )
    case 'privacy':
      return (
        <p>
          Your privacy is important to us. We collect and use personal information according to our{' '}
          <Link to="/privacy" className={linkClass}>
            Privacy Policy
          </Link>
          , which is available on our website.
        </p>
      )
    case 'liability':
      return (
        <p>
          Medical Global Academy is not responsible for any errors or omissions in the content
          provided or any adverse outcomes that arise from applying the skills learned in our
          courses. Use of the information provided is at your own risk.
        </p>
      )
    case 'termination':
      return (
        <p>
          Medical Global Academy reserves the right to terminate your access to the website and its
          services if you breach any of these terms.
        </p>
      )
    case 'changes':
      return (
        <p>
          Medical Global Academy may update these terms and conditions from time to time. Any changes
          will be posted on this page, and continued use of the website implies acceptance of the
          updated terms.
        </p>
      )
    case 'governing':
      return (
        <p>
          These terms and conditions are governed by and construed in accordance with the laws of
          India. Any disputes related to these terms will be subject to the exclusive jurisdiction of
          the courts in India.
        </p>
      )
    case 'contact':
      return (
        <>
          <p>
            If you have any questions or need further clarification on these terms, please contact
            us at:
          </p>
          <div className="mt-4 rounded-xl border border-[#ecdcb8] bg-[#fdfaf3] px-5 py-4 space-y-1">
            <p className={`${serif} font-bold text-[#0a1428]`}>Medical Global Academy</p>
            <p>
              Email:{' '}
              <a href="mailto:support@medicalglobalacademy.com" className={`${linkClass} break-all`}>
                support@medicalglobalacademy.com
              </a>
            </p>
            <p>
              Website:{' '}
              <a href="https://medicalglobalacademy.com" className={linkClass}>
                medicalglobalacademy.com
              </a>
            </p>
          </div>
        </>
      )
    default:
      return null
  }
}

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

function TermsPage() {
  const [activeId, setActiveId] = useState(sections[0].id)
  const visibleRef = useRef(new Set())

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Terms & Conditions | Medical Global Academy'
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
            Terms &amp; Conditions
          </h1>
          <p className="mt-4 text-sm text-white/60">Last updated: September 25, 2026</p>
          <p className="mt-6 max-w-3xl text-base md:text-lg leading-relaxed text-white/85">
            Please read these Terms &amp; Conditions carefully before using the Medical Global
            Academy website or enrolling in any of our courses. By accessing our website, you accept
            these terms in full.
          </p>
        </div>
      </section>

      {/* 2. Body */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:grid lg:grid-cols-[240px_1fr] lg:gap-16">
          {/* On this page — desktop */}
          <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-32">
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
                  {sectionBody(s.id)}
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TermsPage
