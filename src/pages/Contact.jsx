import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF } from '../data/contactInfo.js'
import { socialLinks } from '../data/socialLinks.js'

const serif = "font-['Playfair_Display',serif]"

const icons = {
  phone:
    'M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.8 19.8 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z',
  mail: 'M3 5h18v14H3z M3 7l9 6 9-6',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18z M12 7v5l3 2',
  send: 'M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z',
  check: 'M20 6L9 17l-5-5',
}

const contactMethods = [
  {
    label: 'Call us',
    value: PHONE_DISPLAY,
    href: PHONE_HREF,
    note: 'Speak directly with a course counsellor.',
    icon: icons.phone,
  },
  {
    label: 'Email us',
    value: EMAIL,
    href: EMAIL_HREF,
    note: 'We usually reply within one working day.',
    icon: icons.mail,
  },
]

const EMPTY_FORM = { name: '', email: '', phone: '', message: '' }

function validate(values) {
  const errors = {}
  if (values.name.trim().length < 2) errors.name = 'Please enter your full name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }
  const digits = values.phone.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 15) {
    errors.phone = 'Please enter a valid phone number (10–15 digits).'
  }
  if (values.message.trim().length < 10) {
    errors.message = 'Please tell us a little more (at least 10 characters).'
  }
  return errors
}

// There is no enquiry API on the site yet, so the form opens the visitor's email
// app with the message pre-filled to the support inbox. Swap this function for an
// API call when a backend exists; the rest of the form stays the same.
function sendEnquiry(values) {
  const subject = `Website enquiry from ${values.name.trim()}`
  const body = [
    `Name: ${values.name.trim()}`,
    `Email: ${values.email.trim()}`,
    `Phone: ${values.phone.trim()}`,
    '',
    values.message.trim(),
  ].join('\n')
  window.location.href = `${EMAIL_HREF}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function Icon({ path, className = 'h-5 w-5', strokeWidth = 1.8 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}

function Eyebrow({ children, light = false }) {
  return (
    <span
      className={`inline-block rounded-full border px-5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] ${
        light
          ? 'border-[#c9a24a]/40 bg-[#c9a24a]/10 text-[#c9a24a]'
          : 'border-[#c9a24a]/30 bg-[#f8f0dc] text-[#b08a3a]'
      }`}
    >
      {children}
    </span>
  )
}

function GoldRule({ center = false }) {
  return <div className={`mt-5 h-1 w-16 rounded-full bg-[#c9a24a] ${center ? 'mx-auto' : ''}`} />
}

function EcgTrace({ className = '' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full text-[#c9a24a] ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path d="M0 60 H380 L400 60 L415 30 L430 95 L445 10 L462 85 L475 60 H760 L780 60 L795 35 L810 90 L825 15 L842 80 L855 60 H1200" />
    </svg>
  )
}

function BrandIcon({ path, color, className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={color} aria-hidden="true" focusable="false">
      <path d={path} />
    </svg>
  )
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-[#0a1428]">
        {label} <span className="text-[#b08a3a]" aria-hidden="true">*</span>
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass = (hasError) =>
  `block w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-800 placeholder:text-slate-400 transition-colors duration-200 focus:outline-none focus:ring-2 sm:text-sm ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
      : 'border-slate-200 focus:border-[#c9a24a] focus:ring-[#c9a24a]/25'
  }`

function ContactForm() {
  const [values, setValues] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const update = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    // Clear a field's error as soon as the visitor starts fixing it
    if (errors[name]) setErrors((errs) => ({ ...errs, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus()
      return
    }
    sendEnquiry(values)
    setSent(true)
    setValues(EMPTY_FORM)
  }

  const describedBy = (name) => (errors[name] ? `contact-${name}-error` : undefined)

  return (
    <div className="relative">
      {/* Gold glow behind the card, as on the About page */}
      <div
        aria-hidden="true"
        className="absolute -inset-4 rounded-[2rem] bg-[radial-gradient(circle_at_60%_40%,rgba(201,162,74,0.22),transparent_70%)] blur-2xl"
      />
      <div className="relative rounded-[1.75rem] border border-[#c9a24a]/30 bg-white p-6 text-slate-800 shadow-[0_30px_70px_rgba(10,20,40,0.35)] sm:p-8 md:p-10">
        <h2 className={`${serif} text-2xl font-bold text-[#0a1428] md:text-3xl`}>
          Send us a <span className="italic text-[#c9a24a]">message</span>
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Ask about a course, fees, eligibility or enrolment and our team will get back to you.
        </p>

        {sent && (
          <div
            role="status"
            className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            <Icon path={icons.check} className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.4} />
            <p>
              Thank you! Your email app should now open with your message ready to send. If it
              didn&apos;t, write to us at{' '}
              <a href={EMAIL_HREF} className="font-semibold underline underline-offset-2">
                {EMAIL}
              </a>
              .
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field id="contact-name" label="Name" error={errors.name}>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Dr. Your Name"
                value={values.name}
                onChange={update}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={describedBy('name')}
                className={inputClass(errors.name)}
              />
            </Field>
          </div>
          <Field id="contact-email" label="Email" error={errors.email}>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={update}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={describedBy('email')}
              className={inputClass(errors.email)}
            />
          </Field>
          <Field id="contact-phone" label="Phone" error={errors.phone}>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="+91 98765 43210"
              value={values.phone}
              onChange={update}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={describedBy('phone')}
              className={inputClass(errors.phone)}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field id="contact-message" label="Message" error={errors.message}>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                placeholder="Which course are you interested in? Any questions?"
                value={values.message}
                onChange={update}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={describedBy('message')}
                className={`${inputClass(errors.message)} resize-y`}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#c9a24a] px-8 text-sm font-semibold tracking-wide text-[#0a1428] shadow-[0_8px_24px_rgba(201,162,74,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d8b25a] hover:shadow-[0_12px_34px_rgba(201,162,74,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1428] focus-visible:ring-offset-2 sm:w-auto"
            >
              Submit
              <Icon
                path={icons.send}
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2}
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Contact() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Contact Us | Medical Global Academy'
    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <div className="font-['DM_Sans',sans-serif] text-slate-800">
      {/* 1. Hero: heading + contact details on the left, form on the right */}
      <section className="relative overflow-clip bg-gradient-to-br from-[#0a1428] via-[#0A1A3A] to-[#0F2A5C] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_55%_at_15%_20%,rgba(201,162,74,0.18),transparent_70%),radial-gradient(ellipse_50%_50%_at_95%_90%,rgba(58,124,184,0.2),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,black,transparent)]"
        />
        <EcgTrace className="opacity-[0.1]" />

        <div className="relative mx-auto grid max-w-[1140px] grid-cols-1 gap-12 px-4 pt-5 pb-16 sm:px-6 md:pt-8 md:pb-20 lg:grid-cols-[5fr_7fr] lg:gap-16 lg:pt-10">
          <div>
            <div className="flex items-center gap-3 motion-safe:animate-fade-up">
              <span className="h-px w-6 shrink-0 bg-[#c9a24a] sm:w-10" />
              <span className="rounded-full border border-[#c9a24a]/40 bg-[#c9a24a]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a24a]">
                Contact Us
              </span>
            </div>
            <h1
              className={`${serif} mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem] motion-safe:animate-fade-up [animation-delay:100ms]`}
            >
              Get in Touch
              <span className="block bg-gradient-to-r from-[#e6c573] to-[#c9a24a] bg-clip-text italic text-transparent">
                With Our Team
              </span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-slate-300 md:text-lg motion-safe:animate-fade-up [animation-delay:200ms]">
              Have a question about a programme, admissions or your enrolment? Call, email or send
              us a message and a counsellor will help you choose the right course.
            </p>

            <ul className="mt-10 space-y-3">
              {contactMethods.map((m, i) => (
                <li
                  key={m.label}
                  className="motion-safe:animate-fade-up"
                  style={{ animationDelay: `${300 + i * 75}ms` }}
                >
                  <a
                    href={m.href}
                    className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a24a]/60 hover:bg-white/[0.07] hover:shadow-[0_14px_36px_rgba(201,162,74,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24a]"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-gradient-to-b from-[#e6c573] to-[#c9a24a] transition-transform duration-300 group-hover:scale-y-100"
                    />
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#c9a24a]/15 text-[#c9a24a] ring-1 ring-[#c9a24a]/40 transition-all duration-300 group-hover:bg-[#c9a24a] group-hover:text-[#0a1428]">
                      <Icon path={m.icon} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-[#c9a24a]">
                        {m.label}
                      </span>
                      <span className="mt-0.5 block text-base font-semibold text-white [overflow-wrap:anywhere] sm:text-lg">
                        {m.value}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-slate-300">{m.note}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 motion-safe:animate-fade-up [animation-delay:450ms]">
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a24a]">
                Follow us
                <span className="h-px flex-1 bg-gradient-to-r from-[#c9a24a]/40 to-transparent" />
              </p>
              <ul className="mt-4 flex flex-wrap gap-3">
                {socialLinks.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Medical Global Academy on ${s.name} (opens in a new tab)`}
                      title={s.name}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#133560] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9a24a] hover:shadow-[0_8px_20px_rgba(201,162,74,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24a] motion-reduce:transition-none"
                    >
                      <BrandIcon path={s.path} color={s.color} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="motion-safe:animate-fade-up [animation-delay:200ms]">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* 2. Social channels */}
      <section className="relative overflow-hidden bg-[#eef3f8] py-14 md:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(10,20,40,0.05)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,black,transparent)]"
        />
        <div className="relative mx-auto max-w-[1140px] px-4 sm:px-6">
          <div className="text-center">
            <Eyebrow>Stay Connected</Eyebrow>
            <h2 className={`${serif} mt-5 text-3xl font-bold text-[#0a1428] md:text-5xl`}>
              Join Our <span className="italic text-[#c9a24a]">Community</span>
            </h2>
            <GoldRule center />
            <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-slate-500 md:text-lg">
              Follow Medical Global Academy for course announcements, clinical updates and
              highlights from our faculty and learners.
            </p>
          </div>

          {/* Compact pills, centred; they wrap onto extra rows on small screens */}
          <ul className="mt-8 flex flex-wrap justify-center gap-3">
            {socialLinks.map((s) => (
              <li key={s.name}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.name} (opens in a new tab)`}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white py-1.5 pr-4 pl-1.5 shadow-[0_4px_14px_rgba(10,20,40,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9a24a] hover:shadow-[0_10px_24px_rgba(10,20,40,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24a]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0a1428]">
                    <BrandIcon path={s.path} color={s.color} className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold text-[#0a1428]">{s.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. CTA banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1428] via-[#0A1A3A] to-[#0F2A5C] py-20 text-white md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_30%,rgba(201,162,74,0.2),transparent_70%)]"
        />
        <EcgTrace className="opacity-[0.12]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className={`${serif} text-3xl font-bold leading-tight sm:text-4xl md:text-5xl`}>
            Ready to{' '}
            <span className="bg-gradient-to-r from-[#e6c573] to-[#c9a24a] bg-clip-text italic text-transparent">
              Advance Your Career?
            </span>
          </h2>
          <GoldRule center />
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-slate-300 md:text-lg">
            Browse our certificate, fellowship and PG diploma programmes, or talk to a counsellor
            today.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/courses"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#c9a24a] px-8 py-3.5 text-sm font-semibold tracking-wide text-[#0a1428] shadow-[0_8px_24px_rgba(201,162,74,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d8b25a] hover:shadow-[0_12px_34px_rgba(201,162,74,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
            >
              Explore Courses
            </Link>
            <a
              href={PHONE_HREF}
              className="inline-flex w-full items-center justify-center rounded-full border-2 border-white/70 px-8 py-3.5 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9a24a] hover:text-[#c9a24a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24a] sm:w-auto"
            >
              Talk to Counsellor
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
