import { motion } from 'motion/react'
import { pageTransition } from './variants'

/**
 * Wraps a route's content so each page fades in instead of hard-cutting.
 * LandingLayout keys it on the pathname, so it replays on every navigation.
 */
export default function PageTransition({ children, className }) {
  return (
    <motion.div
      className={className}
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
    >
      {children}
    </motion.div>
  )
}
