import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { isSampleDirectory } from '../../data/hospitals'
import { formatDistance } from '../../utils/geo'

/**
 * One hospital in the PM-JAY locator: who it is, how far, how to reach it,
 * and one-tap ambulance or blood booking to it.
 *
 * Sample numbers are shown as text only, never as dialable links, so nobody
 * rings a stranger from the demo.
 *
 * `anchor` gives the card the id the map scrolls to; turn it off for extra
 * copies of a card so the id stays unique.
 */
export default function HospitalCard({
  hospital,
  originLabel,
  active,
  anchor = true,
  onActivate,
  onBook,
}) {
  const dialable = !isSampleDirectory
  const telHref = `tel:${hospital.phone.replace(/\s+/g, '')}`

  return (
    <article
      id={anchor ? `hospital-${hospital.id}` : undefined}
      onMouseEnter={() => onActivate(hospital.id)}
      onFocus={() => onActivate(hospital.id)}
      className={cn(
        'scroll-mt-4 rounded-3xl p-5 ring-1 transition-[background-color,box-shadow] duration-300 ring-inset sm:p-6',
        active
          ? 'bg-brand-50/50 shadow-card ring-brand-300'
          : 'bg-white ring-ink-200/80 hover:ring-brand-200'
      )}
    >
      {/* Badges and distance share the top row, so the name and address below
          get the card's full width even on a phone. */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="success" className="whitespace-nowrap">
            <Icon name="checkCircle" size={13} />
            Ayushman card accepted
          </Badge>
          {isSampleDirectory ? <Badge variant="neutral">Sample listing</Badge> : null}
          {/* Phones get the distance as a wrapping badge; larger screens get
              the box on the right. */}
          {hospital.distance != null ? (
            <Badge variant="brand" className="sm:hidden">
              <Icon name="mapPin" size={13} />
              {formatDistance(hospital.distance)} from {originLabel}
            </Badge>
          ) : null}
        </div>

        {hospital.distance != null ? (
          <div className="hidden shrink-0 rounded-2xl bg-ink-50 px-3 py-2 text-right ring-1 ring-ink-100 ring-inset sm:block">
            <p className="font-display text-lg leading-none font-extrabold text-ink-900 tabular-nums">
              {formatDistance(hospital.distance)}
            </p>
            <p className="mt-1 text-[0.6875rem] font-medium whitespace-nowrap text-ink-500">
              from {originLabel}
            </p>
          </div>
        ) : null}
      </div>

      <h3 className="mt-3 font-display text-lg leading-snug font-bold text-ink-900">
        {hospital.name}
      </h3>
      <p className="mt-1 flex items-start gap-1.5 text-sm text-ink-500">
        <Icon name="mapPin" size={15} className="mt-0.5 shrink-0 text-ink-400" />
        {hospital.area}, {hospital.city}, {hospital.state}
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {hospital.specialities.map((speciality) => (
          <li
            key={speciality}
            className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-ink-600 ring-1 ring-ink-200 ring-inset"
          >
            {speciality}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-600">
        {dialable ? (
          <a
            href={telHref}
            className="flex items-center gap-1.5 font-semibold text-brand-700 hover:text-brand-800"
          >
            <Icon name="phone" size={15} />
            {hospital.phone}
          </a>
        ) : (
          <span className="flex items-center gap-1.5 font-semibold text-ink-800">
            <Icon name="phone" size={15} className="text-brand-600" />
            {hospital.phone}
            <span className="font-normal text-ink-400">(sample)</span>
          </span>
        )}
        {hospital.emergency24x7 ? (
          <span className="flex items-center gap-1.5">
            <Icon name="clock" size={15} className="text-ink-400" />
            24×7 emergency
          </span>
        ) : null}
        {hospital.bloodBank ? (
          <span className="flex items-center gap-1.5">
            <Icon name="droplet" size={15} className="text-emergency-600" />
            Blood bank on site
          </span>
        ) : null}
        <span className="flex items-center gap-1.5">
          <Icon name="building" size={15} className="text-ink-400" />
          {hospital.beds} beds
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5">
        <Button
          size="sm"
          variant="emergency"
          icon="ambulance"
          iconPosition="left"
          onClick={() => onBook('ambulance', hospital)}
        >
          Book ambulance
        </Button>
        <Button
          size="sm"
          variant="emergencySoft"
          icon="droplet"
          iconPosition="left"
          onClick={() => onBook('blood', hospital)}
        >
          Request blood
        </Button>
        {dialable ? (
          <Button
            size="sm"
            variant="outline"
            href={telHref}
            icon="phone"
            iconPosition="left"
          >
            Call hospital
          </Button>
        ) : null}
      </div>
    </article>
  )
}
