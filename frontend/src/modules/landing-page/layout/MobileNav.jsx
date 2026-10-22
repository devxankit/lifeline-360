import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Logo from '@/components/brand/Logo'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import { EASE_OUT } from '@/components/motion/variants'
import { siteConfig } from '@/config/site'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { cn } from '@/lib/cn'
import { primaryNav, serviceMenu } from '../data/navigation'
import { TONES } from '../data/services'

/**
 * Slide-in navigation for phones and tablets.
 *
 * Escape closes it, Tab stays inside while it's open and focus returns to the
 * menu button afterwards. Services expand in place as an accordion so every
 * service is one tap from the menu.
 */
export default function MobileNav({ open, onClose }) {
  const [servicesOpen, setServicesOpen] = useState(false)
  const panelRef = useRef(null)
  const closeButtonRef = useRef(null)
  const previouslyFocused = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) setServicesOpen(false)
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    previouslyFocused.current = document.activeElement
    closeButtonRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
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
      previouslyFocused.current?.focus?.()
    }
  }, [open, onClose])

  const linkClasses = ({ isActive }) =>
    cn(
      'flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-[1.0625rem] font-bold transition-colors',
      isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-900 hover:bg-ink-50'
    )

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-60 lg:hidden">
          <motion.button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 h-full w-full cursor-default bg-ink-950/50 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.36, ease: EASE_OUT }}
            className="absolute inset-y-0 right-0 flex w-[min(24rem,90vw)] flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
              <Logo onClick={onClose} />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-ink-100"
              >
                <Icon name="close" size={22} />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
              <ul className="flex flex-col gap-1">
                {primaryNav.map((item) =>
                  item.menu ? (
                    <li key={item.id}>
                      <button
                        type="button"
                        aria-expanded={servicesOpen}
                        onClick={() => setServicesOpen((value) => !value)}
                        className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 font-display text-[1.0625rem] font-bold text-ink-900 transition-colors hover:bg-ink-50"
                      >
                        {item.label}
                        <motion.span
                          animate={{ rotate: servicesOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex text-ink-400"
                        >
                          <Icon name="chevronDown" size={18} />
                        </motion.span>
                      </button>

                      <motion.div
                        initial={false}
                        animate={{
                          height: servicesOpen ? 'auto' : 0,
                          opacity: servicesOpen ? 1 : 0,
                        }}
                        transition={{
                          duration: prefersReducedMotion ? 0 : 0.3,
                          ease: EASE_OUT,
                        }}
                        className="overflow-hidden"
                      >
                        <ul className="flex flex-col gap-0.5 px-2 pt-1 pb-2">
                          {serviceMenu.map((service) => (
                            <li key={service.to}>
                              <Link
                                to={service.to}
                                onClick={onClose}
                                tabIndex={servicesOpen ? 0 : -1}
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.9375rem] font-medium text-ink-700 transition-colors hover:bg-ink-50"
                              >
                                <span
                                  className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-inset',
                                    TONES[service.tone].chip
                                  )}
                                >
                                  <Icon name={service.icon} size={16} />
                                </span>
                                {service.label}
                              </Link>
                            </li>
                          ))}
                          <li>
                            <Link
                              to="/services"
                              onClick={onClose}
                              tabIndex={servicesOpen ? 0 : -1}
                              className="flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-brand-700"
                            >
                              View all services
                              <Icon name="arrowRight" size={15} />
                            </Link>
                          </li>
                        </ul>
                      </motion.div>
                    </li>
                  ) : (
                    <li key={item.id}>
                      <NavLink to={item.to} onClick={onClose} className={linkClasses}>
                        {item.label}
                        <Icon name="chevronRight" size={18} className="text-ink-300" />
                      </NavLink>
                    </li>
                  )
                )}
                <li>
                  <NavLink to="/faqs" onClick={onClose} className={linkClasses}>
                    FAQs
                    <Icon name="chevronRight" size={18} className="text-ink-300" />
                  </NavLink>
                </li>
              </ul>
            </nav>

            <div className="flex flex-col gap-3 border-t border-ink-100 bg-ink-50 px-5 py-5">
              <Button
                to="/services/ambulance"
                variant="emergency"
                icon="ambulance"
                iconPosition="left"
                fullWidth
                onClick={onClose}
              >
                Book an ambulance
              </Button>
              <Button to="/#download" variant="outline" fullWidth onClick={onClose}>
                Get the app
              </Button>
              <div className="mt-1 flex flex-col gap-1.5 text-sm text-ink-600">
                <a
                  href={siteConfig.contact.phoneHref}
                  className="flex items-center gap-2.5 hover:text-brand-700"
                >
                  <Icon name="phone" size={15} className="text-ink-400" />
                  {siteConfig.contact.phone}
                </a>
                <a
                  href={siteConfig.contact.emailHref}
                  className="flex items-center gap-2.5 hover:text-brand-700"
                >
                  <Icon name="mail" size={15} className="text-ink-400" />
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
