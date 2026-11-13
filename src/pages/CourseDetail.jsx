import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { loadCardiologyCourses, useCourseDetails } from '../data/courseApi.js'
import {
  getLearningMethods,
  getTopics,
  hasLiveAndRecorded,
} from '../data/courseHighlights.js'
import FaqSection from '../components/FaqSection.jsx'
import NotFoundPage from './NotFoundPage.jsx'
import { courseFallbackFaqs } from '../data/faqs.js'

const serif = "font-['Playfair_Display',serif]"
// Same action as the Home hero's "Talk to Counsellor" button
const COUNSELLOR_HREF = 'tel:+919310027474'

const badgeStyles = {
  top: 'from-[#ef4444] to-[#dc2626]',
  new: 'from-[#10b981] to-[#059669]',
  trending: 'from-[#f59e0b] to-[#d97706]',
}

const iconPaths = {
  case: 'M8 4h8v2H8zM6 6h12a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM9 11h6M9 15h6',
  video: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM10 8.5v7l5.5-3.5z',
  live: 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM7.8 16.2a6 6 0 0 1 0-8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 19.1a10 10 0 0 1 0-14.2M19.1 4.9a10 10 0 0 1 0 14.2',
  people: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M17 11.5a2.5 2.5 0 1 0 0-5M17.5 14.5A5 5 0 0 1 21 19',
  lecture: 'M3 4h18M5 4v10h14V4M12 14v6M9 20h6',
  pulse: 'M3 12h4l2-5 4 10 2-5h6',
  lab: 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3',
  screen: 'M5 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8 20h8M12 16v4',
  book: 'M4 19V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2zm0 0a2 2 0 0 0 2 2h14',
  pencil: 'M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4',
  quiz: 'M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8 12l3 3 5-6',
}

function Icon({ name, className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={iconPaths[name]} />
    </svg>
  )
}

function CheckIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 10.5 3.2 3.2L15 7" />
    </svg>
  )
}

// Splits on sentence boundaries only, so the words stay exactly as written:
// first sentence becomes the lead, the rest is spread over up to 3 paragraphs.
function toParagraphs(text) {
  if (!text) return []
  const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
  const [lead, ...rest] = sentences
  if (!rest.length) return [lead]
  const size = Math.ceil(rest.length / Math.min(3, rest.length))
  const paragraphs = [lead]
  for (let i = 0; i < rest.length; i += size) {
    paragraphs.push(rest.slice(i, i + size).join(' '))
  }
  return paragraphs
}

// Fades a section up the first time it scrolls into view (motion-safe only).
function Reveal({ as: Tag = 'section', className = '', children, ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`${className} ${shown ? 'motion-safe:animate-fade-up' : 'motion-safe:opacity-0'}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

// Falls back to a navy-gold gradient when there's no image or it fails to load.
function CourseImage({ src, alt, className, loading = 'lazy' }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${className} bg-gradient-to-br from-[#16274a] via-[#0a1428] to-[#7a6230]`}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setFailed(true)}
      className={`${className} object-cover`}
    />
  )
}

function CourseBadge({ course, className = '' }) {
  if (!course.badge) return null
  return (
    <span
      className={`rounded-full bg-gradient-to-br px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-md ${
        badgeStyles[course.badgeType] || badgeStyles.top
      } ${className}`}
    >
      {course.badge}
    </span>
  )
}

function SectionHeading({ eyebrow, children }) {
  return (
    <div className="mb-6">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#b08a3a]">
        {eyebrow}
      </span>
      <h2 className={`${serif} mt-2 text-2xl font-bold text-[#0a1428] md:text-3xl`}>
        {children}
      </h2>
    </div>
  )
}

const cardClass =
  'rounded-2xl border border-slate-100 bg-white shadow-[0_8px_30px_rgba(10,20,40,0.05)]'

function CheckBullet() {
  return (
    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#fbf3e2] text-[#b08a3a]">
      <CheckIcon className="h-3.5 w-3.5" />
    </span>
  )
}

function DetailsStatus({ status, onRetry }) {
  if (status === 'loading') {
    return (
      <div role="status" className={`${cardClass} p-6 text-sm text-slate-500`}>
        Loading program details…
      </div>
    )
  }
  return (
    <div role="alert" className={`${cardClass} flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between`}>
      <p className="text-sm text-slate-600">
        Couldn’t load highlights, workshops and curriculum right now.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#0a1428] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#c9a24a] hover:text-[#0a1428] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24a]"
      >
        Retry
      </button>
    </div>
  )
}

function HighlightsSection({ highlights }) {
  return (
    <Reveal>
      <SectionHeading eyebrow="Why this program">Program Highlights</SectionHeading>
      <ul className="grid gap-4 sm:grid-cols-2">
        {highlights.map((text) => (
          <li key={text} className={`${cardClass} flex items-start gap-3 p-5 text-sm font-medium text-[#0a1428]`}>
            <CheckBullet />
            {text}
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

function LearnSection({ items }) {
  return (
    <Reveal>
      <SectionHeading eyebrow="Learning outcomes">What You’ll Learn</SectionHeading>
      <ul className="grid gap-4 md:grid-cols-2">
        {items.map((item, i) => (
          <li
            key={i}
            className={`${cardClass} p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a24a] motion-reduce:transition-none motion-reduce:hover:translate-y-0`}
          >
            {item.heading && (
              <h3 className={`${serif} text-lg font-bold leading-snug text-[#0a1428]`}>{item.heading}</h3>
            )}
            {item.description && (
              <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
            )}
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

function WorkshopSection({ workshop }) {
  return (
    <Reveal>
      <SectionHeading eyebrow="Hands-on training">{workshop.title || 'Workshops'}</SectionHeading>
      {workshop.subtitle && (
        <p className="max-w-[70ch] whitespace-pre-line text-base leading-8 text-slate-600">
          {workshop.subtitle}
        </p>
      )}
      {workshop.parts.length > 0 && (
        <ol className="mt-6 space-y-5">
          {workshop.parts.map((part, i) => (
            <li key={i} className={`${cardClass} overflow-hidden`}>
              <div className="h-1 bg-gradient-to-r from-[#c9a24a] to-[#e6c573]" />
              <div className="p-6">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#b08a3a]">
                  Part {i + 1}
                </span>
                {part.title && (
                  <h3 className={`${serif} mt-1 text-xl font-bold text-[#0a1428]`}>{part.title}</h3>
                )}
                {part.subtitle && <p className="mt-2 text-sm leading-7 text-slate-600">{part.subtitle}</p>}
                {part.keyPoints.length > 0 && (
                  <ul className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm leading-6 text-slate-700">
                    {part.keyPoints.map((point, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckBullet />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </Reveal>
  )
}

function CurriculumSection({ modules }) {
  const lessonCount = modules.reduce((sum, m) => sum + m.lessons.length, 0)
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

  return (
    <Reveal>
      <SectionHeading eyebrow="Curriculum">Course Modules</SectionHeading>
      <p className="-mt-3 mb-6 text-sm font-medium text-slate-500">
        {plural(modules.length, 'module')} · {plural(lessonCount, 'lesson')}
      </p>
      <div className="space-y-3">
        {modules.map((m, i) => (
          <details key={i} open={i === 0} className={`${cardClass} group overflow-hidden`}>
            <summary className="flex cursor-pointer list-none items-center gap-4 p-5 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#c9a24a] [&::-webkit-details-marker]:hidden">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0a1428] text-sm font-bold text-[#c9a24a]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold uppercase tracking-wide text-[#b08a3a]">
                  Module {i + 1} · {plural(m.lessons.length, 'lesson')}
                </span>
                <span className="mt-0.5 block font-semibold text-[#0a1428]">{m.title || `Module ${i + 1}`}</span>
              </span>
              <span
                aria-hidden="true"
                className="text-xl text-slate-400 transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
              >
                +
              </span>
            </summary>
            {m.lessons.length > 0 && (
              <ol className="space-y-2.5 border-t border-slate-100 px-5 py-5 text-sm leading-6 text-slate-700 sm:pl-20">
                {m.lessons.map((lesson, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="w-6 shrink-0 text-right font-semibold text-[#b08a3a]">{j + 1}.</span>
                    {lesson}
                  </li>
                ))}
              </ol>
            )}
          </details>
        ))}
      </div>
    </Reveal>
  )
}

function CourseView({ course, related }) {
  const asideRef = useRef(null)
  const endRef = useRef(null)
  const [barVisible, setBarVisible] = useState(false)
  const { hash } = useLocation()

  const paragraphs = toParagraphs(course.description)
  const topics = getTopics(course)
  const methods = getLearningMethods(course)
  const { details, status: detailsStatus, retry: retryDetails } = useCourseDetails(course.slug)

  // Home's "Enroll Now" links here with #enroll. CourseView only mounts once the
  // course has loaded, so this runs after App's ScrollToTop and the card exists.
  useEffect(() => {
    if (hash !== '#enroll') return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    asideRef.current.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  }, [hash])

  // Mobile bottom bar: hidden while the fee card itself is on screen, and from
  // the end of the page onwards so it never sits on top of the footer.
  // A scroll check rather than an IntersectionObserver: a fast jump past the
  // end marker never "intersects", which would leave the bar over the footer.
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const aside = asideRef.current.getBoundingClientRect()
      const end = endRef.current.getBoundingClientRect()
      const asideOnScreen = aside.top < window.innerHeight && aside.bottom > 0
      const pastEnd = end.top < window.innerHeight
      setBarVisible(!asideOnScreen && !pastEnd)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1428] via-[#0f1d3a] to-[#16274a] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-48 -right-32 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(201,162,74,0.25),transparent_65%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-size-[22px_22px]"
        />

        <div className="relative mx-auto max-w-285 px-4 py-10 sm:px-6 md:py-14 lg:py-20">
          <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between motion-safe:animate-fade-up">
            <nav aria-label="Breadcrumb" className="min-w-0">
              <ol className="flex min-w-0 items-center gap-2 text-xs text-slate-400 sm:text-sm">
                <li>
                  <Link to="/" className="transition-colors hover:text-[#c9a24a]">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link to="/courses" className="transition-colors hover:text-[#c9a24a]">
                    Courses
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="min-w-0 truncate text-slate-200">
                  {course.title}
                </li>
              </ol>
            </nav>
            <Link
              to="/courses"
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-full text-sm font-semibold text-[#e6c573] transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24a] sm:self-auto"
            >
              <span aria-hidden="true">←</span> Back to Courses
            </Link>
          </div>

          <div className="mt-8 grid items-center gap-10 lg:mt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
            <div>
              <div className="flex flex-wrap items-center gap-2 motion-safe:animate-fade-up [animation-delay:100ms]">
                {course.courseType && (
                  <span className="rounded-full bg-[#c9a24a] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-[#0a1428] sm:text-sm">
                    {course.courseType}
                  </span>
                )}
                {course.specialty && (
                  <span className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur sm:text-sm">
                    {course.specialty}
                  </span>
                )}
                {course.accreditation && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur sm:text-sm">
                    <CheckIcon className="h-4 w-4 text-[#c9a24a]" />
                    {course.accreditation}
                  </span>
                )}
              </div>

              <h1
                className={`${serif} mt-6 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] text-balance text-white motion-safe:animate-fade-up [animation-delay:200ms]`}
              >
                {course.title}
              </h1>

              <div className="mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-[#c9a24a] to-[#e6c573] motion-safe:animate-fade-up [animation-delay:300ms]" />
            </div>

            <div className="relative motion-safe:animate-fade-up [animation-delay:300ms]">
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-[2rem] bg-[#c9a24a]/20 blur-2xl"
              />
              <div className="relative overflow-hidden rounded-3xl border border-[#c9a24a]/50 shadow-[0_20px_60px_rgba(201,162,74,0.25)]">
                <CourseImage
                  src={course.image}
                  alt={course.title}
                  loading="eager"
                  className="aspect-video w-full"
                />
                <CourseBadge course={course} className="absolute top-4 left-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="bg-slate-50">
        <div className="mx-auto grid max-w-285 gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-3 lg:gap-12">
          <div className="min-w-0 space-y-14 lg:col-span-2">
            {paragraphs.length > 0 && (
              <Reveal>
                <SectionHeading eyebrow="About the program">Program Overview</SectionHeading>
                <div className="max-w-[70ch] space-y-5">
                  {paragraphs.map((text, i) => (
                    <p
                      key={i}
                      className={
                        i === 0
                          ? 'text-lg leading-8 font-medium text-slate-700 md:text-xl md:leading-9'
                          : 'text-base leading-8 text-slate-600 md:text-[17px]'
                      }
                    >
                      {text}
                    </p>
                  ))}
                </div>
              </Reveal>
            )}

            {topics.length > 0 && (
              <Reveal>
                <SectionHeading eyebrow="Key topics">Topics Covered</SectionHeading>
                <ul className="flex flex-wrap gap-2.5">
                  {topics.map((topic) => (
                    <li
                      key={topic}
                      className="rounded-full border border-[#ecdcb8] bg-[#fbf3e2] px-4 py-2 text-sm font-medium text-[#0a1428]"
                    >
                      {topic}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {detailsStatus !== 'ready' && <DetailsStatus status={detailsStatus} onRetry={retryDetails} />}

            {details?.highlights.length > 0 && <HighlightsSection highlights={details.highlights} />}

            {details?.whatYouLearn.length > 0 && <LearnSection items={details.whatYouLearn} />}

            {methods.length > 0 && (
              <Reveal>
                <SectionHeading eyebrow="Learning format">How You Will Learn</SectionHeading>
                <ul className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3">
                  {methods.map((method) => (
                    <li
                      key={method.label}
                      className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgba(10,20,40,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a24a] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0a1428] text-[#c9a24a]">
                        <Icon name={method.icon} />
                      </span>
                      <span className="text-sm font-semibold text-[#0a1428]">{method.label}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {details?.workshop && <WorkshopSection workshop={details.workshop} />}

            {details?.modules.length > 0 && <CurriculumSection modules={details.modules} />}
          </div>

          <aside
            ref={asideRef}
            id="enroll"
            className="scroll-mt-28 md:scroll-mt-32 lg:sticky lg:top-24 lg:self-start"
          >
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_18px_50px_rgba(10,20,40,0.08)]">
              <div className="h-1 bg-gradient-to-r from-[#c9a24a] to-[#e6c573]" />
              <div className="p-6 sm:p-7">
                <p className="text-sm text-slate-500">Registration Fee</p>
                <p className={`${serif} mt-1 text-4xl font-bold text-[#0a1428]`}>{course.fee}</p>

                <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-sm text-slate-700">
                  {course.accreditation && (
                    <li className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#fbf3e2] text-[#b08a3a]">
                        <CheckIcon className="h-3.5 w-3.5" />
                      </span>
                      {course.accreditation} Accredited
                    </li>
                  )}
                  {hasLiveAndRecorded(course) && (
                    <li className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#fbf3e2] text-[#b08a3a]">
                        <CheckIcon className="h-3.5 w-3.5" />
                      </span>
                      Live and recorded sessions
                    </li>
                  )}
                </ul>

                <a
                  href={COUNSELLOR_HREF}
                  className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#c9a24a] font-semibold text-[#0a1428] shadow-[0_8px_24px_rgba(201,162,74,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d8b25a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1428] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  Talk to Counsellor
                </a>
                <Link
                  to="/courses"
                  className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[#0a1428]"
                >
                  <span aria-hidden="true">←</span> Back to Courses
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* More programs */}
      {related.length > 0 && (
        <Reveal className="border-t border-slate-100 bg-white">
          <div className="mx-auto max-w-285 px-4 py-14 sm:px-6 md:py-20">
            <SectionHeading eyebrow="Explore further">More Programs</SectionHeading>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  to={`/courses/${item.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_8px_30px_rgba(10,20,40,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a24a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24a] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <div className="relative">
                    <CourseImage src={item.image} alt={item.title} className="aspect-video w-full" />
                    <CourseBadge course={item} className="absolute top-3 left-3" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#b08a3a]">
                      {item.courseType}
                    </span>
                    <h3 className={`${serif} mt-2 flex-1 text-lg font-bold leading-snug text-[#0a1428]`}>
                      {item.title}
                    </h3>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0a1428] group-hover:text-[#b08a3a]">
                      View Details
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      <FaqSection
        title={`Frequently asked questions about ${course.title}`}
        items={course.faqs ?? courseFallbackFaqs}
      />

      <div ref={endRef} aria-hidden="true" className="h-px" />

      {/* Mobile sticky bar (below lg) */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(10,20,40,0.08)] backdrop-blur transition-transform duration-300 motion-reduce:transition-none lg:hidden ${
          barVisible ? 'translate-y-0' : 'pointer-events-none translate-y-full'
        }`}
        aria-hidden={!barVisible}
      >
        <div className="mx-auto flex max-w-285 items-center justify-between gap-3">
          <div className="min-w-0">
            <p className={`${serif} text-xl font-bold leading-tight text-[#0a1428]`}>{course.fee}</p>
            <p className="text-xs text-slate-500">Registration Fee</p>
          </div>
          <a
            href={COUNSELLOR_HREF}
            tabIndex={barVisible ? 0 : -1}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#c9a24a] px-5 text-sm font-semibold text-[#0a1428] transition-colors hover:bg-[#d8b25a]"
          >
            Talk to Counsellor
          </a>
        </div>
      </div>
    </>
  )
}

function StatusMessage({ title, children }) {
  return (
    <section className="bg-slate-50 px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-lg rounded-3xl border border-slate-100 bg-white px-6 py-12 text-center shadow-[0_18px_50px_rgba(10,20,40,0.06)]">
        <div className="mx-auto mb-5 h-1 w-14 rounded-full bg-gradient-to-r from-[#c9a24a] to-[#e6c573]" />
        <h1 className={`${serif} text-2xl font-bold text-[#0a1428] md:text-3xl`}>{title}</h1>
        <p className="mt-3 text-slate-500">{children}</p>
        <Link
          to="/courses"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#0a1428] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#c9a24a] hover:text-[#0a1428] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24a]"
        >
          ← Back to Courses
        </Link>
      </div>
    </section>
  )
}

function CourseDetail() {
  const { slug } = useParams()
  const [courses, setCourses] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    let active = true

    loadCardiologyCourses()
      .then((list) => {
        if (!active) return
        setCourses(list)
        setStatus('ready')
      })
      .catch((err) => {
        if (!active) return
        console.error('Could not load course:', err)
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [])

  if (status === 'loading') {
    return (
      <section className="bg-gradient-to-br from-[#0a1428] to-[#16274a] px-4 py-24 text-center text-slate-300">
        Loading course…
      </section>
    )
  }

  if (status === 'error') {
    return (
      <StatusMessage title="Something went wrong">
        Couldn’t load this course right now. Please refresh the page.
      </StatusMessage>
    )
  }

  const course = courses.find((c) => c.slug === slug)

  if (!course) {
    return (
      <NotFoundPage
        title="Course not found"
        message="This course may have been moved or is no longer available."
      />
    )
  }

  const related = courses
    .filter((c) => c.courseType === course.courseType && c.slug !== course.slug)
    .slice(0, 3)

  // key: switching between programs remounts, resetting image fallbacks and reveals
  return <CourseView key={course.slug} course={course} related={related} />
}

export default CourseDetail
