import { useId } from 'react'

// Shared props for the 24x24 stroke icons below.
const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
}

// Edit values here.
const defaultValues = [
  {
    title: 'Academic Rigour',
    description:
      'Our teaching follows current cardiology guidelines, and practising specialists review every lesson before it reaches you.',
    icon: (
      <svg {...iconProps}>
        <path d="M12 6.5C10.3 5.2 8 4.5 4 4.5v13c4 0 6.3.7 8 2 1.7-1.3 4-2 8-2v-13c-4 0-6.3.7-8 2z" />
        <path d="M12 6.5v13" />
      </svg>
    ),
  },
  {
    title: 'Clinical Relevance',
    description:
      'Lessons are built around real patient cases, so what you learn today is useful on the ward tomorrow.',
    icon: (
      <svg {...iconProps}>
        <path d="M19.5 12.6A4.9 4.9 0 0012 6.1a4.9 4.9 0 00-7.5 6.5L12 20l7.5-7.4z" />
        <path d="M3 12h4l1.5-2.5 2.5 5 1.5-2.5H21" />
      </svg>
    ),
  },
  {
    title: 'Honest Guidance',
    description:
      'Ask us about a course, eligibility or what to expect, and you will get a clear, straight answer with no hidden surprises.',
    icon: (
      <svg {...iconProps}>
        <path d="M20 12a8 8 0 01-11.6 7.1L4 20l1-4A8 8 0 1120 12z" />
        <path d="M9 11h6 M9 14h4" />
      </svg>
    ),
  },
  {
    title: 'Lifelong Growth',
    description:
      'Our support continues after certification, helping doctors keep learning and keep moving forward in their careers.',
    icon: (
      <svg {...iconProps}>
        <path d="M12 21v-9" />
        <path d="M12 12c0-4 2.5-6.5 7-6.5 0 4.5-2.5 6.5-7 6.5z" />
        <path d="M12 15c0-3-2-5-6-5 0 3.5 2 5 6 5z" />
      </svg>
    ),
  },
]

function ValuesSection({
  title = 'What Guides Our Teaching',
  description = 'Four principles shape how we plan each course, how we teach it and how we stand by doctors once it ends.',
  items = defaultValues,
}) {
  const headingId = useId()

  return (
    <section
      className="bg-[#0b2545] font-['DM_Sans',system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif]"
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-[1140px] px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[640px] text-center">
          <h2
            id={headingId}
            className="font-['Playfair_Display',Georgia,serif] text-[clamp(1.625rem,3vw,1.875rem)] leading-[1.25] font-bold text-white"
          >
            {title}
          </h2>
          {description && (
            <p className="mt-3.5 text-[1rem] leading-[1.6] text-[#a9b8cf]">{description}</p>
          )}
        </div>

        <ul className="mt-10 grid grid-cols-[1fr] gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-[18px]">
          {items.map((item) => (
            <li key={item.title} className="flex">
              <div className="flex-1 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#102f57] p-6 text-left transition-[border-color,translate] duration-250 ease-[ease] hover:border-[rgba(255,255,255,0.2)] motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none lg:p-[22px]">
                <div className="flex items-center gap-3 lg:gap-2.5">
                  {item.icon && (
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#173f70] text-[#5b9cf5] [&_svg]:h-[22px] [&_svg]:w-[22px]"
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                  )}
                  <h3 className="text-[1.25rem] leading-[1.3] font-bold text-white lg:text-[1.125rem] lg:tracking-[-0.01em]">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-3.5 text-[0.9375rem] leading-[1.6] text-[#a9b8cf]">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default ValuesSection
