import { membershipTile, servicePath, services } from './services'

/** Header navigation. `menu: true` opens the services panel on desktop. */
export const primaryNav = [
  { id: 'services', label: 'Services', to: '/services', menu: true },
  { id: 'membership', label: 'Membership', to: '/membership' },
  { id: 'partners', label: 'For partners', to: '/partners' },
  { id: 'about', label: 'About', to: '/about' },
  { id: 'contact', label: 'Contact', to: '/contact' },
]

/** Services panel / mobile accordion entries. */
export const serviceMenu = [...services, membershipTile].map((service) => ({
  label: service.title,
  to: servicePath(service),
  icon: service.icon,
  tone: service.tone,
  description: service.summary,
}))

export const footerColumns = [
  {
    title: 'Services',
    links: [
      ...services.map((service) => ({ label: service.title, to: servicePath(service) })),
      { label: 'Membership', to: '/membership' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Lifeline 360', to: '/about' },
      { label: 'All services', to: '/services' },
      { label: 'Partner with us', to: '/partners' },
      { label: 'FAQs', to: '/faqs' },
      { label: 'Contact us', to: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms & Conditions', to: '/terms' },
    ],
  },
]
