import { env } from './env'

/**
 * Brand and contact details shared by the header, footer, contact page and
 * legal pages.
 *
 * PLACEHOLDERS: the phone number, inboxes and office address below are
 * stand-ins until the client confirms the real ones. Change them here and
 * every page picks the update up.
 */
export const siteConfig = {
  name: 'Lifeline 360',
  tagline: 'Complete healthcare, one app',
  description:
    'Lifeline 360 helps you find hospitals that accept your Ayushman card and brings ambulance booking, home nursing and caretakers, medicine delivery, lab tests with home sample collection and blood bank requests together in one app.',
  url: env.siteUrl,

  contact: {
    phone: '+91 98765 43210',
    phoneHref: 'tel:+919876543210',
    email: 'care@lifeline360.in',
    emailHref: 'mailto:care@lifeline360.in',
    partnerEmail: 'partners@lifeline360.in',
    partnerEmailHref: 'mailto:partners@lifeline360.in',
    address: 'Lifeline 360 Healthcare, New Delhi, India',
  },

  /** India's national emergency number, shown wherever we talk about emergencies. */
  emergencyNumber: '112',

  /** Add an entry ({ id, label, href, brandColor }) as each account goes live. */
  socials: [],
}
