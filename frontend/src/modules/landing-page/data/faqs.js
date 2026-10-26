import { siteConfig } from '@/config/site'

/**
 * Frequently asked questions, grouped by topic. Answers stay within what the
 * Scope of Work commits to; anything still being decided (prices, the final
 * benefit list) says so plainly. `featured` items also appear on the landing
 * page.
 */
export const faqCategories = [
  {
    id: 'general',
    label: 'General',
    items: [
      {
        q: 'What is Lifeline 360?',
        a: 'Lifeline 360 is one healthcare platform with six services: finding hospitals that accept the Ayushman card (PM-JAY), ambulance booking, home nursing and caretakers, medicine delivery, lab tests with home sample collection and blood bank requests. Membership plans, calling support and live tracking are built in.',
        featured: true,
      },
      {
        q: 'Is the app available on Android and iOS?',
        a: 'Yes. The Lifeline 360 user app is being built for both Android and iOS. Download links will appear on this website as soon as the apps are published.',
        featured: true,
      },
      {
        q: 'How do I sign in?',
        a: 'With your mobile number and a one-time password (OTP) sent by SMS. There is no password to remember.',
      },
      {
        q: 'Which languages does Lifeline 360 support?',
        a: 'Hindi and English. You choose your language when you first open the app and can change it any time from your profile settings. Menus, service categories, buttons and notifications all follow your choice.',
        featured: true,
      },
      {
        q: 'Can I save more than one address?',
        a: 'Yes. Your profile can hold several addresses, such as your home and your parents’ home, along with an emergency contact.',
      },
    ],
  },
  {
    id: 'ayushman',
    label: 'Ayushman card (PM-JAY)',
    items: [
      {
        q: 'Which hospitals can I find with the Ayushman search?',
        a: 'Private hospitals empanelled under Ayushman Bharat PM-JAY. Search by state and city, or use your location, to see each hospital’s distance, phone number and specialities.',
        featured: true,
        services: ['ayushman-hospitals'],
      },
      {
        q: 'Is treatment free with an Ayushman card?',
        a: 'For eligible families, covered treatment at PM-JAY empanelled hospitals is cashless, up to ₹5 lakh per family per year. The hospital’s Ayushman help desk confirms what your treatment covers.',
        services: ['ayushman-hospitals'],
      },
      {
        q: 'Does Lifeline 360 issue Ayushman cards?',
        a: 'No. Lifeline 360 helps you find hospitals and book an ambulance or blood for them. To check eligibility or get an Ayushman card, use the official PM-JAY channels or ask at a hospital’s Ayushman help desk.',
        services: ['ayushman-hospitals'],
      },
      {
        q: 'Can I book an ambulance to a PM-JAY hospital?',
        a: 'Yes. Find the hospital in the search and tap Book ambulance; the hospital is set as the destination. You can also request blood for a patient there.',
        services: ['ayushman-hospitals', 'ambulance'],
      },
    ],
  },
  {
    id: 'ambulance',
    label: 'Ambulance',
    items: [
      {
        q: 'How do I book an ambulance?',
        a: 'Open the app, choose Ambulance and share your pickup location and destination hospital. A verified driver accepts the request and you can follow the ambulance live on the map.',
        featured: true,
        services: ['ambulance'],
      },
      {
        q: 'Will the driver see my phone number?',
        a: 'No. Calls between you and the driver go through a masked calling system, so neither of you sees the other’s personal number.',
        services: ['ambulance'],
      },
      {
        q: 'Does Lifeline 360 replace government emergency numbers?',
        a: `No. Lifeline 360 helps you book and track an ambulance, but in a life-threatening emergency you should also call ${siteConfig.emergencyNumber}, India’s national emergency number.`,
        services: ['ambulance', 'blood-bank'],
      },
    ],
  },
  {
    id: 'care',
    label: 'Care, medicine & tests',
    items: [
      {
        q: 'Are nurses and caretakers verified?',
        a: 'Yes. Every nursing and caretaker partner completes KYC and document verification before they can accept bookings. You can also see ratings and reviews from other families.',
        featured: true,
        services: ['nursing-caretaker'],
      },
      {
        q: 'Can I order medicines with a prescription?',
        a: 'Yes. Upload your prescription with the order and the pharmacy prepares it from there. You can follow the order until it is delivered.',
        services: ['medicine'],
      },
      {
        q: 'Do lab tests include home sample collection?',
        a: 'Yes. Choose a test or package, pick a collection slot and the laboratory collects the sample at home. Your report is delivered digitally in the app, with a notification when it is ready.',
        featured: true,
        services: ['laboratory'],
      },
      {
        q: 'Does Lifeline 360 store blood?',
        a: 'No. Lifeline 360 connects you with registered blood banks. Each blood bank manages its own stock and availability, and responds to requests directly through the platform.',
        services: ['blood-bank'],
      },
    ],
  },
  {
    id: 'membership',
    label: 'Membership',
    items: [
      {
        q: 'What membership plans are there?',
        a: 'Monthly and annual plans. Pricing and plan details will be announced at launch.',
      },
      {
        q: 'What benefits come with membership?',
        a: 'Benefits being planned include consultation benefits, laboratory discounts and priority healthcare services. The final list will be confirmed when membership launches.',
      },
      {
        q: 'How do I show my membership?',
        a: 'Every member gets a digital membership card in the app, showing the plan and how long it is valid. You will get a reminder before it expires.',
      },
    ],
  },
  {
    id: 'partners',
    label: 'Partners',
    items: [
      {
        q: 'Who can partner with Lifeline 360?',
        a: 'Pharmacies, nurses and caretakers, ambulance drivers, laboratories and blood banks. Each gets its own app or web panel to manage requests and earnings.',
      },
      {
        q: 'What does verification involve?',
        a: 'Every partner completes KYC and document verification. Our team will tell you exactly which documents apply to your partner type when you register.',
      },
      {
        q: 'How do partners track earnings?',
        a: 'Earnings, transactions and order or booking history are available inside each partner app and panel.',
      },
    ],
  },
  {
    id: 'payments',
    label: 'Payments & privacy',
    items: [
      {
        q: 'How do I pay?',
        a: 'Online, inside the app, through an integrated payment gateway. Your payment history stays in your account.',
      },
      {
        q: 'How is my information kept private?',
        a: 'Calls with drivers and providers use masked numbers, partners only see the details they need to complete your booking, and every partner is verified before joining. Read our Privacy Policy for the full detail.',
      },
    ],
  },
]

export const featuredFaqs = faqCategories.flatMap((category) =>
  category.items.filter((item) => item.featured)
)

export const getFaqCategory = (id) => faqCategories.find((category) => category.id === id)

/** Questions for one service page: its own first, topped up with general ones. */
export function getFaqsForService(slug, limit = 4) {
  const specific = faqCategories
    .flatMap((category) => category.items)
    .filter((item) => item.services?.includes(slug))
  const general = getFaqCategory('general').items.filter(
    (item) => !specific.includes(item)
  )

  return [...specific, ...general].slice(0, limit)
}
