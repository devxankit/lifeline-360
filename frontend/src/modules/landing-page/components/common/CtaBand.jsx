import Reveal from '@/components/motion/Reveal'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { partnerTypes } from '../../data/partners'
import { TONES } from '../../data/services'
import PhoneMockup from '../mockups/PhoneMockup'
import StoreBadges from './StoreBadges'

const APP_POINTS = [
  'Mobile number + OTP sign-in',
  'Live tracking and instant updates',
  'Every booking and order in one history',
]

/**
 * Closing call to action shared by the landing page and inner pages: the app
 * on the left, partner registration on the right. Carries the `download`
 * anchor that every "Get the app" button points at.
 */
export default function CtaBand({ id = 'download' }) {
  return (
    <section id={id} className="scroll-mt-24 py-20 sm:py-24">
      <Container width="wide" className="grid gap-6 lg:grid-cols-12">
        <Reveal className="relative overflow-hidden rounded-5xl bg-ink-950 px-6 py-10 sm:px-12 sm:py-14 lg:col-span-8">
          <div aria-hidden="true" className="absolute inset-0 bg-dots-dark" />
          <div
            aria-hidden="true"
            className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-brand-600/40 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -right-24 -bottom-40 h-96 w-96 rounded-full bg-aqua-500/25 blur-3xl"
          />

          <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto]">
            <div className="flex flex-col gap-5">
              <span className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold tracking-[0.14em] text-aqua-300 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-aqua-300" />
                Get the app
              </span>
              <h2 className="text-display-sm text-white sm:text-display-md">
                Every service, one app, in your language.
              </h2>
              <p className="max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
                Sign in with your mobile number, choose Hindi or English and book any
                Lifeline 360 service in a few taps.
              </p>
              <ul className="flex flex-col gap-2.5">
                {APP_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2.5 text-[0.9375rem] text-white/85"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-aqua-400/20 text-aqua-300">
                      <Icon name="check" size={13} strokeWidth={2.5} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <StoreBadges tone="dark" className="pt-2" />
            </div>

            <div className="hidden justify-center md:flex">
              <PhoneMockup className="rotate-[4deg] transition-transform duration-700 ease-out hover:rotate-0" />
            </div>
          </div>
        </Reveal>

        <Reveal
          delay={0.1}
          className="relative flex flex-col justify-between gap-10 overflow-hidden rounded-5xl bg-brand-50 px-6 py-10 ring-1 ring-brand-100 ring-inset sm:px-10 sm:py-12 lg:col-span-4"
        >
          <div
            aria-hidden="true"
            className="absolute -top-12 -right-12 h-52 w-52 rounded-full bg-aqua-200/50 blur-2xl"
          />

          <div className="relative flex flex-col gap-5">
            <span className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold tracking-[0.14em] text-brand-700 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-aqua-500" />
              For partners
            </span>
            <h2 className="text-display-xs sm:text-display-sm">
              Partner with Lifeline 360
            </h2>
            <p className="text-base leading-relaxed text-ink-600">
              Receive requests, manage your work and track earnings in one place.
            </p>
            <ul className="flex flex-col gap-2.5 pt-1">
              {partnerTypes.map((partner) => (
                <li key={partner.id} className="flex items-center gap-3">
                  <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                      TONES[partner.tone].solid
                    )}
                  >
                    <Icon name={partner.icon} size={17} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-[0.9375rem] leading-tight font-bold text-ink-900">
                      {partner.title}
                    </span>
                    <span className="block text-xs text-ink-500">
                      {partner.workspace}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Button to="/partners" icon="arrowRight" className="relative self-start">
            Register as a partner
          </Button>
        </Reveal>
      </Container>
    </section>
  )
}
