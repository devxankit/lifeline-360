import { useMemo } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { createProjection } from '../../utils/geo'

const WIDTH = 400
const HEIGHT = 440
const RING_KM = [2, 5, 10, 25]
const KM_PER_DEGREE_LAT = 111.32

/** Teardrop pin with its tip at (0, 0). */
const PIN = 'M0 0C-1.8-5.4-11-11.6-11-20.2a11 11 0 1 1 22 0C11-11.6 1.8-5.4 0 0Z'

/** Quiet city-block texture behind the pins. Purely decorative. */
const BLOCKS = Array.from({ length: 30 }, (_, index) => {
  const col = index % 5
  const row = Math.floor(index / 5)
  return {
    x: 14 + col * 78 + (row % 2) * 10,
    y: 14 + row * 72,
    w: 58 - ((index * 7) % 18),
    h: 50 - ((index * 5) % 16),
  }
})

/**
 * Schematic map of the current results: every hospital at its real relative
 * position, distance rings drawn to scale around the visitor (or the city
 * centre), and pins that highlight together with their cards.
 *
 * It is a diagram, not a street map, and says so in its caption.
 */
export default function HospitalMap({
  results,
  origin,
  activeId,
  onHover,
  onSelect,
  className,
}) {
  const layout = useMemo(() => {
    const points = results.map((hospital) => hospital.coords)
    if (origin) points.push(origin.coords)
    if (!points.length) return null

    const project = createProjection(points, WIDTH, HEIGHT)
    const centre = origin ? project(origin.coords) : null
    const rings = centre
      ? RING_KM.map((km) => {
          const edge = project([
            origin.coords[0] + km / KM_PER_DEGREE_LAT,
            origin.coords[1],
          ])
          return { km, r: Math.abs(centre.y - edge.y) }
        }).filter((ring) => ring.r > 22 && ring.r < WIDTH * 0.9)
      : []

    return {
      centre,
      rings,
      pins: results.map((hospital) => ({ hospital, ...project(hospital.coords) })),
    }
  }, [results, origin])

  return (
    <figure className={cn('flex flex-col gap-3', className)}>
      <div className="relative overflow-hidden rounded-3xl bg-ink-50 ring-1 ring-ink-200/70 ring-inset">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="block h-auto w-full"
          role="img"
          aria-label={`Schematic map of ${results.length} hospitals${origin ? ` around ${origin.label}` : ''}`}
        >
          {BLOCKS.map((block) => (
            <rect
              key={`${block.x}-${block.y}`}
              x={block.x}
              y={block.y}
              width={block.w}
              height={block.h}
              rx="9"
              fill="#ffffff"
              stroke="#e5ebf3"
            />
          ))}
          <path
            d="M0 150 C 120 130 240 190 400 160 M0 330 C 140 300 260 360 400 320 M120 0 C 140 150 100 300 130 440 M290 0 C 270 140 320 300 290 440"
            fill="none"
            stroke="#e3e9f2"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {layout?.centre
            ? layout.rings.map((ring) => (
                <g key={ring.km}>
                  <circle
                    cx={layout.centre.x}
                    cy={layout.centre.y}
                    r={ring.r}
                    fill="none"
                    stroke="#93b8fd"
                    strokeOpacity="0.55"
                    strokeDasharray="4 6"
                  />
                  <text
                    x={layout.centre.x + 4}
                    y={layout.centre.y - ring.r - 5}
                    fontSize="11"
                    fontWeight="600"
                    fill="#607089"
                  >
                    {ring.km} km
                  </text>
                </g>
              ))
            : null}

          {layout?.pins.map(({ hospital, x, y }) => {
            const active = hospital.id === activeId

            return (
              <g
                key={hospital.id}
                transform={`translate(${x} ${y})`}
                onClick={() => onSelect(hospital.id)}
                onMouseEnter={() => onHover(hospital.id)}
                className="cursor-pointer"
              >
                {/* Scales from the pin's tip so it grows in place. */}
                <motion.g
                  style={{ originY: 1 }}
                  initial={{ opacity: 0, y: -14 }}
                  animate={{ opacity: 1, y: 0, scale: active ? 1.25 : 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                >
                  <ellipse
                    cx="0"
                    cy="1"
                    rx="6"
                    ry="2.4"
                    fill="#121b2d"
                    fillOpacity="0.18"
                  />
                  <path
                    d={PIN}
                    fill={active ? '#d92d35' : '#2453db'}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <circle cx="0" cy="-20.2" r="5.2" fill="#ffffff" />
                  <path
                    d="M0 -23.4v6.4M-3.2 -20.2h6.4"
                    stroke={active ? '#d92d35' : '#2453db'}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </motion.g>
              </g>
            )
          })}

          {layout?.centre ? (
            <g transform={`translate(${layout.centre.x} ${layout.centre.y})`}>
              <circle
                r="9"
                fill="#10a2bc"
                fillOpacity="0.35"
                className="origin-center animate-ping-soft [transform-box:fill-box]"
              />
              <circle r="6.5" fill="#10a2bc" stroke="#ffffff" strokeWidth="2.5" />
              <text x="11" y="4" fontSize="12" fontWeight="700" fill="#12677d">
                {origin.label === 'you' ? 'You' : 'City centre'}
              </text>
            </g>
          ) : null}
        </svg>

        {!results.length ? (
          <p className="absolute inset-0 flex items-center justify-center p-8 text-center text-sm font-medium text-ink-500">
            No hospitals to show for this search.
          </p>
        ) : null}
      </div>

      <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-1 text-xs text-ink-500">
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />
            PM-JAY hospital
          </span>
          {origin ? (
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-aqua-500" />
              {origin.label === 'you' ? 'Your location' : 'City centre'}
            </span>
          ) : null}
        </span>
        <span>Schematic map, straight-line distances</span>
      </figcaption>
    </figure>
  )
}
