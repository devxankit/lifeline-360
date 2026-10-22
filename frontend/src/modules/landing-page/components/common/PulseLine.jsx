import { useId } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { EASE_OUT } from '@/components/motion/variants'
import { cn } from '@/lib/cn'

/**
 * Two heartbeats of an ECG trace (P wave, QRS spike, T wave) across a
 * 1200-unit band. The trace draws itself once on load, then a bright pulse
 * keeps travelling along it: the "lifeline" in the name, and the page's
 * signature motion. Both ends fade out through a mask so the line never stops
 * abruptly at the edge of its container.
 */
const BEAT = 'h180 l14 -10 l14 10 h42 l8 10 l14 -52 l14 70 l10 -28 h40 q20 -22 40 0 h224'
const TRACE = `M0 60 ${BEAT} ${BEAT}`

export default function PulseLine({ className, tone = 'light' }) {
  const prefersReducedMotion = useReducedMotion()
  const id = useId().replace(/:/g, '')
  const fadeId = `pulse-fade-${id}`
  const maskId = `pulse-mask-${id}`
  const dark = tone === 'dark'

  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={cn('pointer-events-none', className)}
    >
      <defs>
        <linearGradient id={fadeId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" />
          <stop offset="0.18" stopColor="#fff" />
          <stop offset="0.82" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id={maskId}>
          <rect width="1200" height="120" fill={`url(#${fadeId})`} />
        </mask>
      </defs>

      <g mask={`url(#${maskId})`}>
        <motion.path
          d={TRACE}
          fill="none"
          stroke={dark ? '#67d8e8' : '#93b8fd'}
          strokeOpacity={dark ? 0.45 : 0.75}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.4, ease: EASE_OUT, delay: 0.3 }}
        />

        {prefersReducedMotion ? null : (
          <path
            d={TRACE}
            fill="none"
            stroke={dark ? '#cff5f9' : '#2453db'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="100"
            strokeDasharray="5 95"
            className="animate-pulse-travel"
          />
        )}
      </g>
    </svg>
  )
}
