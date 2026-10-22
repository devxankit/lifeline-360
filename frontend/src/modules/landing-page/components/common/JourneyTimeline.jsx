import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import Icon from '@/components/ui/Icon'
import { EASE_OUT } from '@/components/motion/variants'
import { cn } from '@/lib/cn'
import { TONES } from '../../data/services'

const STEP_MS = 2400

/**
 * A service journey as a vertical timeline (request → partner → status →
 * done). While it is on screen it steps through the stages by itself, so the
 * visitor watches the flow happen; hovering pauses it and clicking a stage
 * jumps there. Reduced-motion users get a static, fully readable list.
 *
 * Node rings are white, so place the timeline on a white surface.
 */
export default function JourneyTimeline({
  steps,
  tone = 'brand',
  autoplay = true,
  className,
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.35 })
  const prefersReducedMotion = useReducedMotion()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const playing = autoplay && inView && !paused && !prefersReducedMotion
  const t = TONES[tone] ?? TONES.brand

  // A new set of steps (e.g. switching service tab) starts from the top.
  useEffect(() => {
    setActive(0)
  }, [steps])

  useEffect(() => {
    if (!playing) return undefined
    const timer = setInterval(
      () => setActive((index) => (index + 1) % steps.length),
      STEP_MS
    )
    return () => clearInterval(timer)
  }, [playing, steps.length])

  return (
    <ol
      ref={ref}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={cn('flex flex-col gap-1', className)}
    >
      {steps.map((step, index) => {
        const state = index < active ? 'done' : index === active ? 'active' : 'upcoming'
        const isLast = index === steps.length - 1

        return (
          <li key={step.title} className="relative">
            {/* Connector to the next node: grey rail with a tone fill that
                grows as the journey passes it. */}
            {isLast ? null : (
              <span
                aria-hidden="true"
                className="absolute top-[1.875rem] -bottom-[2.125rem] left-[calc(1.875rem-1px)] w-0.5 overflow-hidden rounded-full bg-ink-100"
              >
                <motion.span
                  className={cn('block h-full w-full origin-top', t.dot)}
                  initial={false}
                  animate={{ scaleY: index < active ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                />
              </span>
            )}

            <button
              type="button"
              onClick={() => setActive(index)}
              aria-current={state === 'active' ? 'step' : undefined}
              className="group relative flex w-full items-start gap-4 rounded-2xl p-2 text-left transition-colors hover:bg-ink-50/80"
            >
              <span
                className={cn(
                  'relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-4 ring-white transition-colors duration-300',
                  state === 'upcoming' && 'bg-ink-100 text-ink-400',
                  state === 'done' && t.chip,
                  state === 'active' && t.solid
                )}
              >
                {state === 'active' && !prefersReducedMotion ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-0 animate-ping-soft rounded-full',
                      t.dot
                    )}
                  />
                ) : null}
                <Icon
                  name={state === 'done' ? 'check' : step.icon}
                  size={19}
                  strokeWidth={state === 'done' ? 2.25 : 1.75}
                  className="relative"
                />
              </span>

              <span className="min-w-0 pt-0.5">
                <span className="block text-[0.6875rem] font-semibold tracking-[0.14em] text-ink-400 uppercase">
                  Step {index + 1}
                </span>
                <span
                  className={cn(
                    'block font-display text-[1.0625rem] font-bold transition-colors duration-300',
                    state === 'upcoming' ? 'text-ink-500' : 'text-ink-900'
                  )}
                >
                  {step.title}
                </span>
                <span className="mt-0.5 block text-[0.9375rem] leading-relaxed text-ink-500">
                  {step.text}
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
