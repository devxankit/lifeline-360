import Reveal from '@/components/motion/Reveal'
import StaggerGroup from '@/components/motion/StaggerGroup'
import StaggerItem from '@/components/motion/StaggerItem'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Icon from '@/components/ui/Icon'
import SectionHeading from '@/components/ui/SectionHeading'
import { membershipBenefits } from '../../data/membership'
import PlanToggle from '../common/PlanToggle'
import MembershipCard from '../mockups/MembershipCard'

export default function MembershipSection() {
  return (
    <section className="relative overflow-hidden bg-ink-50/70 py-20 sm:py-28">
      <Container
        width="wide"
        className="grid items-center gap-16 lg:grid-cols-2 lg:gap-14"
      >
        <Reveal variant="left" className="relative order-2 lg:order-1">
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-300/40 blur-3xl"
          />
          <MembershipCard className="relative mx-auto max-w-md" />
          <p className="relative mt-5 text-center text-xs text-ink-400">
            Sample card. Your own name, plan and validity appear in the app.
          </p>
        </Reveal>

        <div className="order-1 flex flex-col gap-8 lg:order-2">
          <SectionHeading
            eyebrow="Membership"
            title="One membership, benefits across services"
            description="Choose a monthly or annual plan, pay online and carry your digital membership card in the app, with a reminder before it expires."
          />

          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
              Benefits being planned
            </p>
            <StaggerGroup as="ul" className="grid gap-3 sm:grid-cols-3">
              {membershipBenefits.map((benefit) => (
                <StaggerItem
                  as="li"
                  key={benefit.title}
                  className="flex flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-ink-200/70 ring-inset"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon name={benefit.icon} size={18} />
                  </span>
                  <p className="font-display text-[0.9375rem] leading-snug font-bold text-ink-900">
                    {benefit.title}
                  </p>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>

          <Reveal delay={0.1}>
            <PlanToggle />
          </Reveal>

          <Reveal delay={0.15}>
            <Button to="/membership" icon="arrowRight">
              Explore membership
            </Button>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
