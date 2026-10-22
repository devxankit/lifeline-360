import { Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/cn'
import { serviceMenu } from '../data/navigation'
import { TONES } from '../data/services'

/** Desktop "Services" dropdown: every service with a one-line summary. */
export default function ServicesMenu({ onNavigate }) {
  return (
    <div className="w-[min(46rem,calc(100vw-3rem))] overflow-hidden rounded-3xl border border-ink-200/80 bg-white shadow-float">
      <ul className="grid grid-cols-2 gap-1 p-3">
        {serviceMenu.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              onClick={onNavigate}
              className="group/item flex items-start gap-3.5 rounded-2xl p-3.5 transition-colors hover:bg-ink-50"
            >
              <span
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset transition-transform duration-300 group-hover/item:scale-110',
                  TONES[item.tone].chip
                )}
              >
                <Icon name={item.icon} size={20} />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1 font-display text-[0.9375rem] font-bold text-ink-900">
                  {item.label}
                  <Icon
                    name="arrowRight"
                    size={14}
                    className="-translate-x-1 text-brand-600 opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100"
                  />
                </span>
                <span className="mt-0.5 line-clamp-2 block text-[0.8125rem] leading-snug text-ink-500">
                  {item.description}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-4 border-t border-ink-100 bg-ink-50/70 px-6 py-3.5 text-sm">
        <Link
          to="/services"
          onClick={onNavigate}
          className="group/all inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:text-brand-800"
        >
          View all services
          <Icon
            name="arrowRight"
            size={15}
            className="transition-transform group-hover/all:translate-x-0.5"
          />
        </Link>
        <p className="flex items-center gap-1.5 text-ink-500">
          <Icon name="siren" size={15} className="text-emergency-600" />
          Life-threatening emergency? Call
          <span className="font-semibold text-ink-800">{siteConfig.emergencyNumber}</span>
        </p>
      </div>
    </div>
  )
}
