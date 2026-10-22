/**
 * Membership module content (Scope of Work §9).
 *
 * Prices and the final benefit list are not set yet, so plans show
 * "announced at launch" rather than invented figures. When pricing is agreed,
 * fill in `price` and the cards render it.
 */
export const membershipPlans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: null,
    cadence: 'per month',
    description: 'Flexible membership that renews every month.',
    points: [
      'Renews every month',
      'Digital membership card',
      'Reminder before each expiry',
    ],
  },
  {
    id: 'annual',
    name: 'Annual',
    price: null,
    cadence: 'per year',
    description: 'One payment for a full year of membership benefits across services.',
    points: [
      'Twelve months of membership',
      'Digital membership card',
      'One renewal a year',
    ],
    featured: true,
  },
]

/** Included with every plan. */
export const membershipIncludes = [
  {
    icon: 'idCard',
    title: 'Digital membership card',
    text: 'Your card lives in the app, ready to show whenever you use a service.',
  },
  {
    icon: 'sparkles',
    title: 'Benefits in one view',
    text: 'See every benefit attached to your plan and how to use it.',
  },
  {
    icon: 'bellRing',
    title: 'Validity & renewal reminders',
    text: 'Know when your plan is valid until, with a reminder before it expires.',
  },
  {
    icon: 'clipboardList',
    title: 'Membership history',
    text: 'Past plans, purchases and renewals, all in your account.',
  },
]

/** Benefits being planned. Final list confirmed at launch. */
export const membershipBenefits = [
  {
    icon: 'stethoscope',
    title: 'Consultation benefits',
    text: 'Benefits on consultations for members.',
  },
  {
    icon: 'flask',
    title: 'Laboratory discounts',
    text: 'Savings on lab tests and health packages.',
  },
  {
    icon: 'timer',
    title: 'Priority healthcare services',
    text: 'Priority handling across Lifeline 360 services.',
  },
]

/** Sample data for the card illustration. Clearly labelled as a sample on screen. */
export const sampleMember = {
  name: 'Aarav Sharma',
  plan: 'Annual plan',
  memberId: 'L360 2026 0481',
  validTill: '31 Mar 2027',
}
