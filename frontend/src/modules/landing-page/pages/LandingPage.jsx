import Seo from '@/components/seo/Seo'
import { siteConfig } from '@/config/site'
import CtaBand from '../components/common/CtaBand'
import AyushmanSection from '../components/sections/AyushmanSection'
import EmergencySection from '../components/sections/EmergencySection'
import FaqSection from '../components/sections/FaqSection'
import HeroSection from '../components/sections/HeroSection'
import HowItWorksSection from '../components/sections/HowItWorksSection'
import MembershipSection from '../components/sections/MembershipSection'
import ServicesSection from '../components/sections/ServicesSection'
import TrustSection from '../components/sections/TrustSection'

/**
 * The home page (/). Hero, then eight sections in the order a family would
 * ask: which hospital takes my Ayushman card, what can I get, how does it
 * work, what about emergencies, can I trust it, is there a plan, what else
 * should I know, and where do I get the app.
 */
export default function LandingPage() {
  return (
    <>
      <Seo
        fullTitle={`${siteConfig.name} — Ayushman hospitals, ambulance, nursing, medicine, lab tests & blood bank in one app`}
        description={siteConfig.description}
      />
      <HeroSection />
      <AyushmanSection />
      <ServicesSection />
      <HowItWorksSection />
      <EmergencySection />
      <TrustSection />
      <MembershipSection />
      <FaqSection />
      <CtaBand />
    </>
  )
}
