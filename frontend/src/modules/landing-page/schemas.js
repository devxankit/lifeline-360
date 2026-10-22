import { z } from 'zod'
import { partnerTypes } from './data/partners'

/**
 * Client-side validation for the website's enquiry forms. These give instant
 * feedback; when the backend endpoints exist they must re-validate everything,
 * and any rule changed here should change there too.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const name = z
  .string()
  .trim()
  .min(2, 'Please enter your name')
  .max(80, 'Name must be 80 characters or fewer')
  .regex(
    /^[\p{L}\p{M}][\p{L}\p{M}\s'.-]*$/u,
    'Name may only contain letters, spaces, apostrophes, hyphens and full stops'
  )

const phone = z
  .string()
  .trim()
  .min(1, 'Please enter your mobile number')
  .refine(
    (value) => /^(?:\+?91|0)?[6-9]\d{9}$/.test(value.replace(/[\s()-]/g, '')),
    'Please enter a valid 10-digit Indian mobile number'
  )

const optionalEmail = z
  .string()
  .trim()
  .max(254, 'Email address is too long')
  .refine(
    (value) => value === '' || EMAIL_PATTERN.test(value),
    'Please enter a valid email address'
  )

const email = z
  .string()
  .trim()
  .min(1, 'Please enter your email address')
  .max(254, 'Email address is too long')
  .refine((value) => EMAIL_PATTERN.test(value), 'Please enter a valid email address')

/** Hidden honeypot — registered on the form but never shown to real users. */
const website = z.string().max(200).optional()

export const CONTACT_TOPICS = [
  { value: 'general', label: 'General question' },
  { value: 'services', label: 'Services & bookings' },
  { value: 'membership', label: 'Membership' },
  { value: 'partners', label: 'Partnering with Lifeline 360' },
  { value: 'feedback', label: 'Feedback' },
]

export const PARTNER_OPTIONS = partnerTypes.map((partner) => ({
  value: partner.id,
  label: partner.title,
}))

export const contactSchema = z.object({
  name,
  phone,
  email: optionalEmail,
  topic: z
    .string()
    .refine(
      (value) => CONTACT_TOPICS.some((topic) => topic.value === value),
      'Please choose a topic'
    ),
  message: z
    .string()
    .trim()
    .min(10, 'Please tell us a little more (at least 10 characters)')
    .max(2000, 'Message must be 2000 characters or fewer'),
  website,
})

export const partnerSchema = z.object({
  partnerType: z
    .string()
    .refine(
      (value) => PARTNER_OPTIONS.some((option) => option.value === value),
      'Please choose what kind of partner you are'
    ),
  name,
  organisation: z.string().trim().max(120, 'Please keep this under 120 characters'),
  phone,
  email,
  city: z.string().trim().min(2, 'Please enter your city').max(80, 'City is too long'),
  message: z.string().trim().max(1000, 'Please keep this under 1000 characters'),
  website,
})
