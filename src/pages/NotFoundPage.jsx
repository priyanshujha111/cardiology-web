import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const serif = "font-['Playfair_Display',serif]"

const helpfulLinks = [
  { to: '/about', label: 'About' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/sitemap', label: 'Sitemap' },
]

function NotFoundPage({
  title = 'Page not found',
  message = 'The page you’re looking for may have been moved, or the link may be incorrect.',
}) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = `${title} | Medical Global Academy`
    return () => {
      document.title = previousTitle
    }
  }, [title])

  return (
    <section className="bg-gradient-to-br from-[#0a1428] via-[#16274a] to-[#2b4a85] font-['DM_Sans',sans-serif] text-white">
      {/* The server answers every URL with index.html, so this keeps bad URLs out of search results */}
      <meta name="robots" content="noindex" />
      <div className="mx-auto flex min-h-[70vh] max-w-[1140px] flex-col items-center justify-center px-4 py-20 text-center sm:px-6 md:py-28">
        <p className={`${serif} text-7xl font-bold leading-none text-[#c9a24a] sm:text-8xl md:text-9xl motion-safe:animate-fade-up`}>
          404
        </p>
        <div className="mx-auto mt-8 h-1 w-14 rounded-full bg-gradient-to-r from-[#c9a24a] to-[#e6c573]" />
        <h1 className={`${serif} mt-8 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl`}>{title}</h1>
        <p className="mt-4 max-w-xl text-base leading-[1.8] text-slate-300 md:text-[17px]">{message}</p>

        <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
          <Link
            to="/"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#c9a24a] px-7 text-sm font-semibold text-[#0a1428] shadow-[0_8px_24px_rgba(201,162,74,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d8b25a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
          >
            Back to Home
          </Link>
          <Link
            to="/courses"
            className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/30 px-7 text-sm font-semibold text-white transition-colors hover:border-[#c9a24a] hover:text-[#c9a24a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
          >
            Browse Courses
          </Link>
        </div>

        <nav aria-label="Helpful links" className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {helpfulLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-slate-300 underline decoration-[#c9a24a]/60 underline-offset-4 transition-colors hover:text-[#c9a24a]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  )
}

export default NotFoundPage
