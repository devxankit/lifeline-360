import { useReducedMotion } from 'motion/react'
import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

/** Pickup (bottom left) to hospital (top right) through a few city blocks. */
const ROUTE = 'M44 170 C 92 170 100 128 138 124 S 204 104 220 78 S 252 42 288 38'

const BLOCKS = [
  [12, 14, 70, 44],
  [96, 14, 92, 30],
  [214, 82, 94, 36],
  [12, 74, 58, 60],
  [150, 150, 70, 38],
  [244, 140, 64, 48],
  [96, 64, 64, 34],
]

/**
 * Live ambulance tracking: a small city map with the route drawn in, a
 * marching dash showing direction and the ambulance marker travelling along
 * it. Reduced motion parks the marker partway along the route.
 */
export default function LiveTrackingCard({ className }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      role="img"
      aria-label="Illustration of live ambulance tracking on a map"
      className={cn(
        'overflow-hidden rounded-3xl bg-white shadow-float ring-1 ring-ink-100',
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <p className="flex items-center gap-2 text-[0.8125rem] font-semibold text-ink-900">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inset-0 animate-ping-soft rounded-full bg-success" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-success" />
          </span>
          Live tracking
        </p>
        <p className="text-xs font-semibold text-ink-500">
          ETA{' '}
          <span className="font-display text-sm font-extrabold text-ink-900">7 min</span>
        </p>
      </div>

      <svg
        viewBox="0 0 320 200"
        className="block h-auto w-full bg-ink-50"
        aria-hidden="true"
      >
        {BLOCKS.map(([x, y, w, h]) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={w}
            height={h}
            rx="8"
            fill="#ffffff"
            stroke="#e5ebf3"
          />
        ))}
        <path
          d="M0 58 H320 M0 140 H320 M84 0 V200 M200 0 V200"
          stroke="#ebf0f7"
          strokeWidth="6"
        />

        <path
          d={ROUTE}
          fill="none"
          stroke="#bfd5ff"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d={ROUTE}
          fill="none"
          stroke="#2453db"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="8 8"
          className="animate-route"
        />

        {/* Pickup */}
        <circle cx="44" cy="170" r="10" fill="#2453db" fillOpacity="0.15" />
        <circle
          cx="44"
          cy="170"
          r="5.5"
          fill="#ffffff"
          stroke="#2453db"
          strokeWidth="3"
        />

        {/* Hospital */}
        <rect
          x="276"
          y="22"
          width="26"
          height="26"
          rx="8"
          fill="#ffffff"
          stroke="#d9e1ec"
        />
        <path
          d="M289 28.5v13M282.5 35h13"
          stroke="#d92d35"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Ambulance marker */}
        <g transform={prefersReducedMotion ? 'translate(138 124)' : undefined}>
          <circle r="12" fill="#d92d35" fillOpacity="0.18" />
          <circle r="8" fill="#d92d35" stroke="#ffffff" strokeWidth="2.5" />
          <path
            d="M0 -3.5v7M-3.5 0h7"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {prefersReducedMotion ? null : (
            <animateMotion dur="7s" repeatCount="indefinite" path={ROUTE} />
          )}
        </g>
      </svg>

      <div className="flex items-center gap-3 border-t border-ink-100 px-4 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 font-display text-xs font-bold text-white">
          RK
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.8125rem] font-semibold text-ink-900">Rakesh K.</p>
          <p className="text-xs text-ink-500">Advanced life support ambulance</p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 ring-1 ring-brand-100 ring-inset">
          <Icon name="phone" size={16} />
        </span>
      </div>
    </div>
  )
}
