export const COURSE_DISCLAIMER =
  'Please Note: This is not a 2-year Government PG Diploma program. The course is a professional upskilling/certification 1-Year program designed for eligible medical professionals.'

// Split so the "Please Note:" label can be styled on its own; the rendered text stays identical
const splitAt = COURSE_DISCLAIMER.indexOf(':') + 1
export const COURSE_DISCLAIMER_LABEL = COURSE_DISCLAIMER.slice(0, splitAt)
export const COURSE_DISCLAIMER_BODY = COURSE_DISCLAIMER.slice(splitAt)
