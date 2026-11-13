import { Link } from 'react-router-dom'
import ValuesSection from '../components/ValuesSection.jsx'

const serif = "font-['Playfair_Display',serif]"

// icon = SVG path(s) drawn on a 24x24 grid (stroke icons)
const stats = [
  {
    icon: 'M6 3v6a4 4 0 008 0V3 M10 13v3a5 5 0 0010 0v-2 M20 14a2 2 0 100-4 2 2 0 000 4z',
    value: '200+',
    label: 'Practicing Physicians',
  },
  {
    icon: 'M4 19.5A2.5 2.5 0 016.5 17H20 M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z',
    value: '150+',
    label: 'Specialized Programs',
  },
  {
    icon: 'M6 18h8 M3 22h18 M14 22a7 7 0 100-14h-1 M9 14h2 M9 12a2 2 0 01-2-2V6h6v4a2 2 0 01-2 2z M12 6V3a1 1 0 00-1-1H9a1 1 0 00-1 1v3',
    value: '25+',
    label: 'Medical Specializations',
  },
  {
    icon: 'M12 3L2 8l10 5 10-5-10-5z M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5',
    value: '10K+',
    label: 'Students Trained',
  },
]

const specialties = [
  'Cardiology',
  'Medicine',
  'Oncology',
  'Nephrology',
  'Neurology',
  'Orthopedics',
  'Obstetrics & Gynecology',
]

// Hero "What we offer" tiles. Each line restates the hero copy; no new claims.
const offerings = [
  {
    title: 'PG Diplomas',
    line: 'Built for the professional development of healthcare practitioners.',
    icon: 'M12 3L2 8l10 5 10-5-10-5z M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5',
    delay: '[animation-delay:350ms]',
  },
  {
    title: 'Fellowships',
    line: 'Flexible learning with attending and non-attending classes.',
    icon: 'M12 15a4 4 0 100-8 4 4 0 000 8z M9 14.5L8 21l4-2 4 2-1-6.5',
    delay: '[animation-delay:425ms]',
  },
  {
    title: 'Certificates',
    line: 'Pursue your education at your convenience, without compromising on quality.',
    icon: 'M6 3h9l4 4v14H6z M14 3v5h5 M9 13h7 M9 17h5',
    delay: '[animation-delay:500ms]',
  },
]

const recognitions = ['CPD Accredited', 'ACTD Accredited', 'Global Recognition']

const specializations = [
  {
    title: 'Clinical Cardiology',
    icon: 'M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 000-7.8z',
  },
  {
    title: 'Interventional Cardiology',
    icon: 'M22 12h-4l-3 9L9 3l-3 9H2',
  },
  {
    title: 'Preventive Cardiology',
    icon: 'M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z M9 12l2 2 4-4',
  },
  {
    title: 'Pediatric Cardiology',
    icon: 'M12 21a9 9 0 100-18 9 9 0 000 18z M9 10h.01 M15 10h.01 M9.5 15a3.5 3.5 0 005 0',
  },
  {
    title: 'Cardiac Rehabilitation',
    icon: 'M3 17l6-6 4 4 8-8 M15 7h6v6',
  },
]

const learningModes = [
  {
    label: 'Live Online Classes',
    icon: 'M3 5h18v11H3z M8 20h8 M12 16v4 M10 8.5v4l3.5-2-3.5-2z',
  },
  {
    label: 'Self-Paced Learning',
    icon: 'M12 21a9 9 0 100-18 9 9 0 000 18z M12 7v5l3 2',
  },
  {
    label: 'Clinical Mentorship',
    icon: 'M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1 M9.5 10a3 3 0 100-6 3 3 0 000 6z M21 19v-1a4 4 0 00-3-3.87 M16 4.13a3 3 0 010 5.74',
  },
]

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

function OfferingsBlock() {
  return (
    <div className="mt-10">
      <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a24a] motion-safe:animate-fade-up [animation-delay:300ms]">
        What we offer
        <span className="h-px flex-1 bg-gradient-to-r from-[#c9a24a]/40 to-transparent" />
      </p>

      <ul className="mt-5 space-y-3">
        {offerings.map((item) => (
          <li key={item.title} className={`motion-safe:animate-fade-up ${item.delay}`}>
            <Link
              to="/courses"
              className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a24a]/60 hover:bg-white/[0.07] hover:shadow-[0_14px_36px_rgba(201,162,74,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24a]"
            >
              {/* Gold edge appears on hover */}
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-gradient-to-b from-[#e6c573] to-[#c9a24a] transition-transform duration-300 group-hover:scale-y-100"
              />
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#c9a24a]/15 text-[#c9a24a] ring-1 ring-[#c9a24a]/40 transition-all duration-300 group-hover:bg-[#c9a24a] group-hover:text-[#0a1428]">
                <Icon path={item.icon} />
              </span>
              <span className="min-w-0 flex-1">
                <span className={`${serif} block text-lg font-bold text-white`}>{item.title}</span>
                <span className="mt-0.5 block text-xs leading-snug text-slate-300">{item.line}</span>
              </span>
              <span className="shrink-0 text-[#c9a24a]/60 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#c9a24a]">
                <Icon path="M9 6l6 6-6 6" className="h-4 w-4" strokeWidth={2} />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        to="/courses"
        className="group mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#c9a24a] px-7 text-sm font-semibold text-[#0a1428] shadow-[0_8px_24px_rgba(201,162,74,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d8b25a] hover:shadow-[0_12px_34px_rgba(201,162,74,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto motion-safe:animate-fade-up [animation-delay:575ms]"
      >
        Explore Courses
        <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 10h12 M11 5l5 5-5 5" />
        </svg>
      </Link>
    </div>
  )
}

function About() {
  return (
    <div className="font-['DM_Sans',sans-serif] text-slate-800">
      {/* 1. Hero */}
      {/* overflow-clip, not overflow-hidden: hidden would make this section the sticky
          column's scroll container, so the column would never stick to the viewport */}
      <section className="relative overflow-clip bg-gradient-to-br from-[#0a1428] via-[#0A1A3A] to-[#0F2A5C] text-white">
        {/* Soft glows so the gradient doesn't feel flat */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_55%_at_15%_20%,rgba(201,162,74,0.18),transparent_70%),radial-gradient(ellipse_50%_50%_at_95%_90%,rgba(58,124,184,0.2),transparent_70%)]"
        />
        {/* Dot grid, faded towards the edges */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,black,transparent)]"
        />
        <EcgTrace className="opacity-[0.1]" />

        {/* Navbar is sticky (in flow) here, so the top padding is just the gap below it */}
        <div className="relative mx-auto grid max-w-[1140px] grid-cols-1 gap-10 px-4 pt-5 pb-16 sm:px-6 md:pt-8 md:pb-20 lg:grid-cols-[5fr_7fr] lg:gap-16 lg:pt-10">
          {/* Left: label, heading, offerings + CTA (sticky on desktop).
              top = 85px navbar + the same 40px gap it starts with, so it doesn't jump when it sticks */}
          <div className="lg:sticky lg:top-31 lg:self-start">
            <div className="flex items-center gap-3 motion-safe:animate-fade-up">
              <span className="h-px w-6 shrink-0 bg-[#c9a24a] sm:w-10" />
              <span className="rounded-full border border-[#c9a24a]/40 bg-[#c9a24a]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a24a]">
                About Us
              </span>
            </div>
            <h1
              className={`${serif} mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem] motion-safe:animate-fade-up [animation-delay:100ms]`}
            >
              About Medical
              <span className="block bg-gradient-to-r from-[#e6c573] to-[#c9a24a] bg-clip-text italic text-transparent">
                Global Academy
              </span>
            </h1>

            <div className="mt-6 flex items-center gap-4 text-[#c9a24a] motion-safe:animate-fade-up [animation-delay:200ms]">
              <span className="h-px w-8 shrink-0 bg-[#c9a24a]/50" />
              <span className="text-[11px] font-semibold tracking-[0.2em] sm:text-xs">
                TRUSTED · ACCREDITED · CAREER FOCUSED
              </span>
            </div>

            <OfferingsBlock />
          </div>

          {/* Right: story */}
          <div className="space-y-6 text-left text-base leading-relaxed text-slate-300 md:text-lg">
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur motion-safe:animate-fade-up [animation-delay:200ms] md:p-8">
              {/* Gold quote mark */}
              <span
                aria-hidden="true"
                className={`${serif} pointer-events-none absolute -top-5 left-6 select-none text-7xl leading-none text-[#c9a24a]/50`}
              >
                &ldquo;
              </span>
              <p className="text-lg text-white md:text-xl">
                Medical Global Academy is a leading platform for medical education in India, trusted
                by more than 200 doctors and recognized for its commitment to excellence in
                healthcare training. Our courses are{' '}
                <strong className="font-semibold text-[#c9a24a]">CPD &amp; ACTD accredited</strong>,
                ensuring high standards and credibility.
              </p>
            </div>
            <p className="motion-safe:animate-fade-up [animation-delay:300ms]">
              We offer a diverse range of programs, including{' '}
              <strong className="font-medium text-white">PG Diplomas</strong>,{' '}
              <strong className="font-medium text-white">Fellowships</strong>, and{' '}
              <strong className="font-medium text-white">Certificates</strong>, designed to meet the
              professional development needs of healthcare practitioners. Our extensive course
              catalog spans over 150 programs covering specialties such as Cardiology, Medicine,
              Oncology, Nephrology, Neurology, Orthopedics, Obstetrics &amp; Gynecology, and many
              more. Whether you are seeking to enhance your expertise in a specific field or broaden
              your medical knowledge, Medical Global Academy has a course tailored to your goals.
            </p>
            <ul
              aria-label="Specialties"
              className="flex flex-wrap gap-2 motion-safe:animate-fade-up [animation-delay:350ms]"
            >
              {specialties.map((name) => (
                <li
                  key={name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs text-white/85 transition-colors duration-300 hover:border-[#c9a24a]/60 hover:text-white sm:text-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c9a24a]" aria-hidden="true" />
                  {name}
                </li>
              ))}
            </ul>
            <p className="motion-safe:animate-fade-up [animation-delay:400ms]">
              Understanding the demanding schedules of medical professionals, we provide{' '}
              <strong className="font-medium text-white">flexible learning</strong> options with both
              attending and non-attending classes. This ensures that you can pursue your education
              at your convenience without compromising on quality.
            </p>
            <p className="border-l-2 border-[#c9a24a]/60 pl-5 motion-safe:animate-fade-up [animation-delay:500ms]">
              At Medical Global Academy, we are committed to empowering healthcare professionals
              with the knowledge and skills needed to excel in their careers and contribute to
              improved patient outcomes. Join us to advance your medical journey with courses
              designed to inspire growth, innovation, and excellence in healthcare.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Stat cards */}
      <section className="relative bg-white px-4 pt-16 sm:px-6 md:pt-20">
        <div className="mx-auto grid max-w-[1140px] grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-slate-200/80 bg-white px-4 py-9 text-center shadow-[0_6px_24px_rgba(10,20,40,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#c9a24a] hover:shadow-[0_18px_44px_rgba(10,20,40,0.12)] md:py-11"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fdf8ed] text-[#c9a24a] ring-1 ring-[#c9a24a]/25 transition-all duration-300 group-hover:bg-[#c9a24a] group-hover:text-[#0a1428] group-hover:shadow-[0_10px_24px_rgba(201,162,74,0.4)]">
                <Icon path={stat.icon} className="h-7 w-7" />
              </span>
              <div className={`${serif} mt-5 text-4xl font-bold text-[#0a1428] lining-nums md:text-5xl`}>
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium text-slate-500">{stat.label}</div>
              {/* Bottom accent line grows on hover */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#0a1428] to-[#c9a24a] transition-transform duration-500 group-hover:scale-x-100"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 3. Who we are */}
      <section className="relative overflow-hidden bg-white py-20 md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_35%_40%_at_0%_60%,rgba(201,162,74,0.08),transparent_70%)]"
        />
        <div className="relative mx-auto grid max-w-[1140px] grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>Who We Are</Eyebrow>
            <h2 className={`${serif} mt-5 text-3xl font-bold leading-[1.15] text-[#0a1428] md:text-4xl`}>
              Advancing Cardiology Education for{' '}
              <span className="italic text-[#c9a24a]">Modern Healthcare</span>
            </h2>
            <GoldRule />
            <p className="mt-6 leading-relaxed text-slate-600">
              Medical Global Academy was founded on a commitment to clinical excellence. Our
              programs are built and taught by practicing cardiologists, so every module reflects
              what doctors actually face on the ward, in the cath lab and in the clinic.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              We bridge the gap between general medical training and cardiology specialization —
              giving MBBS graduates and practicing physicians a structured, case-based path to
              build real expertise in diagnosing and managing heart disease.
            </p>
          </div>

          <div className="relative">
            {/* Gold glow behind the card */}
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2rem] bg-[radial-gradient(circle_at_60%_40%,rgba(201,162,74,0.25),transparent_70%)] blur-2xl"
            />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-[#c9a24a]/30 bg-gradient-to-br from-[#0a1428] via-[#16274a] to-[#2b4a85] p-8 text-white shadow-[0_30px_70px_rgba(10,20,40,0.35)] md:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_70%_70%_at_80%_20%,black,transparent)]"
              />
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c9a24a] text-[#0a1428] shadow-[0_10px_24px_rgba(201,162,74,0.4)]">
                  <Icon
                    path="M3 21h18 M5 21V10 M19 21V10 M9 21V10 M15 21V10 M2 10l10-6 10 6"
                    className="h-7 w-7"
                  />
                </div>
                <h3 className={`${serif} mt-6 text-2xl font-bold`}>Credibility &amp; Recognition</h3>
                <p className="mt-4 leading-relaxed text-white/80">
                  Our programs carry CPD and ACTD accreditation, so the qualifications you earn are
                  recognised and support your continuing professional development wherever you practise.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {recognitions.map((r) => (
                    <span
                      key={r}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#c9a24a]/40 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
                    >
                      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-[#c9a24a]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 8.5l3.5 3.5 6.5-7" />
                      </svg>
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <ValuesSection />

      {/* 4. Specializations */}
      <section className="relative overflow-hidden bg-[#eef3f8] py-20 md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(10,20,40,0.05)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,black,transparent)]"
        />
        <div className="relative mx-auto max-w-[1140px] px-4 sm:px-6">
          <div className="text-center">
            <Eyebrow>Programs</Eyebrow>
            <h2 className={`${serif} mt-5 text-3xl font-bold text-[#0a1428] md:text-5xl`}>
              High-Demand <span className="italic text-[#c9a24a]">Cardiology Specializations</span>
            </h2>
            <GoldRule center />
          </div>
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
            {specializations.map((s, i) => (
              <div
                key={s.title}
                className={`group relative flex flex-col items-center overflow-hidden rounded-2xl border border-slate-200/80 bg-white px-4 pt-9 pb-8 text-center shadow-[0_6px_24px_rgba(10,20,40,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#c9a24a] hover:shadow-[0_18px_44px_rgba(10,20,40,0.12)] ${
                  i === specializations.length - 1 ? 'col-span-2 sm:col-span-1' : ''
                }`}
              >
                {/* Big faint number */}
                <span
                  aria-hidden="true"
                  className={`${serif} pointer-events-none absolute right-3 top-2 select-none text-4xl font-bold leading-none text-slate-100 transition-colors duration-300 group-hover:text-[#c9a24a]/25`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fdf8ed] text-[#c9a24a] ring-1 ring-[#c9a24a]/25 transition-all duration-300 group-hover:bg-[#c9a24a] group-hover:text-[#0a1428] group-hover:shadow-[0_10px_24px_rgba(201,162,74,0.4)]">
                  <Icon path={s.icon} className="h-8 w-8" />
                </div>
                <h3 className={`${serif} relative mt-5 text-base font-bold leading-snug text-[#0a1428] md:text-lg`}>
                  {s.title}
                </h3>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#0a1428] to-[#c9a24a] transition-transform duration-500 group-hover:scale-x-100"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Flexible learning */}
      <section className="relative overflow-hidden bg-white py-20 md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_50%_at_50%_0%,rgba(201,162,74,0.1),transparent_70%)]"
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className={`${serif} text-3xl font-bold text-[#0a1428] md:text-5xl`}>
            Designed for <span className="italic text-[#c9a24a]">Working Medical Professionals</span>
          </h2>
          <GoldRule center />
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-slate-500 md:text-lg">
            We know doctors don&apos;t have time to step away from practice. Our programs combine
            live sessions, recorded lectures and mentorship so you can build cardiology expertise
            on a schedule that works around your shifts.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {learningModes.map((m) => (
              <div
                key={m.label}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-[0_6px_24px_rgba(10,20,40,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a24a] hover:shadow-[0_14px_34px_rgba(10,20,40,0.1)] sm:flex-col sm:text-center"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0a1428] text-[#c9a24a] transition-all duration-300 group-hover:bg-[#c9a24a] group-hover:text-[#0a1428]">
                  <Icon path={m.icon} className="h-6 w-6" />
                </span>
                <span className="font-semibold text-[#0a1428]">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Mission banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1428] via-[#0A1A3A] to-[#0F2A5C] py-20 text-white md:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_30%,rgba(201,162,74,0.2),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,black,transparent)]"
        />
        <EcgTrace className="opacity-[0.12]" />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Eyebrow light>Our Mission</Eyebrow>
          <h2 className={`${serif} mt-6 text-3xl font-bold leading-tight sm:text-4xl md:text-6xl`}>
            Empowering{' '}
            <span className="bg-gradient-to-r from-[#e6c573] to-[#c9a24a] bg-clip-text italic text-transparent">
              Cardiology Excellence
            </span>
          </h2>
          <GoldRule center />
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-slate-300 md:text-lg">
            Our mission is to equip healthcare professionals with the cardiology knowledge,
            clinical judgement and confidence they need to deliver better care for every heart
            they treat.
          </p>
          <Link
            to="/courses"
            className="group mt-10 inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#c9a24a] px-9 py-3.5 font-semibold text-[#0a1428] shadow-[0_8px_24px_rgba(201,162,74,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d8b25a] hover:shadow-[0_12px_34px_rgba(201,162,74,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Enroll Today
            <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 10h12 M11 5l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default About
