import { siteConfig } from '@/config/site'

/**
 * Privacy Policy and Terms & Conditions.
 *
 * DRAFT: written from the Scope of Work so the pages are complete for review,
 * but both must be checked and finalised by the client's legal counsel before
 * launch. The pages show that notice on screen.
 */

const { email, address } = siteConfig.contact

export const legalLastUpdated = '22 October 2026'

export const privacyPolicy = {
  title: 'Privacy Policy',
  intro:
    'This policy explains what information Lifeline 360 collects when you use our apps and website, why we collect it, who we share it with and the choices you have.',
  sections: [
    {
      id: 'information-we-collect',
      title: 'Information we collect',
      paragraphs: ['We collect only what we need to provide and improve our services:'],
      list: [
        'Account details: your mobile number (used for OTP sign-in), name, saved addresses, emergency contact, language and notification preferences.',
        'Booking and order details: the services you book, prescriptions you upload, lab tests and collection slots, blood requests and membership purchases.',
        'Location: your pickup or delivery location when you book an ambulance, medicines, a home visit or a sample collection, and live location during an active ambulance trip.',
        'Payment information: processed by our payment gateway partner. We do not store your full card details.',
        'Communication records: details of calls made through our masked calling system, such as time and duration.',
      ],
    },
    {
      id: 'how-we-use-it',
      title: 'How we use your information',
      list: [
        'To create and secure your account and verify your mobile number.',
        'To match your request with a verified partner and complete the booking or order.',
        'To show live tracking, booking status and order status.',
        'To send notifications you have asked for, such as booking confirmations, driver assignment and report availability.',
        'To process payments, membership purchases and renewals.',
        'To provide support, resolve complaints and keep the platform safe.',
      ],
    },
    {
      id: 'sharing',
      title: 'Sharing with partners',
      paragraphs: [
        'Partners (pharmacies, nurses and caretakers, ambulance drivers, laboratories and blood banks) receive only the information needed to complete your request, for example your pickup location for an ambulance or your address for a sample collection.',
        'We do not sell your personal information. We share information with service providers who help us run the platform (such as SMS, maps, payment and cloud storage providers) under contracts that require them to protect it, and with authorities where the law requires it.',
      ],
    },
    {
      id: 'masked-calling',
      title: 'Masked calling',
      paragraphs: [
        'Calls between you and drivers or providers are routed through a masked number. Neither party sees the other’s personal mobile number.',
      ],
    },
    {
      id: 'security',
      title: 'How we protect your information',
      paragraphs: [
        'We use access controls, encryption in transit and verified partner onboarding to protect your information. No system is perfectly secure, so please keep your phone and OTPs private and tell us straight away if you notice anything unusual.',
      ],
    },
    {
      id: 'retention',
      title: 'How long we keep information',
      paragraphs: [
        'We keep your information for as long as your account is active and for as long as needed to meet legal, accounting and record-keeping requirements. Lab reports and booking history stay available in your account until you ask us to delete them, unless the law requires us to keep them.',
      ],
    },
    {
      id: 'your-rights',
      title: 'Your choices and rights',
      paragraphs: [
        'You can update your profile, addresses, language and notification preferences in the app at any time. Under applicable Indian law, including the Digital Personal Data Protection Act, 2023, you may ask to access, correct or erase your personal data, or withdraw consent. Some services cannot be provided without certain information.',
      ],
    },
    {
      id: 'changes',
      title: 'Changes to this policy',
      paragraphs: [
        'We will post any changes on this page and update the date at the top. For significant changes we will also notify you in the app.',
      ],
    },
    {
      id: 'contact',
      title: 'Contact us',
      paragraphs: [`Questions about privacy? Write to ${email} or to ${address}.`],
    },
  ],
}

export const termsAndConditions = {
  title: 'Terms & Conditions',
  intro:
    'These terms govern your use of the Lifeline 360 apps and website. By creating an account or using our services you agree to them.',
  sections: [
    {
      id: 'about-the-platform',
      title: 'About the platform',
      paragraphs: [
        'Lifeline 360 is a technology platform that connects users with independent, verified healthcare partners: pharmacies, nurses and caretakers, ambulance operators and drivers, laboratories and blood banks. Partners are responsible for the services they provide.',
      ],
    },
    {
      id: 'emergencies',
      title: 'Emergencies',
      paragraphs: [
        `Lifeline 360 is not a replacement for government emergency services. In a life-threatening emergency, call ${siteConfig.emergencyNumber} as well as using the app.`,
      ],
    },
    {
      id: 'your-account',
      title: 'Your account',
      list: [
        'You sign in with your mobile number and an OTP. Keep your phone and OTPs secure.',
        'Give accurate details, including addresses and emergency contacts, so partners can reach you.',
        'You are responsible for activity on your account.',
      ],
    },
    {
      id: 'bookings-and-orders',
      title: 'Bookings and orders',
      list: [
        'A booking or order is confirmed when a partner accepts it in the app.',
        'Prescription medicines are supplied only against a valid prescription, at the pharmacy’s professional discretion.',
        'Lab reports are issued by the laboratory that processed your sample.',
        'Blood availability is managed by each blood bank and can change at any time.',
        'Cancellation and refund rules are shown in the app before you confirm.',
      ],
    },
    {
      id: 'payments',
      title: 'Payments',
      paragraphs: [
        'Payments are made online through our payment gateway partner. Prices are shown before you confirm a booking, order or membership purchase.',
      ],
    },
    {
      id: 'membership',
      title: 'Membership',
      paragraphs: [
        'Membership plans are offered monthly or annually. Each plan’s benefits, validity and renewal terms are shown in the app before purchase, and you will be reminded before your plan expires.',
      ],
    },
    {
      id: 'partners',
      title: 'Partner responsibilities',
      paragraphs: [
        'Partners must complete KYC and document verification, keep their licences and documents current, provide services professionally and keep their availability, prices and stock accurate.',
      ],
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable use',
      list: [
        'Do not misuse the platform, make false bookings or harass partners or users.',
        'Do not try to access other accounts or interfere with the platform’s security.',
        'Do not use masked calling to contact anyone outside an active booking.',
      ],
    },
    {
      id: 'liability',
      title: 'Liability',
      paragraphs: [
        'To the extent the law allows, Lifeline 360 is not liable for the acts or omissions of independent partners, or for indirect or consequential losses. Nothing in these terms limits liability that cannot be limited by law.',
      ],
    },
    {
      id: 'governing-law',
      title: 'Governing law',
      paragraphs: [
        'These terms are governed by the laws of India. Courts at the location of our registered office will have jurisdiction.',
      ],
    },
    {
      id: 'contact',
      title: 'Contact us',
      paragraphs: [`Questions about these terms? Write to ${email}.`],
    },
  ],
}
