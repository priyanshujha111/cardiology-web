import { useEffect, useRef } from 'react'
import ProtectedImage from './ProtectedImage.jsx'

// Full-size image viewer. `item` = { src, fullSrc?, alt, title, verifyHref?, verifyLabel? };
// renders nothing when null. With `verifyHref`, a small "Verify" link (new tab) sits beside the title.
// Shows `fullSrc` (a higher-resolution file) when given, otherwise `src`.
// Closes on Esc, backdrop click or the close button, and locks body scroll while open.
function ImageLightbox({ item, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    if (!item) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [item, onClose])

  if (!item) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#16274a]/85 p-3 backdrop-blur-sm sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative rounded-xl bg-white p-2 shadow-2xl sm:p-3"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-1 right-1 z-10 flex sm:-top-3 sm:-right-3 h-10 w-10 items-center justify-center rounded-full border-2 border-[#c9a24a] bg-[#16274a] text-white shadow-lg transition-colors hover:bg-[#c9a24a] hover:text-[#16274a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        {/* `relative` gives ProtectedImage's overlay the image's box (not the title or close button). */}
        <div className="relative">
          <ProtectedImage
            src={item.fullSrc ?? item.src}
            alt={item.alt}
            // With known dimensions, scale up to fill the viewport (by width or height, whichever runs out first).
            style={item.width ? { width: `min(100vw, calc((100vh - 7rem) * ${item.width / item.height}))` } : undefined}
            className="block h-auto max-h-[calc(100vh-7rem)] w-auto max-w-[calc(100vw-2.5rem)] object-contain sm:max-w-[calc(100vw-5rem)]"
          />
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
          <p className="text-center font-['Playfair_Display',serif] text-sm font-semibold text-[#16274a] sm:text-base">
            {item.title}
          </p>
          {item.verifyHref && (
            <a
              href={item.verifyHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-[#c9a24a]/50 bg-[#fdf8ed] px-3 py-1 text-xs font-semibold text-[#0a1428] transition-colors hover:bg-[#c9a24a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24a] focus-visible:ring-offset-1"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8.5l3.5 3.5 6.5-7" />
              </svg>
              {item.verifyLabel ?? 'Verify'}
              <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 3h7v7 M13 3L6 10" />
              </svg>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageLightbox
