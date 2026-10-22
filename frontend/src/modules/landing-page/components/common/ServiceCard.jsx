import { Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import Photo from '@/components/ui/Photo'
import { cn } from '@/lib/cn'
import { servicePath, TONES } from '../../data/services'

/**
 * Photo-led card for one service. The whole card is the link: it lifts on
 * hover, the photo slowly zooms and the arrow slides forward.
 */
export default function ServiceCard({ service, className }) {
  const tone = TONES[service.tone] ?? TONES.brand

  return (
    <Link
      to={servicePath(service)}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-4xl border border-ink-200/70 bg-white shadow-card',
        'transition-[box-shadow,translate,border-color] duration-500 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover',
        className
      )}
    >
      <div className="relative">
        <Photo
          src={service.image}
          alt={service.imageAlt}
          zoom
          className="aspect-[16/10]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-ink-950/30 via-transparent to-transparent"
        />
        <span
          className={cn(
            'absolute bottom-0 left-6 flex h-14 w-14 translate-y-1/2 items-center justify-center rounded-2xl bg-white shadow-card transition-transform duration-500 group-hover:-rotate-6',
            tone.text
          )}
        >
          <Icon name={service.icon} size={26} />
        </span>
      </div>

      <div className="flex flex-1 flex-col px-6 pt-11 pb-6">
        <h3 className="font-display text-xl font-bold text-ink-900">{service.title}</h3>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-500">
          {service.summary}
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {service.highlights.map((highlight) => (
            <li
              key={highlight}
              className="rounded-full bg-ink-50 px-2.5 py-1 text-xs font-medium text-ink-600 ring-1 ring-ink-100 ring-inset"
            >
              {highlight}
            </li>
          ))}
        </ul>

        <span className="mt-auto flex items-center gap-1.5 pt-6 text-[0.9375rem] font-semibold text-brand-700">
          See how it works
          <Icon
            name="arrowRight"
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  )
}
