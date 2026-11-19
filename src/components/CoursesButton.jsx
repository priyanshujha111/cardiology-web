import { ArrowUpRight } from 'lucide-react'

const COURSES_URL = 'https://medicalglobalacademy.com/courses'

// Footer CTA: gold (#c9a24a) accent border/arrow with white text, tuned for the navy footer.
// Compact and always one line; the box sizes to its content (w-fit) so the label and arrow
// stay inside the border. Footer columns are sized so it always fits. 44px tap target on
// touch-size screens, compact on desktop.
function CoursesButton({ className = '' }) {
  return (
    <a
      href={COURSES_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group box-border inline-flex min-h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-lg border border-[rgba(201,162,74,0.7)] bg-[rgba(201,162,74,0.06)] px-4 py-2 text-sm leading-none font-semibold whitespace-nowrap text-white lg:min-h-0 transition-[background-color,border-color,box-shadow] duration-200 ease-[ease] hover:border-[#e0bd6a] hover:bg-[rgba(201,162,74,0.16)] hover:shadow-[0_0_18px_rgba(201,162,74,0.28)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#c9a24a] motion-reduce:transition-none ${className}`}
    >
      <span>MGA All Courses</span>
      <ArrowUpRight
        size={16}
        strokeWidth={2.5}
        aria-hidden="true"
        className="block shrink-0 text-[#c9a24a] transition-[translate,color] duration-200 ease-[ease] group-hover:text-[#e0bd6a] motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 motion-reduce:transition-none"
      />
    </a>
  )
}

export default CoursesButton
