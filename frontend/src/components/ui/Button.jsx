import { Link } from 'react-router-dom'
import { motionComponent } from '@/components/motion/motionComponent'
import { cn } from '@/lib/cn'
import Icon from './Icon'

const VARIANTS = {
  primary: 'bg-brand-600 text-white shadow-glow hover:bg-brand-700',
  emergency: 'bg-emergency-600 text-white shadow-glow-emergency hover:bg-emergency-700',
  emergencySoft:
    'bg-emergency-50 text-emergency-700 ring-1 ring-emergency-200 ring-inset hover:bg-emergency-100',
  soft: 'bg-brand-50 text-brand-700 ring-1 ring-brand-100 ring-inset hover:bg-brand-100',
  dark: 'bg-ink-900 text-white hover:bg-ink-800',
  outline:
    'border border-ink-200 bg-white text-ink-800 hover:border-brand-300 hover:bg-brand-50/60 hover:text-brand-700',
  ghost: 'text-ink-700 hover:bg-ink-100 hover:text-ink-900',
  light: 'bg-white text-ink-900 hover:bg-brand-50',
  onDark: 'border border-white/25 text-white hover:border-white/50 hover:bg-white/10',
}

const SIZES = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-5 text-[0.9375rem] gap-2',
  lg: 'h-13 px-7 text-base gap-2.5',
}

/** Icons that point somewhere nudge in that direction on hover. */
const NUDGE = {
  arrowRight: 'group-hover/btn:translate-x-0.5',
  arrowUpRight: 'group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5',
  chevronRight: 'group-hover/btn:translate-x-0.5',
}

const MotionLink = motionComponent(Link)
const MotionA = motionComponent('a')
const MotionButton = motionComponent('button')

/**
 * Button / link with hover + press micro-interactions.
 *
 * Renders a react-router <Link> when given `to`, an <a> when given `href`
 * (external hrefs get target/rel and a ↗ affordance automatically), and a
 * <button> otherwise.
 */
export default function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  fullWidth = false,
  className,
  children,
  ...rest
}) {
  const isExternal = Boolean(href && /^https?:\/\//i.test(href))
  const resolvedIcon = icon ?? (isExternal ? 'arrowUpRight' : undefined)
  const iconSize = size === 'lg' ? 19 : 17

  const classes = cn(
    'group/btn inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap transition-colors duration-200',
    'disabled:pointer-events-none disabled:opacity-60',
    VARIANTS[variant] ?? VARIANTS.primary,
    SIZES[size] ?? SIZES.md,
    fullWidth && 'w-full',
    className
  )

  // Scale-only hover/press — no layout thrash, and MotionConfig strips these
  // automatically for prefers-reduced-motion users.
  const interactions = {
    whileHover: { scale: 1.025 },
    whileTap: { scale: 0.975 },
    transition: { type: 'spring', stiffness: 400, damping: 28 },
  }

  const iconNode = resolvedIcon ? (
    <Icon
      name={resolvedIcon}
      size={iconSize}
      className={cn('transition-transform duration-200', NUDGE[resolvedIcon])}
    />
  ) : null

  const content = (
    <>
      {iconPosition === 'left' ? iconNode : null}
      <span>{children}</span>
      {iconPosition === 'right' ? iconNode : null}
    </>
  )

  if (to) {
    return (
      <MotionLink to={to} className={classes} {...interactions} {...rest}>
        {content}
      </MotionLink>
    )
  }

  if (href) {
    return (
      <MotionA
        href={href}
        className={classes}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        {...interactions}
        {...rest}
      >
        {content}
      </MotionA>
    )
  }

  return (
    <MotionButton type="button" className={classes} {...interactions} {...rest}>
      {content}
    </MotionButton>
  )
}
