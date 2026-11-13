import { useCallback, useEffect, useState } from 'react'
import { courseFaqs } from './faqs.js'

const API_URL = 'https://24x7.medicalglobalacademy.com/api/course-list'
const DETAILS_URL = 'https://24x7.medicalglobalacademy.com/api/course-details/'
const IMG_BASE = 'https://24x7.medicalglobalacademy.com/storage/uploads/course/'

// Widen or narrow this to change what counts as a cardiology course.
const CARDIO_RE = /cardio|cardiac|heart|echocardio|\becg\b|electrophys/i

function isCardiology(course) {
  return (
    CARDIO_RE.test(course.name || '') ||
    CARDIO_RE.test(course.slug || '') ||
    CARDIO_RE.test(course.category?.name || '')
  )
}

function cleanDescription(raw) {
  return (raw || '')
    .replace(/\\r\\n|\r\n|\r|\n/g, ' ')
    .replace(/^["'\s]+|["'\s]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function formatFee(fee) {
  if (fee === null || fee === undefined) return '—'
  return `₹${Number(fee).toLocaleString('en-IN')}`
}

function badgeFor(course) {
  if (course.top_courses === 1) return { badge: 'Top', badgeType: 'top' }
  if (course.type === 'Certificate') return { badge: 'New', badgeType: 'new' }
  if (course.type === 'Pg Diploma')
    return { badge: 'Trending', badgeType: 'trending' }
  return { badge: 'Top', badgeType: 'top' }
}

function mapCourse(course) {
  return {
    id: course.id,
    slug: course.slug,
    title: course.name,
    courseType: course.type,
    specialty: course.category?.name || 'Cardiology',
    accreditation: 'CPD & ACTD',
    image: course.image ? `${IMG_BASE}${course.image}` : '',
    description: cleanDescription(course.description),
    fee: formatFee(course.fee),
    faqs: courseFaqs[course.slug], // optional; undefined means use the shared fallback
    ...badgeFor(course),
  }
}

// One request per page load, shared by the list and detail pages.
// A failed request is dropped from the cache so the next visit retries.
let cached = null

export function loadCardiologyCourses() {
  if (!cached) {
    cached = fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data || []
        return list.filter(isCardiology).map(mapCourse)
      })
      .catch((err) => {
        cached = null
        throw err
      })
  }
  return cached
}

// ---- Course details (highlights, learnings, workshop, curriculum) ----

const asArray = (value) => (Array.isArray(value) ? value : [])
const oneLine = (text) => (typeof text === 'string' ? text.replace(/\s+/g, ' ').trim() : '')

// Keeps line breaks (the workshop subtitle uses them for "Part 1 / Part 2").
function multiLine(text) {
  if (typeof text !== 'string') return ''
  return text
    .replace(/\r\n|\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim()
}

// Some highlights hold the same line twice, joined by \r\n.
function splitHighlight(text) {
  if (typeof text !== 'string') return []
  return text.split(/\r\n|\r|\n/).map(oneLine).filter(Boolean)
}

// TEMPORARY: until the CMS is cleaned up. Several courses have brochure text
// (accreditation blurbs, contact details, app links) pasted into the last
// module as sessions. From the first session containing a marker, that
// session and every later one in the same module is dropped.
const BROCHURE_MARKERS = [
  'International Accreditation',
  'Pan-India Clinical Attachment',
  'Contact Us',
  'MEDICAL GLOBAL',
  'ACCREDITED WITH',
  'playgoogle',
  'ACTD ACCREDITATION',
]

export function stripBrochureSessions(titles) {
  const cut = titles.findIndex((title) => BROCHURE_MARKERS.some((m) => title.includes(m)))
  return cut === -1 ? titles : titles.slice(0, cut)
}

export function normalizeCourseDetails(data) {
  const highlights = [
    ...new Set(asArray(data?.highlight).flatMap((h) => splitHighlight(h?.highlight))),
  ]

  const whatYouLearn = asArray(data?.what_you_learn)
    .map((item) => ({ heading: oneLine(item?.heading), description: oneLine(item?.description) }))
    .filter((item) => item.heading || item.description)

  const parts = asArray(data?.workshop?.parts)
    .map((part) => ({
      title: oneLine(part?.title),
      subtitle: oneLine(part?.subtitle),
      keyPoints: asArray(part?.key_points).map((k) => oneLine(k?.content)).filter(Boolean),
    }))
    .filter((part) => part.title || part.subtitle || part.keyPoints.length)
  const workshopTitle = oneLine(data?.workshop?.title)
  const workshopSubtitle = multiLine(data?.workshop?.subtitle)
  const workshop =
    workshopTitle || workshopSubtitle || parts.length
      ? { title: workshopTitle, subtitle: workshopSubtitle, parts }
      : null

  const modules = asArray(data?.module)
    .map((m) => ({
      title: oneLine(m?.module),
      lessons: stripBrochureSessions(asArray(m?.sessions).map((s) => oneLine(s?.title)).filter(Boolean)),
    }))
    .filter((m) => m.title || m.lessons.length)

  return { highlights, whatYouLearn, workshop, modules }
}

function fetchDetails(slug) {
  return fetch(`${DETAILS_URL}${encodeURIComponent(slug)}`).then((res) => {
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    return res.json()
  })
}

// Cached per slug. One automatic retry after a short pause; if that also
// fails the entry is dropped so the page's Retry button fetches again.
const detailsCache = new Map()

export function loadCourseDetails(slug) {
  if (!detailsCache.has(slug)) {
    const request = fetchDetails(slug)
      .catch(() => new Promise((resolve) => setTimeout(resolve, 800)).then(() => fetchDetails(slug)))
      .then((data) => normalizeCourseDetails(Array.isArray(data) ? data[0] : (data?.data ?? data)))
      .catch((err) => {
        detailsCache.delete(slug)
        throw err
      })
    detailsCache.set(slug, request)
  }
  return detailsCache.get(slug)
}

// status: loading | ready | error. A new slug or a retry reads as loading
// until its own request settles.
export function useCourseDetails(slug) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ key: null, details: null, status: 'loading' })
  const key = `${slug}#${attempt}`

  useEffect(() => {
    let active = true
    loadCourseDetails(slug).then(
      (details) => active && setResult({ key, details, status: 'ready' }),
      (err) => {
        if (!active) return
        console.error('Could not load course details:', err)
        setResult({ key, details: null, status: 'error' })
      },
    )
    return () => {
      active = false
    }
  }, [slug, key])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  if (result.key !== key) return { details: null, status: 'loading', retry }
  return { details: result.details, status: result.status, retry }
}
