import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Frames to keep looking for a hash target while a lazy page loads (~2s). */
const MAX_HASH_ATTEMPTS = 120

/**
 * Resets scroll position on navigation.
 *
 * A single-page app keeps the scroll offset across route changes by default,
 * so without this you land halfway down a freshly-opened page. Links with a
 * hash (e.g. /partners#register) scroll to that section instead, retrying for
 * a moment because the target page may still be loading.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      return undefined
    }

    const id = decodeURIComponent(hash.slice(1))
    let attempts = 0
    let frame = 0

    const scrollToTarget = () => {
      const target = document.getElementById(id)
      if (target) {
        target.scrollIntoView()
        return
      }
      if (attempts++ < MAX_HASH_ATTEMPTS)
        frame = window.requestAnimationFrame(scrollToTarget)
    }

    frame = window.requestAnimationFrame(scrollToTarget)
    return () => window.cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}
