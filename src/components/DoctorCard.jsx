import { Children, useState } from 'react'
import { Link } from 'react-router-dom'

// Shared by the Home "Meet Our Expert Doctors" section, the Doctors page and the
// doctor profile. Fonts: Lora 700 and Outfit 400/600 are loaded in index.html, so
// only those weights are used here to look the same on every page.
const serif = "font-['Lora',Georgia,'Times_New_Roman',serif]"
const sans = "font-['Outfit',system-ui,-apple-system,'Segoe_UI',sans-serif]"

const avatarBg = 'bg-[linear-gradient(145deg,#f8f0e0,#efdcb4)]'

// Card avatar size (px). The cover strip and avatar offset below are tuned to it:
// the avatar ring (48 + 2*5 padding = 58px) starts 24px down and straddles the
// strip's bottom edge at 52px.
const CARD_AVATAR = 48
const MAX_CARD_TAGS = 2

// Navy strip behind the avatar (Doctors page cards)
const coverStrip =
  'before:absolute before:inset-x-0 before:top-0 before:h-[52px] before:bg-[linear-gradient(135deg,rgba(217,191,140,0.25),transparent_55%),linear-gradient(135deg,#0f1b3d,#22305c)]'

// "Dr. Ambuj" -> "A", "Dr. Meet Jha" -> "MJ"
function getInitials(name = '') {
  const parts = name
    .replace(/^dr\.?\s*/i, '')
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return 'Dr'
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

function HeartIcon({ size = 16 }) {
  return (
    <svg
      className="shrink-0"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 20.5s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7.6a4.5 4.5 0 0 1 7.5 2.9c0 5.4-7.5 10-7.5 10Z" />
    </svg>
  )
}

// Round photo, or the doctor's initials when there is no photo or it fails to load.
export function DoctorAvatar({ name, photo, size = 64 }) {
  const [failedSrc, setFailedSrc] = useState(null)
  const showPhoto = Boolean(photo) && failedSrc !== photo
  const box = { width: size, height: size }

  if (showPhoto) {
    return (
      <img
        className={`block rounded-full object-cover ${avatarBg}`}
        style={box}
        src={photo}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        onError={() => setFailedSrc(photo)}
      />
    )
  }

  return (
    <div
      className={`grid place-items-center rounded-full font-bold tracking-[0.02em] text-[#0f1b3d] select-none ${serif} ${avatarBg}`}
      style={{ ...box, fontSize: Math.round(size * 0.34) }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  )
}

const tagSizes = {
  md: {
    chip: 'gap-[7px] px-3.5 py-[7px] text-[0.85rem]',
    list: 'gap-1.5',
    icon: 16,
  },
  sm: {
    chip: 'gap-1 px-2.5 py-1 text-xs',
    list: 'gap-1',
    icon: 12,
  },
}

// Departments as tags; the first one (the doctor's focus) gets the heart icon.
// `max` limits how many are shown; the rest collapse into a "+N" chip.
export function DepartmentTags({ areas = [], className = '', size = 'md', max }) {
  if (areas.length === 0) return null
  const s = tagSizes[size] ?? tagSizes.md
  const limit = typeof max === 'number' && max > 0 ? max : areas.length
  const shown = areas.slice(0, limit)
  const hidden = areas.slice(limit)

  return (
    <ul aria-label="Departments" className={`flex flex-wrap justify-center ${s.list} ${className}`}>
      {shown.map((area, i) => (
        <li
          key={area}
          className={`inline-flex max-w-full items-center rounded-full bg-[#eef3fb] font-normal leading-tight text-[#3b4766] ${s.chip}`}
        >
          {i === 0 && <HeartIcon size={s.icon} />}
          <span className="min-w-0 wrap-anywhere">{area}</span>
        </li>
      ))}
      {hidden.length > 0 && (
        <li
          className={`inline-flex items-center rounded-full border border-[#d9e3f2] bg-white font-semibold leading-tight text-[#3b4766] ${s.chip}`}
          title={hidden.join(', ')}
        >
          <span aria-hidden="true">+{hidden.length}</span>
          <span className="sr-only">
            {hidden.length} more: {hidden.join(', ')}
          </span>
        </li>
      )}
    </ul>
  )
}

// Centred, wrapping rows: 1 card sits in the middle, 4+ fill a 4-column row.
// Each row stretches its items, so cards in a row share one height.
export function DoctorGrid({ children, className = '', ...rest }) {
  return (
    <ul role="list" className={`flex flex-wrap justify-center gap-5 ${className}`} {...rest}>
      {Children.map(children, (child) =>
        child ? <li className="grid w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]">{child}</li> : null,
      )}
    </ul>
  )
}

// Same footprint as DoctorCard (placeholder while content loads).
export function DoctorCardSkeleton({ cover = false }) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex h-full min-w-0 flex-col items-center overflow-hidden rounded-[20px] border border-[#e7e2d6] bg-white px-5 pb-5 shadow-[0_1px_2px_rgba(15,27,61,0.04),0_12px_32px_-16px_rgba(15,27,61,0.18)] motion-safe:animate-pulse ${cover ? `pt-0 ${coverStrip}` : 'pt-6'}`}
    >
      <div className={`relative z-1 rounded-full bg-white p-[5px] ${cover ? 'mt-6' : ''}`}>
        <div className="h-12 w-12 rounded-full bg-[#efe7d6]" />
      </div>
      <div className="relative z-1 mt-3 h-5 w-28 rounded bg-[#ece7dc]" />
      <div className="mt-2 h-6 w-32 rounded-full bg-[#eef3fb]" />
      <div className="mt-3.5 mb-3 h-px w-full bg-[#efeae0]" />
      <div className="h-6 w-36 rounded-full bg-[#f6f1e6]" />
    </div>
  )
}

// `cover` adds the navy strip behind the avatar. Passing `onSelect` makes the
// card clickable (keyboard too); `selected` highlights it and plays the blink.
// Passing `to` (without onSelect) adds a "View profile" link.
function DoctorCard({ doctor, cover = false, selected = false, onSelect, to, headingLevel = 3 }) {
  const interactive = typeof onSelect === 'function'
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  const qualification = doctor.qualification || ''

  const className = [
    `relative flex h-full w-full min-w-0 flex-col items-center overflow-hidden rounded-[20px] border bg-white px-5 pb-5 text-center ${sans} text-[#0f1b3d] transition-[translate,box-shadow,border-color] duration-250 ease-[ease] motion-reduce:transition-none`,
    selected
      ? 'border-[#d9bf8c] shadow-[0_2px_4px_rgba(15,27,61,0.05),0_24px_44px_-18px_rgba(15,27,61,0.3)] motion-safe:-translate-y-1.5 motion-safe:animate-doctor-blink'
      : 'border-[#e7e2d6] shadow-[0_1px_2px_rgba(15,27,61,0.04),0_12px_32px_-16px_rgba(15,27,61,0.18)] hover:border-[#d9bf8c] hover:shadow-[0_2px_4px_rgba(15,27,61,0.05),0_24px_44px_-18px_rgba(15,27,61,0.3)] motion-safe:hover:-translate-y-1.5',
    cover ? `pt-0 ${coverStrip}` : 'pt-6',
    // Clickable cards (Home): navy-to-gold top bar on hover / when selected
    interactive &&
      'cursor-pointer after:absolute after:inset-x-0 after:top-0 after:h-1 after:bg-[linear-gradient(90deg,#0a1428,#c9a24a)] after:transition-opacity after:duration-250 after:ease-[ease] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#c9a24a] motion-reduce:after:transition-none',
    interactive && (selected ? 'after:opacity-100' : 'after:opacity-0 hover:after:opacity-100'),
  ]
    .filter(Boolean)
    .join(' ')

  const interactiveProps = interactive
    ? {
        role: 'button',
        tabIndex: 0,
        'aria-pressed': selected,
        onClick: onSelect,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect()
          }
        },
      }
    : {}

  return (
    <article className={className} {...interactiveProps}>
      <div
        className={`relative z-1 rounded-full bg-white p-[5px] shadow-[0_6px_16px_-6px_rgba(15,27,61,0.35)] ${cover ? 'mt-6' : ''}`}
      >
        <DoctorAvatar name={doctor.name} photo={doctor.photo} size={CARD_AVATAR} />
      </div>

      {/* flex-1 pushes the divider, qualification and link to the bottom, so they line up across a row */}
      <div className="relative z-1 mt-3 w-full flex-1">
        <Heading className={`text-[1.1rem] leading-[1.3] font-bold wrap-anywhere text-[#0f1b3d] ${serif}`}>
          {doctor.name}
        </Heading>
        <DepartmentTags areas={doctor.focusAreas} size="sm" max={MAX_CARD_TAGS} className="mt-2" />
      </div>

      {qualification && (
        <>
          <div
            className="mt-3.5 mb-3 h-px w-full bg-[linear-gradient(90deg,transparent,#e7e2d6_20%,#e7e2d6_80%,transparent)]"
            aria-hidden="true"
          />
          <p
            className={`line-clamp-2 max-w-full border border-dashed border-[#d9bf8c] bg-[#fffdf8] px-3 py-1 text-xs leading-[1.45] font-normal text-[#3b4766] ${qualification.length > 28 ? 'rounded-xl' : 'rounded-full'}`}
            title={qualification}
          >
            <span>Qualification: </span>
            <strong className="font-semibold tracking-[0.02em] wrap-anywhere text-[#0f1b3d]">
              {qualification}
            </strong>
          </p>
        </>
      )}

      {to && !interactive && (
        <Link
          to={to}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.85rem] font-semibold text-[#b8924f] underline-offset-4 transition-colors hover:text-[#0f1b3d] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a24a] motion-reduce:transition-none"
        >
          View profile<span className="sr-only"> of {doctor.name}</span>
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </article>
  )
}

export default DoctorCard
