import { Link } from 'react-router-dom'
import Logo from '@/components/brand/Logo'
import Container from '@/components/ui/Container'
import Icon from '@/components/ui/Icon'
import SocialIcons from '@/components/ui/SocialIcons'
import { siteConfig } from '@/config/site'
import { footerColumns } from '../data/navigation'
import StoreBadges from '../components/common/StoreBadges'

export default function SiteFooter() {
  const { phone, phoneHref, email, emailHref, address } = siteConfig.contact

  return (
    <footer className="relative overflow-hidden bg-ink-950 text-white/65">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl"
      />

      <Container width="wide" className="relative">
        <div className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Logo tone="dark" />
            <p className="max-w-sm text-[0.9375rem] leading-relaxed">
              {siteConfig.description}
            </p>

            <ul className="flex flex-col gap-3 text-[0.9375rem]">
              <li>
                <a
                  href={phoneHref}
                  className="group inline-flex items-center gap-3 transition-colors hover:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-aqua-300 transition-colors group-hover:bg-white/14">
                    <Icon name="phone" size={16} />
                  </span>
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={emailHref}
                  className="group inline-flex items-center gap-3 transition-colors hover:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-aqua-300 transition-colors group-hover:bg-white/14">
                    <Icon name="mail" size={16} />
                  </span>
                  {email}
                </a>
              </li>
              <li className="inline-flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-aqua-300">
                  <Icon name="mapPin" size={16} />
                </span>
                {address}
              </li>
            </ul>

            <SocialIcons />
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-5">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h2 className="mb-4 font-sans text-xs font-semibold tracking-[0.16em] text-white uppercase">
                  {column.title}
                </h2>
                <ul className="flex flex-col gap-2.5 text-[0.9375rem]">
                  {column.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="inline-block transition-[color,translate] duration-200 hover:translate-x-0.5 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 lg:col-span-3">
            <h2 className="font-sans text-xs font-semibold tracking-[0.16em] text-white uppercase">
              Get the app
            </h2>
            <p className="text-[0.9375rem] leading-relaxed">
              Every service, one account. Launching on Android and iOS.
            </p>
            <StoreBadges tone="dark" />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-5 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-white/80">
            <Icon name="siren" size={16} className="text-emergency-400" />
            In a life-threatening emergency, call {siteConfig.emergencyNumber}.
          </p>
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
