import Reveal from '@/components/motion/Reveal'
import StaggerGroup from '@/components/motion/StaggerGroup'
import StaggerItem from '@/components/motion/StaggerItem'
import Seo from '@/components/seo/Seo'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Icon from '@/components/ui/Icon'
import Photo from '@/components/ui/Photo'
import SectionHeading from '@/components/ui/SectionHeading'
import { cn } from '@/lib/cn'
import doctorLab from '../assets/images/doctor-lab-delhi.webp'
import doctorsXray from '../assets/images/doctors-xray.webp'
import CountUp from '../components/common/CountUp'
import CtaBand from '../components/common/CtaBand'
import PageHero from '../components/common/PageHero'
import { ecosystem, platformFacts } from '../data/platform'

const PRINCIPLES = [
  {
    icon: 'badgeCheck',
    title: 'Verified before visible',
    text: 'No pharmacy, carer, driver, lab or blood bank goes live without KYC and document verification.',
  },
  {
    icon: 'lock',
    title: 'Private by design',
    text: 'Masked calling keeps personal numbers hidden, and partners see only what they need to help you.',
  },
  {
    icon: 'activity',
    title: 'Visible at every step',
    text: 'Live tracking, status updates and notifications for every booking, order and request.',
  },
  {
    icon: 'languages',
    title: 'Care in your language',
    text: 'Hindi and English across menus, service categories, buttons and notifications.',
  },
]

function EcosystemGroup({ title, items, columns }) {
  return (
    <div>
      <Reveal
        as="h3"
        className="mb-5 flex items-center gap-3 font-sans text-xs font-semibold tracking-[0.16em] text-ink-400 uppercase"
      >
        {title}
        <span aria-hidden="true" className="h-px flex-1 bg-ink-200" />
      </Reveal>
      <StaggerGroup
        as="ul"
        className={cn(
          'grid gap-5 sm:grid-cols-2',
          columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
        )}
        stagger={0.06}
      >
        {items.map((app) => (
          <StaggerItem
            as="li"
            key={app.name}
            variant="rise"
            className="group flex flex-col gap-4 rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 transition-[box-shadow,translate] duration-500 ring-inset hover:-translate-y-1 hover:shadow-card-hover"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 transition-colors duration-300 ring-inset group-hover:bg-brand-600 group-hover:text-white">
                <Icon name={app.icon} size={22} />
              </span>
              <span className="rounded-full bg-ink-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-ink-500 ring-1 ring-ink-100 ring-inset">
                {app.platform}
              </span>
            </div>
            <div>
              <p className="font-display text-lg font-bold text-ink-900">{app.name}</p>
              <p className="mt-0.5 text-sm font-medium text-brand-700">{app.audience}</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-500">
                {app.text}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  )
}

export default function AboutPage() {
  const apps = ecosystem.filter((app) => app.platform !== 'Web')
  const panels = ecosystem.filter((app) => app.platform === 'Web')

  return (
    <>
      <Seo
        title="About us"
        description="Lifeline 360 is an integrated healthcare platform bringing ambulance booking, nursing and caretakers, medicine delivery, lab tests and blood bank requests into one app."
      />

      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]}
        eyebrow="About Lifeline 360"
        title="Essential healthcare, brought together in one place"
        description="Lifeline 360 is an integrated healthcare platform. Ambulance booking, nursing and caretakers, medicine delivery, lab tests and blood bank requests share one app, one account and one standard of care."
        image={doctorLab}
        imageAlt="A doctor in a white coat standing with arms folded in a modern diagnostic laboratory"
        actions={
          <>
            <Button to="/services" size="lg" icon="arrowRight">
              Explore services
            </Button>
            <Button to="/contact" size="lg" variant="outline">
              Talk to us
            </Button>
          </>
        }
      />

      <section className="py-20 sm:py-28">
        <Container width="wide" className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-6 lg:col-span-6">
            <SectionHeading
              eyebrow="Why we exist"
              title="Getting help shouldn’t take six apps and ten phone calls"
            />
            <Reveal className="flex flex-col gap-4 text-lg leading-relaxed text-ink-600">
              <p>
                When someone in the family needs care, the hardest part is often the
                coordination: finding a hospital that accepts your Ayushman card, an
                ambulance, a nurse for the evening, the right medicines, a lab that will
                collect a sample at home, or a blood bank with the right group in stock.
              </p>
              <p>
                Lifeline 360 brings those services onto one platform. Every partner is
                verified, every request can be followed as it happens, calls stay private,
                and the whole experience works in Hindi or English.
              </p>
            </Reveal>
          </div>

          <StaggerGroup className="grid grid-cols-2 gap-4 self-center lg:col-span-6">
            {platformFacts.map((fact, index) => (
              <StaggerItem
                key={fact.label}
                variant="rise"
                className={cn(
                  'flex flex-col gap-2 rounded-3xl p-6 ring-1 ring-inset sm:p-8',
                  index === 0
                    ? 'bg-brand-600 text-white ring-brand-600'
                    : 'bg-ink-50 ring-ink-100'
                )}
              >
                <CountUp
                  value={Number(fact.value)}
                  className={cn(
                    'font-display text-5xl font-extrabold tracking-tight sm:text-6xl',
                    index === 0 ? 'text-white' : 'text-brand-700'
                  )}
                />
                <p
                  className={cn(
                    'text-[0.9375rem] leading-snug font-medium',
                    index === 0 ? 'text-white/80' : 'text-ink-600'
                  )}
                >
                  {fact.label}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      <section className="bg-ink-50/70 py-20 sm:py-28">
        <Container width="wide">
          <SectionHeading
            align="center"
            eyebrow="The platform"
            title="Seven apps and panels, working as one"
            description="Everyone involved in your care gets a tool built for their job, all connected to the same platform."
          />
          <div className="mt-14 flex flex-col gap-12">
            <EcosystemGroup
              title="Mobile apps · Android & iOS"
              items={apps}
              columns={3}
            />
            <EcosystemGroup title="Web panels & website" items={panels} columns={4} />
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container width="wide" className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal variant="left" className="relative">
            <Photo
              src={doctorsXray}
              alt="Two doctors in lab coats reviewing an X-ray together"
              className="aspect-[4/3] rounded-5xl shadow-float"
            />
            <div className="glass absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-float sm:left-10">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Icon name="shieldCheck" size={20} />
              </span>
              <div>
                <p className="text-[0.8125rem] font-semibold text-ink-900">
                  Every partner verified
                </p>
                <p className="text-xs text-ink-500">
                  KYC & document checks before go-live
                </p>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="What we stand for"
              title="The principles behind every service"
            />
            <StaggerGroup as="ul" className="flex flex-col gap-6">
              {PRINCIPLES.map((principle) => (
                <StaggerItem as="li" key={principle.title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-aqua-50 text-aqua-700 ring-1 ring-aqua-100 ring-inset">
                    <Icon name={principle.icon} size={21} />
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold text-ink-900">
                      {principle.title}
                    </p>
                    <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-500">
                      {principle.text}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  )
}
