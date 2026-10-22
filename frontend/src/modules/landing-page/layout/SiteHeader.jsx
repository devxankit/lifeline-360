import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Logo from '@/components/brand/Logo'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Icon from '@/components/ui/Icon'
import { menuPanel } from '@/components/motion/variants'
import { useScrolled } from '@/hooks/useScrolled'
import { cn } from '@/lib/cn'
import { primaryNav } from '../data/navigation'
import MobileNav from './MobileNav'
import ServicesMenu from './ServicesMenu'

/** Delay before a hover-opened menu closes, so a diagonal mouse path doesn't drop it. */
const CLOSE_DELAY_MS = 140

/**
 * Sticky site header.
 *
 * Condenses and gains a hairline once the page scrolls. On desktop a soft pill
 * follows the pointer across the nav items, and Services opens a panel listing
 * every service. Below `lg` everything moves into the slide-in MobileNav.
 */
export default function SiteHeader() {
  const scrolled = useScrolled(12)
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [hovered, setHovered] = useState(null)
  const closeTimer = useRef(null)
  const servicesRef = useRef(null)

  // Any navigation closes whatever is open.
  useEffect(() => {
    setMenuOpen(false)
    setDrawerOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    const onPointerDown = (event) => {
      if (!servicesRef.current?.contains(event.target)) setMenuOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [menuOpen])

  useEffect(() => () => clearTimeout(closeTimer.current), [])

  const openMenu = () => {
    clearTimeout(closeTimer.current)
    setMenuOpen(true)
  }

  const scheduleClose = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setMenuOpen(false), CLOSE_DELAY_MS)
  }

  const isServicesActive = pathname.startsWith('/services')

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300',
          scrolled
            ? 'border-b border-ink-200/70 bg-white/90 shadow-[0_6px_24px_-12px_rgb(18_27_45/0.18)] backdrop-blur-xl'
            : 'border-b border-transparent bg-white/70 backdrop-blur-md'
        )}
      >
        <Container width="wide">
          <div
            className={cn(
              'flex items-center justify-between gap-6 transition-[height] duration-300',
              scrolled ? 'h-16' : 'h-[4.5rem]'
            )}
          >
            <Logo />

            {/* The nav is the positioning context for the services panel, so the
              panel centres under the whole menu rather than one item. */}
            <nav aria-label="Main" className="relative hidden lg:block">
              <ul
                className="flex items-center gap-1"
                onMouseLeave={() => setHovered(null)}
              >
                {primaryNav.map((item) => {
                  const pill =
                    hovered === item.id ? (
                      <motion.span
                        layoutId="nav-hover-pill"
                        transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                        className="absolute inset-0 -z-10 rounded-full bg-brand-50"
                      />
                    ) : null

                  if (item.menu) {
                    return (
                      <li
                        key={item.id}
                        ref={servicesRef}
                        onMouseEnter={() => {
                          setHovered(item.id)
                          openMenu()
                        }}
                        onMouseLeave={scheduleClose}
                      >
                        <button
                          type="button"
                          aria-expanded={menuOpen}
                          aria-controls="services-menu"
                          onClick={() => (menuOpen ? setMenuOpen(false) : openMenu())}
                          className={cn(
                            'relative z-0 flex items-center gap-1 rounded-full px-4 py-2 text-[0.9375rem] font-semibold transition-colors',
                            isServicesActive || menuOpen
                              ? 'text-brand-700'
                              : 'text-ink-700 hover:text-ink-900'
                          )}
                        >
                          {pill}
                          {item.label}
                          <motion.span
                            animate={{ rotate: menuOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex"
                          >
                            <Icon name="chevronDown" size={16} />
                          </motion.span>
                        </button>

                        <AnimatePresence>
                          {menuOpen ? (
                            <motion.div
                              id="services-menu"
                              variants={menuPanel}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
                            >
                              <ServicesMenu onNavigate={() => setMenuOpen(false)} />
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </li>
                    )
                  }

                  return (
                    <li key={item.id} onMouseEnter={() => setHovered(item.id)}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          cn(
                            'relative z-0 block rounded-full px-4 py-2 text-[0.9375rem] font-semibold transition-colors',
                            isActive
                              ? 'text-brand-700'
                              : 'text-ink-700 hover:text-ink-900'
                          )
                        }
                      >
                        {pill}
                        {item.label}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-2.5">
              <Link
                to="/services/ambulance"
                className="group hidden items-center gap-2 rounded-full bg-emergency-50 py-2 pr-4 pl-2.5 text-sm font-semibold text-emergency-700 ring-1 ring-emergency-100 transition-colors ring-inset hover:bg-emergency-100 sm:flex"
              >
                <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-emergency-600 text-white">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 animate-ping-soft rounded-full bg-emergency-500"
                  />
                  <Icon name="ambulance" size={14} strokeWidth={2} className="relative" />
                </span>
                Ambulance
              </Link>

              {/* Hidden via a wrapper: Button sets its own display, which would
                override a `hidden` class passed to it. */}
              <div className="hidden xl:block">
                <Button to="/#download" size="sm">
                  Get the app
                </Button>
              </div>

              <Link
                to="/services/ambulance"
                aria-label="Book an ambulance"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-emergency-600 text-white shadow-glow-emergency sm:hidden"
              >
                <Icon name="ambulance" size={19} />
              </Link>

              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                aria-expanded={drawerOpen}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-800 transition-colors hover:border-brand-300 hover:text-brand-700 lg:hidden"
              >
                <Icon name="menu" size={20} />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Rendered outside <header>: its backdrop-filter would otherwise become
        the containing block for the drawer's fixed positioning. */}
      <MobileNav open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
