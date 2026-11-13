import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ImageLightbox from '../components/ImageLightbox.jsx'
import ProtectedImage from '../components/ProtectedImage.jsx'
import FaqSection from '../components/FaqSection.jsx'
import { generalFaqs } from '../data/faqs.js'
import DoctorCard, { DoctorGrid } from '../components/DoctorCard.jsx'
import { trendingCourses } from '../data/courses.js'
import { loadCardiologyCourses } from '../data/courseApi.js'
import { doctors } from '../data/doctors.js'

const previewDoctors = doctors.slice(0, 4)

const serif = "font-['Playfair_Display',serif]"

const stats = [
  { value: 11406, suffix: '+', label: 'Happy Students' },
  { value: 22, suffix: '+', label: 'Years Experience' },
  { value: 4, suffix: '+', label: 'Expert Doctors' },
  { value: 89, suffix: '%', label: 'Success Rate' },
]

const hospitals = [
  'Medanta',
  'Fortis',
  'Manipal Hospitals',
  'Jeeban Suraksha Hospital',
  'Max Hospital',
]

const pathwaySteps = [
  {
    num: '01',
    badge: 'STEP 1 · FOUNDATION',
    icon: '🎓',
    title: 'Enroll in Program',
    description:
      'Choose from our advanced cardiology and medical certification programs tailored for working professionals.',
  },
  {
    num: '02',
    badge: 'STEP 2 · KNOWLEDGE',
    icon: '👨‍⚕️',
    title: 'Learn From Experts',
    description:
      'Gain knowledge from experienced doctors and healthcare professionals through live and recorded sessions.',
  },
  {
    num: '03',
    badge: 'STEP 3 · PRACTICE',
    icon: '🩺',
    title: 'Practical Training',
    description:
      'Advanced training with real case studies, live procedures, and modern cardiology techniques.',
  },
  {
    num: '04',
    badge: 'STEP 4 · ACHIEVE',
    icon: '📜',
    title: 'Get Certified',
    description:
      'Receive globally recognised certification to advance your medical career and open international opportunities.',
    badges: ['CPD', 'ACTD'],
  },
]

const pathwayHighlights = [
  '500+ graduates placed',
  'Globally recognised',
  'Flexible learning',
  'Expert faculty',
]

// Update these names, hospital affiliations, and review text when you have the final details.
// These are placeholder testimonials for layout/content editing, not verified real reviews.
const testimonials = [
  {
    quote: 'The specialist-led sessions helped me strengthen my understanding of cardiology and approach clinical cases with greater confidence.',
    name: 'Dr. Rohit',
    role: 'Cardiology | Example Hospital',
    rating: 5,
  },
  {
    quote: 'The program provided a structured learning experience and useful insights that I can build on in my professional development.',
    name: 'Dr. Muskan',
    role: 'Medical Professional | Example Hospital',
    rating: 5,
  },
  {
    quote: 'The case-based learning format made the topics easier to follow and helped me connect theory with clinical practice.',
    name: 'Dr. Divyanshu',
    role: 'Cardiology Trainee | Example Hospital',
    rating: 5,
  },
  {
    quote: 'I appreciated the clear teaching approach and the opportunity to revisit learning materials at a flexible pace.',
    name: 'Dr. Sumit',
    role: 'Medical Professional | Example Hospital',
    rating: 5,
  },
  {
    quote: 'The course offered a helpful structure for reviewing important cardiology concepts and continuing my learning.',
    name: 'Dr. Aditya',
    role: 'Cardiology Trainee | Example Hospital',
    rating: 5,
  },
  {
    quote: 'The learning materials were organised and easy to follow, making it convenient to continue studying alongside other responsibilities.',
    name: 'Dr. Ishika',
    role: 'Medical Professional | Example Hospital',
    rating: 5,
  },
]

// icon = SVG path(s) drawn on a 24x24 grid (stroke icons)
const features = [
  {
    icon: 'M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1 M9.5 10a3 3 0 100-6 3 3 0 000 6z M21 19v-1a4 4 0 00-3-3.87 M16 4.13a3 3 0 010 5.74',
    title: 'Expert Faculty',
    description: 'Learn from experienced cardiologists who teach from real clinical practice.',
  },
  {
    icon: 'M22 12h-4l-3 9L9 3l-3 9H2',
    title: 'Advanced Training',
    description: 'Case-based modules that go beyond theory into day-to-day decision making.',
  },
  {
    icon: 'M12 15a6 6 0 100-12 6 6 0 000 12z M8.2 13.9L7 22l5-3 5 3-1.2-8.1',
    title: 'Certified Programs',
    description: 'Earn a certificate on completion to support your professional profile.',
  },
  {
    icon: 'M12 21a9 9 0 100-18 9 9 0 000 18z M3 12h18 M12 3a14 14 0 010 18 M12 3a14 14 0 000 18',
    title: 'Global Opportunities',
    description: 'Skills and knowledge that are relevant to cardiology practice worldwide.',
  },
  {
    icon: 'M4 19.5A2.5 2.5 0 016.5 17H20 M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z',
    title: 'Advanced Curriculum',
    description: 'Regularly updated content aligned with current cardiology guidelines.',
  },
  {
    icon: 'M3 17l6-6 4 4 8-8 M15 7h6v6',
    title: 'Career Growth',
    description: 'Strengthen your expertise and take the next step in your medical career.',
  },
]

const uploads = 'https://medicalglobalacademy.com/wp-content/uploads'

// All four share one card size (see AccreditationCard); kind picks how the image is fitted.
// width/height are given only for the certificates: the lightbox uses them to scale a
// certificate up to fill the screen, while the logos open at their natural size. To serve a
// sharper certificate in the lightbox, drop it into public/certificates/ and add one line,
// e.g. fullSrc: '/certificates/cpd-certificate.png'.
const accreditations = [
  {
    src: `${uploads}/2026/09/WhatsApp-Image-2026-09-25-at-4.27.09-PM.jpeg`,
    kind: 'logo',
    title: 'CPD Accredited Badge',
    alt: 'Accredited CPD & Training Excellence badge, PDCD1106 Dual Training & CPD Accreditation',
  },
  {
    src: `${uploads}/2026/09/WhatsApp-Image-2026-09-24-at-12.17.06-PM.jpeg`,
    kind: 'logo',
    title: 'ACTD Member Seal',
    alt: 'ACTD — American Council of Training and Development eagle seal',
  },
  {
    src: `${uploads}/2026/10/WhatsApp-Image-2026-10-17-at-10.15.41-AM.jpeg`,
    kind: 'certificate',
    width: 1024,
    height: 726,
    title: 'CPD Accreditation Certificate',
    alt: 'Official Certificate of CPD Accreditation certifying that Medical Global Academy has achieved Dual CPD & Provider of Training Excellence status with The CPD Standards Office, provider number PDCD1106, valid 2026–2028',
  },
  {
    src: `${uploads}/2026/10/WhatsApp-Image-2026-10-17-at-5.58.43-PM.jpeg`,
    kind: 'certificate',
    width: 1600,
    height: 1236,
    title: 'ACTD Certificate of Accreditation',
    alt: 'American Council of Training and Development Certificate of Accreditation certifying Medical Global Academy as an accredited professional training institution, accreditation number GNA452N, valid until September 12, 2027',
  },
]

function AccreditationCard({ item, onOpen, onError }) {
  // Every card is the same 3:2 white tile. The image sits in an absolute box so its intrinsic
  // size can't stretch the card. Logos are centred with white space around them and are only
  // ever scaled down (max-* with auto size); certificates fill the tile with a small even inset.
  const isLogo = item.kind === 'logo'
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      aria-label={`View ${item.title} in full size`}
      className="group relative block aspect-[3/2] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_18px_rgba(22,39,74,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a24a] hover:shadow-[0_14px_32px_rgba(22,39,74,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16274a]/40"
    >
      <span className={isLogo ? 'absolute inset-0 flex items-center justify-center' : 'absolute inset-2'}>
        <ProtectedImage
          src={item.src}
          alt={item.alt}
          loading="lazy"
          decoding="async"
          onError={() => onError(item.src)}
          className={isLogo ? 'h-auto max-h-[75%] w-auto max-w-[85%] object-contain' : 'h-full w-full object-contain'}
        />
      </span>
      {/* Zoom cue: on hover/focus for mouse users, always visible on touch screens (no hover there). */}
      <span
        aria-hidden="true"
        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#16274a]/85 text-[#c9a24a] opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:right-2 sm:top-2 sm:h-8 sm:w-8 [@media(hover:none)]:opacity-100"
      >
        <svg viewBox="0 0 24 24" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round">
          <path d="M11 18a7 7 0 100-14 7 7 0 000 14z M20 20l-4-4 M11 8v6 M8 11h6" />
        </svg>
      </span>
    </button>
  )
}

function AccreditationSection() {
  const [openItem, setOpenItem] = useState(null)
  const [failed, setFailed] = useState(() => new Set())
  const closeLightbox = useCallback(() => setOpenItem(null), [])

  const markFailed = (src) => setFailed((prev) => new Set(prev).add(src))
  const items = accreditations.filter((a) => !failed.has(a.src))

  if (items.length === 0) return null

  return (
    <section id="accreditation" className="bg-[#F4F7FB] py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="inline-block rounded-full border border-[#c9a24a]/40 bg-[#c9a24a]/10 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#16274a]">
            Accreditation
          </span>
          <h2 className={`${serif} mt-4 text-2xl md:text-4xl font-bold text-[#16274a]`}>
            Globally recognised &amp; <span className="text-[#c9a24a]">CPD/ACTD</span> aligned
            certification
          </h2>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:gap-6">
          {items.map((item) => (
            <AccreditationCard key={item.src} item={item} onOpen={setOpenItem} onError={markFailed} />
          ))}
        </div>
      </div>

      <ImageLightbox item={openItem} onClose={closeLightbox} />
    </section>
  )
}

const heroImage = {
  src: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=900&h=1125&q=75',
  srcSet:
    'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=600&h=750&q=75 600w, https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=900&h=1125&q=75 900w',
  alt: 'Anatomical model of the human heart showing the coronary arteries, used in cardiology teaching',
}

const heroBadges = [
  {
    title: 'CPD Accredited',
    subtitle: 'The CPD Standards Office',
    position: '-left-3 top-8 sm:-left-10',
    delay: '',
  },
  {
    title: 'ACTD Aligned',
    subtitle: 'American Council of Training & Development',
    position: '-right-3 bottom-10 sm:-right-10 lg:-right-4 xl:-right-10',
    delay: '[animation-delay:1.5s]',
  },
]

const heroTrust = [
  { label: 'CPD Accredited', icon: 'M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z M9 12l2 2 4-4' },
  {
    label: 'Specialist-led Faculty',
    icon: 'M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1 M9.5 10a3 3 0 100-6 3 3 0 000 6z M21 19v-1a4 4 0 00-3-3.87 M16 4.13a3 3 0 010 5.74',
  },
  { label: 'Online & Flexible', icon: 'M3 5h18v11H3z M8 20h8 M12 16v4' },
  { label: 'Case-based Learning', icon: 'M9 4h6v3H9z M7 5H5v15h14V5h-2 M9 12h6 M9 16h4' },
]

function HeroVisual() {
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[400px] lg:mr-0 lg:max-w-[440px] motion-safe:animate-fade-in [animation-delay:300ms]">
      {/* Gold glow behind the card */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_40%,rgba(201,162,74,0.35),transparent_70%)] blur-2xl"
      />
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-[#c9a24a]/50 bg-gradient-to-br from-[#16274a] via-[#1d3563] to-[#c9a24a]/60 shadow-[0_0_0_6px_rgba(201,162,74,0.08),0_30px_70px_rgba(0,0,0,0.45)]">
        {!imgFailed && (
          <img
            src={heroImage.src}
            srcSet={heroImage.srcSet}
            sizes="(min-width: 1024px) 440px, (min-width: 640px) 400px, 340px"
            alt={heroImage.alt}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#0a1428]/60 via-transparent to-transparent"
        />
      </div>

      {heroBadges.map((badge) => (
        <div
          key={badge.title}
          className={`absolute ${badge.position} flex max-w-[210px] items-center gap-3 rounded-2xl border border-white/60 bg-white/95 px-4 py-3 shadow-[0_14px_34px_rgba(10,20,40,0.3)] backdrop-blur motion-safe:animate-float ${badge.delay}`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c9a24a] text-[#0a1428]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-[#0a1428]">{badge.title}</span>
            <span className="block text-[11px] leading-snug text-slate-500">{badge.subtitle}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

function CountUp({ end, suffix, start }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return
    const duration = 1800
    let startTime = null
    let frame

    const tick = (time) => {
      if (startTime === null) startTime = time
      const progress = Math.min((time - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * end))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [start, end])

  return (
    <>
      {count.toLocaleString('en-US')}
      {suffix}
    </>
  )
}

function SectionHeading({ children, light = false }) {
  return (
    <div className="text-center mb-12">
      <h2
        className={`${serif} text-3xl md:text-4xl font-bold ${
          light ? 'text-white' : 'text-[#0a1428]'
        }`}
      >
        {children}
      </h2>
      <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#c9a24a]" />
    </div>
  )
}

const starPath = 'M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z'

// Supports decimal ratings (e.g. 4.5) by clipping a gold row over a grey row.
function Stars({ rating }) {
  const pct = Math.max(0, Math.min(5, rating)) * 20
  const row = (
    <div className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((s) => (
        <svg key={s} viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
          <path d={starPath} />
        </svg>
      ))}
    </div>
  )
  return (
    <div className="relative" role="img" aria-label={`${rating} out of 5 stars`}>
      <div className="text-slate-200">{row}</div>
      <div className="absolute inset-y-0 left-0 overflow-hidden text-[#c9a24a]" style={{ width: `${pct}%` }}>
        {row}
      </div>
    </div>
  )
}

function TestimonialCard({ t }) {
  return (
    <article className="mx-3 flex w-[300px] shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_6px_24px_rgba(10,20,40,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a24a] hover:shadow-[0_16px_40px_rgba(10,20,40,0.12)] sm:w-[340px]">
      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 ring-2 ring-[#c9a24a]/60">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
            <path d="M4 20v-1a5 5 0 015-5h6a5 5 0 015 5v1" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="truncate font-bold text-[#0a1428]">{t.name}</p>
          <p className="truncate text-sm text-slate-400">{t.role}</p>
        </div>
      </div>

      <div className="my-4 h-px bg-slate-200" />

      {/* Rating */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-500">{t.rating}</span>
        <Stars rating={t.rating} />
      </div>

      {/* Review */}
      <p className="mt-3 line-clamp-4 text-[15px] leading-relaxed text-slate-600">{t.quote}</p>
    </article>
  )
}

// Endless right-to-left scroll. The list is rendered twice and the track moves by exactly half,
// so the loop is seamless. Pauses on hover. Reduced-motion users get a normal swipeable row.
function TestimonialsMarquee() {
  return (
    <div className="relative">
      <div className="group/marquee overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-reduce:overflow-x-auto">
        <div className="flex w-max animate-testimonials group-focus-within/marquee:[animation-play-state:paused] group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none">
          {testimonials.map((t) => (
            <TestimonialCard key={`a-${t.name}`} t={t} />
          ))}
          {testimonials.map((t) => (
            <div key={`b-${t.name}`} aria-hidden="true" className="flex">
              <TestimonialCard t={t} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const cardClass =
  'flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow'

// Live API data picked by slug; badges and fallback descriptions come from courses.js.
// Courses that fail to load or aren't found are skipped, and the section hides if none load.
function TrendingCourses() {
  const [cards, setCards] = useState(null) // null while loading

  useEffect(() => {
    let active = true

    loadCardiologyCourses()
      .then((list) => {
        if (!active) return
        setCards(
          trendingCourses.flatMap((item) => {
            const course = list.find((c) => c.slug === item.slug)
            if (!course) return []
            return [
              {
                ...item,
                title: course.title,
                fee: course.fee,
                description: course.description || item.description || '',
              },
            ]
          }),
        )
      })
      .catch((err) => {
        if (!active) return
        console.error('Could not load trending courses:', err)
        setCards([])
      })

    return () => {
      active = false
    }
  }, [])

  if (cards && cards.length === 0) return null

  return (
    <section id="courses" className="bg-slate-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading>Trending Courses</SectionHeading>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-busy={cards === null}
        >
          {cards === null
            ? trendingCourses.map((item) => (
                <div key={item.slug} aria-hidden="true" className={`${cardClass} animate-pulse`}>
                  <div className="h-2 bg-slate-200" />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="h-6 w-20 rounded-full bg-slate-200" />
                    <div className="mt-4 h-6 w-3/4 rounded bg-slate-200" />
                    <div className="mt-3 space-y-2">
                      <div className="h-3.5 rounded bg-slate-100" />
                      <div className="h-3.5 rounded bg-slate-100" />
                      <div className="h-3.5 w-2/3 rounded bg-slate-100" />
                    </div>
                    <div className="mt-5 flex justify-between border-t border-slate-100 pt-4">
                      <div className="h-4 w-24 rounded bg-slate-100" />
                      <div className="h-4 w-16 rounded bg-slate-200" />
                    </div>
                    <div className="mt-6 flex gap-3">
                      <div className="h-9 flex-1 rounded-md bg-slate-200" />
                      <div className="h-9 flex-1 rounded-md bg-slate-200" />
                    </div>
                  </div>
                </div>
              ))
            : cards.map((course) => (
                <div key={course.slug} className={cardClass}>
                  <div className="h-2 bg-gradient-to-r from-[#16274a] to-[#c9a24a]" />
                  <div className="flex flex-1 flex-col p-6">
                    <span
                      className={`self-start rounded-full px-3 py-1 text-xs font-bold tracking-wider ${course.badgeClass}`}
                    >
                      {course.badge}
                    </span>
                    <h3 className={`${serif} mt-4 text-xl font-bold text-[#0a1428]`}>
                      {course.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 flex-1 line-clamp-3">
                      {course.description}
                    </p>
                    <dl className="mt-5 flex items-baseline justify-between gap-3 border-t border-slate-100 pt-4">
                      <dt className="text-xs text-slate-400">Registration Fee</dt>
                      <dd className="text-base font-bold text-[#0a1428]">{course.fee}</dd>
                    </dl>
                    <div className="mt-6 flex gap-3">
                      <Link
                        to={`/courses/${course.slug}`}
                        className="flex-1 rounded-md border border-[#16274a] px-4 py-2 text-center text-sm font-semibold text-[#16274a] hover:bg-[#16274a] hover:text-white transition-colors"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/courses/${course.slug}#enroll`}
                        className="flex-1 rounded-md bg-[#c9a24a] px-4 py-2 text-center text-sm font-semibold text-[#0a1428] hover:bg-[#b48e3a] transition-colors"
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}

function Home() {
  const statsRef = useRef(null)
  const [statsVisible, setStatsVisible] = useState(false)
  const [activeDoctor, setActiveDoctor] = useState(null)
  const [blinkCount, setBlinkCount] = useState(0)
  const [activeStep, setActiveStep] = useState(null)

  const selectDoctor = (i) => {
    setActiveDoctor(i)
    setBlinkCount((c) => c + 1)
  }

  useEffect(() => {
    const node = statsRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="font-['DM_Sans',sans-serif] text-slate-800">
      {/* 1. Hero */}
      {/* Top padding = fixed navbar height (Navbar is fixed on Home: py-3 + 44px logo + 1px border,
          md: py-4 + 52px logo + 1px border). Change both together. */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1428] via-[#0A1A3A] to-[#0F2A5C] pt-17.25 text-white md:pt-21.25">
        {/* Soft glows so the gradient doesn't feel flat */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_80%_35%,rgba(201,162,74,0.2),transparent_70%),radial-gradient(ellipse_50%_50%_at_5%_95%,rgba(58,124,184,0.22),transparent_70%)]"
        />
        {/* Dot grid, faded towards the edges */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,black,transparent)]"
        />
        {/* ECG trace */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full text-[#c9a24a] opacity-[0.12]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        >
          <path d="M0 60 H380 L400 60 L415 30 L430 95 L445 10 L462 85 L475 60 H760 L780 60 L795 35 L810 90 L825 15 L842 80 L855 60 H1200" />
        </svg>

        <div className="relative mx-auto grid w-full max-w-[1280px] grid-cols-1 items-start gap-14 px-4 pt-5 pb-12 sm:px-6 md:pt-8 md:pb-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 lg:pt-10 xl:gap-16 xl:px-8">
          <div className="text-left">
            <div className="mb-6 flex items-center gap-3 motion-safe:animate-fade-up">
              <span className="h-px w-6 shrink-0 sm:w-10 bg-[#c9a24a]" />
              <span className="rounded-full border border-[#c9a24a]/40 bg-[#c9a24a]/10 whitespace-nowrap px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] sm:px-4 sm:text-xs sm:tracking-[0.25em] text-[#c9a24a]">
                Welcome to Medical Global Academy
              </span>
            </div>
            <h1
              className={`${serif} mb-6 text-[clamp(1.75rem,6vw,3.75rem)] lg:text-[clamp(2.75rem,4.4vw,3.75rem)] font-bold leading-[1.08] tracking-tight motion-safe:animate-fade-up [animation-delay:100ms]`}
            >
              {/* One phrase per line; sizes are capped so neither line wraps at any breakpoint */}
              <span className="block">
                Master{' '}
                <span className="bg-gradient-to-r from-[#e6c573] to-[#c9a24a] bg-clip-text text-transparent">
                  Cardiology.
                </span>
              </span>
              <span className="block">
                Lead with{' '}
                <span className="bg-gradient-to-r from-[#e6c573] to-[#c9a24a] bg-clip-text text-transparent">
                  Confidence.
                </span>
              </span>
            </h1>
            <p className="mb-10 max-w-[540px] text-base leading-relaxed text-slate-300 md:text-lg motion-safe:animate-fade-up [animation-delay:200ms]">
              Specialist-led fellowship with hands-on, case-based training. Learn online, sharpen your
              diagnosis and treatment skills, and grow your career with expert guidance.
            </p>
            <div className="flex flex-col justify-start gap-4 sm:flex-row motion-safe:animate-fade-up [animation-delay:300ms]">
              <Link
                to="/courses"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#c9a24a] px-8 py-3.5 text-sm font-semibold tracking-wide text-[#0a1428] shadow-[0_8px_24px_rgba(201,162,74,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d8b25a] hover:shadow-[0_12px_34px_rgba(201,162,74,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
              >
                Our Courses
              </Link>
              <a
                href="tel:+919310027474"
                className="inline-flex w-full items-center justify-center rounded-full border-2 border-white/70 px-8 py-3.5 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9a24a] hover:text-[#c9a24a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24a] sm:w-auto"
              >
                Talk to Counsellor
              </a>
            </div>

            <ul className="mt-10 grid max-w-135 grid-cols-2 gap-x-4 gap-y-4 border-t border-white/10 pt-6 motion-safe:animate-fade-up [animation-delay:400ms]">
              {heroTrust.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2 text-xs text-slate-300 sm:text-sm even:border-l even:border-white/15 even:pl-4"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[#c9a24a]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={item.icon} />
                  </svg>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <HeroVisual />
        </div>
      </section>

      {/* 2. Stats bar */}
      <section ref={statsRef} className="bg-[#0a1428] border-t border-[#c9a24a]/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`${serif} text-3xl md:text-4xl font-bold text-[#c9a24a]`}>
                <CountUp end={stat.value} suffix={stat.suffix} start={statsVisible} />
              </div>
              <div className="mt-2 text-slate-300 text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Accreditation */}
      <AccreditationSection />

      {/* 4. Doctors preview */}
      <section className="bg-gradient-to-b from-[#fdfaf3] to-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block rounded-full border border-[#c9a24a]/30 bg-[#f8f0dc] px-5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#b08a3a]">
              Our Medical Experts
            </span>
            <h2 className={`${serif} mt-4 text-3xl md:text-5xl font-bold text-[#0a1428]`}>
              Meet Our <span className="italic text-[#c9a24a]">Expert Doctors</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-500 leading-relaxed">
              Our team of experienced cardiologists and medical specialists provides advanced
              training and academic excellence.
            </p>
          </div>

          {previewDoctors.length > 0 && (
            <DoctorGrid>
              {previewDoctors.map((doctor, i) => (
                <DoctorCard
                  key={activeDoctor === i ? `${doctor.id}-${blinkCount}` : doctor.id}
                  doctor={doctor}
                  selected={activeDoctor === i}
                  onSelect={() => selectDoctor(i)}
                />
              ))}
            </DoctorGrid>
          )}

          <div className="mt-10 flex flex-col items-center gap-4">
            <Link
              to="/doctors"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-[#16274a] px-7 text-sm font-semibold text-[#16274a] transition-colors hover:bg-[#16274a] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24a] focus-visible:ring-offset-2 motion-reduce:transition-none"
            >
              View all faculty
              <span aria-hidden="true">→</span>
            </Link>
            <p className="text-center text-sm text-slate-500">
              All doctors are verified · CPD &amp; ACTD accredited
            </p>
          </div>
        </div>
      </section>

      {/* 5. Hospital partners */}
      <section className="bg-white py-14 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs uppercase tracking-[0.25em] text-slate-500 font-semibold mb-8">
            Our Hospital Partners
          </p>
        </div>
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
            {[...hospitals, ...hospitals, ...hospitals, ...hospitals].map((name, i) => (
              <span
                key={`${name}-${i}`}
                aria-hidden={i >= hospitals.length}
                className={`${serif} shrink-0 whitespace-nowrap px-8 md:px-12 text-lg md:text-xl font-bold text-[#16274a]/70 hover:text-[#16274a] transition-colors`}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Trending courses */}
      <TrendingCourses />

      {/* 7. Career Pathway — card style with connecting lines */}
      <section className="bg-[#eef3f8] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <div className="text-center mb-4">
            <span className="inline-block rounded-full border border-[#b0cde0]/50 bg-[#dce8f0] px-5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#3a7cb8]">
              Career Pathway
            </span>
          </div>
          <h2 className={`${serif} text-center text-3xl md:text-5xl font-bold text-[#0a1428] mb-4`}>
            Your Path to <span className="italic text-[#3a7cb8]">Medical Excellence</span>
          </h2>
          <p className="mx-auto text-center max-w-2xl text-slate-500 leading-relaxed mb-14">
            A structured, four-stage learning journey designed to take medical professionals from
            enrolment to globally recognised certification.
          </p>

          {/* Step cards with connecting lines */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Horizontal connecting line (desktop only) */}
            <div
              aria-hidden="true"
              className="hidden lg:block absolute top-1/2 left-0 right-0 -translate-y-1/2 z-0 px-[12%]"
            >
              <div className="h-[3px] w-full bg-gradient-to-r from-[#16274a] via-[#3a6ea5] to-[#c9a24a] rounded-full opacity-30" />
              {/* Dots on the line between cards */}
              <div className="absolute top-1/2 left-[30%] -translate-y-1/2 h-3 w-3 rounded-full bg-[#16274a] border-2 border-white shadow" />
              <div className="absolute top-1/2 left-[52%] -translate-y-1/2 h-3 w-3 rounded-full bg-[#3a6ea5] border-2 border-white shadow" />
              <div className="absolute top-1/2 left-[74%] -translate-y-1/2 h-3 w-3 rounded-full bg-[#c9a24a] border-2 border-white shadow" />
            </div>

            {/* Vertical connecting line (mobile/tablet) */}
            <div
              aria-hidden="true"
              className="lg:hidden absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-0 py-[8%]"
            >
              <div className="w-[3px] h-full bg-gradient-to-b from-[#16274a] via-[#3a6ea5] to-[#c9a24a] rounded-full opacity-30 mx-auto" />
            </div>

            {pathwaySteps.map((step, i) => {
              const isActive = activeStep === i
              return (
                <div
                  key={step.title}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  onClick={() => setActiveStep(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setActiveStep(i)
                    }
                  }}
                  className={`group relative z-10 flex flex-col cursor-pointer rounded-2xl border bg-white p-6 pt-5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24a] ${
                    isActive
                      ? '-translate-y-2 border-[#16274a]/40 shadow-[0_16px_40px_rgba(10,20,40,0.15)]'
                      : i === pathwaySteps.length - 1
                        ? 'border-[#c9a24a]/40 shadow-[0_4px_24px_rgba(10,20,40,0.06)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(10,20,40,0.12)]'
                        : 'border-slate-200 shadow-[0_4px_24px_rgba(10,20,40,0.06)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(10,20,40,0.12)]'
                  }`}
                >
                  {/* Top accent line — visible on hover/active */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-[#0a1428] to-[#c9a24a] transition-all duration-300 ${
                      isActive
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    }`}
                  />

                  {/* Large step number watermark */}
                  <span
                    aria-hidden="true"
                    className={`absolute top-3 right-5 text-6xl md:text-7xl font-extrabold leading-none select-none pointer-events-none transition-colors duration-300 ${
                      isActive ? 'text-[#c9a24a]/20' : 'text-slate-100'
                    }`}
                  >
                    {step.num}
                  </span>

                  {/* Icon */}
                  <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-xl text-2xl mb-4 transition-shadow duration-300 ${
                    isActive
                      ? 'bg-[#e8f0fa] shadow-[0_6px_16px_rgba(22,39,74,0.15)]'
                      : 'bg-[#f0f4fa]'
                  }`}>
                    {step.icon}
                  </div>

                  {/* Step badge */}
                  <span className="relative z-10 inline-block self-start rounded-full bg-[#e8f4ec] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#2d7a4f] mb-3">
                    {step.badge}
                  </span>

                  {/* Title */}
                  <h3 className={`${serif} relative z-10 text-lg font-bold text-[#0a1428] mb-2`}>
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="relative z-10 text-sm text-slate-500 leading-relaxed flex-1">
                    {step.description}
                  </p>

                  {/* Certification badges on last card */}
                  {step.badges && (
                    <div className="relative z-10 mt-4 flex flex-wrap gap-2">
                      {step.badges.map((badge) => (
                        <span
                          key={badge}
                          className="inline-flex items-center gap-1 rounded-full border border-[#c9a24a]/30 bg-[#fdf8ed] px-3 py-1 text-xs font-semibold text-[#0a1428]"
                        >
                          <svg
                            viewBox="0 0 16 16"
                            className="h-3.5 w-3.5 text-[#c9a24a]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 8.5l3.5 3.5 6.5-7" />
                          </svg>
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Bottom highlights bar */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {pathwayHighlights.map((item) => (
              <span key={item} className="flex items-center gap-2 text-sm text-slate-600">
                <span className="h-2 w-2 rounded-full bg-[#c9a24a]" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Why choose us */}
      <section className="relative overflow-hidden bg-white py-20 md:py-24">
        {/* Soft gold glows + faint dot grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_100%_0%,rgba(201,162,74,0.12),transparent_70%),radial-gradient(ellipse_35%_35%_at_0%_100%,rgba(201,162,74,0.08),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(10,20,40,0.06)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_60%_40%,black,transparent)]"
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            {/* Left: heading + CTA (sticky on desktop) */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <span className="inline-block rounded-full border border-[#c9a24a]/30 bg-[#f8f0dc] px-5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#b08a3a]">
                Why Choose Us
              </span>
              <h2
                className={`${serif} mt-5 text-3xl font-bold leading-[1.15] text-[#0a1428] md:text-5xl`}
              >
                Why Choose{' '}
                <span className="bg-gradient-to-r from-[#e6c573] to-[#c9a24a] bg-clip-text text-transparent">
                  Medical Global Academy
                </span>
              </h2>
              <div className="mt-5 h-1 w-16 rounded-full bg-[#c9a24a]" />
              <p className="mt-6 max-w-md text-base leading-relaxed text-slate-500 md:text-lg">
                We provide specialist-led cardiology education designed to help healthcare
                professionals advance their careers with confidence.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {['CPD', 'ACTD'].map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#c9a24a]/40 bg-[#fdf8ed] px-4 py-1.5 text-sm font-semibold text-[#0a1428]"
                  >
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-[#c9a24a]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 8.5l3.5 3.5 6.5-7" />
                    </svg>
                    {badge} Accredited
                  </span>
                ))}
              </div>

              <Link
                to="/courses"
                className="group mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#c9a24a] px-7 text-sm font-semibold text-[#0a1428] shadow-[0_8px_24px_rgba(201,162,74,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d8b25a] hover:shadow-[0_12px_34px_rgba(201,162,74,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24a] focus-visible:ring-offset-2"
              >
                Explore Courses
                <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
            </div>

            {/* Right: feature cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {features.map((feature, i) => (
                <article
                  key={feature.title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-7 shadow-[0_6px_24px_rgba(10,20,40,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#c9a24a] hover:shadow-[0_18px_44px_rgba(10,20,40,0.12)]"
                >
                  {/* Big faint number */}
                  <span
                    aria-hidden="true"
                    className={`${serif} pointer-events-none absolute right-5 top-3 select-none text-6xl font-bold leading-none text-slate-100 transition-colors duration-300 group-hover:text-[#c9a24a]/25`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Icon */}
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fdf8ed] text-[#c9a24a] ring-1 ring-[#c9a24a]/25 transition-all duration-300 group-hover:bg-[#c9a24a] group-hover:text-[#0a1428] group-hover:shadow-[0_10px_24px_rgba(201,162,74,0.4)]">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d={feature.icon} />
                    </svg>
                  </div>

                  <h3 className={`${serif} relative mt-6 text-xl font-bold text-[#0a1428]`}>
                    {feature.title}
                  </h3>
                  <p className="relative mt-2.5 leading-relaxed text-slate-500">
                    {feature.description}
                  </p>

                  {/* Bottom accent line grows on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#0a1428] to-[#c9a24a] transition-transform duration-500 group-hover:scale-x-100"
                  />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. Testimonials */}
      <section className="overflow-hidden bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className={`${serif} text-3xl font-bold text-[#0a1428] md:text-5xl`}>
              What Our <span className="italic text-[#c9a24a]">Doctors Say</span>
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#c9a24a]" />
            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-slate-500">
              Hear from healthcare professionals who advanced their careers with our
              specialist-led programs.
            </p>
          </div>
        </div>
        <TestimonialsMarquee />
      </section>

      {/* 10. FAQ */}
      <FaqSection
        variant="dark"
        defaultOpen={0}
        title="Frequently asked questions from our students"
        items={generalFaqs}
      />
    </div>
  )
}

export default Home