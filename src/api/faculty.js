import { useSyncExternalStore } from 'react'

// Live faculty from the MGA API, filtered to this site's department.
// The list endpoint returns every MGA faculty member (all departments).
export const FACULTY_API_URL = 'https://24x7.medicalglobalacademy.com/api/faculty-list'
const API_ORIGIN = 'https://24x7.medicalglobalacademy.com/'

export const SITE_DEPARTMENT = 'Cardiology'

// Placeholder/test logins such as "FACULTY1101" are not real doctors.
const TEST_ACCOUNT_RE = /^FACULTY\d+$/i

const clean = (value) => (typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '')

// Splits on the given separator(s), trims, drops blanks and duplicates (keeps order).
function splitList(value, separator) {
  return [...new Set(clean(value).split(separator).map(clean).filter(Boolean))]
}

// "Cardiology,Medicine" | "Orthopaedics | Arthroscopy" | "Medicine"
export function splitDepartments(value) {
  return splitList(value, /[,|]/)
}

function isTestAccount(item) {
  return TEST_ACCOUNT_RE.test(clean(item?.name))
}

// Only http(s) URLs are used; root-relative paths are resolved against the API host.
function photoUrl(item) {
  const raw = clean(item?.image_url) || clean(item?.profileImage) || clean(item?.external_photo_url)
  if (!raw) return null
  try {
    const url = new URL(raw, API_ORIGIN)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
  } catch {
    return null
  }
}

// Builds the public doctor shape from an API record. Only the fields listed here
// are copied, so email, phone and any other private fields never reach components.
export function mapFaculty(item) {
  const focusAreas = splitDepartments(item?.department)
  const qualification = clean(item?.qualification)
  return {
    id: String(item?.id),
    name: clean(item?.name),
    qualification,
    focus: focusAreas[0] || '',
    focusAreas,
    photo: photoUrl(item),
    bio: [],
    qualifications: splitList(qualification, /[,/]/),
  }
}

// Exact department match (case-insensitive, trimmed), never a substring match.
function inSiteDepartment(doctor) {
  const wanted = SITE_DEPARTMENT.toLowerCase()
  return doctor.focusAreas.some((area) => area.toLowerCase() === wanted)
}

// a) drop test accounts, b) keep only this site's department.
function selectSiteDoctors(list) {
  return list
    .filter((item) => item && item.id != null && !isTestAccount(item))
    .map(mapFaculty)
    .filter((doctor) => doctor.name && inSiteDepartment(doctor))
}

/* ---------- Shared store: one request per page load, shared by every page ---------- */

const IDLE = { status: 'idle', doctors: [], error: null }

let snapshot = IDLE
let controller = null
let abortTimer = null
const listeners = new Set()

function setSnapshot(next) {
  snapshot = next
  listeners.forEach((listener) => listener())
}

function load() {
  controller?.abort()
  const ctrl = new AbortController()
  controller = ctrl
  setSnapshot({ status: 'loading', doctors: [], error: null })

  fetch(FACULTY_API_URL, { signal: ctrl.signal, headers: { Accept: 'application/json' } })
    .then((res) => {
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      return res.json()
    })
    .then((data) => {
      if (controller !== ctrl) return
      const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : null
      if (!list) throw new Error('Unexpected response format')
      controller = null
      setSnapshot({ status: 'ready', doctors: selectSiteDoctors(list), error: null })
    })
    .catch((err) => {
      // Aborted or replaced by a newer request: nothing to report.
      if (controller !== ctrl) return
      controller = null
      // Log the message only, never the response body.
      console.error('Could not load faculty:', err?.message)
      setSnapshot({ status: 'error', doctors: [], error: 'Couldn’t load faculty details right now.' })
    })
}

function subscribe(listener) {
  clearTimeout(abortTimer)
  abortTimer = null

  // First use starts the request. A page opened after a failure tries again once.
  if (snapshot.status === 'idle' || (snapshot.status === 'error' && listeners.size === 0)) {
    load()
  }
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
    // Nobody is waiting any more: abort the request. Deferred one tick so a
    // remount (route change, React StrictMode) keeps the same request alive.
    if (listeners.size === 0 && controller) {
      abortTimer = setTimeout(() => {
        abortTimer = null
        if (listeners.size > 0 || !controller) return
        const ctrl = controller
        controller = null
        snapshot = IDLE
        ctrl.abort()
      }, 0)
    }
  }
}

const getSnapshot = () => snapshot

function retry() {
  if (snapshot.status === 'error') load()
}

// status: 'loading' | 'ready' | 'error'
export function useFaculty() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const status = state.status === 'ready' || state.status === 'error' ? state.status : 'loading'
  return { status, doctors: state.doctors, error: state.error, retry }
}
