import StaggerGroup from '@/components/motion/StaggerGroup'
import StaggerItem from '@/components/motion/StaggerItem'
import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { TONES } from '../../data/services'

const COLUMNS = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

/** Icon + title + text tiles that rise in sequence and lift on hover. */
export default function FeatureGrid({
  features,
  tone = 'brand',
  columns = 3,
  className,
}) {
  const chip = (TONES[tone] ?? TONES.brand).chip

  return (
    <StaggerGroup
      className={cn('grid gap-5', COLUMNS[columns], className)}
      stagger={0.06}
    >
      {features.map((feature) => (
        <StaggerItem
          key={feature.title}
          variant="rise"
          className="group rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 transition-[box-shadow,translate] duration-500 ring-inset hover:-translate-y-1 hover:shadow-card-hover sm:p-7"
        >
          <span
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-inset transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6',
              chip
            )}
          >
            <Icon name={feature.icon} size={22} />
          </span>
          <h3 className="mt-5 font-display text-lg font-bold">{feature.title}</h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-500">
            {feature.text}
          </p>
        </StaggerItem>
      ))}
    </StaggerGroup>
  )
}
