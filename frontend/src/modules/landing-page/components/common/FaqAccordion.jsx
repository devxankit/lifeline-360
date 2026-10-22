import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Icon from '@/components/ui/Icon'
import { EASE_OUT } from '@/components/motion/variants'
import { cn } from '@/lib/cn'

/**
 * Question/answer list where one answer is open at a time. The plus turns
 * into a close mark as its answer slides open.
 *
 * @param {Array<{q: string, a: string}>} props.items
 * @param {number|null} [props.defaultOpen=0] - index open on first render
 */
export default function FaqAccordion({ items, defaultOpen = 0, className }) {
  const [open, setOpen] = useState(defaultOpen)
  const baseId = useId()

  return (
    <div
      className={cn(
        'divide-y divide-ink-200/80 overflow-hidden rounded-3xl border border-ink-200/80 bg-white',
        className
      )}
    >
      {items.map((item, index) => {
        const isOpen = open === index
        const buttonId = `${baseId}-q-${index}`
        const panelId = `${baseId}-a-${index}`

        return (
          <div
            key={item.q}
            className={cn('transition-colors duration-300', isOpen && 'bg-brand-50/40')}
          >
            <h3 className="font-display">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="group flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-[1.0625rem] font-bold text-ink-900 transition-colors hover:text-brand-700 sm:px-7"
              >
                {item.q}
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300',
                    isOpen
                      ? 'bg-brand-600 text-white'
                      : 'bg-ink-100 text-ink-600 group-hover:bg-brand-100 group-hover:text-brand-700'
                  )}
                >
                  <motion.span
                    className="flex"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: EASE_OUT }}
                  >
                    <Icon name="plus" size={16} strokeWidth={2.25} />
                  </motion.span>
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                  className="overflow-hidden"
                >
                  <p className="max-w-3xl px-6 pb-6 text-base leading-relaxed text-ink-600 sm:px-7">
                    {item.a}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
