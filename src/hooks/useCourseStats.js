import { useEffect, useState } from 'react'
import { loadAllCourses } from '../data/courseApi.js'

// Shown if the API request fails
export const FALLBACK_STATS = { programs: 508, fellowships: 397, certificates: 47, pgDiplomas: 64 }

const typeOf = (course) => String(course?.type ?? '').trim().toLowerCase()

export function countCourses(list) {
  const count = (type) => list.filter((c) => typeOf(c) === type).length
  return {
    programs: list.length,
    fellowships: count('fellowship'),
    certificates: count('certificate'),
    pgDiplomas: count('pg diploma'),
  }
}

// Computed once per page load; the request itself is shared via loadAllCourses()
let statsPromise = null

function loadCourseStats() {
  if (!statsPromise) {
    statsPromise = loadAllCourses()
      .then(countCourses)
      .catch((err) => {
        statsPromise = null
        throw err
      })
  }
  return statsPromise
}

/**
 * Live course counts from the MGA course list API.
 * status: 'loading' | 'ready' | 'error' (on error, `stats` holds FALLBACK_STATS).
 */
export function useCourseStats() {
  const [state, setState] = useState({ status: 'loading', stats: null })

  useEffect(() => {
    let active = true
    loadCourseStats().then(
      (stats) => active && setState({ status: 'ready', stats }),
      (err) => {
        if (!active) return
        console.error('Could not load course stats:', err)
        setState({ status: 'error', stats: FALLBACK_STATS })
      },
    )
    return () => {
      active = false
    }
  }, [])

  return state
}
