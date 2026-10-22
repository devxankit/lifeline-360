import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import BackToTop from '@/components/layout/BackToTop'
import PageTransition from '@/components/motion/PageTransition'
import PageLoader from '@/components/ui/PageLoader'
import SiteFooter from './SiteFooter'
import SiteHeader from './SiteHeader'

/** Shell for every public page: header, the routed page, footer. */
export default function LandingLayout() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <a
        href="#main"
        className="sr-only z-70 rounded-full bg-brand-600 px-5 py-2.5 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main" className="flex-1">
        {/* Keyed on the path so each page fades in as it mounts; the header
            and footer stay put while a lazy page loads. */}
        <PageTransition key={pathname}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </PageTransition>
      </main>

      <SiteFooter />
      <BackToTop />
    </div>
  )
}
