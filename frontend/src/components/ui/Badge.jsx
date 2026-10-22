import { cn } from '@/lib/cn'

const VARIANTS = {
  neutral: 'bg-ink-100 text-ink-700 ring-ink-200',
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  aqua: 'bg-aqua-50 text-aqua-800 ring-aqua-200',
  emergency: 'bg-emergency-50 text-emergency-700 ring-emergency-200',
  success: 'bg-success-soft text-success ring-success/25',
  warning: 'bg-warning-soft text-warning ring-warning/25',
  onDark: 'bg-white/10 text-white/85 ring-white/20',
}

/** Small status pill. */
export default function Badge({ variant = 'neutral', className, children, ...rest }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        VARIANTS[variant] ?? VARIANTS.neutral,
        className
      )}
      {...rest}
    >
      {children}
    </span>
  )
}
