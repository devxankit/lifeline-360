import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Reveal from '@/components/motion/Reveal'
import Container from '@/components/ui/Container'
import Icon from '@/components/ui/Icon'
import SectionHeading from '@/components/ui/SectionHeading'
import { EASE_OUT } from '@/components/motion/variants'
import { cn } from '@/lib/cn'
import { servicePath, serviceTiles, TONES } from '../../data/services'
import JourneyTimeline from '../common/JourneyTimeline'

const JOURNEYS = serviceTiles

/**
 * Pick a service and watch its journey play out, using the user flows from the
 * Scope of Work §16 (e.g. Laboratory → Test → Sample collection → Report).
 */
export default function HowItWorksSection() {
  const [activeSlug, setActiveSlug] = useState(JOURNEYS[0].slug)
  const active = JOURNEYS.find((journey) => journey.slug === activeSlug)

  return (
    <section className="bg-ink-50/70 py-20 sm:py-28">
      {/* grid-cols-1 (minmax(0,1fr)) keeps the scrolling tab row from
          stretching the single mobile column to its full width. */}
      <Container
        width="wide"
        className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10"
      >
        <div className="flex flex-col gap-8 lg:col-span-5">
          <SectionHeading
            eyebrow="How it works"
            title="From a tap to care at your door"
            description="Every service follows a clear path from request to result, and you can see each step as it happens. Pick a service to watch its journey."
          />

          <Reveal delay={0.1}>
            <div
              role="tablist"
              aria-label="Services"
              className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 lg:flex-col lg:flex-nowrap"
            >
              {JOURNEYS.map((journey) => {
                const selected = journey.slug === activeSlug
                const tone = TONES[journey.tone]

                return (
                  <button
                    key={journey.slug}
                    type="button"
                    role="tab"
                    id={`journey-tab-${journey.slug}`}
                    aria-selected={selected}
                    aria-controls="journey-panel"
                    onClick={() => setActiveSlug(journey.slug)}
                    className={cn(
                      'relative flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-left text-[0.9375rem] font-semibold transition-colors lg:w-full',
                      selected ? 'text-ink-900' : 'text-ink-500 hover:text-ink-800'
                    )}
                  >
                    {selected ? (
                      <motion.span
                        layoutId="journey-tab"
                        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                        className="absolute inset-0 rounded-2xl bg-white shadow-card ring-1 ring-ink-200/70"
                      />
                    ) : null}
                    <span
                      className={cn(
                        'relative flex h-9 w-9 items-center justify-center rounded-xl ring-1 ring-inset transition-colors',
                        selected ? tone.chip : 'bg-white text-ink-400 ring-ink-200'
                      )}
                    >
                      <Icon name={journey.icon} size={18} />
                    </span>
                    <span className="relative whitespace-nowrap">{journey.title}</span>
                    {selected ? (
                      <Icon
                        name="chevronRight"
                        size={16}
                        className="relative ml-auto hidden text-ink-400 lg:block"
                      />
                    ) : null}
                  </button>
                )
              })}
            </div>
          </Reveal>
        </div>

        {/* Sized to its content and pinned while the tab list scrolls past. */}
        <Reveal delay={0.15} className="lg:sticky lg:top-28 lg:col-span-7 lg:self-start">
          <div
            id="journey-panel"
            role="tabpanel"
            aria-labelledby={`journey-tab-${activeSlug}`}
            className="rounded-4xl bg-white p-6 shadow-card ring-1 ring-ink-200/70 sm:p-9"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeSlug}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-100 pb-6">
                  <div className="flex items-center gap-3.5">
                    <span
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-2xl',
                        TONES[active.tone].solid
                      )}
                    >
                      <Icon name={active.icon} size={24} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
                        Journey
                      </p>
                      <h3 className="font-display text-xl font-bold">{active.title}</h3>
                    </div>
                  </div>
                  <Link
                    to={servicePath(active)}
                    className="group inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-brand-700"
                  >
                    Explore
                    <Icon
                      name="arrowRight"
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>

                <JourneyTimeline
                  steps={active.journey}
                  tone={active.tone}
                  className="mt-5"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
