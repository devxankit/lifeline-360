import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import Container from '@/components/ui/Container'
import Icon from '@/components/ui/Icon'
import Photo from '@/components/ui/Photo'
import { EASE_OUT, staggerContainer } from '@/components/motion/variants'
import { cn } from '@/lib/cn'

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
}

/**
 * Hero band for every inner page: breadcrumb, the page's single <h1>, a lede
 * and actions, with an optional framed photo on the right. `aside` floats over
 * the photo (status cards, availability tiles…).
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.eyebrow]
 * @param {string} [props.description]
 * @param {Array<{label: string, to?: string}>} [props.breadcrumbs]
 * @param {string} [props.image]
 * @param {string} [props.imageAlt]
 * @param {string} [props.imagePosition]
 * @param {React.ReactNode} [props.actions]
 * @param {React.ReactNode} [props.aside]
 * @param {React.ReactNode} [props.visual] - custom right-hand art in place of a photo
 */
export default function PageHero({
  title,
  eyebrow,
  description,
  breadcrumbs = [],
  image,
  imageAlt = '',
  imagePosition,
  actions,
  aside,
  visual,
  children,
}) {
  const hasArt = Boolean(image || visual)

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-brand-50/80 via-white to-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-dots opacity-60 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -top-32 right-[-8%] h-[30rem] w-[30rem] rounded-full bg-aqua-200/35 blur-3xl"
      />

      <Container
        width="wide"
        className={cn(
          'relative grid items-center gap-12 py-14 sm:py-20',
          hasArt && 'lg:grid-cols-12 lg:gap-10'
        )}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.08)}
          className={cn('flex flex-col gap-6', hasArt ? 'lg:col-span-6' : 'max-w-3xl')}
        >
          {breadcrumbs.length ? (
            <motion.nav variants={item} aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
                {breadcrumbs.map((crumb, index) => (
                  <li key={crumb.label} className="flex items-center gap-1.5">
                    {index > 0 ? (
                      <Icon name="chevronRight" size={14} className="text-ink-300" />
                    ) : null}
                    {crumb.to ? (
                      <Link
                        to={crumb.to}
                        className="transition-colors hover:text-brand-700"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="font-medium text-ink-800">
                        {crumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </motion.nav>
          ) : null}

          {eyebrow ? (
            <motion.span
              variants={item}
              className="inline-flex items-center gap-2 self-start rounded-full bg-white px-3.5 py-1.5 text-[0.8125rem] font-semibold text-brand-700 shadow-card ring-1 ring-brand-100 ring-inset"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-aqua-500" />
              {eyebrow}
            </motion.span>
          ) : null}

          <motion.h1 variants={item} className="text-display-md sm:text-display-lg">
            {title}
          </motion.h1>

          {description ? (
            <motion.p
              variants={item}
              className="max-w-2xl text-lg leading-relaxed text-ink-500 sm:text-xl sm:leading-relaxed"
            >
              {description}
            </motion.p>
          ) : null}

          {actions ? (
            <motion.div
              variants={item}
              className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center"
            >
              {actions}
            </motion.div>
          ) : null}

          {children ? <motion.div variants={item}>{children}</motion.div> : null}
        </motion.div>

        {hasArt ? (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.15 }}
            className="relative lg:col-span-6"
          >
            {visual ?? (
              <Photo
                src={image}
                alt={imageAlt}
                priority
                position={imagePosition}
                className="aspect-[4/3] rounded-5xl shadow-float"
              />
            )}
            {aside}
          </motion.div>
        ) : null}
      </Container>
    </section>
  )
}
