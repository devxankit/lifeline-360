import { Link, useParams } from 'react-router-dom'
import Reveal from '@/components/motion/Reveal'
import Seo from '@/components/seo/Seo'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Icon from '@/components/ui/Icon'
import Photo from '@/components/ui/Photo'
import SectionHeading from '@/components/ui/SectionHeading'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/cn'
import CtaBand from '../components/common/CtaBand'
import FaqAccordion from '../components/common/FaqAccordion'
import FeatureGrid from '../components/common/FeatureGrid'
import JourneyTimeline from '../components/common/JourneyTimeline'
import PageHero from '../components/common/PageHero'
import {
  AmbulanceEtaCard,
  BloodAvailabilityCard,
  CareBookingCard,
  LabReportCard,
  MedicineOrderCard,
} from '../components/mockups/StatusCards'
import { getFaqsForService } from '../data/faqs'
import { getServiceBySlug, servicePath, services, TONES } from '../data/services'
import NotFoundPage from './NotFoundPage'

/** The live-status card that floats over each service's hero photo. */
const HERO_CARDS = {
  ambulance: AmbulanceEtaCard,
  'nursing-caretaker': CareBookingCard,
  medicine: MedicineOrderCard,
  laboratory: LabReportCard,
  'blood-bank': BloodAvailabilityCard,
}

/** One template for every service page, driven by data/services.js. */
export default function ServiceDetailPage() {
  const { slug } = useParams()
  const service = getServiceBySlug(slug)

  if (!service) return <NotFoundPage />

  const tone = TONES[service.tone]
  const HeroCard = HERO_CARDS[service.slug]
  const others = services.filter((item) => item.slug !== service.slug)
  const faqs = getFaqsForService(service.slug)
  const isUrgent = service.tone === 'emergency'

  return (
    <>
      <Seo title={service.title} description={service.summary} />

      <PageHero
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Services', to: '/services' },
          { label: service.name },
        ]}
        eyebrow={service.title}
        title={service.hero.title}
        description={service.hero.description}
        image={service.image}
        imageAlt={service.imageAlt}
        actions={
          <>
            <Button
              to="/#download"
              size="lg"
              variant={isUrgent ? 'emergency' : 'primary'}
              icon="arrowRight"
            >
              Get the app
            </Button>
            <Button to="/contact" size="lg" variant="outline">
              Ask a question
            </Button>
          </>
        }
        aside={
          HeroCard ? (
            <div className="absolute -bottom-8 left-4 sm:-left-6">
              <div className="animate-float-slow">
                <HeroCard />
              </div>
            </div>
          ) : null
        }
      >
        {service.slug === 'ambulance' ? (
          <p className="flex items-center gap-2 text-sm text-ink-500">
            <Icon name="info" size={16} className="text-emergency-600" />
            In a life-threatening emergency, also call {siteConfig.emergencyNumber}.
          </p>
        ) : null}
      </PageHero>

      <section className="py-20 sm:py-28">
        <Container width="wide" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="What you can do"
            title={`${service.title}, the Lifeline 360 way`}
            description={service.summary}
          />
          <FeatureGrid features={service.features} tone={service.tone} />
        </Container>
      </section>

      <section className="bg-ink-50/70 py-20 sm:py-28">
        <Container
          width="wide"
          className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14"
        >
          <div className="flex flex-col gap-8 lg:col-span-5">
            <SectionHeading
              eyebrow="How it works"
              title="Step by step"
              description="Here is what happens from the moment you tap until the job is done."
            />
            {service.secondaryImage ? (
              <Reveal>
                <Photo
                  src={service.secondaryImage}
                  alt={service.secondaryImageAlt}
                  className="aspect-[4/3] rounded-4xl"
                />
              </Reveal>
            ) : null}
          </div>

          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="rounded-4xl bg-white p-6 shadow-card ring-1 ring-ink-200/70 sm:p-9">
              <JourneyTimeline steps={service.journey} tone={service.tone} />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container width="wide">
          <Reveal className="relative flex flex-col gap-8 overflow-hidden rounded-5xl bg-ink-950 px-6 py-10 text-white sm:px-12 sm:py-12 lg:flex-row lg:items-center lg:justify-between">
            <div aria-hidden="true" className="absolute inset-0 bg-dots-dark" />
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-600/40 blur-3xl"
            />
            <div className="relative flex max-w-2xl gap-5">
              <span
                className={cn(
                  'hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl sm:flex',
                  tone.solid
                )}
              >
                <Icon name={service.icon} size={26} />
              </span>
              <div>
                <p className="text-[0.8125rem] font-semibold tracking-[0.14em] text-aqua-300 uppercase">
                  For {service.partner.label.toLowerCase()}
                </p>
                <p className="mt-2 font-display text-2xl font-bold">
                  Grow with Lifeline 360
                </p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/70">
                  {service.partner.text}
                </p>
              </div>
            </div>
            <Button
              to="/partners#register"
              variant="light"
              icon="arrowRight"
              className="relative self-start lg:self-center"
            >
              Become a partner
            </Button>
          </Reveal>
        </Container>
      </section>

      <section className="pb-20 sm:pb-24">
        <Container width="wide" className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-6 lg:col-span-4">
            <SectionHeading eyebrow="FAQs" title="Good to know" />
            <Reveal>
              <Button to="/faqs" variant="outline" icon="arrowRight">
                All FAQs
              </Button>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-8">
            <FaqAccordion items={faqs} />
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-ink-100 bg-ink-50/50 py-16">
        <Container width="wide" className="flex flex-col gap-8">
          <p className="font-display text-xl font-bold text-ink-900">
            Explore other services
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((item) => (
              <li key={item.slug}>
                <Link
                  to={servicePath(item)}
                  className="group flex items-center gap-3.5 rounded-2xl bg-white p-4 ring-1 ring-ink-200/70 transition-[box-shadow,translate] duration-300 ring-inset hover:-translate-y-0.5 hover:shadow-card"
                >
                  <span
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset',
                      TONES[item.tone].chip
                    )}
                  >
                    <Icon name={item.icon} size={20} />
                  </span>
                  <span className="min-w-0 flex-1 font-display text-[0.9375rem] font-bold text-ink-900">
                    {item.title}
                  </span>
                  <Icon
                    name="arrowRight"
                    size={16}
                    className="text-ink-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brand-600"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand />
    </>
  )
}
