import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const DEBOUNCE_MS = 250
const DESCRIPTION_CHARS = 300 // only the start of the description is searched

const COMBINING_MARKS = /[̀-ͯ]/g

// Lowercase, strip accents, collapse whitespace
export function normalize(text) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

// Query word -> extra words it should also match (course type shorthands)
const SYNONYMS = {
  pg: ['pg diploma'],
  pgd: ['pg diploma'],
  diploma: ['pg diploma'],
  cert: ['certificate'],
  fellow: ['fellowship'],
}

// Each query word becomes a list of alternatives; a word matches if any alternative does
function parseQuery(query) {
  const words = normalize(query).split(' ').filter(Boolean)
  return words.map((word) => [word, ...(SYNONYMS[word] ?? [])])
}

const wordMatches = (alternatives, text) => alternatives.some((alt) => text.includes(alt))

// Built once per course list, not per keystroke
function buildIndex(courses) {
  return courses.map((course, position) => ({
    course,
    position,
    name: normalize(course.title),
    text: normalize(
      [
        course.title,
        course.courseType,
        course.specialty,
        ...(course.departments ?? []),
        (course.description ?? '').slice(0, DESCRIPTION_CHARS),
      ].join(' '),
    ),
  }))
}

// 0: name starts with the query, 1: name contains it, 2: every word is in the name, 3: other fields
function rank(entry, phrase, words) {
  if (entry.name.startsWith(phrase)) return 0
  if (entry.name.includes(phrase)) return 1
  if (words.every((alts) => wordMatches(alts, entry.name))) return 2
  return 3
}

// Ranges [start, end) in `text` that match any query word or synonym, accent- and
// case-insensitive. Used to highlight the course name.
export function getHighlightRanges(text, query) {
  const alternatives = parseQuery(query).flat()
  if (!text || alternatives.length === 0) return []

  // Normalize char by char so positions map back to the original text
  let normalized = ''
  const origin = []
  for (let i = 0; i < text.length; i += 1) {
    const piece = text[i].normalize('NFD').replace(COMBINING_MARKS, '').toLowerCase()
    for (const ch of piece) {
      normalized += ch
      origin.push(i)
    }
  }

  const ranges = []
  for (const alt of alternatives) {
    let from = normalized.indexOf(alt)
    while (from !== -1) {
      const to = from + alt.length - 1
      ranges.push([origin[from], origin[to] + 1])
      from = normalized.indexOf(alt, from + 1)
    }
  }

  // Merge overlaps
  ranges.sort((a, b) => a[0] - b[0])
  const merged = []
  for (const range of ranges) {
    const last = merged[merged.length - 1]
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1])
    else merged.push([...range])
  }
  return merged
}

/**
 * Search state for the Courses page. The search text lives in the URL (?q=)
 * so refresh, sharing and the back button keep it; typing updates the URL
 * after a short debounce (replacing the entry, so history isn't flooded).
 *
 * @param courses     the full course list
 * @param activeType  the active type filter ('All' or a course type)
 */
export function useCourseSearch(courses, activeType = 'All') {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const [inputValue, setInputValue] = useState(query)

  // URL changed from outside (back/forward, a link): show it in the input
  const [syncedQuery, setSyncedQuery] = useState(query)
  if (query !== syncedQuery) {
    setSyncedQuery(query)
    if (normalize(query) !== normalize(inputValue)) setInputValue(query)
  }

  // Debounced write of the input to the URL (extra spaces collapsed)
  useEffect(() => {
    const next = inputValue.trim().replace(/\s+/g, ' ')
    if (next === query) return undefined
    const timer = setTimeout(() => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev)
          if (next) params.set('q', next)
          else params.delete('q')
          return params
        },
        { replace: true },
      )
    }, DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [inputValue, query, setSearchParams])

  const index = useMemo(() => buildIndex(courses), [courses])

  // All courses matching the text (any type), best matches first
  const matches = useMemo(() => {
    const words = parseQuery(query)
    if (words.length === 0) return index.map((entry) => entry.course)
    const phrase = normalize(query)
    return index
      .filter((entry) => words.every((alts) => wordMatches(alts, entry.text)))
      .map((entry) => ({ entry, score: rank(entry, phrase, words) }))
      .sort((a, b) => a.score - b.score || a.entry.position - b.entry.position)
      .map(({ entry }) => entry.course)
  }, [index, query])

  // Matches per type, for the filter chip counts
  const countsByType = useMemo(() => {
    const counts = { All: matches.length }
    for (const course of matches) counts[course.courseType] = (counts[course.courseType] ?? 0) + 1
    return counts
  }, [matches])

  const results = useMemo(
    () => (activeType === 'All' ? matches : matches.filter((c) => c.courseType === activeType)),
    [matches, activeType],
  )

  // Clearing applies at once (no debounce)
  const clear = () => {
    setInputValue('')
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev)
        params.delete('q')
        return params
      },
      { replace: true },
    )
  }

  // Run a search right away (e.g. a suggested term)
  const searchFor = (term) => {
    setInputValue(term)
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev)
        params.set('q', term)
        return params
      },
      { replace: true },
    )
  }

  return {
    query, // the applied (debounced) search text
    inputValue,
    setInputValue,
    clear,
    searchFor,
    matches,
    results,
    countsByType,
    total: courses.length,
  }
}
