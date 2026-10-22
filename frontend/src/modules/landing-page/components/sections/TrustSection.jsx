import Reveal from '@/components/motion/Reveal'
import StaggerGroup from '@/components/motion/StaggerGroup'
import StaggerItem from '@/components/motion/StaggerItem'
import Container from '@/components/ui/Container'
import Icon from '@/components/ui/Icon'
import SectionHeading from '@/components/ui/SectionHeading'
import { trustFeatures } from '../../data/platform'

export default function TrustSection() {
  return (
    <section className="py-20 sm:py-28">
      <Container width="wide" className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col gap-8 self-start lg:sticky lg:top-28 lg:col-span-4">
          <SectionHeading
            eyebrow="Why Lifeline 360"
            title="Built for trust at every step"
            description="Safety and visibility are part of every service: who you deal with, how you talk to them and what is happening right now."
          />

          <Reveal
            delay={0.1}
            className="relative overflow-hidden rounded-3xl bg-ink-950 p-7 text-white"
          >
            <div
              aria-hidden="true"
              className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-brand-600/40 blur-2xl"
            />
            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-aqua-300">
              <Icon name="shieldCheck" size={22} />
            </span>
            <p className="relative mt-5 font-display text-lg font-bold">
              One team watching over it all
            </p>
            <p className="relative mt-2 text-[0.9375rem] leading-relaxed text-white/65">
              Every booking, order and request is monitored from the Lifeline 360 admin
              panel, along with partner verification, payments, complaints and support.
            </p>
          </Reveal>
        </div>

        <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:col-span-8" stagger={0.06}>
          {trustFeatures.map((feature) => (
            <StaggerItem
              key={feature.title}
              variant="rise"
              className="group rounded-3xl bg-white p-7 ring-1 ring-ink-200/70 transition-[box-shadow,translate] duration-500 ring-inset hover:-translate-y-1 hover:shadow-card-hover"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 transition-all duration-500 ring-inset group-hover:rotate-[-8deg] group-hover:bg-brand-600 group-hover:text-white">
                <Icon name={feature.icon} size={23} />
              </span>
              <h3 className="mt-6 font-display text-lg font-bold">{feature.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-500">
                {feature.text}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  )
}
