import { useId, useState } from 'react'
import { fellowshipFaqs } from '../data/faqs.js'

// Each variant owns its full class list. Open/closed classes are alternatives rather
// than overrides, because Tailwind's output order (not the order here) decides conflicts.
const themes = {
  light: {
    section: "bg-[#f1f5fa] font-['Inter','DM_Sans',system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif]",
    container: 'px-4 py-14 sm:px-6 sm:py-[72px]',
    inner: 'max-w-[680px]',
    title:
      'mb-6 text-left text-[clamp(1.5rem,4vw,2rem)] leading-[1.2] font-bold tracking-[-0.01em] text-[#0f1b3d]',
    list: 'gap-3',
    item: 'rounded-[10px] bg-white',
    itemOpen: 'border-[#d8e0ec] shadow-[0_8px_24px_rgba(15,27,61,0.08)]',
    itemClosed: 'border-[#e3e8f0] shadow-[0_1px_3px_rgba(15,27,61,0.04)]',
    button:
      'rounded-[10px] px-5 py-[18px] text-[1rem] font-bold text-[#0f1b3d] focus-visible:outline-[#2563eb] sm:px-6 sm:py-5 sm:text-[1.0625rem]',
    buttonOpen: '',
    buttonClosed: '',
    icon: 'text-[#2563eb]',
    answer: 'px-5 pb-5 leading-[1.7] text-[#4a5675] sm:px-6 sm:pb-[22px]',
  },
  // Centered, navy-black with gold accents
  dark: {
    section: "bg-[#060b18] font-['DM_Sans',system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif]",
    container: 'px-4 py-16 sm:px-6 sm:py-24',
    inner: 'mx-auto max-w-[770px]',
    title:
      'mx-auto mb-10 max-w-[640px] text-center text-[clamp(1.75rem,5vw,3rem)] leading-[1.15] font-medium tracking-[-0.02em] text-balance text-white sm:mb-14',
    list: 'gap-3.5',
    item: 'group rounded-xl bg-[#0a1226]',
    itemOpen:
      'border-[rgba(201,162,74,0.6)] shadow-[0_0_0_1px_rgba(201,162,74,0.08),0_16px_40px_rgba(0,0,0,0.35)]',
    itemClosed: 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.22)]',
    button:
      'rounded-xl p-[18px] text-[1rem] font-medium transition-[color] duration-250 ease-[ease] focus-visible:outline-[#c9a24a] motion-reduce:transition-none sm:px-6 sm:py-[22px] sm:text-[1.0625rem]',
    buttonOpen: 'text-white',
    buttonClosed: 'text-[#9aa3b5] group-hover:text-[#d3d8e2]',
    icon: 'text-[#c9a24a]',
    answer: 'px-[18px] pb-[18px] leading-[1.75] text-[#8b93a7] sm:px-6 sm:pb-[22px]',
  },
}

function PlusMinusIcon({ isOpen, className }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 ${className}`}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 10h12" />
      <path
        className={`origin-center transition-transform duration-250 ease-[ease] motion-reduce:transition-none ${isOpen ? 'scale-y-0' : ''}`}
        d="M10 4v12"
      />
    </svg>
  )
}

// Points down; the dark variant rotates it 180° when the item is open.
function ChevronIcon({ isOpen, className }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 transition-transform duration-300 ease-[ease] motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''} ${className}`}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 7.5l5 5 5-5" />
    </svg>
  )
}

function FaqSection({
  title = 'Frequently asked questions',
  items = fellowshipFaqs,
  variant = 'light', // 'light' | 'dark'
  defaultOpen = null, // index of the item open on first render, or null
}) {
  const [openIndex, setOpenIndex] = useState(defaultOpen)
  const baseId = useId()
  const titleId = `${baseId}-title`
  const isDark = variant === 'dark'
  const theme = isDark ? themes.dark : themes.light
  const Icon = isDark ? ChevronIcon : PlusMinusIcon

  if (!items.length) return null

  return (
    <section className={theme.section} aria-labelledby={titleId}>
      <div className={`mx-auto max-w-[1140px] ${theme.container}`}>
        <div className={theme.inner}>
          <h2 id={titleId} className={theme.title}>
            {title}
          </h2>
          <ul className={`flex flex-col ${theme.list}`}>
            {items.map((item, i) => {
              const isOpen = openIndex === i
              const buttonId = `${baseId}-q${i}`
              const panelId = `${baseId}-a${i}`
              return (
                <li
                  key={item.question}
                  className={`border transition-[box-shadow,border-color] duration-250 ease-[ease] motion-reduce:transition-none ${theme.item} ${isOpen ? theme.itemOpen : theme.itemClosed}`}
                >
                  <h3>
                    <button
                      type="button"
                      id={buttonId}
                      className={`flex w-full cursor-pointer items-center justify-between gap-4 bg-transparent text-left leading-[1.45] focus-visible:outline-2 focus-visible:outline-offset-2 ${theme.button} ${isOpen ? theme.buttonOpen : theme.buttonClosed}`}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                    >
                      <span>{item.question}</span>
                      <Icon isOpen={isOpen} className={theme.icon} />
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`grid motion-reduce:transition-none ${
                      isOpen
                        ? 'visible grid-rows-[1fr] opacity-100 [transition:grid-template-rows_0.3s_ease,opacity_0.3s_ease,visibility_0s]'
                        : 'invisible grid-rows-[0fr] opacity-0 [transition:grid-template-rows_0.3s_ease,opacity_0.3s_ease,visibility_0s_linear_0.3s]'
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className={`text-[0.9375rem] font-normal ${theme.answer}`}>{item.answer}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default FaqSection
