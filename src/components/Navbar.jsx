import { useCallback, useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import LoginModal from './LoginModal'
import SignUpModal from './SignUpModal'

const LOGO_URL = 'https://medicalglobalacademy.com/wp-content/uploads/2026/08/logo_new.png'

// Specialty shown under the site name. Change this one value for another specialty site.
const SPECIALTY = 'Cardiology'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/courses', label: 'Courses' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/contact', label: 'Contact' },
]

const SCROLL_THRESHOLD = 12

const linkBase =
  'uppercase text-sm tracking-[0.15em] pb-1 border-b-2 transition-colors duration-200'

// `solid` = white bar (scrolled, other pages, or mobile menu open); otherwise dark glass over the hero
function navLinkClass(solid) {
  return ({ isActive }) => {
    if (isActive) {
      return `${linkBase} border-[#c9a24a] ${solid ? 'text-[#0a1428]' : 'text-white'}`
    }
    return `${linkBase} border-transparent ${
      solid ? 'text-slate-600 hover:text-[#0a1428]' : 'text-white/75 hover:text-white'
    }`
  }
}

const buttonBase =
  'inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24a]'

function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(() => window.scrollY > SCROLL_THRESHOLD)
  const [logoFailed, setLogoFailed] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const close = () => setOpen(false)
  const closeLogin = useCallback(() => setLoginOpen(false), [])
  const [signUpOpen, setSignUpOpen] = useState(false)
  const closeSignUp = useCallback(() => setSignUpOpen(false), [])
  const switchToSignUp = () => {
    setLoginOpen(false)
    setSignUpOpen(true)
  }
  const switchToLogin = () => {
    setSignUpOpen(false)
    setLoginOpen(true)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // On Home the bar is fixed so the hero gradient shows through the glass
  const isHome = pathname === '/'
  const solid = !isHome || scrolled || open

  const navItems = (
    <>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          className={navLinkClass(solid)}
          onClick={close}
        >
          {link.label}
        </NavLink>
      ))}
    </>
  )

  const buttons = (
    <>
      <button
        type="button"
        onClick={() => {
          close()
          setLoginOpen(true)
        }}
        className={`${buttonBase} border ${
          solid
            ? 'border-slate-300 bg-white text-[#0a1428] hover:border-[#0a1428]'
            : 'border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10'
        }`}
      >
        Login
      </button>
      <button
        type="button"
        onClick={() => {
          close()
          setSignUpOpen(true)
        }}
        className={`${buttonBase} border border-[#c9a24a] bg-[#c9a24a] text-[#0a1428] hover:border-[#d8b25a] hover:bg-[#d8b25a]`}
      >
        Sign Up
      </button>
    </>
  )

  const specialtyLabel = SPECIALTY && (
    <span
      className={`mt-0.5 flex items-center gap-1.5 whitespace-nowrap text-[10px] font-semibold uppercase leading-none tracking-[0.22em] transition-colors duration-300 md:text-[11px] ${
        solid ? 'text-slate-500' : 'text-white/70'
      }`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a24a]" />
      {SPECIALTY}
    </span>
  )

  return (
    <>
    <header
      className={`${isHome ? 'fixed inset-x-0' : 'sticky'} top-0 z-50 w-full border-b font-['DM_Sans',sans-serif] transition-[background-color,border-color,box-shadow] duration-300 ${
        solid
          ? 'border-slate-200 bg-white shadow-[0_6px_24px_rgba(10,20,40,0.08)]'
          : 'border-white/10 bg-[#0a1428]/70 backdrop-blur-md'
      }`}
    >
      {/* Same max-width + padding as the hero container so left edges line up */}
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 sm:px-6 xl:px-8 py-3 md:py-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
        <Link to="/" onClick={close} aria-label="Medical Global Academy — Home" className="flex shrink-0 items-center gap-3 justify-self-start">
          {logoFailed ? (
            <span className="flex flex-col">
              <span
                className={`font-['Playfair_Display',serif] text-lg md:text-xl font-bold transition-colors duration-300 ${
                  solid ? 'text-[#0a1428]' : 'text-white'
                }`}
              >
                Medical Global Academy
              </span>
              {specialtyLabel}
            </span>
          ) : (
            <>
              <img
                src={LOGO_URL}
                alt="Medical Global Academy"
                loading="eager"
                width="256"
                height="256"
                onError={() => setLogoFailed(true)}
                className="h-11 w-auto object-contain md:h-[52px]"
              />
              {/* Site name only fits from xl up; the specialty label shows at every size */}
              <span className="flex flex-col">
                <span
                  className={`hidden xl:block whitespace-nowrap font-['Playfair_Display',serif] text-lg leading-tight font-bold transition-colors duration-300 ${
                    solid ? 'text-[#0a1428]' : 'text-white'
                  }`}
                >
                  Medical Global Academy
                </span>
                {specialtyLabel}
              </span>
            </>
          )}
        </Link>

        <nav className="hidden lg:flex items-center gap-8">{navItems}</nav>

        <div className="hidden lg:flex items-center justify-end gap-3">{buttons}</div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className={`lg:hidden flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md transition-colors ${
            solid ? 'hover:bg-slate-100' : 'hover:bg-white/10'
          }`}
        >
          <span className={`h-0.5 w-6 ${solid ? 'bg-[#0a1428]' : 'bg-white'}`} />
          <span className={`h-0.5 w-6 ${solid ? 'bg-[#0a1428]' : 'bg-white'}`} />
          <span className={`h-0.5 w-6 ${solid ? 'bg-[#0a1428]' : 'bg-white'}`} />
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pb-6 pt-4">
          <nav className="flex flex-col items-start gap-4">{navItems}</nav>
          <div className="mt-6 flex flex-col gap-3">{buttons}</div>
        </div>
      )}
    </header>
    <LoginModal open={loginOpen} onClose={closeLogin} onSwitchToSignUp={switchToSignUp} />
    <SignUpModal open={signUpOpen} onClose={closeSignUp} onSwitchToLogin={switchToLogin} />
    </>
  )
}

export default Navbar
