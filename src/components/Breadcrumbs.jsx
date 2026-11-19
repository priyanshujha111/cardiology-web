import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, matchPath, useLocation, useSearchParams } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import {
  SITE_URL,
  breadcrumbRoutes,
  courseTypeLabels,
  hiddenPaths,
  notFoundRoute,
} from '../config/breadcrumbs.js'
import { loadCardiologyCourses } from '../data/courseApi.js'
import { getDoctorById } from '../data/doctors.js'
import { BreadcrumbContext } from '../hooks/useBreadcrumbLabel.js'

const routesByPath = new Map(breadcrumbRoutes.map((r) => [r.path, r]))

const SMALL_WORDS = new Set(['a', 'an', 'and', 'as', 'at', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'with'])

// "fellowship-in-cardiac-surgery" -> "Fellowship in Cardiac Surgery"
function titleFromSlug(slug = '') {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word, i) =>
      i > 0 && SMALL_WORDS.has(word.toLowerCase())
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join(' ')
}

function matchRoute(pathname) {
  for (const route of breadcrumbRoutes) {
    const match = matchPath({ path: route.path, end: true }, pathname)
    if (match) return { route, params: match.params }
  }
  return { route: notFoundRoute, params: {} }
}

/**
 * Course name for a slug, from the shared (cached, one request) course list.
 * Returns undefined while loading or if the request fails, null if no course has that slug.
 */
function useCourseTitle(slug) {
  const [result, setResult] = useState({ slug: undefined, title: undefined })

  useEffect(() => {
    if (!slug) return undefined
    let active = true
    loadCardiologyCourses()
      .then((list) => {
        if (active) setResult({ slug, title: list.find((c) => c.slug === slug)?.title ?? null })
      })
      .catch(() => {}) // fall back to the slug; the page itself shows the error
    return () => {
      active = false
    }
  }, [slug])

  return result.slug === slug ? result.title : undefined
}

/**
 * Site-wide breadcrumb, mounted once in App.jsx below the Navbar. The trail comes
 * from src/config/breadcrumbs.js; also adds a schema.org BreadcrumbList JSON-LD.
 *
 * @param currentLabel  optional override for the last item (pages can also use
 *                      useBreadcrumbLabel() from src/hooks/useBreadcrumbLabel.js)
 */
function Breadcrumbs({ currentLabel }) {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const { override } = useContext(BreadcrumbContext)

  const hidden = hiddenPaths.some((p) => matchPath({ path: p, end: true }, pathname))
  const { route, params } = matchRoute(pathname)
  const courseTitle = useCourseTitle(route.dynamic === 'course' ? params.slug : undefined)

  // Label for the current route, plus whether it is a "not found" view
  let label = route.label
  let notFound = Boolean(route.notFound)
  if (route.dynamic === 'course') {
    if (courseTitle === null) {
      label = 'Course Not Found'
      notFound = true
    } else {
      label = courseTitle ?? titleFromSlug(params.slug)
    }
  } else if (route.dynamic === 'doctor') {
    const doctor = getDoctorById(params.id)
    label = doctor?.name ?? 'Doctor Not Found'
    notFound = !doctor
  }

  // Walk up the parents: [Home, …, current]
  const items = [{ label, to: pathname }]
  for (let parent = routesByPath.get(route.parent); parent; parent = routesByPath.get(parent.parent)) {
    items.unshift({ label: parent.label, to: parent.path })
  }

  // /courses?type=Fellowship -> Home > Courses > Fellowship
  const type = searchParams.get('type')
  if (route.path === '/courses' && courseTypeLabels[type]) {
    items.push({ label: courseTypeLabels[type], to: `/courses?type=${encodeURIComponent(type)}` })
  }

  const overrideLabel = currentLabel ?? (override?.pathname === pathname ? override.label : undefined)
  if (overrideLabel) items[items.length - 1] = { ...items[items.length - 1], label: overrideLabel }

  // JSON-LD from the same trail (skipped for "not found" views, which are noindex)
  const jsonLd = hidden || notFound
    ? null
    : JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.label,
          item: `${SITE_URL}${item.to}`,
        })),
      })

  useEffect(() => {
    if (!jsonLd) return undefined
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.breadcrumbs = ''
    script.textContent = jsonLd
    document.head.appendChild(script)
    return () => script.remove()
  }, [jsonLd])

  const tones = useMemo(
    () =>
      route.tone === 'light'
        ? {
            bar: `${route.bg ?? 'bg-white'} border-b border-[rgba(15,27,61,0.06)]`,
            link: 'text-[#64748b] hover:text-[#b8924f]',
            separator: 'text-[#cbd5e1]',
            current: 'text-[#0f172a]',
          }
        : {
            bar: 'bg-[#0a1428] border-b border-[rgba(255,255,255,0.06)]',
            link: 'text-slate-400 hover:text-[#c9a24a]',
            separator: 'text-slate-600',
            current: 'text-white',
          },
    [route.tone, route.bg],
  )

  if (hidden) return null

  return (
    <div className={`${tones.bar} font-['DM_Sans',system-ui,sans-serif]`}>
      <nav aria-label="Breadcrumb" className={`mx-auto ${route.container ?? 'max-w-[1280px] px-4 sm:px-6'} py-3`}>
        {/* One line: earlier items keep their size, the current one truncates with an ellipsis */}
        <ol className="flex min-w-0 items-center text-sm leading-5">
          {items.map((item, i) => {
            const isLast = i === items.length - 1
            const isHome = item.to === '/'
            return (
              <li key={item.to} className={`flex items-center ${isLast ? 'min-w-0' : 'shrink-0'}`}>
                {i > 0 && (
                  <ChevronRight
                    size={14}
                    strokeWidth={2}
                    aria-hidden="true"
                    className={`mx-1.5 shrink-0 ${tones.separator}`}
                  />
                )}
                {isLast ? (
                  <span aria-current="page" title={item.label} className={`truncate font-medium ${tones.current}`}>
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.to}
                    className={`inline-flex items-center gap-1.5 rounded-[4px] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a24a] motion-reduce:transition-none ${tones.link}`}
                  >
                    {isHome && <Home size={15} strokeWidth={2} aria-hidden="true" className="shrink-0" />}
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}

export function BreadcrumbProvider({ children }) {
  const [override, setOverride] = useState(null)
  const value = useMemo(() => ({ override, setOverride }), [override])
  return <BreadcrumbContext.Provider value={value}>{children}</BreadcrumbContext.Provider>
}

export default Breadcrumbs
