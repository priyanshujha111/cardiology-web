import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { getHighlightRanges } from '../hooks/useCourseSearch.js'

const MAX_SUGGESTIONS = 6

// Wraps the parts of `text` that match `query` in <mark>
export function HighlightText({ text, query }) {
  const ranges = getHighlightRanges(text, query)
  if (ranges.length === 0) return text

  const parts = []
  let cursor = 0
  ranges.forEach(([start, end]) => {
    if (start > cursor) parts.push(text.slice(cursor, start))
    parts.push(
      <mark
        key={start}
        className="rounded-[3px] bg-[rgba(225,29,72,0.12)] px-px text-inherit [-webkit-text-fill-color:currentColor]"
      >
        {text.slice(start, end)}
      </mark>,
    )
    cursor = end
  })
  if (cursor < text.length) parts.push(text.slice(cursor))
  return parts
}

const isTypingTarget = (el) =>
  el instanceof HTMLElement &&
  (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))

/**
 * Search input with a suggestions dropdown (ARIA combobox).
 * `search` is the object returned by useCourseSearch.
 */
function CourseSearch({ search, disabled = false }) {
  const { inputValue, setInputValue, clear, matches, query } = search
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const inputId = useId()
  const listId = useId()
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const hasText = inputValue.trim().length > 0
  const suggestions = query ? matches.slice(0, MAX_SUGGESTIONS) : []
  const showList = open && hasText && !disabled && suggestions.length > 0
  const active = showList && activeIndex < suggestions.length ? activeIndex : -1
  const optionId = (i) => `${listId}-opt-${i}`

  // "/" focuses the search from anywhere on the page (except while typing elsewhere)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return
      if (isTypingTarget(e.target)) return
      e.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const openCourse = (course) => {
    setOpen(false)
    navigate(`/courses/${course.slug}`)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      if (!hasText || suggestions.length === 0) return
      e.preventDefault()
      setOpen(true)
      setActiveIndex(showList ? Math.min(active + 1, suggestions.length - 1) : 0)
    } else if (e.key === 'ArrowUp') {
      if (!showList) return
      e.preventDefault()
      setActiveIndex(Math.max(active - 1, -1))
    } else if (e.key === 'Enter') {
      if (active >= 0) {
        e.preventDefault()
        openCourse(suggestions[active])
      } else {
        setOpen(false)
      }
    } else if (e.key === 'Escape') {
      if (showList) {
        e.preventDefault()
        setOpen(false)
      } else if (inputValue) {
        e.preventDefault()
        clear()
      }
    }
  }

  return (
    <div role="search" className="relative mx-auto w-full max-w-[720px]">
      <label htmlFor={inputId} className="sr-only">
        Search courses
      </label>
      <div className="relative">
        <Search
          size={20}
          strokeWidth={2}
          aria-hidden="true"
          // z-1: the input's backdrop-blur creates a layer that would otherwise paint over it
          className="pointer-events-none absolute top-1/2 left-5 z-1 -translate-y-1/2 text-[#94a3b8]"
        />
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={active >= 0 ? optionId(active) : undefined}
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          disabled={disabled}
          value={inputValue}
          placeholder="Search courses, e.g. Cardiology, Fellowship, PG Diploma..."
          onChange={(e) => {
            setInputValue(e.target.value)
            setOpen(true)
            setActiveIndex(-1)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className="h-[52px] w-full rounded-full border border-[#e2e8f0] bg-[rgba(255,255,255,0.85)] pr-14 pl-13 text-base text-[#0f172a] shadow-[0_2px_8px_rgba(15,23,42,0.04)] backdrop-blur-[10px] transition-[border-color,box-shadow] duration-200 ease-[ease] outline-none placeholder:text-[#94a3b8] hover:border-[#cbd5e1] focus:border-[#e11d48] focus:shadow-[0_0_0_4px_rgba(225,29,72,0.12),0_8px_24px_rgba(225,29,72,0.1)] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none sm:text-[0.95rem] [&::-webkit-search-cancel-button]:appearance-none"
        />
        {hasText ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              clear()
              inputRef.current?.focus()
            }}
            className="absolute top-1/2 right-2.5 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[#64748b] transition-colors duration-200 hover:bg-[#f1f5f9] hover:text-[#e11d48] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#e11d48] motion-reduce:transition-none"
          >
            <X size={18} strokeWidth={2.25} aria-hidden="true" />
          </button>
        ) : (
          <kbd
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-4 hidden h-6 min-w-6 -translate-y-1/2 items-center justify-center rounded-md border border-[#e2e8f0] bg-[#f8fafc] px-1.5 font-sans text-[0.75rem] font-semibold text-[#64748b] sm:inline-flex"
          >
            /
          </kbd>
        )}
      </div>

      <ul
        id={listId}
        role="listbox"
        aria-label="Suggested courses"
        hidden={!showList}
        className="absolute inset-x-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white py-1.5 text-left shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]"
      >
        {suggestions.map((course, i) => (
          <li
            key={course.id}
            id={optionId(i)}
            role="option"
            aria-selected={i === active}
            // mousedown would blur the input (closing the list) before the click lands
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => openCourse(course)}
            onMouseMove={() => i !== active && setActiveIndex(i)}
            className={`flex cursor-pointer items-center justify-between gap-3 px-5 py-2.5 text-[0.9rem] ${i === active ? 'bg-[#fff1f2]' : ''}`}
          >
            <span className="min-w-0 truncate text-[#0f172a]">
              <HighlightText text={course.title} query={query} />
            </span>
            <span className="shrink-0 text-[0.75rem] text-[#64748b]">{course.courseType}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CourseSearch
