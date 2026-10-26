import ambulancePune from '../assets/images/ambulance-pune.webp'
import bloodBag from '../assets/images/blood-bag.webp'
import bloodDonor from '../assets/images/blood-donor.webp'
import caretakerHome from '../assets/images/caretaker-home.webp'
import familyGenerations from '../assets/images/family-generations.webp'
import hospitalEntrance from '../assets/images/hospital-entrance.webp'
import labSample from '../assets/images/lab-sample.webp'
import labTechnician from '../assets/images/lab-technician.webp'
import medicineStrips from '../assets/images/medicine-strips.webp'
import medicineTablets from '../assets/images/medicine-tablets.webp'
import nurseHomeVisit from '../assets/images/nurse-home-visit.webp'

/**
 * The healthcare services Lifeline 360 offers, as scoped in the Scope of Work
 * (§3–§9, §16). One record drives the landing page cards, the services
 * overview, each service's detail page, the header menu and the
 * "how it works" journeys, so they can never disagree.
 *
 * `tone` picks the accent family: emergency (red) is reserved for the two
 * time-critical services, ambulance and blood bank.
 */
export const services = [
  {
    slug: 'ambulance',
    name: 'Ambulance',
    title: 'Ambulance booking',
    icon: 'ambulance',
    tone: 'emergency',
    summary:
      'Request an ambulance in a few taps, see who is coming and follow it live to your door.',
    highlights: ['Live GPS tracking', 'Masked calling', 'Hospital details'],
    image: ambulancePune,
    imageAlt: 'An advanced life support ambulance driving on a hillside road near Pune',
    secondaryImage: null,
    hero: {
      title: 'An ambulance on its way, and you can watch it arrive',
      description:
        'Book an ambulance from the app, get a verified driver assigned and follow the vehicle live on the map, while calls stay private through masked numbers.',
    },
    journey: [
      {
        title: 'Request an ambulance',
        text: 'Share your pickup location and the destination hospital from the app.',
        icon: 'siren',
      },
      {
        title: 'A driver accepts',
        text: 'A verified driver accepts the request and you are notified straight away.',
        icon: 'userCheck',
      },
      {
        title: 'Track it live',
        text: 'Follow the ambulance on the map with live GPS location and trip status.',
        icon: 'navigation',
      },
      {
        title: 'Talk without sharing numbers',
        text: 'Call the driver through masked calling. Neither side sees a personal number.',
        icon: 'phoneCall',
      },
    ],
    features: [
      {
        icon: 'locate',
        title: 'Live GPS tracking',
        text: 'See the ambulance on the map from the moment a driver accepts your request.',
      },
      {
        icon: 'bellRing',
        title: 'Driver assignment alerts',
        text: 'A notification as soon as a driver is assigned, with the ambulance details.',
      },
      {
        icon: 'hospital',
        title: 'Pickup and hospital details',
        text: 'Your pickup point and destination hospital go straight to the driver’s navigation.',
      },
      {
        icon: 'lock',
        title: 'Masked calling',
        text: 'Speak to the driver without either of you seeing the other’s personal number.',
      },
      {
        icon: 'route',
        title: 'Trip status',
        text: 'Know when the ambulance is on the way, when it has arrived and when the trip is complete.',
      },
      {
        icon: 'clipboardList',
        title: 'Booking history',
        text: 'Every emergency booking is saved to your history in the app.',
      },
    ],
    partner: {
      label: 'Ambulance drivers',
      text: 'Drivers use a dedicated Driver app to go online, accept emergency requests, navigate to the patient and track their earnings.',
    },
  },
  {
    slug: 'nursing-caretaker',
    name: 'Nursing & caretakers',
    title: 'Nursing & caretakers',
    icon: 'handHeart',
    tone: 'aqua',
    summary:
      'Book verified nurses and caretakers for care at home, and follow every booking from request to completion.',
    highlights: ['KYC-verified carers', 'Booking status', 'Ratings & reviews'],
    image: caretakerHome,
    imageAlt:
      'A caretaker gently combing an elderly man’s hair at home in the morning light',
    secondaryImage: nurseHomeVisit,
    secondaryImageAlt:
      'A nurse checking an elderly man’s heartbeat with a stethoscope at home',
    hero: {
      title: 'Trusted nurses and caretakers, at home',
      description:
        'Choose from verified nursing and caretaker partners, book by their availability and follow each booking until the service is complete.',
    },
    journey: [
      {
        title: 'Choose the care you need',
        text: 'Browse nursing and caretaker service categories.',
        icon: 'clipboardList',
      },
      {
        title: 'Pick a verified carer',
        text: 'Compare profiles, service details and ratings before you book.',
        icon: 'userCheck',
      },
      {
        title: 'Confirm the booking',
        text: 'The carer accepts the request and you can follow its status.',
        icon: 'calendarCheck',
      },
      {
        title: 'Care at home',
        text: 'The service is completed at home, and you can rate the visit.',
        icon: 'home',
      },
    ],
    features: [
      {
        icon: 'badgeCheck',
        title: 'Verified profiles',
        text: 'Every nurse and caretaker completes KYC and document verification before taking bookings.',
      },
      {
        icon: 'clipboardList',
        title: 'Service categories',
        text: 'Find the right kind of care from clearly listed service categories and details.',
      },
      {
        icon: 'calendarClock',
        title: 'Book by availability',
        text: 'Carers set the times they are available, so you only book slots that work.',
      },
      {
        icon: 'activity',
        title: 'Booking status',
        text: 'Follow each booking from requested to accepted to completed.',
      },
      {
        icon: 'star',
        title: 'Ratings & reviews',
        text: 'Rate the service after every visit and read what other families said.',
      },
      {
        icon: 'phoneCall',
        title: 'Calling support',
        text: 'Call your carer about the booking from within the app.',
      },
    ],
    partner: {
      label: 'Nurses & caretakers',
      text: 'Nurses and caretakers manage booking requests, availability, service details and earnings in the Lifeline 360 partner app.',
    },
  },
  {
    slug: 'medicine',
    name: 'Medicine',
    title: 'Medicine delivery',
    icon: 'pill',
    tone: 'brand',
    summary:
      'Order from verified pharmacies, send a prescription and track your medicines to the door.',
    highlights: ['Prescription orders', 'Verified pharmacies', 'Order tracking'],
    image: medicineStrips,
    imageAlt: 'Blister packs of tablets and capsules arranged on a white surface',
    secondaryImage: medicineTablets,
    secondaryImageAlt: 'Blue and red tablets in blister packs',
    hero: {
      title: 'Medicines from verified pharmacies, delivered',
      description:
        'Search the catalogue, order from a verified pharmacy or upload a prescription, and follow your order from preparation to delivery.',
    },
    journey: [
      {
        title: 'Find your medicines',
        text: 'Search by medicine or category, with prices and availability.',
        icon: 'search',
      },
      {
        title: 'Order from a pharmacy',
        text: 'Place an order or upload a prescription for the pharmacy to review.',
        icon: 'store',
      },
      {
        title: 'Pharmacy prepares it',
        text: 'The pharmacy accepts, prepares and hands your order over for delivery.',
        icon: 'package',
      },
      {
        title: 'Delivered to you',
        text: 'Status updates until the order reaches your door.',
        icon: 'packageCheck',
      },
    ],
    features: [
      {
        icon: 'pill',
        title: 'Medicine catalogue',
        text: 'Browse medicines by category with clear pricing and availability.',
      },
      {
        icon: 'fileText',
        title: 'Prescription orders',
        text: 'Upload a prescription and the pharmacy prepares your order from it.',
      },
      {
        icon: 'badgeCheck',
        title: 'Verified pharmacies',
        text: 'Every pharmacy partner completes KYC and document verification.',
      },
      {
        icon: 'activity',
        title: 'Order tracking',
        text: 'Follow your order from accepted to prepared to out for delivery.',
      },
      {
        icon: 'clipboardList',
        title: 'Order history',
        text: 'All your past orders in one place, ready when you need a refill.',
      },
      {
        icon: 'phoneCall',
        title: 'Call the pharmacy',
        text: 'Calling support for medicine orders whenever a question comes up.',
      },
    ],
    partner: {
      label: 'Pharmacies',
      text: 'Pharmacies list their catalogue, set prices and availability, accept prescription orders and track earnings in the partner app.',
    },
  },
  {
    slug: 'laboratory',
    name: 'Lab tests',
    title: 'Lab tests at home',
    icon: 'flask',
    tone: 'aqua',
    summary:
      'Book tests and health packages with home sample collection, and get digital reports in the app.',
    highlights: ['Home sample collection', 'Health packages', 'Digital reports'],
    image: labSample,
    imageAlt: 'A gloved hand placing a blood sample tube into a laboratory centrifuge',
    secondaryImage: labTechnician,
    secondaryImageAlt: 'A lab technician labelling blood sample tubes at a workstation',
    hero: {
      title: 'Lab tests with sample collection at home',
      description:
        'Book tests and packages from registered laboratories, schedule a home collection and receive your report digitally the moment it is ready.',
    },
    journey: [
      {
        title: 'Choose a test or package',
        text: 'Compare tests and health packages from registered labs.',
        icon: 'testTubes',
      },
      {
        title: 'Schedule a home collection',
        text: 'Pick a slot that suits you for sample collection at home.',
        icon: 'calendarClock',
      },
      {
        title: 'Sample collected',
        text: 'Follow the booking as the lab collects and processes your sample.',
        icon: 'microscope',
      },
      {
        title: 'Digital report',
        text: 'Get notified when your report is ready and open it in the app.',
        icon: 'fileHeart',
      },
    ],
    features: [
      {
        icon: 'testTubes',
        title: 'Tests & packages',
        text: 'Individual tests and health packages with transparent pricing.',
      },
      {
        icon: 'home',
        title: 'Home sample collection',
        text: 'Book a collection at home instead of travelling to a lab.',
      },
      {
        icon: 'calendarCheck',
        title: 'Collection scheduling',
        text: 'Choose the time that suits you and the lab confirms the slot.',
      },
      {
        icon: 'activity',
        title: 'Booking status',
        text: 'Know when your sample is collected and when testing is under way.',
      },
      {
        icon: 'fileHeart',
        title: 'Digital reports',
        text: 'Reports are uploaded to the app and stay in your history.',
      },
      {
        icon: 'bellRing',
        title: 'Report alerts',
        text: 'A notification the moment your report is available.',
      },
    ],
    partner: {
      label: 'Laboratories',
      text: 'Laboratories manage tests, packages and pricing, schedule home collections and upload reports from the Laboratory Panel.',
    },
  },
  {
    slug: 'blood-bank',
    name: 'Blood bank',
    title: 'Blood bank requests',
    icon: 'droplet',
    tone: 'emergency',
    summary:
      'Check blood availability at registered blood banks by blood group and raise a request in minutes.',
    highlights: ['Availability by group', 'Registered blood banks', 'Request tracking'],
    image: bloodDonor,
    imageAlt:
      'A blood donor squeezing a stress ball while blood flows into a collection bag',
    secondaryImage: bloodBag,
    secondaryImageAlt: 'A blood bag on a blood collection monitor during a donation',
    hero: {
      title: 'Find the blood group you need, and request it fast',
      description:
        'See available units at registered blood banks for every blood group, raise a request in a few steps and get the blood bank’s response in the app.',
    },
    journey: [
      {
        title: 'Select a blood bank',
        text: 'Find registered blood banks serving your area.',
        icon: 'building',
      },
      {
        title: 'Choose the blood group',
        text: 'Pick the group you need, from A+ to O−.',
        icon: 'droplet',
      },
      {
        title: 'Check availability',
        text: 'See available units and the availability status.',
        icon: 'search',
      },
      {
        title: 'Raise a request',
        text: 'Send the request with patient and requester details.',
        icon: 'clipboardCheck',
      },
      {
        title: 'Blood bank responds',
        text: 'The blood bank reviews and accepts your request.',
        icon: 'message',
      },
      {
        title: 'Confirmation',
        text: 'Get confirmation and speak to the blood bank directly.',
        icon: 'checkCircle',
      },
    ],
    features: [
      {
        icon: 'droplets',
        title: 'Availability by blood group',
        text: 'See available units for each blood group before you raise a request.',
      },
      {
        icon: 'badgeCheck',
        title: 'Registered blood banks',
        text: 'Blood banks complete KYC and document verification before they go live.',
      },
      {
        icon: 'mapPin',
        title: 'Search by area',
        text: 'Find blood banks by location and the areas they serve.',
      },
      {
        icon: 'activity',
        title: 'Request tracking',
        text: 'Follow your request from raised to accepted to confirmed.',
      },
      {
        icon: 'phoneCall',
        title: 'Calling support',
        text: 'Speak to the blood bank about your request when you need to.',
      },
      {
        icon: 'clipboardList',
        title: 'Request history',
        text: 'All your past blood requests in one place.',
      },
    ],
    partner: {
      label: 'Blood banks',
      text: 'Blood banks update stock by blood group, set availability and respond to requests from the Blood Bank Panel.',
    },
  },
]

/**
 * Ayushman Bharat PM-JAY hospital finder: the sixth service and the first one
 * on the page. It has its own page (with the full locator) rather than the
 * generic service template, so it carries `to`.
 */
export const hospitalTile = {
  slug: 'ayushman-hospitals',
  to: '/ayushman-hospitals',
  name: 'Ayushman hospitals',
  title: 'Ayushman card hospitals',
  badge: 'New',
  icon: 'hospital',
  tone: 'brand',
  summary:
    'Find private hospitals that treat Ayushman card holders under PM-JAY by state and city, see how far they are, and book an ambulance or blood there.',
  highlights: ['PM-JAY hospitals', 'Distance & contacts', 'Ambulance & blood in one tap'],
  image: hospitalEntrance,
  imageAlt: 'The emergency entrance of a hospital building',
  journey: [
    {
      title: 'Search by state and city',
      text: 'Find private hospitals empanelled under PM-JAY near you or your family.',
      icon: 'search',
    },
    {
      title: 'Compare distance and contacts',
      text: 'See how far each hospital is, its specialities and its phone number.',
      icon: 'mapPin',
    },
    {
      title: 'Confirm with the hospital',
      text: 'Check your treatment and eligibility with the hospital’s Ayushman help desk.',
      icon: 'phoneCall',
    },
    {
      title: 'Book an ambulance or blood',
      text: 'Send an ambulance or a blood request for that hospital in one tap.',
      icon: 'ambulance',
    },
  ],
}

/** Membership sits beside the services everywhere they are listed. */
export const membershipTile = {
  slug: 'membership',
  to: '/membership',
  name: 'Membership',
  title: 'Lifeline 360 Membership',
  icon: 'crown',
  tone: 'brand',
  summary:
    'Monthly and annual plans with a digital membership card and benefits across Lifeline 360 services.',
  highlights: ['Monthly & annual plans', 'Digital card', 'Renewal reminders'],
  image: familyGenerations,
  imageAlt: 'Grandparents and their grandson smiling together outdoors',
  journey: [
    { title: 'Choose a plan', text: 'Compare monthly and annual plans.', icon: 'scale' },
    {
      title: 'Pay online',
      text: 'Buy securely through the payment gateway.',
      icon: 'creditCard',
    },
    {
      title: 'Get your card',
      text: 'Your digital membership card appears in the app.',
      icon: 'idCard',
    },
    {
      title: 'Use your benefits',
      text: 'See and use your benefits across services.',
      icon: 'sparkles',
    },
  ],
}

export const servicePath = (service) => service.to ?? `/services/${service.slug}`

/** Every tile in the order the site lists them: the six services, then membership. */
export const serviceTiles = [hospitalTile, ...services, membershipTile]

export const getServiceBySlug = (slug) =>
  services.find((service) => service.slug === slug)

/** Accent classes per tone, shared by every card and icon chip. */
export const TONES = {
  brand: {
    chip: 'bg-brand-50 text-brand-700 ring-brand-100',
    solid: 'bg-brand-600 text-white',
    text: 'text-brand-700',
    dot: 'bg-brand-500',
  },
  aqua: {
    chip: 'bg-aqua-50 text-aqua-700 ring-aqua-100',
    solid: 'bg-aqua-600 text-white',
    text: 'text-aqua-700',
    dot: 'bg-aqua-500',
  },
  emergency: {
    chip: 'bg-emergency-50 text-emergency-700 ring-emergency-100',
    solid: 'bg-emergency-600 text-white',
    text: 'text-emergency-700',
    dot: 'bg-emergency-500',
  },
}
