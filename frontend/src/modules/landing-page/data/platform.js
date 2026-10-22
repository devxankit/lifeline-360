/**
 * Facts about the Lifeline 360 platform itself, taken from the Scope of Work:
 * the apps and panels (§2), the safety and convenience features every service
 * shares (§3, §11, §14, §15) and the account features (§3).
 */

/** The seven apps and panels in the current scope. */
export const ecosystem = [
  {
    name: 'User app',
    platform: 'Android & iOS',
    icon: 'smartphone',
    audience: 'Patients and families',
    text: 'Book every service, track it live, pay online and manage membership.',
  },
  {
    name: 'Driver app',
    platform: 'Android & iOS',
    icon: 'ambulance',
    audience: 'Ambulance drivers',
    text: 'Go online, accept emergency requests, navigate and track earnings.',
  },
  {
    name: 'Partner app',
    platform: 'Android & iOS',
    icon: 'store',
    audience: 'Pharmacies, nurses & caretakers',
    text: 'One app with role-based access for medicine vendors and care partners.',
  },
  {
    name: 'Laboratory panel',
    platform: 'Web',
    icon: 'microscope',
    audience: 'Diagnostic labs',
    text: 'Tests, packages, home collection schedules and digital report uploads.',
  },
  {
    name: 'Blood bank panel',
    platform: 'Web',
    icon: 'droplets',
    audience: 'Blood banks',
    text: 'Blood group stock, availability status and request management.',
  },
  {
    name: 'Master admin panel',
    platform: 'Web',
    icon: 'shieldCheck',
    audience: 'Lifeline 360 team',
    text: 'Central oversight of users, partners, bookings, payments and support.',
  },
  {
    name: 'Lifeline 360 website',
    platform: 'Web',
    icon: 'globe',
    audience: 'Everyone',
    text: 'Information about every service, and the front door for partner sign-ups.',
  },
]

/** Safety and convenience built into every service. */
export const trustFeatures = [
  {
    icon: 'badgeCheck',
    title: 'Verified partners',
    text: 'Pharmacies, carers, drivers, labs and blood banks all complete KYC and document verification before they go live.',
  },
  {
    icon: 'lock',
    title: 'Masked calling',
    text: 'Calls with drivers and providers route through a masked number, so personal numbers stay private on both sides.',
  },
  {
    icon: 'locate',
    title: 'Live tracking',
    text: 'Follow ambulances on a live map and see the status of every order and booking as it moves.',
  },
  {
    icon: 'fileHeart',
    title: 'Digital reports',
    text: 'Lab reports arrive in the app with a notification the moment they are ready, and stay in your history.',
  },
  {
    icon: 'creditCard',
    title: 'Secure payments',
    text: 'Pay online for bookings, orders and membership through an integrated payment gateway.',
  },
  {
    icon: 'languages',
    title: 'Hindi & English',
    text: 'Choose your language when you sign up and change it any time from settings.',
  },
]

/** What every user account includes (Scope of Work §3). */
export const accountFeatures = [
  {
    icon: 'smartphone',
    title: 'Mobile number + OTP sign-in',
    text: 'No passwords to remember.',
  },
  { icon: 'mapPin', title: 'Multiple addresses', text: 'Home, parents’ home, office.' },
  {
    icon: 'users',
    title: 'Emergency contact',
    text: 'Someone to reach when it matters.',
  },
  { icon: 'languages', title: 'Language choice', text: 'Hindi or English, any time.' },
  {
    icon: 'bell',
    title: 'Notification preferences',
    text: 'Hear about what you care about.',
  },
  {
    icon: 'clipboardList',
    title: 'One history',
    text: 'Every booking and order in one place.',
  },
]

/** Plain facts about the platform for stat rows. No invented usage figures. */
export const platformFacts = [
  { value: '5', label: 'care services in one app' },
  { value: '7', label: 'apps and panels working together' },
  { value: '2', label: 'languages, Hindi and English' },
  { value: '1', label: 'account for every service' },
]
