import { useState } from 'react'
import { Link } from 'react-router-dom'
import CoursesButton from './CoursesButton.jsx'
import { COURSE_DISCLAIMER_BODY, COURSE_DISCLAIMER_LABEL } from '../constants/disclaimer.js'
import { EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF } from '../data/contactInfo.js'
import { socialLinks } from '../data/socialLinks.js'

// Same logo the Navbar uses; falls back to the "MGA" box if it fails to load
const LOGO_URL = 'https://medicalglobalacademy.com/wp-content/uploads/2026/08/logo_new.png'

// `type` must match the Courses page filter values (the API's own types)
const coursesOfType = (type) => `/courses?type=${encodeURIComponent(type)}`

const linkGroups = [
  {
    heading: 'Explore',
    showCoursesButton: true,
    links: [
      { to: '/', label: 'Home' },
      { to: '/about', label: 'About ' },
      { to: '/courses', label: 'Courses' },
      { to: '/doctors', label: 'Doctors' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    heading: 'Courses types',
    links: [
      { to: coursesOfType('Certificate'), label: 'Certificate courses' },
      { to: coursesOfType('Fellowship'), label: 'Fellowship' },
      { to: coursesOfType('Pg Diploma'), label: 'PG Diploma' },
    ],
  },
]

// Shown in the bottom bar. Only pages that exist in the router.
const legalLinks = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
  { to: '/sitemap', label: 'Sitemap' },
  { to: '/refund-policy', label: 'Refund Policy' },
]

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#c9a24a]'

const headingClass =
  'relative mb-3.5 pb-2 text-[15px] font-bold tracking-[0.02em] text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-7 after:rounded-[2px] after:bg-[#c9a24a]'

// Font size is set per use (text-sm in columns, 13px in the bottom bar)
const linkClass = `rounded-[4px] underline decoration-transparent decoration-1 underline-offset-4 transition-[color,text-decoration-color] duration-200 ease-[ease] hover:decoration-[#c9a24a] motion-reduce:transition-none ${focusRing}`

const contactRowClass = 'flex min-w-0 items-start gap-3 text-sm leading-[1.55] text-white'

// Email stays on one line from tablet up; on small phones it may break only as a last resort
const contactLinkClass = `min-w-0 rounded-[4px] wrap-anywhere text-white sm:whitespace-nowrap hover:underline hover:decoration-[#c9a24a] hover:underline-offset-4 ${focusRing}`

const contactIconClass = 'mt-[3px] h-4 w-4 shrink-0 text-[#c9a24a]'

const badgeClass =
  'inline-flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] px-2.5 py-1 text-[12px] leading-[1.3] whitespace-nowrap text-[#cbd5e1]'

const badgeIconClass = 'h-[14px] w-[14px] shrink-0 text-[#c9a24a]'

function SocialIcon({ path, color }) {
  return (
    <svg className="h-[14px] w-[14px]" viewBox="0 0 24 24" fill={color} aria-hidden="true" focusable="false">
      <path d={path} />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg className={contactIconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg className={contactIconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function LayersIcon() {
  return (
    <svg className={badgeIconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg className={badgeIconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
  )
}

function Footer() {
  const [logoFailed, setLogoFailed] = useState(false)

  return (
    // ::before is the thin gold line at the very top of the footer
    <footer className="bg-[#0b2545] font-['DM_Sans',system-ui,-apple-system,'Segoe_UI',Roboto,Arial,sans-serif] text-[15px] leading-[1.5] text-[#cbd5e1] before:block before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(201,162,74,0.55),transparent)]">
      {/* Mobile: 1 column. Tablet: 2 columns. Desktop: 4 columns with thin dividers;
          the link/contact columns size to their content so nothing wraps, the brand
          column takes the rest. All columns align to the top. */}
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-y-7 px-5 py-8 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-8 sm:px-7 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto] lg:gap-0 lg:px-8 lg:py-10">
        {/* Left: brand */}
        <div className="lg:pr-5 xl:pr-10">
          <Link
            to="/"
            className={`inline-flex items-center gap-3 rounded-[6px] text-white ${focusRing}`}
            aria-label="Medical Global Academy — Home"
          >
            {logoFailed ? (
              <span
                className="inline-flex h-8 items-center justify-center rounded-[3px] bg-[#133560] px-[7px] text-[14px] font-medium tracking-[0.02em] text-white"
                aria-hidden="true"
              >
                MGA
              </span>
            ) : (
              <img
                src={LOGO_URL}
                alt=""
                width="256"
                height="256"
                loading="lazy"
                onError={() => setLogoFailed(true)}
                className="h-9 w-auto object-contain"
              />
            )}
            <span className="text-[19px] leading-[1.2] font-bold">Medical Global Academy</span>
          </Link>
          <p className="mt-3 max-w-[280px] text-sm leading-normal text-[#a9b8cf]">
            Certificate and fellowship programs that let practising doctors specialise without
            stepping away from clinical work.
          </p>

          <ul className="mt-3 flex flex-wrap gap-2">
            <li className={badgeClass}>
              <LayersIcon />
              <span>CPD &amp; ACTD Accredited</span>
            </li>
            <li className={badgeClass}>
              <CheckCircleIcon />
              <span>Verified</span>
            </li>
          </ul>

          <ul className="mt-3 flex flex-wrap gap-2">
            {socialLinks.map((s) => (
              <li key={s.name}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Medical Global Academy on ${s.name} (opens in a new tab)`}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] bg-[#133560] transition-[background-color,border-color,translate] duration-200 ease-[ease] hover:border-[#c9a24a] motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none ${focusRing}`}
                >
                  <SocialIcon path={s.path} color={s.color} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Middle: link columns */}
        {linkGroups.map((group) => (
          <nav
            key={group.heading}
            aria-label={group.heading}
            className="lg:border-l lg:border-[rgba(255,255,255,0.1)] lg:px-5 xl:px-10"
          >
            <h2 className={headingClass}>{group.heading}</h2>
            <ul className="grid gap-2 leading-snug">
              {group.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className={`text-sm text-[#cbd5e1] hover:text-white ${linkClass}`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            {group.showCoursesButton && <CoursesButton className="mt-3.5" />}
          </nav>
        ))}

        {/* Right: contact details */}
        <div className="lg:border-l lg:border-[rgba(255,255,255,0.1)] lg:pl-5 xl:pl-10">
          <h2 className={headingClass}>Contact us</h2>
          <ul className="grid gap-2.5">
            <li className={contactRowClass}>
              <MailIcon />
              <a href={EMAIL_HREF} className={contactLinkClass}>
                {EMAIL}
              </a>
            </li>
            <li className={contactRowClass}>
              <PhoneIcon />
              <a href={PHONE_HREF} className={contactLinkClass}>
                {PHONE_DISPLAY}
              </a>
            </li>
          </ul>
          <CoursesButton className="mt-4" />
        </div>
      </div>

      <div className="border-t border-[rgba(255,255,255,0.1)]">
        <div className="mx-auto max-w-[1200px] px-5 pt-3 sm:px-7 lg:px-8">
          <p
            role="note"
            className="mx-auto max-w-[900px] text-center text-xs leading-normal text-[#a9b8cf]/90"
          >
            <strong className="font-semibold text-[#c9a24a]">{COURSE_DISCLAIMER_LABEL}</strong>
            {COURSE_DISCLAIMER_BODY}
          </p>
        </div>
        {/* Bottom bar: copyright + legal links. Extra side padding keeps the text
            clear of the floating chat button at the bottom-right of the page. */}
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-2 px-[72px] pt-3 pb-[max(14px,env(safe-area-inset-bottom))] text-center max-[360px]:px-4 max-[360px]:pb-[max(72px,env(safe-area-inset-bottom))] sm:pr-24 sm:pl-7 lg:flex-row lg:justify-between lg:text-left lg:pl-8">
          <p className="text-[13px] text-[#a9b8cf]">
            © {new Date().getFullYear()} Medical Global Academy. All rights reserved.
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 lg:justify-end">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className={`text-[13px] text-[#a9b8cf] ${linkClass}`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer
