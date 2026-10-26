import Reveal from '@/components/motion/Reveal'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import HospitalLocator from '../hospitals/HospitalLocator'

/**
 * First section after the hero: search hospitals that treat Ayushman card
 * holders under PM-JAY, then book an ambulance or blood for one of them.
 * Carries the `ayushman-hospitals` anchor the hero links to.
 */
export default function AyushmanSection() {
  return (
    <section id="ayushman-hospitals" className="scroll-mt-20 py-20 sm:py-24">
      <Container width="wide" className="flex flex-col gap-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Ayushman Bharat · PM-JAY"
            title="Find hospitals that accept your Ayushman card"
            description="Search private hospitals that treat patients under PM-JAY by state and city, see how far they are and how to reach them, then book an ambulance or request blood in one tap."
          />
          <Reveal delay={0.1} className="shrink-0">
            <Button to="/ayushman-hospitals" variant="outline" icon="arrowRight">
              How PM-JAY works
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <HospitalLocator />
        </Reveal>
      </Container>
    </section>
  )
}
