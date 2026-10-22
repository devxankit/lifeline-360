import Reveal from '@/components/motion/Reveal'
import StaggerGroup from '@/components/motion/StaggerGroup'
import StaggerItem from '@/components/motion/StaggerItem'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { membershipTile, services } from '../../data/services'
import ServiceCard from '../common/ServiceCard'

export default function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-24 py-20 sm:py-28">
      <Container width="wide">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Our services"
            title="Everything your family needs, in one app"
            description="Five healthcare services and a membership plan, each run by verified partners and tracked from request to result."
          />
          <Reveal delay={0.1} className="shrink-0">
            <Button to="/services" variant="outline" icon="arrowRight">
              View all services
            </Button>
          </Reveal>
        </div>

        <StaggerGroup
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.07}
        >
          {[...services, membershipTile].map((service) => (
            <StaggerItem key={service.slug} variant="rise" className="h-full">
              <ServiceCard service={service} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  )
}
