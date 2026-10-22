import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { TONES } from '../../data/services'

const SIZES = {
  sm: { box: 'h-9 w-9 rounded-xl', icon: 17 },
  md: { box: 'h-11 w-11 rounded-2xl', icon: 21 },
  lg: { box: 'h-14 w-14 rounded-2xl', icon: 26 },
}

/** An icon on a soft tinted tile in one of the service tones. */
export default function IconChip({ icon, tone = 'brand', size = 'md', className }) {
  const { box, icon: iconSize } = SIZES[size] ?? SIZES.md

  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center ring-1 ring-inset',
        box,
        TONES[tone]?.chip ?? TONES.brand.chip,
        className
      )}
    >
      <Icon name={icon} size={iconSize} />
    </span>
  )
}
