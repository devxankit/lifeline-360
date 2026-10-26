import Reveal from '@/components/motion/Reveal'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import ServiceGrid from '../common/ServiceGrid'

export default function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-24 py-20 sm:py-28">
      <Container width="wide">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Our services"
            title="Everything your family needs, in one app"
            description="Six healthcare services and a membership plan, from finding a hospital that accepts your Ayushman card to tracking an ambulance to your door."
          />
          <Reveal delay={0.1} className="shrink-0">
            <Button to="/services" variant="outline" icon="arrowRight">
              View all services
            </Button>
          </Reveal>
        </div>

        <ServiceGrid className="mt-12" />
      </Container>
    </section>
  )
}
