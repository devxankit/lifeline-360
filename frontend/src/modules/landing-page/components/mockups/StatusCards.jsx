import { motion } from 'motion/react'
import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

/**
 * Small app-notification cards that float over photography to show real
 * moments from the product: an ambulance on its way, a confirmed nurse visit,
 * a lab report arriving. Names and figures are illustrative.
 */

export function AmbulanceEtaCard({ className }) {
  return (
    <div className={cn('glass w-[17rem] rounded-2xl p-4 shadow-float', className)}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emergency-600 text-white">
          <Icon name="ambulance" size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.8125rem] font-semibold text-ink-900">
            Ambulance on the way
          </p>
          <p className="text-xs text-ink-500">Driver assigned · 2.4 km</p>
        </div>
        <div className="text-right">
          <p className="font-display text-xl leading-none font-extrabold text-ink-900 tabular-nums">
            7
          </p>
          <p className="text-[0.625rem] font-semibold tracking-wide text-ink-500 uppercase">
            min
          </p>
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-100">
        <motion.div
          className="h-full w-full origin-left rounded-full bg-linear-to-r from-emergency-600 to-emergency-400"
          initial={{ scaleX: 0.2 }}
          animate={{ scaleX: 0.74 }}
          transition={{
            duration: 5,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </div>
    </div>
  )
}

export function CareBookingCard({ className }) {
  return (
    <div className={cn('glass w-[16.5rem] rounded-2xl p-4 shadow-float', className)}>
      <p className="flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-wide text-success uppercase">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        Booking confirmed
      </p>
      <div className="mt-2.5 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-aqua-400 to-brand-500 font-display text-sm font-bold text-white">
          PN
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-[0.8125rem] font-semibold text-ink-900">
            Priya N.
            <Icon
              name="badgeCheck"
              size={14}
              className="text-brand-600"
              title="Verified"
            />
          </p>
          <p className="text-xs text-ink-500">Home nursing · Today, 4:30 PM</p>
        </div>
      </div>
    </div>
  )
}

export function PmjayHospitalCard({ className }) {
  return (
    <div className={cn('glass w-[16.5rem] rounded-2xl p-4 shadow-float', className)}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
          <Icon name="hospital" size={20} />
        </span>
        <div className="min-w-0">
          <p className="text-[0.8125rem] font-semibold text-ink-900">
            Ayushman card accepted
          </p>
          <p className="text-xs text-ink-500">PM-JAY hospital · 2.1 km away</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-center text-[0.6875rem] font-semibold">
        <span className="rounded-lg bg-emergency-600 px-2 py-1.5 text-white">
          Book ambulance
        </span>
        <span className="rounded-lg bg-emergency-50 px-2 py-1.5 text-emergency-700 ring-1 ring-emergency-100 ring-inset">
          Request blood
        </span>
      </div>
    </div>
  )
}

export function LabReportCard({ className }) {
  return (
    <div className={cn('glass w-[15rem] rounded-2xl p-4 shadow-float', className)}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-aqua-50 text-aqua-700 ring-1 ring-aqua-100 ring-inset">
          <Icon name="fileHeart" size={20} />
        </span>
        <div className="min-w-0">
          <p className="text-[0.8125rem] font-semibold text-ink-900">
            Your report is ready
          </p>
          <p className="text-xs text-ink-500">Complete blood count</p>
        </div>
      </div>
      <p className="mt-3 flex items-center justify-between rounded-xl bg-ink-50 px-3 py-2 text-xs font-medium text-ink-700">
        <span className="flex items-center gap-1.5">
          <Icon name="home" size={13} />
          Sample collected at home
        </span>
        <Icon name="checkCircle" size={14} className="text-success" />
      </p>
    </div>
  )
}

const ORDER_STAGES = ['Accepted', 'Prepared', 'Out for delivery']

export function MedicineOrderCard({ className }) {
  return (
    <div className={cn('glass w-[16rem] rounded-2xl p-4 shadow-float', className)}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
          <Icon name="packageCheck" size={20} />
        </span>
        <div className="min-w-0">
          <p className="text-[0.8125rem] font-semibold text-ink-900">
            Order out for delivery
          </p>
          <p className="text-xs text-ink-500">Prescription order · 3 items</p>
        </div>
      </div>
      <ol className="mt-3 flex items-center gap-1.5">
        {ORDER_STAGES.map((stage) => (
          <li key={stage} className="flex-1">
            <span className="block h-1.5 rounded-full bg-brand-500" />
            <span className="mt-1.5 block text-[0.625rem] font-semibold text-ink-500">
              {stage}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

const BARS = [0.45, 0.8, 0.55, 1, 0.65, 0.9, 0.5, 0.75, 0.4, 0.85, 0.6, 0.7]

export function MaskedCallCard({ className }) {
  return (
    <div className={cn('glass w-[15.5rem] rounded-2xl p-4 shadow-float', className)}>
      <div className="flex items-center gap-3">
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-ping-soft rounded-full bg-brand-500"
          />
          <Icon name="phoneCall" size={18} className="relative" />
        </span>
        <div className="min-w-0">
          <p className="text-[0.8125rem] font-semibold text-ink-900">
            Calling your driver
          </p>
          <p className="text-xs text-ink-500 tabular-nums">+91 ••••• ••210 · masked</p>
        </div>
      </div>
      <div aria-hidden="true" className="mt-3 flex h-6 items-center gap-1">
        {BARS.map((height, index) => (
          <motion.span
            key={index}
            className="w-1.5 origin-center rounded-full bg-brand-300"
            style={{ height: '100%' }}
            initial={{ scaleY: height * 0.5 }}
            animate={{ scaleY: [height * 0.5, height, height * 0.35] }}
            transition={{
              duration: 1.1 + (index % 4) * 0.2,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  )
}

/** Units per blood group, purely illustrative. */
const BLOOD_STOCK = [
  ['A+', 12],
  ['A−', 3],
  ['B+', 9],
  ['B−', 2],
  ['AB+', 5],
  ['AB−', 1],
  ['O+', 14],
  ['O−', 4],
]

export function BloodAvailabilityCard({ className }) {
  return (
    <div className={cn('glass w-[17.5rem] rounded-2xl p-4 shadow-float', className)}>
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-[0.8125rem] font-semibold text-ink-900">
          <Icon name="droplet" size={15} className="text-emergency-600" />
          Units available
        </p>
        <span className="text-[0.625rem] font-semibold tracking-wide text-ink-400 uppercase">
          Sample
        </span>
      </div>
      <ul className="mt-3 grid grid-cols-4 gap-2">
        {BLOOD_STOCK.map(([group, units]) => (
          <li
            key={group}
            className={cn(
              'rounded-xl px-1 py-2 text-center ring-1 ring-inset',
              units <= 2 ? 'bg-warning-soft ring-warning/20' : 'bg-white ring-ink-100'
            )}
          >
            <p className="font-display text-sm font-extrabold text-emergency-700">
              {group}
            </p>
            <p className="text-[0.6875rem] text-ink-500 tabular-nums">{units} units</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
