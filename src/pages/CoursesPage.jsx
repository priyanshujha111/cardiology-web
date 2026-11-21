import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Info } from 'lucide-react'
import { loadCardiologyCourses } from '../data/courseApi.js'
import { COURSE_DISCLAIMER_BODY, COURSE_DISCLAIMER_LABEL } from '../constants/disclaimer.js'
import CourseSearch, { HighlightText } from '../components/CourseSearch.jsx'
import { useCourseSearch } from '../hooks/useCourseSearch.js'

// Matches the API's own `type` values exactly — "Pg Diploma", not "PG Diploma".
const filters = ['All', 'Fellowship', 'Pg Diploma', 'Certificate']

// Offered when a search finds nothing (each matches several cardiology courses)
const popularSearches = ['Cardiology', 'Echocardiography', 'Fellowship']

const SKELETON_CARDS = 6

// Cards shown at first, and how many more each "Load More" click reveals
const PAGE_SIZE = 12

const badgeColors = {
  trending: 'bg-[linear-gradient(135deg,#f59e0b,#d97706)]',
  top: 'bg-[linear-gradient(135deg,#ef4444,#dc2626)]',
  new: 'bg-[linear-gradient(135deg,#10b981,#059669)]',
  popular: 'bg-[linear-gradient(135deg,#8b5cf6,#7c3aed)]',
}

const filterBaseClass =
  'cursor-pointer rounded-[30px] text-[0.875rem] font-semibold transition-all duration-300 ease-in-out motion-reduce:transition-none'
// Same 2px of padding the border takes up, so active pills don't shrink
const filterActiveClass =
  'bg-[linear-gradient(135deg,#e11d48,#be123c)] px-[22px] py-2.5 text-white'
const filterIdleClass =
  'border-2 border-[#e2e8f0] bg-white px-5 py-2 text-[#475569] hover:border-[#e11d48] hover:text-[#e11d48]'

const noteClass = 'text-center text-[0.95rem] text-[#64748b]'

function truncate(text, max = 110) {
  return text.length > max ? `${text.slice(0, max).trimEnd()}...` : text
}

function CoursesPage() {
  // The active filter lives in the URL (?type=Fellowship) so it can be linked
  // to; a missing or unknown value falls back to "All"
  const [searchParams, setSearchParams] = useSearchParams()
  const typeParam = searchParams.get('type')
  const activeFilter = filters.includes(typeParam) ? typeParam : 'All'

  const setActiveFilter = (filter) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (filter === 'All') next.delete('type')
        else next.set('type', filter)
        return next
      },
      { replace: true },
    )
  }

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
        console.error('Could not load courses:', err)
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [])

  // Search text (?q=) + the type filter above, applied together
  const search = useCourseSearch(courses, activeFilter)
  const visibleCourses = search.results
  const { query, countsByType, total } = search

  // "Load More": every matching course stays in the DOM (so crawlers see all of
  // them); cards past `shownCount` are only hidden with CSS. The count goes back
  // to PAGE_SIZE whenever the filter or search text changes.
  const pagingKey = `${activeFilter}|${query}`
  const [paging, setPaging] = useState({ key: pagingKey, count: PAGE_SIZE })
  const shownCount = paging.key === pagingKey ? paging.count : PAGE_SIZE
  const shownTotal = Math.min(shownCount, visibleCourses.length)
  const hasMore = shownCount < visibleCourses.length
  const loadMore = () => setPaging({ key: pagingKey, count: shownCount + PAGE_SIZE })

  let resultLine = ''
  if (status === 'ready' && total > 0) {
    const matching =
      visibleCourses.length === total ? `${total}` : `${visibleCourses.length} matching`
    resultLine = query
      ? `Showing ${shownTotal} of ${matching} courses for “${query}”`
      : `Showing ${shownTotal} of ${matching} courses`
  }

  return (
    // Navbar is sticky (in flow) on this page, so top padding is only the gap below it
    <section className="relative overflow-x-hidden bg-[linear-gradient(135deg,#f8fafc,#f1f5f9)] pt-10 pb-16 font-['Lato',sans-serif] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[400px] before:bg-[linear-gradient(135deg,rgba(225,29,72,0.1),rgba(59,130,246,0.05))] max-[769px]:pt-5 max-[769px]:pb-12">
      <div className="relative z-1 mx-auto w-full max-w-[1280px] px-6">
        <div className="mb-8 text-center motion-safe:animate-rise-in">
          <span className="mb-5 inline-block rounded-[30px] bg-[rgba(225,29,72,0.1)] px-4 py-1.5 text-[0.875rem] font-semibold tracking-[1.5px] text-[#e11d48] uppercase backdrop-blur-[10px]">
            Trending Programs
          </span>
          <h2 className="mb-5 font-['Playfair_Display',serif] text-[2.8rem] leading-[1.2] font-bold text-[#0f172a] max-[769px]:text-[2rem]">
            Explore Our{' '}
            <span className="relative inline-block bg-[linear-gradient(135deg,#e11d48,#3b82f6)] bg-clip-text [-webkit-text-fill-color:transparent] after:absolute after:inset-x-0 after:bottom-[-5px] after:h-[3px] after:rounded-[3px] after:bg-[linear-gradient(90deg,#e11d48,#3b82f6)]">
              Cardiology Programs
            </span>
          </h2>
          <p className="mx-auto max-w-[700px] text-[1.1rem] leading-[1.6] text-[#475569]">
            Advance your clinical practice with structured cardiology training
            designed for doctors. Learn from experienced faculty through
            case-based modules you can fit around your schedule.
          </p>
          <p
            role="note"
            className="mx-auto mt-7 flex max-w-[700px] items-start gap-3 rounded-xl border border-[rgba(225,29,72,0.2)] bg-[rgba(255,255,255,0.7)] px-5 py-3.5 text-left text-[0.875rem] leading-[1.6] text-[#475569] backdrop-blur-[6px] max-[481px]:px-4"
          >
            <Info size={18} strokeWidth={2} aria-hidden="true" className="mt-[3px] shrink-0 text-[#e11d48]" />
            <span className="min-w-0">
              <strong className="font-semibold text-[#0f172a]">{COURSE_DISCLAIMER_LABEL}</strong>
              {COURSE_DISCLAIMER_BODY}
            </span>
          </p>
        </div>

        <div className="mb-6 motion-safe:animate-rise-in-delayed">
          <CourseSearch search={search} disabled={status !== 'ready'} />
        </div>

        {/* Mobile: one row that scrolls sideways. Wider screens: wraps, centered. */}
        <div className="-mx-6 mb-4 flex gap-3 overflow-x-auto px-6 py-1 [scrollbar-width:none] motion-safe:animate-rise-in-delayed sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`shrink-0 whitespace-nowrap ${filterBaseClass} ${activeFilter === filter ? filterActiveClass : filterIdleClass}`}
              aria-pressed={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
              {status === 'ready' && (
                <span className="ml-1.5 tabular-nums opacity-75">{countsByType[filter] ?? 0}</span>
              )}
            </button>
          ))}
        </div>

        {/* Always rendered (fixed height) so the grid doesn't jump when it appears */}
        <p
          aria-live="polite"
          className="mb-8 min-h-[1.5rem] text-center text-[0.9rem] text-[#64748b]"
        >
          {resultLine}
        </p>

        {status === 'loading' && (
          <>
            <p className="sr-only">Loading courses…</p>
            <div
              aria-hidden="true"
              className="mb-[60px] grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-8 max-[1025px]:grid-cols-[repeat(auto-fill,minmax(340px,1fr))] max-[1025px]:gap-6 max-[769px]:grid-cols-[1fr]"
            >
              {Array.from({ length: SKELETON_CARDS }, (_, i) => (
                <div key={i} className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]">
                  <div className="h-60 animate-pulse bg-[#e2e8f0] motion-reduce:animate-none" />
                  <div className="space-y-3 p-6 max-[481px]:p-5">
                    <div className="h-5 w-24 animate-pulse rounded-full bg-[#f1f5f9] motion-reduce:animate-none" />
                    <div className="h-6 w-4/5 animate-pulse rounded-md bg-[#e2e8f0] motion-reduce:animate-none" />
                    <div className="h-4 w-full animate-pulse rounded-md bg-[#f1f5f9] motion-reduce:animate-none" />
                    <div className="h-4 w-2/3 animate-pulse rounded-md bg-[#f1f5f9] motion-reduce:animate-none" />
                    <div className="mt-5 h-11 animate-pulse rounded-xl bg-[#e2e8f0] motion-reduce:animate-none" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {status === 'error' && (
          <p className={noteClass}>
            Couldn’t load the course list right now. Please refresh the page.
          </p>
        )}

        {status === 'ready' && visibleCourses.length === 0 && !query && (
          <p className={noteClass}>
            No {activeFilter.toLowerCase()} programs available at the moment.
          </p>
        )}

        {status === 'ready' && visibleCourses.length === 0 && query && (
          <div className="mx-auto mb-[60px] max-w-[560px] rounded-3xl border border-[#e2e8f0] bg-white px-6 py-10 text-center shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
            <p className="font-['Playfair_Display',serif] text-[1.35rem] font-bold text-[#0f172a]">
              No {activeFilter === 'All' ? '' : `${activeFilter.toLowerCase()} `}courses found for ‘{query}’
            </p>
            <p className="mt-2 text-[0.95rem] text-[#64748b]">
              Check the spelling, or try one of these:
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => search.searchFor(term)}
                  className={`${filterBaseClass} ${filterIdleClass}`}
                >
                  {term}
                </button>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={search.clear}
                className={`${filterBaseClass} ${filterActiveClass}`}
              >
                Clear search
              </button>
              {/* The text matches other types, just not this one */}
              {activeFilter !== 'All' && countsByType.All > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveFilter('All')}
                  className={`${filterBaseClass} ${filterIdleClass}`}
                >
                  Show all types ({countsByType.All})
                </button>
              )}
            </div>
          </div>
        )}

        {status === 'ready' && visibleCourses.length > 0 && (
          <>
          <div
            id="course-grid"
            className={`grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-8 max-[1025px]:grid-cols-[repeat(auto-fill,minmax(340px,1fr))] max-[1025px]:gap-6 max-[769px]:grid-cols-[1fr] ${hasMore ? 'mb-10' : 'mb-[60px]'}`}
          >
            {visibleCourses.map((course, i) => (
              <div
                className={`${i >= shownCount ? 'hidden' : 'flex'} group relative flex-col overflow-hidden rounded-3xl bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] transition-all duration-400 ease-in-out hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.02)] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-[3px] has-[a:focus-visible]:outline-[#c9a24a] motion-safe:animate-rise-in-stagger motion-safe:hover:-translate-y-2 motion-reduce:transition-none`}
                // Stagger restarts for each newly revealed batch
                style={{ '--card-index': i % PAGE_SIZE }}
                key={course.id}
              >
                <div className="relative h-60 overflow-hidden bg-[linear-gradient(135deg,#667eea,#764ba2)]">
                  <img
                    className="h-full w-full object-cover transition-transform duration-600 ease-in-out motion-safe:group-hover:scale-110 motion-reduce:transition-none"
                    src={course.image}
                    alt={course.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.classList.add('invisible')
                    }}
                  />
                  <span
                    className={`absolute top-4 left-4 z-2 rounded-[30px] px-3.5 py-1.5 text-[0.75rem] font-semibold tracking-[0.5px] text-white uppercase shadow-[0_2px_8px_rgba(0,0,0,0.1)] motion-safe:animate-slide-in-left ${badgeColors[course.badgeType] ?? ''}`}
                  >
                    {course.badge}
                  </span>
                  <span className="absolute right-4 bottom-4 z-2 rounded-[20px] bg-[rgba(0,0,0,0.7)] px-3 py-1 text-[0.75rem] font-medium text-white backdrop-blur-[10px] motion-safe:animate-slide-in-right">
                    {course.courseType}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 max-[481px]:p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-[20px] bg-[#f1f5f9] px-3 py-1 text-[0.75rem] font-semibold tracking-[0.3px] text-[#e11d48]">
                      {course.specialty}
                    </span>
                    <span className="flex items-center gap-1.5 text-[0.75rem] text-[#64748b]">
                      <span className="h-1 w-1 rounded-full bg-[#cbd5e1]"></span>
                      {course.accreditation}
                    </span>
                  </div>
                  <h3 className="mb-3 font-['Playfair_Display',serif] text-[1.35rem] leading-[1.3] font-bold text-[#0f172a] transition-[color] duration-300 ease-[ease] group-hover:text-[#e11d48] motion-reduce:transition-none">
                    <HighlightText text={course.title} query={query} />
                  </h3>
                  <p className="mb-5 text-[0.9rem] leading-[1.5] text-[#64748b]">
                    {truncate(course.description)}
                  </p>
                  {/* Pushed to the bottom so fee + buttons line up across cards in a row */}
                  <div className="mt-auto flex items-baseline justify-between gap-3 border-y border-[#f1f5f9] py-3">
                    <span className="text-[0.75rem] text-[#64748b]">Registration Fee</span>
                    <strong className="text-[1.05rem] font-bold text-[#0f172a]">{course.fee}</strong>
                  </div>
                  {/* Stretched link: ::after covers the whole card so any click on it opens the course */}
                  <Link
                    to={`/courses/${course.slug}`}
                    className="mt-5 flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[#0a1428] text-[0.9rem] font-semibold text-white transition-[background-color,color,box-shadow] duration-300 ease-[ease] group-hover:bg-[#c9a24a] group-hover:text-[#0a1428] group-hover:shadow-[0_8px_20px_rgba(201,162,74,0.35)] after:absolute after:inset-0 after:z-3 focus-visible:outline-none motion-reduce:transition-none"
                    aria-label={`View details: ${course.title}`}
                  >
                    View Details{' '}
                    <span
                      className="inline-block transition-transform duration-300 ease-[ease] motion-safe:group-hover:translate-x-1 motion-reduce:transition-none"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="mb-[60px] flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                aria-controls="course-grid"
                className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0a1428] px-8 text-[0.95rem] font-semibold text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-[background-color,color,box-shadow] duration-300 ease-[ease] hover:bg-[#c9a24a] hover:text-[#0a1428] hover:shadow-[0_8px_20px_rgba(201,162,74,0.35)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#c9a24a] motion-reduce:transition-none"
              >
                Load More
                <span className="tabular-nums opacity-75">
                  ({Math.min(PAGE_SIZE, visibleCourses.length - shownCount)} more)
                </span>
              </button>
            </div>
          )}
          </>
        )}

        {status === 'ready' && courses.length > 0 && (
          <p className={noteClass}>
            {courses.length} specialised cardiology programs · Flexible learning
            · Globally recognised
          </p>
        )}
      </div>
    </section>
  )
}

export default CoursesPage
