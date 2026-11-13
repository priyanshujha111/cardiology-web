import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadCardiologyCourses } from '../data/courseApi.js'

const serif = "font-['Playfair_Display',serif]"

const linkClass = 'font-medium text-[#16274a] underline decoration-[#c9a24a]/60 underline-offset-4 hover:text-[#c9a24a] transition-colors'

// Only routes that exist in App.jsx
const pages = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/courses', label: 'Courses' },
  { to: '/doctors', label: 'Faculty' },
  { to: '/terms', label: 'Terms of Service' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/refund-policy', label: 'Refund Policy' },
]

function LinkList({ links }) {
  return (
    <ul className="space-y-3">
      {links.map((l) => (
        <li key={l.to} className="flex gap-3">
          <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a24a]" />
          <Link to={l.to} className={linkClass}>
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function SitemapPage() {
  const [courses, setCourses] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Sitemap | Medical Global Academy'
    return () => {
      document.title = previousTitle
    }
  }, [])

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

  const courseLinks = courses.map((c) => ({ to: `/courses/${c.slug}`, label: c.title }))

  return (
    <div className="font-['DM_Sans',sans-serif] text-slate-800">
      {/* 1. Header */}
      <section className="bg-gradient-to-br from-[#0a1428] via-[#16274a] to-[#2b4a85] text-white">
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6 py-16 md:py-20">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#c9a24a]" />
            <span className="rounded-full border border-[#c9a24a]/40 bg-[#c9a24a]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a24a]">
              Sitemap
            </span>
          </div>
          <h1 className={`${serif} mt-6 text-4xl sm:text-5xl md:text-6xl font-bold leading-tight`}>
            Sitemap
          </h1>
        </div>
      </section>

      {/* 2. Body */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6">
          <div className="max-w-3xl space-y-12 text-base md:text-[17px] leading-[1.8] text-slate-600">
            <section>
              <h2 className={`${serif} mb-4 text-2xl md:text-3xl font-bold text-[#0a1428]`}>Pages</h2>
              <LinkList links={pages} />
            </section>

            <section>
              <h2 className={`${serif} mb-4 text-2xl md:text-3xl font-bold text-[#0a1428]`}>Courses</h2>
              {status === 'loading' && <p>Loading courses…</p>}
              {status === 'error' && (
                <p>
                  Courses could not be loaded. See all programs on the{' '}
                  <Link to="/courses" className={linkClass}>
                    Courses
                  </Link>{' '}
                  page.
                </p>
              )}
              {status === 'ready' && <LinkList links={courseLinks} />}
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SitemapPage
