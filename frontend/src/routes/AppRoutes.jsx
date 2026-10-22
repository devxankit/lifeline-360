import { Route, Routes } from 'react-router-dom'
import LandingRoutes from '@/modules/landing-page'
import ScrollToTop from './ScrollToTop'

/**
 * Top-level routing. Each product area is a module under src/modules that owns
 * its own routes; the public website (landing-page) is mounted at the root.
 * Later modules mount beside it, e.g. <Route path="/admin/*" element={<AdminRoutes />} />.
 */
export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/*" element={<LandingRoutes />} />
      </Routes>
    </>
  )
}
