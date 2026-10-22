import Reveal from '@/components/motion/Reveal'
import StaggerGroup from '@/components/motion/StaggerGroup'
import StaggerItem from '@/components/motion/StaggerItem'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Icon from '@/components/ui/Icon'
import Photo from '@/components/ui/Photo'
import SectionHeading from '@/components/ui/SectionHeading'
import { siteConfig } from '@/config/site'
import ambulanceImage from '../../assets/images/ambulance-pune.webp'
import PulseLine from '../common/PulseLine'
import LiveTrackingCard from '../mockups/LiveTrackingCard'
import { MaskedCallCard } from '../mockups/StatusCards'

const POINTS = [
  {
    icon: 'siren',
    title: 'Request with pickup and hospital',
    text: 'Your location and destination hospital go straight to the driver.',
  },
  {
    icon: 'userCheck',
    title: 'A verified driver accepts',
    text: 'You are notified the moment a driver is assigned.',
  },
  {
    icon: 'locate',
    title: 'Live GPS and trip status',
    text: 'Watch the ambulance approach on the map.',
  },
  {
    icon: 'lock',
    title: 'Private, masked calls',
    text: 'Talk to the driver without sharing numbers.',
  },
]

export default function EmergencySection() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-20 text-white sm:py-28">
      <div aria-hidden="true" className="absolute inset-0 bg-dots-dark" />
      <div
        aria-hidden="true"
        className="absolute -top-48 -left-40 h-[30rem] w-[30rem] rounded-full bg-emergency-600/12 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-40 -bottom-40 h-[34rem] w-[34rem] rounded-full bg-brand-600/30 blur-3xl"
      />
      <PulseLine tone="dark" className="absolute top-6 left-0 h-20 w-full opacity-70" />

      <Container
        width="wide"
        className="relative grid items-center gap-16 lg:grid-cols-12 lg:gap-12"
      >
        <div className="flex flex-col gap-8 lg:col-span-5">
          <SectionHeading
            tone="dark"
            eyebrow="Emergency ambulance"
            title="When every minute counts, watch help arrive"
            description="Request an ambulance from the app, see a verified driver accept and follow the ambulance on a live map all the way to your door."
          />

          <StaggerGroup as="ul" className="grid gap-5 sm:grid-cols-2">
            {POINTS.map((point) => (
              <StaggerItem as="li" key={point.title} className="flex gap-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/8 text-aqua-300 ring-1 ring-white/10 ring-inset">
                  <Icon name={point.icon} size={19} />
                </span>
                <div>
                  <p className="font-display text-base font-bold text-white">
                    {point.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-white/60">
                    {point.text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal className="flex flex-col gap-4">
            <Button
              to="/services/ambulance"
              variant="emergency"
              icon="arrowRight"
              className="self-start"
            >
              How ambulance booking works
            </Button>
            <p className="flex items-center gap-2 text-sm text-white/60">
              <Icon name="info" size={16} className="text-emergency-400" />
              In a life-threatening emergency, also call {siteConfig.emergencyNumber}.
            </p>
          </Reveal>
        </div>

        <Reveal variant="right" className="relative pb-24 lg:col-span-7 lg:pb-0">
          <Photo
            src={ambulanceImage}
            alt="An advanced life support ambulance driving along a hillside road near Pune"
            className="aspect-[16/11] rounded-5xl ring-1 ring-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-5xl bg-linear-to-tr from-ink-950/50 via-transparent to-transparent lg:bottom-0"
          />

          <div className="absolute bottom-0 left-3 w-[min(19rem,calc(100%-1.5rem))] sm:left-6 lg:-bottom-12 lg:-left-10">
            <div className="animate-float-slow">
              <LiveTrackingCard />
            </div>
          </div>

          <div className="absolute top-5 right-5 hidden sm:block">
            <MaskedCallCard />
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
