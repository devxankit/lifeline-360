import Reveal from '@/components/motion/Reveal'
import { cn } from '@/lib/cn'

/**
 * Eyebrow + heading + optional lede, reused by every section.
 *
 * `as` defaults to h2 — pages render their single <h1> in the page hero, so
 * sections below never add a second one.
 */
export default function SectionHeading({
  as = 'h2',
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'light',
  className,
  children,
}) {
  const Heading = as
  const centered = align === 'center'
  const dark = tone === 'dark'

  return (
    <Reveal
      className={cn(
        'flex flex-col gap-4',
        centered && 'mx-auto max-w-3xl items-center text-center',
        className
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            'inline-flex items-center gap-2 text-[0.8125rem] font-semibold tracking-[0.14em] uppercase',
            dark ? 'text-aqua-300' : 'text-brand-700'
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              dark ? 'bg-aqua-300' : 'bg-aqua-500'
            )}
          />
          {eyebrow}
        </span>
      ) : null}

      <Heading className={cn('text-display-sm sm:text-display-md', dark && 'text-white')}>
        {title}
      </Heading>

      {description ? (
        <p
          className={cn(
            'max-w-2xl text-base leading-relaxed sm:text-lg',
            dark ? 'text-white/70' : 'text-ink-500'
          )}
        >
          {description}
        </p>
      ) : null}

      {children}
    </Reveal>
  )
}
