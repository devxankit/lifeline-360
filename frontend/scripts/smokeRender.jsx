/**
 * Render smoke test.
 *
 * A production build only proves the code parses and resolves — it cannot tell
 * you that a page actually renders. This mounts every public route inside the
 * real site layout through renderToString and fails on the first component
 * that throws, which catches the class of mistakes a bundler happily ships: a
 * bad import, a missing data key, a hook used incorrectly.
 *
 * It also asserts structural rules: exactly one <h1> per page and no leftover
 * placeholder copy.
 *
 * Run with: npm run smoke
 */
import { renderToString } from 'react-dom/server'
// React Router 7 dropped the react-router-dom/server entry point; StaticRouter
// is exported from the main package now.
import { Route, Routes, StaticRouter } from 'react-router-dom'
import { MotionConfig } from 'motion/react'

import LandingLayout from '@/modules/landing-page/layout/LandingLayout'
import LandingPage from '@/modules/landing-page/pages/LandingPage'
import AboutPage from '@/modules/landing-page/pages/AboutPage'
import ServicesPage from '@/modules/landing-page/pages/ServicesPage'
import ServiceDetailPage from '@/modules/landing-page/pages/ServiceDetailPage'
import MembershipPage from '@/modules/landing-page/pages/MembershipPage'
import PartnersPage from '@/modules/landing-page/pages/PartnersPage'
import ContactPage from '@/modules/landing-page/pages/ContactPage'
import FaqPage from '@/modules/landing-page/pages/FaqPage'
import PrivacyPolicyPage from '@/modules/landing-page/pages/PrivacyPolicyPage'
import TermsPage from '@/modules/landing-page/pages/TermsPage'
import NotFoundPage from '@/modules/landing-page/pages/NotFoundPage'
import { services } from '@/modules/landing-page/data/services'

/** [url, route pattern, page] */
const routes = [
  ['/', '/', LandingPage],
  ['/about', '/about', AboutPage],
  ['/services', '/services', ServicesPage],
  ...services.map((service) => [
    `/services/${service.slug}`,
    '/services/:slug',
    ServiceDetailPage,
  ]),
  ['/services/not-a-service', '/services/:slug', ServiceDetailPage],
  ['/membership', '/membership', MembershipPage],
  ['/partners', '/partners', PartnersPage],
  ['/contact', '/contact', ContactPage],
  ['/contact?topic=membership', '/contact', ContactPage],
  ['/faqs', '/faqs', FaqPage],
  ['/privacy-policy', '/privacy-policy', PrivacyPolicyPage],
  ['/terms', '/terms', TermsPage],
  ['/does-not-exist', '*', NotFoundPage],
]

function render(url, pattern, Page) {
  return renderToString(
    <MotionConfig reducedMotion="user">
      <StaticRouter location={url}>
        <Routes>
          <Route element={<LandingLayout />}>
            <Route path={pattern} element={<Page />} />
          </Route>
        </Routes>
      </StaticRouter>
    </MotionConfig>
  )
}

let failures = 0

for (const [url, pattern, Page] of routes) {
  try {
    const html = render(url, pattern, Page)
    const h1Count = (html.match(/<h1[\s>]/g) ?? []).length
    const problems = []

    if (h1Count !== 1) problems.push(`${h1Count} <h1> elements (expected exactly 1)`)
    if (/lorem ipsum|TODO|undefined<|>undefined|\[object Object\]/i.test(html))
      problems.push('contains placeholder or undefined output')
    if (html.length < 5000)
      problems.push(`suspiciously short output (${html.length} bytes)`)

    if (problems.length) {
      failures += 1
      console.error(`FAIL  ${url}\n      ${problems.join('\n      ')}`)
    } else {
      console.log(`ok    ${url}  (${Math.round(html.length / 1024)} KB)`)
    }
  } catch (error) {
    failures += 1
    console.error(`ERROR ${url}\n      ${error.stack ?? error.message}`)
  }
}

// Every service must have its own page and appear in the home page grid.
const home = render('/', '/', LandingPage)
for (const service of services) {
  if (!home.includes(`href="/services/${service.slug}"`)) {
    failures += 1
    console.error(`FAIL  home page does not link to /services/${service.slug}`)
  }
}

console.log(`\n${routes.length - failures}/${routes.length} routes rendered cleanly.`)
if (failures) process.exit(1)
