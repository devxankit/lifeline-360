import { lazy, Suspense, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Icon from '@/components/ui/Icon'
import { EASE_OUT } from '@/components/motion/variants'
import { useDialog } from '@/hooks/useDialog'

// Loaded when a booking opens, so the form and validation libraries stay out
// of the home page bundle.
const AmbulanceBookingForm = lazy(() => import('../forms/AmbulanceBookingForm'))
const BloodRequestForm = lazy(() => import('../forms/BloodRequestForm'))

const KINDS = {
  ambulance: {
    title: 'Book an ambulance',
    icon: 'ambulance',
    Form: AmbulanceBookingForm,
  },
  blood: { title: 'Request blood', icon: 'droplet', Form: BloodRequestForm },
}

/**
 * Booking sheet opened from a hospital card: a bottom sheet on phones, a
 * centred dialog on larger screens.
 *
 * Portalled to <body> so no transformed ancestor (the scroll-reveal and page
 * transition wrappers) can trap its fixed positioning.
 *
 * @param {{kind: 'ambulance'|'blood', hospital: Object} | null} props.booking
 */
export default function BookingDialog({ booking, onClose }) {
  const panelRef = useRef(null)
  const closeButtonRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const open = Boolean(booking)

  useDialog({ open, onClose, panelRef, initialFocusRef: closeButtonRef })

  if (typeof document === 'undefined') return null

  const kind = booking ? KINDS[booking.kind] : null

  return createPortal(
    <AnimatePresence>
      {booking ? (
        <div className="fixed inset-0 z-80 flex items-end justify-center sm:items-center sm:p-6">
          <motion.button
            type="button"
            aria-label="Close"
            tabIndex={-1}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 h-full w-full cursor-default bg-ink-950/55 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-dialog-title"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 32 }}
            transition={{ duration: 0.32, ease: EASE_OUT }}
            className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-4xl bg-white shadow-2xl sm:rounded-4xl"
          >
            <div className="flex items-center gap-3.5 border-b border-ink-100 px-6 py-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emergency-600 text-white">
                <Icon name={kind.icon} size={21} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="booking-dialog-title" className="font-display text-lg font-bold">
                  {kind.title}
                </h2>
                <p className="truncate text-sm text-ink-500">{booking.hospital.name}</p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-800"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6">
              <Suspense fallback={<FormPlaceholder />}>
                <kind.Form hospital={booking.hospital} />
              </Suspense>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  )
}

/** Shimmering stand-ins for the form fields while the form loads. */
function FormPlaceholder() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-5">
      <div className="skeleton h-20 rounded-2xl" />
      <div className="skeleton h-14 rounded-2xl" />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="skeleton h-14 rounded-2xl" />
        <div className="skeleton h-14 rounded-2xl" />
      </div>
      <div className="skeleton h-13 rounded-full" />
    </div>
  )
}
