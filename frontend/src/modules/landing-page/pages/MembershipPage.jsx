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
import seniorCouple from '../assets/images/senior-couple.webp'
import CtaBand from '../components/common/CtaBand'
import FaqAccordion from '../components/common/FaqAccordion'
import FeatureGrid from '../components/common/FeatureGrid'
import JourneyTimeline from '../components/common/JourneyTimeline'
import PageHero from '../components/common/PageHero'
import MembershipCard from '../components/mockups/MembershipCard'
import { getFaqCategory } from '../data/faqs'
import {
  membershipBenefits,
  membershipIncludes,
  membershipPlans,
} from '../data/membership'
import { membershipTile } from '../data/services'

const NOTIFY_LINK = '/contact?topic=membership'

export default function MembershipPage() {
  return (
    <>
      <Seo
        title="Membership"
        description="Monthly and annual Lifeline 360 membership plans with a digital membership card, renewal reminders and benefits across services."
      />

      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Membership' }]}
        eyebrow="Lifeline 360 Membership"
        title="One membership for every kind of care"
        description="Choose a monthly or annual plan, pay online and carry your digital membership card in the app. Benefits apply across Lifeline 360 services."
        actions={
          <>
            <Button to={NOTIFY_LINK} size="lg" icon="arrowRight">
              Get notified at launch
            </Button>
            <Button to="#plans" size="lg" variant="outline">
              Compare plans
            </Button>
          </>
        }
        visual={
          <div className="relative mx-auto max-w-md py-4 lg:py-10">
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-300/45 blur-3xl"
            />
            <MembershipCard className="relative" />
            <p className="relative mt-5 text-center text-xs text-ink-400">
              Sample card. Move your pointer over it.
            </p>
          </div>
        }
      />

      <section id="plans" className="scroll-mt-24 py-20 sm:py-28">
        <Container width="wide" className="flex flex-col gap-12">
          <SectionHeading
            align="center"
            eyebrow="Plans"
            title="Monthly or annual, your choice"
            description="Pricing and the final benefit list will be announced when membership launches."
          />

          <StaggerGroup className="mx-auto grid w-full max-w-4xl gap-6 md:grid-cols-2">
            {membershipPlans.map((plan) => {
              const featured = Boolean(plan.featured)

              return (
                <StaggerItem
                  key={plan.id}
                  variant="rise"
                  className={cn(
                    'relative flex flex-col gap-6 overflow-hidden rounded-4xl p-8 transition-[box-shadow,translate] duration-500 hover:-translate-y-1 sm:p-10',
                    featured
                      ? 'bg-ink-950 text-white shadow-float'
                      : 'bg-white ring-1 ring-ink-200/80 ring-inset hover:shadow-card-hover'
                  )}
                >
                  {featured ? (
                    <div
                      aria-hidden="true"
                      className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-brand-600/50 blur-3xl"
                    />
                  ) : null}

                  <div className="relative flex items-center justify-between">
                    <p
                      className={cn(
                        'font-display text-2xl font-bold',
                        featured ? 'text-white' : 'text-ink-900'
                      )}
                    >
                      {plan.name}
                    </p>
                    {featured ? (
                      <span className="rounded-full bg-aqua-400/15 px-3 py-1 text-xs font-semibold text-aqua-200 ring-1 ring-aqua-300/30 ring-inset">
                        One payment a year
                      </span>
                    ) : null}
                  </div>

                  <div className="relative">
                    {plan.price ? (
                      <p className="flex items-baseline gap-2">
                        <span className="font-display text-5xl font-extrabold">
                          {plan.price}
                        </span>
                        <span className={featured ? 'text-white/60' : 'text-ink-500'}>
                          {plan.cadence}
                        </span>
                      </p>
                    ) : (
                      <p
                        className={cn(
                          'font-display text-xl font-bold',
                          featured ? 'text-aqua-200' : 'text-brand-700'
                        )}
                      >
                        Price announced at launch
                      </p>
                    )}
                    <p
                      className={cn(
                        'mt-3 text-[0.9375rem] leading-relaxed',
                        featured ? 'text-white/70' : 'text-ink-500'
                      )}
                    >
                      {plan.description}
                    </p>
                  </div>

                  <ul className="relative flex flex-col gap-3">
                    {plan.points.map((point) => (
                      <li
                        key={point}
                        className={cn(
                          'flex items-center gap-2.5 text-[0.9375rem]',
                          featured ? 'text-white/85' : 'text-ink-700'
                        )}
                      >
                        <Icon
                          name="checkCircle"
                          size={18}
                          className={featured ? 'text-aqua-300' : 'text-success'}
                        />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <Button
                    to={NOTIFY_LINK}
                    variant={featured ? 'light' : 'outline'}
                    icon="arrowRight"
                    className="relative mt-auto self-start"
                  >
                    Get notified
                  </Button>
                </StaggerItem>
              )
            })}
          </StaggerGroup>
        </Container>
      </section>

      <section className="bg-ink-50/70 py-20 sm:py-28">
        <Container width="wide" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="Included with every plan"
            title="Your membership, always in your pocket"
          />
          <FeatureGrid features={membershipIncludes} columns={4} />
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container width="wide" className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal variant="left" className="relative order-2 lg:order-1">
            <Photo
              src={seniorCouple}
              alt="A smiling senior couple standing together outdoors, one holding a rose"
              position="50% 30%"
              className="aspect-[4/3] rounded-5xl shadow-float"
            />
          </Reveal>

          <div className="order-1 flex flex-col gap-8 lg:order-2">
            <SectionHeading
              eyebrow="Benefits being planned"
              title="More care for members"
              description="These are the benefits planned for membership. The final list will be confirmed at launch."
            />
            <StaggerGroup as="ul" className="flex flex-col gap-4">
              {membershipBenefits.map((benefit) => (
                <StaggerItem
                  as="li"
                  key={benefit.title}
                  className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-ink-200/70 ring-inset"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon name={benefit.icon} size={21} />
                  </span>
                  <div>
                    <p className="font-display text-base font-bold text-ink-900">
                      {benefit.title}
                    </p>
                    <p className="text-sm text-ink-500">{benefit.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </Container>
      </section>

      <section className="bg-ink-50/70 py-20 sm:py-28">
        <Container width="wide" className="grid items-start gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-5">
            <SectionHeading
              eyebrow="How it works"
              title="From plan to benefits in four steps"
              description="Buy and manage membership entirely in the app."
            />
          </div>
          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="rounded-4xl bg-white p-6 shadow-card ring-1 ring-ink-200/70 sm:p-9">
              <JourneyTimeline steps={membershipTile.journey} tone="brand" />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container width="wide" className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="FAQs" title="Membership questions" />
          </div>
          <Reveal delay={0.1} className="lg:col-span-8">
            <FaqAccordion items={getFaqCategory('membership').items} />
          </Reveal>
        </Container>
      </section>

      <CtaBand />
    </>
  )
}
