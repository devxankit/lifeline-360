import { AnimatePresence, motion } from 'motion/react'
import { useId } from 'react'
import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

/**
 * Select styled to sit beside FloatingField: same height, border, focus ring
 * and error treatment, with the label resting at the top edge.
 *
 * The empty placeholder option is `required`-invalid, which greys the text
 * until a real choice is made (forms use noValidate, so the browser never
 * blocks on it). React 19 passes `ref` as an ordinary prop, so React Hook
 * Form's register() spread works directly.
 *
 * @param {Array<{value: string, label: string}>} props.options
 */
export default function SelectField({
  label,
  options,
  placeholder = 'Select an option',
  error,
  className,
  ref,
  ...field
}) {
  const generatedId = useId()
  const id = field.id ?? `${field.name ?? 'select'}-${generatedId}`
  const errorId = `${id}-error`

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="relative">
        <select
          {...field}
          ref={ref}
          id={id}
          required
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'peer h-14 w-full cursor-pointer rounded-2xl border bg-white pt-5 pr-11 pb-1 pl-4 text-base text-ink-900 transition-all duration-200',
            'invalid:text-ink-400 focus:ring-4 focus:outline-none [&_option]:text-ink-900',
            error
              ? 'border-danger focus:border-danger focus:ring-danger/15'
              : 'border-ink-200 hover:border-ink-300 focus:border-brand-500 focus:ring-brand-500/12'
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label
          htmlFor={id}
          className={cn(
            'pointer-events-none absolute top-2 left-4 text-xs font-medium',
            error ? 'text-danger' : 'text-ink-400 peer-focus:text-brand-700'
          )}
        >
          {label}
        </label>
        <Icon
          name="chevronDown"
          size={18}
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-400 transition-transform peer-focus:rotate-180"
        />
      </div>

      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            id={errorId}
            role="alert"
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden px-1 text-xs text-danger"
          >
            <span className="mt-1.5 flex items-center gap-1.5">
              <Icon name="alert" size={13} />
              {error}
            </span>
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
