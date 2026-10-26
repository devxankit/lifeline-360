import Reveal from '@/components/motion/Reveal'
import Seo from '@/components/seo/Seo'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Photo from '@/components/ui/Photo'
import SectionHeading from '@/components/ui/SectionHeading'
import helpDesk from '../assets/images/hospital-help-desk.webp'
import hospitalEntrance from '../assets/images/hospital-entrance.webp'
import CtaBand from '../components/common/CtaBand'
import FaqAccordion from '../components/common/FaqAccordion'
import FeatureGrid from '../components/common/FeatureGrid'
import JourneyTimeline from '../components/common/JourneyTimeline'
import PageHero from '../components/common/PageHero'
import HospitalLocator from '../components/hospitals/HospitalLocator'
import { getFaqCategory } from '../data/faqs'
import { PMJAY_HOSPITAL_SEARCH_URL, pmjayFacts } from '../data/hospitals'
import { hospitalTile } from '../data/services'

export default function AyushmanHospitalsPage() {
  return (
    <>
      <Seo
        title="Ayushman card hospitals (PM-JAY)"
        description="Find private hospitals that treat Ayushman card holders under PM-JAY by state and city, see distance and contact details, and book an ambulance or blood."
      />

      <PageHero
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Services', to: '/services' },
          { label: 'Ayushman card hospitals' },
        ]}
        eyebrow="Ayushman Bharat · PM-JAY"
        title="Hospitals that accept your Ayushman card"
        description="Search private hospitals empanelled under PM-JAY by state and city, see how far they are and how to reach them, then book an ambulance or request blood for the one you choose."
        image={helpDesk}
        imageAlt="Two hospital staff members at a reception desk, ready to help"
        actions={
          <>
            <Button to="#locator" size="lg" icon="arrowRight">
              Search hospitals
            </Button>
            <Button href={PMJAY_HOSPITAL_SEARCH_URL} size="lg" variant="outline">
              Official PM-JAY portal
            </Button>
          </>
        }
      />

      <section id="locator" className="scroll-mt-20 pt-4 pb-20 sm:pb-24">
        <Container width="wide">
          <HospitalLocator />
        </Container>
      </section>

      <section className="bg-ink-50/70 py-20 sm:py-28">
        <Container width="wide" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="PM-JAY at a glance"
            title="What the Ayushman card covers"
            description="Ayushman Bharat Pradhan Mantri Jan Arogya Yojana is the government health cover run by the National Health Authority. Rules can change, so confirm the details on the official portal."
          />
          <FeatureGrid features={pmjayFacts} columns={4} />
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container
          width="wide"
          className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14"
        >
          <div className="flex flex-col gap-8 lg:col-span-5">
            <SectionHeading
              eyebrow="How it works"
              title="From search to the hospital door"
              description="Find the right hospital, check your cover with its Ayushman help desk, and get there by ambulance if you need to."
            />
            <Reveal>
              <Photo
                src={hospitalEntrance}
                alt="The emergency entrance of a hospital building"
                className="aspect-[4/3] rounded-4xl"
              />
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="rounded-4xl bg-white p-6 shadow-card ring-1 ring-ink-200/70 sm:p-9">
              <JourneyTimeline steps={hospitalTile.journey} tone="brand" />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-ink-50/70 py-20 sm:py-24">
        <Container width="wide" className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="FAQs" title="Ayushman card questions" />
          </div>
          <Reveal delay={0.1} className="lg:col-span-8">
            <FaqAccordion items={getFaqCategory('ayushman').items} />
          </Reveal>
        </Container>
      </section>

      <CtaBand />
    </>
  )
}
