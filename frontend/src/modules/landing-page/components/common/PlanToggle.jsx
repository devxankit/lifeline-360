import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { membershipPlans } from '../../data/membership'

/**
 * Monthly / annual switch. The pill slides between options and the plan
 * details cross-fade. Shows the price once one is set in data/membership.js,
 * otherwise says pricing is announced at launch.
 */
export default function PlanToggle({ className }) {
  const [planId, setPlanId] = useState('annual')
  const pillId = useId()
  const plan = membershipPlans.find((option) => option.id === planId)

  return (
    <div
      className={cn(
        'rounded-3xl bg-white p-5 ring-1 ring-ink-200/70 ring-inset sm:p-6',
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="radiogroup"
          aria-label="Membership plan"
          className="flex rounded-full bg-ink-100 p-1"
        >
          {membershipPlans.map((option) => {
            const selected = option.id === planId

            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setPlanId(option.id)}
                className={cn(
                  'relative rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300',
                  selected ? 'text-white' : 'text-ink-600 hover:text-ink-900'
                )}
              >
                {selected ? (
                  <motion.span
                    layoutId={pillId}
                    transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                    className="absolute inset-0 rounded-full bg-brand-600 shadow-glow"
                  />
                ) : null}
                <span className="relative">{option.name}</span>
              </button>
            )
          })}
        </div>

        <p className="text-sm text-ink-500">
          {plan.price ? (
            <>
              <span className="font-display text-2xl font-extrabold text-ink-900">
                {plan.price}
              </span>{' '}
              {plan.cadence}
            </>
          ) : (
            <span className="font-semibold text-ink-700">
              Pricing announced at launch
            </span>
          )}
        </p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={planId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="mt-5"
        >
          <p className="text-[0.9375rem] leading-relaxed text-ink-600">
            {plan.description}
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {plan.points.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 text-sm font-medium text-ink-700"
              >
                <Icon name="checkCircle" size={16} className="text-success" />
                {point}
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
