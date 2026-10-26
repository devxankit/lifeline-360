import StaggerGroup from '@/components/motion/StaggerGroup'
import StaggerItem from '@/components/motion/StaggerItem'
import { cn } from '@/lib/cn'
import { serviceTiles } from '../../data/services'
import ServiceCard from './ServiceCard'

/**
 * Seven tiles (six services + membership) arranged so every row is full:
 *   lg (3 columns): hospital finder (2) + ambulance | 3 services | blood bank + membership (2)
 *   sm (2 columns): hospital finder (2) | then pairs
 */
const PLACEMENT = {
  'ayushman-hospitals': { span: 'sm:col-span-2', wide: 'sm' },
  membership: { span: 'lg:col-span-2', wide: 'lg' },
}

export default function ServiceGrid({ className }) {
  return (
    <StaggerGroup
      className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}
      stagger={0.07}
    >
      {serviceTiles.map((service) => {
        const placement = PLACEMENT[service.slug]

        return (
          <StaggerItem
            key={service.slug}
            variant="rise"
            className={cn('h-full', placement?.span)}
          >
            <ServiceCard service={service} wide={placement?.wide} />
          </StaggerItem>
        )
      })}
    </StaggerGroup>
  )
}
