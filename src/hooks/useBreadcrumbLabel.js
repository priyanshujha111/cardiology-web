import { createContext, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// { override: { pathname, label } | null, setOverride } — provided by <BreadcrumbProvider>
export const BreadcrumbContext = createContext({ override: null, setOverride: null })

/**
 * Lets a page replace the last breadcrumb label, e.g. useBreadcrumbLabel(course.title).
 * The override only applies to the URL it was set on and is removed on unmount.
 */
export function useBreadcrumbLabel(label) {
  const { setOverride } = useContext(BreadcrumbContext)
  const { pathname } = useLocation()

  useEffect(() => {
    if (!setOverride || !label) return undefined
    setOverride({ pathname, label })
    return () => setOverride((current) => (current?.pathname === pathname ? null : current))
  }, [setOverride, pathname, label])
}
