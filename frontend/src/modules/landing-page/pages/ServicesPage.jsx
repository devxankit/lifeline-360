import Reveal from '@/components/motion/Reveal'
import StaggerGroup from '@/components/motion/StaggerGroup'
import StaggerItem from '@/components/motion/StaggerItem'
import Seo from '@/components/seo/Seo'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Icon from '@/components/ui/Icon'
import SectionHeading from '@/components/ui/SectionHeading'
import doctorConsultation from '../assets/images/doctor-consultation.webp'
import CtaBand from '../components/common/CtaBand'
import PageHero from '../components/common/PageHero'
import ServiceGrid from '../components/common/ServiceGrid'
import PhoneMockup from '../components/mockups/PhoneMockup'
import { accountFeatures } from '../data/platform'

export default function ServicesPage() {
  return (
    <>
      <Seo
        title="Healthcare services"
        description="Ayushman card hospital search, ambulance booking, nursing and caretakers, medicine delivery, lab tests with home sample collection, blood bank requests and membership, all in the Lifeline 360 app."
      />

      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
        eyebrow="Healthcare services"
        title="Every service your family needs, in one app"
        description="Six healthcare services and a membership plan, from finding a hospital that accepts your Ayushman card to care at home. Book in a few taps, follow each request live and keep everything in one history."
        image={doctorConsultation}
        imageAlt="A doctor measuring a patient’s blood pressure during a consultation"
        actions={
          <>
            <Button to="/#download" size="lg" icon="arrowRight">
              Get the app
            </Button>
            <Button
              to="/services/ambulance"
              size="lg"
              variant="emergencySoft"
              icon="ambulance"
              iconPosition="left"
            >
              Book an ambulance
            </Button>
          </>
        }
      />

      <section className="py-20 sm:py-24">
        <Container width="wide">
          <ServiceGrid />
        </Container>
      </section>

      <section className="pb-4">
        <Container width="wide">
          <div className="relative grid items-center gap-12 overflow-hidden rounded-5xl bg-linear-to-br from-brand-50 via-white to-aqua-50 px-6 py-12 ring-1 ring-brand-100 ring-inset sm:px-12 sm:py-16 lg:grid-cols-12">
            <div aria-hidden="true" className="absolute inset-0 bg-dots opacity-50" />

            <div className="relative flex flex-col gap-8 lg:col-span-7">
              <SectionHeading
                eyebrow="One account"
                title="Sign in once, use every service"
                description="Your Lifeline 360 account carries your details from one service to the next, so you never fill them in twice."
              />
              <StaggerGroup as="ul" className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                {accountFeatures.map((feature) => (
                  <StaggerItem as="li" key={feature.title} className="flex gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 shadow-card">
                      <Icon name={feature.icon} size={19} />
                    </span>
                    <div>
                      <p className="font-display text-base font-bold text-ink-900">
                        {feature.title}
                      </p>
                      <p className="text-sm text-ink-500">{feature.text}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>

            <Reveal
              variant="right"
              className="relative hidden justify-center lg:col-span-5 lg:flex"
            >
              <PhoneMockup className="-rotate-3 transition-transform duration-700 ease-out hover:rotate-0" />
            </Reveal>
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  )
}
