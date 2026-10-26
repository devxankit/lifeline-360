import { useEffect, useRef } from 'react'
import { useLockBodyScroll } from './useLockBodyScroll'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Modal behaviour shared by the mobile menu and the booking dialog: locks page
 * scroll, moves focus into the panel, keeps Tab inside it, closes on Escape
 * and hands focus back to whatever opened it.
 *
 * @param {Object} options
 * @param {boolean} options.open
 * @param {() => void} options.onClose
 * @param {React.RefObject<HTMLElement>} options.panelRef
 * @param {React.RefObject<HTMLElement>} [options.initialFocusRef] - defaults to
 *        the first focusable element in the panel
 */
export function useDialog({ open, onClose, panelRef, initialFocusRef }) {
  // Kept in a ref so a new onClose identity each render doesn't re-run the
  // effect (which would bounce focus back and forth).
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return undefined

    const previouslyFocused = document.activeElement
    const initial = initialFocusRef?.current ?? panelRef.current?.querySelector(FOCUSABLE)
    initial?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = panelRef.current.querySelectorAll(FOCUSABLE)
      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [open, panelRef, initialFocusRef])
}
