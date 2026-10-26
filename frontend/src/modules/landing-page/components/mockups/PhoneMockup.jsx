import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { TONES } from '../../data/services'

const TILES = [
  { label: 'Hospitals', icon: 'hospital', tone: 'brand' },
  { label: 'Ambulance', icon: 'ambulance', tone: 'emergency' },
  { label: 'Nursing', icon: 'handHeart', tone: 'aqua' },
  { label: 'Medicine', icon: 'pill', tone: 'brand' },
  { label: 'Lab tests', icon: 'flask', tone: 'aqua' },
  { label: 'Blood bank', icon: 'droplet', tone: 'emergency' },
]

/**
 * The user app's home screen, built in HTML so it stays crisp at any size:
 * a language switch (Hindi/English), the emergency shortcut, every service one
 * tap away and the latest update. The greeting name is sample data.
 */
export default function PhoneMockup({ className }) {
  return (
    <div
      role="img"
      aria-label="Preview of the Lifeline 360 app home screen with all services"
      className={cn(
        'relative w-[16.5rem] rounded-[2.75rem] bg-ink-900 p-2.5 shadow-float ring-1 ring-white/10',
        className
      )}
    >
      <div className="relative overflow-hidden rounded-[2.2rem] bg-ink-50">
        <div className="absolute top-2.5 left-1/2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-ink-900" />

        <div className="flex flex-col gap-3.5 px-4 pt-11 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.625rem] font-medium text-ink-500">Good morning</p>
              <p className="font-display text-sm font-bold text-ink-900">Aarav</p>
            </div>
            <span className="flex items-center rounded-full bg-white p-0.5 text-[0.625rem] font-bold ring-1 ring-ink-200">
              <span className="rounded-full bg-brand-600 px-2 py-0.5 text-white">EN</span>
              <span className="px-2 py-0.5 text-ink-600">हिं</span>
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-emergency-600 p-3 text-white shadow-glow-emergency">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Icon name="ambulance" size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold">Need an ambulance?</p>
              <p className="text-[0.625rem] text-white/80">
                Request now and track it live
              </p>
            </div>
            <Icon name="chevronRight" size={16} />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {TILES.map((tile) => (
              <div
                key={tile.label}
                className="flex flex-col items-center gap-1.5 rounded-xl bg-white px-1 py-2.5 shadow-[0_1px_2px_rgb(18_27_45/0.06)]"
              >
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-inset',
                    TONES[tile.tone].chip
                  )}
                >
                  <Icon name={tile.icon} size={16} />
                </span>
                <span className="text-[0.625rem] font-semibold text-ink-700">
                  {tile.label}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-white p-3 shadow-[0_1px_2px_rgb(18_27_45/0.06)]">
            <p className="text-[0.625rem] font-semibold tracking-wide text-ink-400 uppercase">
              Latest update
            </p>
            <div className="mt-2 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-aqua-50 text-aqua-700">
                <Icon name="fileHeart" size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.6875rem] font-bold text-ink-900">
                  Lab report ready
                </p>
                <p className="text-[0.625rem] text-ink-500">Complete blood count</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-success" />
            </div>
          </div>

          <div className="mt-1 flex items-center justify-around rounded-2xl bg-white py-2.5 text-ink-400 shadow-[0_1px_2px_rgb(18_27_45/0.06)]">
            <Icon name="home" size={17} className="text-brand-600" />
            <Icon name="clipboardList" size={17} />
            <Icon name="bell" size={17} />
            <Icon name="user" size={17} />
          </div>
        </div>
      </div>
    </div>
  )
}
