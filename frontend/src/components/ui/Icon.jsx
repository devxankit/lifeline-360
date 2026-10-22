import {
  Activity,
  Ambulance,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  BellRing,
  Bike,
  Building2,
  CalendarCheck,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  ClipboardCheck,
  ClipboardList,
  Clock,
  CreditCard,
  Crown,
  Droplet,
  Droplets,
  FileHeart,
  FileText,
  FlaskConical,
  Globe,
  HandHeart,
  Headset,
  HeartHandshake,
  HeartPulse,
  Hospital,
  House,
  IdCard,
  Info,
  Languages,
  LoaderCircle,
  LocateFixed,
  Lock,
  Mail,
  MapPin,
  Menu,
  MessageSquareText,
  Microscope,
  Minus,
  Navigation,
  Package,
  PackageCheck,
  Phone,
  PhoneCall,
  Pill,
  Plus,
  QrCode,
  Route,
  Scale,
  Search,
  ShieldCheck,
  ShieldPlus,
  Siren,
  Smartphone,
  Sparkles,
  Star,
  Stethoscope,
  Store,
  TestTubeDiagonal,
  TestTubes,
  Timer,
  Upload,
  UserCheck,
  UserRound,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * One icon component for the whole site.
 *
 * UI and healthcare glyphs come from lucide-react, so every icon shares one
 * stroke style; only the icons named here end up in the bundle. Social marks
 * are filled brand shapes lucide doesn't ship, so they stay as inline paths.
 */
const ICONS = {
  activity: Activity,
  alert: CircleAlert,
  ambulance: Ambulance,
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  badgeCheck: BadgeCheck,
  bell: Bell,
  bellRing: BellRing,
  bike: Bike,
  building: Building2,
  calendarCheck: CalendarCheck,
  calendarClock: CalendarClock,
  check: Check,
  checkCircle: CircleCheck,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  chevronUp: ChevronUp,
  clipboardCheck: ClipboardCheck,
  clipboardList: ClipboardList,
  clock: Clock,
  close: X,
  creditCard: CreditCard,
  crown: Crown,
  droplet: Droplet,
  droplets: Droplets,
  fileHeart: FileHeart,
  fileText: FileText,
  flask: FlaskConical,
  globe: Globe,
  handHeart: HandHeart,
  headset: Headset,
  heartHandshake: HeartHandshake,
  heartPulse: HeartPulse,
  home: House,
  hospital: Hospital,
  idCard: IdCard,
  info: Info,
  languages: Languages,
  locate: LocateFixed,
  lock: Lock,
  mail: Mail,
  mapPin: MapPin,
  menu: Menu,
  message: MessageSquareText,
  microscope: Microscope,
  minus: Minus,
  navigation: Navigation,
  package: Package,
  packageCheck: PackageCheck,
  phone: Phone,
  phoneCall: PhoneCall,
  pill: Pill,
  plus: Plus,
  qrCode: QrCode,
  route: Route,
  scale: Scale,
  search: Search,
  shieldCheck: ShieldCheck,
  shieldPlus: ShieldPlus,
  siren: Siren,
  smartphone: Smartphone,
  sparkles: Sparkles,
  spinner: LoaderCircle,
  star: Star,
  stethoscope: Stethoscope,
  store: Store,
  testTube: TestTubeDiagonal,
  testTubes: TestTubes,
  timer: Timer,
  upload: Upload,
  userCheck: UserCheck,
  user: UserRound,
  users: Users,
  wallet: Wallet,
}

const SOCIAL_PATHS = {
  facebook: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z',
  twitter:
    'M22 4.01c-.79.35-1.63.59-2.5.7a4.36 4.36 0 0 0 1.91-2.41c-.84.5-1.77.86-2.76 1.05A4.35 4.35 0 0 0 11.2 7.3 12.35 12.35 0 0 1 2.24 2.76 4.35 4.35 0 0 0 3.6 8.56c-.71-.02-1.38-.22-1.97-.54v.06a4.35 4.35 0 0 0 3.49 4.26c-.65.18-1.34.2-2 .08a4.35 4.35 0 0 0 4.06 3.02A8.73 8.73 0 0 1 2 17.24a12.31 12.31 0 0 0 6.67 1.95c8 0 12.38-6.63 12.38-12.38l-.01-.56A8.8 8.8 0 0 0 22 4.01Z',
  linkedin:
    'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6ZM6 9H2v12h4Zm-2-6a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z',
  instagram:
    'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM17.5 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z',
  youtube:
    'M22.5 7.2a3 3 0 0 0-2.1-2.1C18.6 4.6 12 4.6 12 4.6s-6.6 0-8.4.5A3 3 0 0 0 1.5 7.2C1 9 1 12 1 12s0 3 .5 4.8a3 3 0 0 0 2.1 2.1c1.8.5 8.4.5 8.4.5s6.6 0 8.4-.5a3 3 0 0 0 2.1-2.1C23 15 23 12 23 12s0-3-.5-4.8ZM9.9 15.3V8.7l5.5 3.3Z',
}

/**
 * @param {Object} props
 * @param {keyof typeof ICONS | keyof typeof SOCIAL_PATHS} props.name
 * @param {number} [props.size=20]
 * @param {number} [props.strokeWidth=1.75]
 * @param {string} [props.className]
 * @param {string} [props.title] - when set the icon is exposed to screen readers
 */
export default function Icon({
  name,
  size = 20,
  strokeWidth = 1.75,
  className,
  title,
  ...rest
}) {
  const a11y = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': 'true' }
  const LucideIcon = ICONS[name]

  if (LucideIcon) {
    return (
      <LucideIcon
        size={size}
        strokeWidth={strokeWidth}
        className={cn('shrink-0', className)}
        focusable="false"
        {...a11y}
        {...rest}
      />
    )
  }

  const d = SOCIAL_PATHS[name]
  if (!d) return null

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={cn('shrink-0', className)}
      focusable="false"
      {...a11y}
      {...rest}
    >
      <path d={d} />
    </svg>
  )
}
