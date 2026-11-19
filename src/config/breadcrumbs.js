// Breadcrumb trail for every route in App.jsx. Keep this in sync when routes change.
//
//   path       route pattern, exactly as in App.jsx (matched with react-router's matchPath)
//   label      text for this level ("dynamic" routes resolve it at runtime)
//   parent     path of the parent level; the trail is built by walking parents up to '/'
//   container  max-width + side padding of the page's own content, so the trail lines up with it
//   tone       'dark' for pages that open on the navy hero, 'light' for pages that open light;
//              the bar takes the page's top colour so it blends in

// Absolute base for the BreadcrumbList JSON-LD (schema.org)
export const SITE_URL = 'https://medicalglobalacademy.com'

const narrow = 'max-w-[1140px] px-4 sm:px-6' // About, course detail, legal pages, 404

export const breadcrumbRoutes = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About', parent: '/', container: narrow, tone: 'dark' },
  {
    path: '/courses',
    label: 'Courses',
    parent: '/',
    container: 'max-w-[1280px] px-6',
    tone: 'light',
    bg: 'bg-[#f8fafc]',
  },
  { path: '/courses/:slug', dynamic: 'course', parent: '/courses', container: narrow, tone: 'dark' },
  {
    path: '/doctors',
    label: 'Doctors',
    parent: '/',
    // The page pads outside its 1160px box, so add the 2 × 20px padding back on
    container: 'max-w-[1200px] px-5 max-[641px]:px-4',
    tone: 'light',
    bg: 'bg-[#fbf9f4]',
  },
  {
    path: '/doctors/:id',
    dynamic: 'doctor',
    parent: '/doctors',
    container: 'max-w-[860px] px-5 max-[641px]:px-4', // 820px box + 2 × 20px page padding
    tone: 'light',
    bg: 'bg-[#fbf9f4]',
  },
  { path: '/terms', label: 'Terms & Conditions', parent: '/', container: narrow, tone: 'dark' },
  { path: '/privacy', label: 'Privacy Policy', parent: '/', container: narrow, tone: 'dark' },
  { path: '/refund-policy', label: 'Refund Policy', parent: '/', container: narrow, tone: 'dark' },
  { path: '/sitemap', label: 'Sitemap', parent: '/', container: narrow, tone: 'dark' },
]

// Any URL that matches no route above (the "*" route in App.jsx)
export const notFoundRoute = {
  label: 'Page Not Found',
  parent: '/',
  container: narrow,
  tone: 'dark',
  notFound: true,
}

// Labels for /courses?type=… (values are the API's own course types)
export const courseTypeLabels = {
  Fellowship: 'Fellowship',
  'Pg Diploma': 'PG Diploma',
  Certificate: 'Certificate',
}

// Routes where no breadcrumb is shown (Home, and /blog/* which redirects to Home)
export const hiddenPaths = ['/', '/blog', '/blog/*']
