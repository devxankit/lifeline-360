import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

const PLATFORMS = [
  { id: 'android', label: 'Android' },
  { id: 'ios', label: 'iOS' },
]

/**
 * App availability badges. The apps aren't published yet, so these are
 * labelled "Coming soon" and are not links; swap them for the official store
 * badges and URLs once the listings are live.
 */
export default function StoreBadges({ tone = 'light', className }) {
  const dark = tone === 'dark'

  return (
    <ul className={cn('flex flex-wrap gap-3', className)}>
      {PLATFORMS.map((platform) => (
        <li
          key={platform.id}
          className={cn(
            'flex min-w-[9.5rem] items-center gap-3 rounded-2xl px-4 py-2.5 ring-1 ring-inset transition-transform duration-300 hover:-translate-y-0.5',
            dark
              ? 'bg-white/8 text-white ring-white/15'
              : 'bg-ink-900 text-white ring-ink-900'
          )}
        >
          <Icon name="smartphone" size={22} className="text-aqua-300" />
          <span className="flex flex-col leading-tight">
            <span className="text-[0.6875rem] font-medium tracking-wide text-white/60 uppercase">
              Coming soon on
            </span>
            <span className="font-display text-base font-bold">{platform.label}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
