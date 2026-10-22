import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingLayout from './layout/LandingLayout'
import LandingPage from './pages/LandingPage'

// The home page ships in the main bundle; every other page loads on demand.
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'))
const MembershipPage = lazy(() => import('./pages/MembershipPage'))
const PartnersPage = lazy(() => import('./pages/PartnersPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const FaqPage = lazy(() => import('./pages/FaqPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

/**
 * Public website routes (Scope of Work §13), mounted at the site root by
 * AppRoutes. Paths here are relative to that mount point.
 */
export default function LandingRoutes() {
  return (
    <Routes>
      <Route element={<LandingLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="services/:slug" element={<ServiceDetailPage />} />
        <Route path="membership" element={<MembershipPage />} />
        <Route path="partners" element={<PartnersPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faqs" element={<FaqPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
