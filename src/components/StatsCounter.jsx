import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Award, BookOpen, GraduationCap, ScrollText } from 'lucide-react'
import { useCourseStats } from '../hooks/useCourseStats.js'

const DURATION_MS = 2000
const STAGGER_MS = 100

const cards = [
  { key: 'programs', label: 'Active Programs', Icon: BookOpen },
  { key: 'fellowships', label: 'Fellowships', Icon: GraduationCap },
  { key: 'certificates', label: 'Certificates', Icon: Award },
  { key: 'pgDiplomas', label: 'PG Diplomas', Icon: ScrollText },
]

const easeOutCubic = (t) => 1 - (1 - t) ** 3

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
function subscribeReducedMotion(onChange) {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}
const usePrefersReducedMotion = () =>
  useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia(REDUCED_MOTION).matches, () => false)

/**
 * "MGA at a glance" band: live course counts in glass cards on the site navy, gold accents.
 * Numbers count up (2s, easeOutCubic) once, the first time the band is 30% in view.
 *
 * @param heading  optional node rendered above the cards (the page's own heading style)
 */
function StatsCounter({ heading = null, labelledBy }) {
  const { status, stats } = useCourseStats()
  const reducedMotion = usePrefersReducedMotion()
  const sectionRef = useRef(null)
  const [inView, setInView] = useState(false)
  const [progress, setProgress] = useState(0) // 0..1, eased

  // Start once, when 30% of the band is visible
  useEffect(() => {
    const node = sectionRef.current
    if (!node) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // Count up once the band is in view and the numbers are known
  const ready = stats !== null
  useEffect(() => {
    if (!inView || !ready || reducedMotion) return undefined
    let frame
    let start = null
    const tick = (now) => {
      if (start === null) start = now
      const t = Math.min((now - start) / DURATION_MS, 1)
      setProgress(easeOutCubic(t))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, ready, reducedMotion])

  const shown = (target) => (reducedMotion ? target : Math.round(target * progress))

  return (
    <section
      ref={sectionRef}
      aria-labelledby={labelledBy}
      // Site navy (#0a1428 navbar/heroes, #0b2545 footer, #133560 footer accents) with the
      // same thin gold top border as the Home stats bar
      className="relative overflow-hidden border-t border-[#c9a24a]/30 bg-[linear-gradient(135deg,#0a1428,#0b2545_55%,#133560)] py-12 text-white md:py-16"
    >
      {/* Faint gold and blue glows so the band doesn't feel flat */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_85%_10%,rgba(201,162,74,0.12),transparent_70%),radial-gradient(ellipse_40%_50%_at_10%_100%,rgba(43,74,133,0.35),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-[1140px] px-4 sm:px-6">
        {heading}

        <ul className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {cards.map(({ key, label, Icon }, i) => {
            const target = stats?.[key] ?? 0
            return (
              <li
                key={key}
                style={{ animationDelay: `${i * STAGGER_MS}ms` }}
                className={`group rounded-2xl border border-[rgba(169,184,207,0.18)] bg-[rgba(19,53,96,0.35)] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-md transition-[translate,border-color,background-color,box-shadow] duration-300 ease-[ease] hover:-translate-y-1 hover:border-[#c9a24a] hover:bg-[rgba(19,53,96,0.5)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.25),0_0_24px_rgba(201,162,74,0.22)] motion-reduce:transition-none sm:p-6 ${
                  inView ? 'motion-safe:animate-rise-in motion-safe:[animation-fill-mode:backwards]' : 'motion-safe:opacity-0'
                }`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c9a24a]/10 text-[#c9a24a] ring-1 ring-[#c9a24a]/25">
                  <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                </span>

                {ready ? (
                  <p className="mt-5 font-['Playfair_Display',serif] text-[2rem] leading-none font-bold text-[#c9a24a] tabular-nums sm:text-[2.6rem]">
                    {/* Screen readers get the final number, not every animation frame */}
                    <span aria-hidden="true">{shown(target).toLocaleString()}+</span>
                    <span className="sr-only">{target.toLocaleString()}+</span>
                  </p>
                ) : (
                  <span
                    aria-hidden="true"
                    className="relative mt-5 block h-8 w-24 overflow-hidden rounded-md bg-white/10 sm:h-[2.6rem] sm:w-28"
                  >
                    <span className="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,transparent,rgba(201,162,74,0.18),transparent)] motion-reduce:animate-none" />
                  </span>
                )}

                <p className="mt-3 text-[0.72rem] font-semibold tracking-[0.14em] text-[#cbd5e1] uppercase sm:text-xs">
                  {label}
                </p>
              </li>
            )
          })}
        </ul>
        {status === 'loading' && <p className="sr-only">Loading course numbers…</p>}
      </div>
    </section>
  )
}

export default StatsCounter
