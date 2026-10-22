import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'
import { EASE_OUT } from '@/components/motion/variants'

/**
 * Counts up to `value` the first time it scrolls into view. Screen readers
 * get the final number straight away.
 */
export default function CountUp({ value, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const prefersReducedMotion = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return undefined
    if (prefersReducedMotion) {
      setDisplay(value)
      return undefined
    }

    const controls = animate(0, value, {
      duration: 1.1,
      ease: EASE_OUT,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
  }, [inView, value, prefersReducedMotion])

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="tabular-nums">
        {display}
      </span>
    </span>
  )
}
