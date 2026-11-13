import { DoctorCardSkeleton, DoctorGrid } from './DoctorCard.jsx'

// Loading / error / empty states for anything fed by useFaculty().
// Renders nothing visible once the list is ready and has doctors.
// The live regions are always mounted so screen readers announce changes.
function FacultyFeedState({
  status,
  isEmpty = false,
  onRetry,
  skeletonCount = 4,
  cover = false,
  skeleton,
  loadingLabel = 'Loading faculty…',
}) {
  const loading = status === 'loading'
  const empty = status === 'ready' && isEmpty

  return (
    <>
      <div role="status" aria-live="polite">
        {loading && <span className="sr-only">{loadingLabel}</span>}
        {empty && (
          <p className="mx-auto max-w-[520px] rounded-2xl border border-[#e7e2d6] bg-white px-6 py-8 text-center text-[1rem] leading-[1.7] text-[#5d6784] shadow-[0_8px_20px_-14px_rgba(15,27,61,0.3)]">
            Faculty details are coming soon.
          </p>
        )}
      </div>

      {loading &&
        (skeleton ?? (
          <DoctorGrid aria-hidden="true">
            {Array.from({ length: skeletonCount }, (_, i) => (
              <DoctorCardSkeleton key={i} cover={cover} />
            ))}
          </DoctorGrid>
        ))}

      <div role="alert" aria-live="assertive">
        {status === 'error' && (
          <div className="mx-auto flex max-w-[620px] flex-col gap-4 rounded-2xl border border-[#e7e2d6] bg-white p-6 text-left shadow-[0_8px_20px_-14px_rgba(15,27,61,0.3)] sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Couldn’t load faculty details right now. Please check your connection and try again.
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#0a1428] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#c9a24a] hover:text-[#0a1428] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24a] focus-visible:ring-offset-2 motion-reduce:transition-none"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default FacultyFeedState
