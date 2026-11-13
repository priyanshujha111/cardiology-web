// An <img> that casual visitors can't easily save: no right-click / long-press menu, no drag,
// no selection, and a transparent overlay on top so clicks and taps land on the overlay
// instead of the image. Clicks still bubble up, so a wrapping button or link keeps working.
// The overlay is `absolute inset-0`, so the nearest positioned ancestor must hug the image.
// Any other prop (src, alt, className, style, loading, onError...) goes straight to the <img>.
// This only deters casual saving; screenshots and DevTools can still get the image.

const noSave = 'select-none [-webkit-touch-callout:none] [-webkit-user-drag:none]'

const block = (e) => e.preventDefault()

function ProtectedImage({ alt, className = '', ...imgProps }) {
  return (
    <>
      <img
        {...imgProps}
        alt={alt}
        draggable={false}
        onContextMenu={block}
        onDragStart={block}
        className={`${noSave} ${className}`}
      />
      <span
        aria-hidden="true"
        onContextMenu={block}
        onDragStart={block}
        className={`absolute inset-0 ${noSave}`}
      />
    </>
  )
}

export default ProtectedImage
