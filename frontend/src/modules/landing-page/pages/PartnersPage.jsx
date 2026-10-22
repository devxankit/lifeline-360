import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Reveal from '@/components/motion/Reveal'
import StaggerGroup from '@/components/motion/StaggerGroup'
import StaggerItem from '@/components/motion/StaggerItem'
import Seo from '@/components/seo/Seo'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Icon from '@/components/ui/Icon'
import SectionHeading from '@/components/ui/SectionHeading'
import { EASE_OUT } from '@/components/motion/variants'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/cn'
import partnersPhone from '../assets/images/partners-phone.webp'
import FaqAccordion from '../components/common/FaqAccordion'
import PageHero from '../components/common/PageHero'
import PartnerForm from '../components/forms/PartnerForm'
import { getFaqCategory } from '../data/faqs'
import { onboardingSteps, partnerTypes } from '../data/partners'
import { TONES } from '../data/services'

const NEXT_STEPS = [
  'Our partner team reviews your details',
  'We call you to explain verification and the documents needed',
  'You get access to your partner app or web panel',
]

export default function PartnersPage() {
  const prefersReducedMotion = useReducedMotion()
  const [activeId, setActiveId] = useState(partnerTypes[0].id)
  const [formType, setFormType] = useState('')
  const active = partnerTypes.find((partner) => partner.id === activeId)
  const tone = TONES[active.tone]

  const startRegistration = (id) => {
    setFormType(id)
    document
      .getElementById('register')
      ?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <>
      <Seo
        title="Partner with us"
        description="Pharmacies, nurses and caretakers, ambulance drivers, laboratories and blood banks can register to partner with Lifeline 360."
      />

      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Partners' }]}
        eyebrow="For partners"
        title="Grow with Lifeline 360"
        description="Run a pharmacy, lab or blood bank, drive an ambulance or provide care at home? Join a platform that sends you requests, keeps calls private and tracks your earnings."
        image={partnersPhone}
        imageAlt="Two healthcare workers in scrubs looking at a smartphone together"
        imagePosition="50% 28%"
        actions={
          <>
            <Button to="#register" size="lg" icon="arrowRight">
              Register now
            </Button>
            <Button to="#partner-types" size="lg" variant="outline">
              See partner tools
            </Button>
          </>
        }
      />

      <section id="partner-types" className="scroll-mt-24 py-20 sm:py-28">
        <Container width="wide" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="Who can partner"
            title="Five ways to partner with us"
            description="Each partner type gets its own app or web panel, built around the work it does."
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <div
                role="tablist"
                aria-label="Partner types"
                className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 lg:flex-col lg:flex-nowrap"
              >
                {partnerTypes.map((partner) => {
                  const selected = partner.id === activeId

                  return (
                    <button
                      key={partner.id}
                      type="button"
                      role="tab"
                      id={`partner-tab-${partner.id}`}
                      aria-selected={selected}
                      aria-controls="partner-panel"
                      onClick={() => setActiveId(partner.id)}
                      className={cn(
                        'relative flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-[0.9375rem] font-semibold transition-colors lg:w-full',
                        selected ? 'text-ink-900' : 'text-ink-500 hover:text-ink-800'
                      )}
                    >
                      {selected ? (
                        <motion.span
                          layoutId="partner-tab"
                          transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                          className="absolute inset-0 rounded-2xl bg-white shadow-card ring-1 ring-ink-200/70"
                        />
                      ) : null}
                      <span
                        className={cn(
                          'relative flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset transition-colors',
                          selected
                            ? TONES[partner.tone].chip
                            : 'bg-ink-50 text-ink-400 ring-ink-200'
                        )}
                      >
                        <Icon name={partner.icon} size={19} />
                      </span>
                      <span className="relative whitespace-nowrap">{partner.title}</span>
                    </button>
                  )
                })}
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-8">
              <div
                id="partner-panel"
                role="tabpanel"
                aria-labelledby={`partner-tab-${activeId}`}
                className="relative h-full overflow-hidden rounded-4xl bg-ink-50/80 p-6 ring-1 ring-ink-200/70 ring-inset sm:p-10"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeId}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: EASE_OUT }}
                    className="flex flex-col gap-7"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span
                          className={cn(
                            'flex h-14 w-14 items-center justify-center rounded-2xl',
                            tone.solid
                          )}
                        >
                          <Icon name={active.icon} size={26} />
                        </span>
                        <div>
                          <h3 className="font-display text-2xl font-bold">
                            {active.title}
                          </h3>
                          <p className="mt-0.5 text-sm font-medium text-ink-500">
                            {active.workspace}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="max-w-xl text-lg leading-relaxed text-ink-600">
                      {active.text}
                    </p>

                    <div>
                      <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
                        Your tools
                      </p>
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {active.tools.map((tool) => (
                          <li
                            key={tool}
                            className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-[0.9375rem] font-medium text-ink-700 ring-1 ring-ink-200/70 ring-inset"
                          >
                            <Icon name="checkCircle" size={18} className={tone.text} />
                            {tool}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      onClick={() => startRegistration(active.id)}
                      icon="arrowRight"
                      className="self-start"
                    >
                      Start registration
                    </Button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-ink-950 py-20 text-white sm:py-28">
        <Container width="wide" className="flex flex-col gap-12">
          <SectionHeading
            tone="dark"
            eyebrow="Onboarding"
            title="From registration to your first request"
            description="Every partner follows the same four steps, including verification, before going live."
          />
          <StaggerGroup
            as="ol"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            stagger={0.08}
          >
            {onboardingSteps.map((step, index) => (
              <StaggerItem
                as="li"
                key={step.title}
                variant="rise"
                className="group relative flex flex-col gap-5 rounded-3xl bg-white/5 p-7 ring-1 ring-white/10 transition-colors duration-300 ring-inset hover:bg-white/8"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white transition-transform duration-500 group-hover:-rotate-6">
                    <Icon name={step.icon} size={22} />
                  </span>
                  <span className="font-display text-4xl font-extrabold text-white/10 tabular-nums">
                    0{index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/60">
                    {step.text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      <section id="register" className="scroll-mt-24 py-20 sm:py-28">
        <Container width="wide" className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="flex flex-col gap-8 lg:col-span-5">
            <SectionHeading
              eyebrow="Register"
              title="Register your interest"
              description="Tell us about yourself and we’ll take it from there. Registering starts the verification process."
            />
            <Reveal className="flex flex-col gap-4">
              <p className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
                What happens next
              </p>
              <ol className="flex flex-col gap-4">
                {NEXT_STEPS.map((step, index) => (
                  <li
                    key={step}
                    className="flex items-start gap-3.5 text-[0.9375rem] text-ink-700"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 font-display text-sm font-bold text-brand-700 ring-1 ring-brand-100 ring-inset">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal className="rounded-3xl bg-ink-50 p-6 ring-1 ring-ink-100 ring-inset">
              <p className="font-display text-base font-bold text-ink-900">
                Prefer email?
              </p>
              <a
                href={siteConfig.contact.partnerEmailHref}
                className="mt-2 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-brand-700 hover:text-brand-800"
              >
                <Icon name="mail" size={17} />
                {siteConfig.contact.partnerEmail}
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="rounded-4xl bg-white p-6 shadow-card ring-1 ring-ink-200/70 sm:p-10">
              <PartnerForm partnerType={formType} />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-ink-50/70 py-20 sm:py-24">
        <Container width="wide" className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="FAQs" title="Partner questions" />
          </div>
          <Reveal delay={0.1} className="lg:col-span-8">
            <FaqAccordion items={getFaqCategory('partners').items} />
          </Reveal>
        </Container>
      </section>
    </>
  )
}
