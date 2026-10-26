import { AnimatePresence, motion } from 'motion/react'
import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

const IDLE_TONES = {
  brand: 'bg-brand-600 shadow-glow hover:bg-brand-700',
  emergency: 'bg-emergency-600 shadow-glow-emergency hover:bg-emergency-700',
}

/**
 * Submit button that animates through idle → submitting → success/error,
 * so the outcome shows right where the visitor is looking.
 *
 * @param {'idle'|'submitting'|'success'|'error'} props.state
 * @param {'brand'|'emergency'} [props.tone='brand'] - idle colour; emergency
 *        is for ambulance and blood requests
 */
export default function SubmitButton({
  state = 'idle',
  idleLabel = 'Send message',
  submittingLabel = 'Sending…',
  successLabel = 'Sent',
  errorLabel = 'Try again',
  tone = 'brand',
  fullWidth = false,
  className,
  ...rest
}) {
  const isBusy = state === 'submitting'

  const content = {
    idle: { label: idleLabel, icon: 'arrowRight' },
    submitting: { label: submittingLabel, icon: 'spinner' },
    success: { label: successLabel, icon: 'check' },
    error: { label: errorLabel, icon: 'alert' },
  }[state]

  return (
    <motion.button
      type="submit"
      disabled={isBusy}
      aria-busy={isBusy}
      whileHover={isBusy ? undefined : { scale: 1.02 }}
      whileTap={isBusy ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={cn(
        'relative inline-flex h-13 items-center justify-center gap-2.5 overflow-hidden rounded-full px-8 text-base font-semibold text-white transition-colors duration-300',
        'disabled:cursor-wait',
        state === 'success'
          ? 'bg-success'
          : state === 'error'
            ? 'bg-danger'
            : (IDLE_TONES[tone] ?? IDLE_TONES.brand),
        fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={state}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="flex items-center gap-2.5"
        >
          <span>{content.label}</span>
          <Icon
            name={content.icon}
            size={18}
            className={isBusy ? 'animate-spin' : undefined}
          />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
