import { useId } from 'react'
import { Link } from 'react-router-dom'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/cn'

/**
 * The Lifeline 360 mark: a heartbeat line inside an open ring.
 *
 * The ring is drawn as an arc with a gap that ends in a dot, so it reads as
 * motion all the way round (the "360"); the pulse is the "lifeline". On hover
 * of the surrounding `group` the ring turns a full 360° while the pulse holds
 * still.
 */
export function LogoMark({ className, tone = 'light' }) {
  const gradientId = `l360-ring-${useId().replace(/:/g, '')}`
  const onDark = tone === 'dark'

  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient
          id={gradientId}
          x1="4"
          y1="36"
          x2="36"
          y2="4"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={onDark ? '#93b8fd' : '#2453db'} />
          <stop offset="1" stopColor={onDark ? '#67d8e8' : '#10a2bc'} />
        </linearGradient>
      </defs>

      <g className="origin-center transition-transform duration-700 ease-out [transform-box:fill-box] group-hover:rotate-360">
        <circle
          cx="20"
          cy="20"
          r="16.5"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="89.67 14"
          transform="rotate(-20 20 20)"
        />
        <circle cx="26.02" cy="4.64" r="2.4" fill={onDark ? '#67d8e8' : '#10a2bc'} />
      </g>

      <path
        d="M7.5 21H14l2.5-6 4 12 3-8.5 2 2.5h7"
        fill="none"
        stroke={onDark ? '#ffffff' : '#2453db'}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Mark + wordmark, linking home. */
export default function Logo({ tone = 'light', className, onClick }) {
  const onDark = tone === 'dark'

  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label={`${siteConfig.name} — Home`}
      className={cn('group inline-flex items-center gap-2.5', className)}
    >
      <LogoMark tone={tone} className="h-9 w-9" />
      <span
        className={cn(
          'font-display text-[1.3rem] leading-none font-extrabold tracking-[-0.035em]',
          onDark ? 'text-white' : 'text-ink-900'
        )}
      >
        Lifeline
        <span className={onDark ? 'text-aqua-300' : 'text-brand-600'}>360</span>
      </span>
    </Link>
  )
}
