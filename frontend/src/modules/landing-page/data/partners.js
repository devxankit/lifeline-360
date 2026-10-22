/**
 * Partner onboarding content (Scope of Work §4–§8). Each partner type lists
 * the tools the scope gives it, so the page promises exactly what is built.
 */
export const partnerTypes = [
  {
    id: 'pharmacy',
    title: 'Pharmacies',
    icon: 'store',
    tone: 'brand',
    workspace: 'Partner app · Android & iOS',
    text: 'Reach patients nearby with your catalogue and prescription orders.',
    tools: [
      'Pharmacy profile & medicine catalogue',
      'Pricing and availability',
      'Prescription order management',
      'Order preparation & delivery handover',
      'Earnings and transactions',
    ],
  },
  {
    id: 'caretaker',
    title: 'Nurses & caretakers',
    icon: 'handHeart',
    tone: 'aqua',
    workspace: 'Partner app · Android & iOS',
    text: 'Get home-care bookings that match your services and availability.',
    tools: [
      'Profile and service details',
      'Service categories',
      'Availability management',
      'Accept or decline bookings',
      'Earnings, history and ratings',
    ],
  },
  {
    id: 'ambulance',
    title: 'Ambulance drivers',
    icon: 'ambulance',
    tone: 'emergency',
    workspace: 'Driver app · Android & iOS',
    text: 'Receive emergency requests near you and navigate straight to the patient.',
    tools: [
      'Vehicle and ambulance details',
      'Online / offline availability',
      'Emergency requests with pickup & hospital',
      'Navigation and live GPS',
      'Trip history and earnings',
    ],
  },
  {
    id: 'laboratory',
    title: 'Laboratories',
    icon: 'microscope',
    tone: 'aqua',
    workspace: 'Laboratory panel · Web',
    text: 'Offer tests and packages with home sample collection and digital reports.',
    tools: [
      'Lab profile, tests and categories',
      'Test pricing and packages',
      'Home collection scheduling',
      'Report upload & digital reports',
      'Payment and transaction history',
    ],
  },
  {
    id: 'blood-bank',
    title: 'Blood banks',
    icon: 'droplets',
    tone: 'emergency',
    workspace: 'Blood bank panel · Web',
    text: 'Show live availability by blood group and respond to requests quickly.',
    tools: [
      'Blood bank profile & service area',
      'Blood group management',
      'Available units and status',
      'Accept or decline requests',
      'Request history',
    ],
  },
]

/** Every partner follows the same onboarding sequence. */
export const onboardingSteps = [
  {
    title: 'Register',
    text: 'Tell us who you are and the service you provide.',
    icon: 'clipboardList',
  },
  {
    title: 'KYC & document verification',
    text: 'Share your documents. Our team verifies every partner before go-live.',
    icon: 'badgeCheck',
  },
  {
    title: 'Set up your profile',
    text: 'Add your services, catalogue, vehicle or blood stock, and your availability.',
    icon: 'userCheck',
  },
  {
    title: 'Start receiving requests',
    text: 'Accept bookings and orders, and track earnings from your app or panel.',
    icon: 'bellRing',
  },
]
