import { motion } from 'motion/react'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Icon from '@/components/ui/Icon'
import Photo from '@/components/ui/Photo'
import { EASE_OUT, staggerContainer } from '@/components/motion/variants'
import heroImage from '../../assets/images/hero-doctor-patient.webp'
import PulseLine from '../common/PulseLine'
import { AmbulanceEtaCard, CareBookingCard, LabReportCard } from '../mockups/StatusCards'

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_OUT } },
}

/** Each headline line rises out of its own clipping box. */
const line = {
  hidden: { y: '105%' },
  visible: { y: '0%', transition: { duration: 0.9, ease: EASE_OUT } },
}

const TRUST_POINTS = [
  { icon: 'badgeCheck', label: 'KYC-verified partners' },
  { icon: 'locate', label: 'Live GPS tracking' },
  { icon: 'lock', label: 'Masked calling' },
  { icon: 'languages', label: 'Hindi & English' },
]

const SERVICE_DOTS = [
  { icon: 'ambulance', className: 'bg-emergency-600' },
  { icon: 'handHeart', className: 'bg-aqua-600' },
  { icon: 'pill', className: 'bg-brand-600' },
]

function FloatIn({ delay, from, className, children }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: from === 'left' ? -28 : from === 'right' ? 28 : 0,
        y: from === 'bottom' ? 24 : 0,
      }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.75, ease: EASE_OUT, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-brand-50 via-white to-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-dots opacity-70 [mask-image:radial-gradient(ellipse_70%_60%_at_70%_30%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="absolute -top-40 right-[-10%] h-[36rem] w-[36rem] rounded-full bg-aqua-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/3 -left-40 h-[28rem] w-[28rem] rounded-full bg-brand-200/40 blur-3xl"
      />
      <PulseLine className="absolute bottom-10 left-0 h-24 w-full sm:h-28" />

      <Container
        width="wide"
        className="relative grid items-center gap-16 pt-10 pb-16 sm:pt-14 sm:pb-24 lg:grid-cols-12 lg:gap-8 lg:pt-16 lg:pb-32"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.1, 0.05)}
          className="flex flex-col gap-7 lg:col-span-7"
        >
          <motion.p
            variants={item}
            className="inline-flex items-center gap-3 self-start rounded-full bg-white py-1.5 pr-4 pl-1.5 text-[0.8125rem] font-semibold text-ink-700 shadow-card ring-1 ring-ink-200/70 ring-inset"
          >
            <span className="flex -space-x-1.5">
              {SERVICE_DOTS.map((dot) => (
                <span
                  key={dot.icon}
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-white ring-2 ring-white ${dot.className}`}
                >
                  <Icon name={dot.icon} size={12} strokeWidth={2} />
                </span>
              ))}
            </span>
            5 healthcare services. 1 app.
          </motion.p>

          <motion.h1
            variants={staggerContainer(0.12)}
            className="text-[2.5rem] leading-[1.06] tracking-[-0.03em] sm:text-display-lg lg:text-display-md xl:text-display-lg"
          >
            <span className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
              <motion.span variants={line} className="block">
                Care that reaches you,
              </motion.span>
            </span>
            <span className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
              <motion.span variants={line} className="block text-gradient-brand">
                the moment you need it.
              </motion.span>
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="max-w-xl text-lg leading-relaxed text-ink-500 sm:text-xl sm:leading-relaxed"
          >
            Ambulance booking, home nursing, medicine delivery, lab tests at home and
            blood bank requests in one app, with live tracking, verified partners and
            support in Hindi and English.
          </motion.p>

          <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row">
            <Button to="/services" size="lg" icon="arrowRight">
              Explore services
            </Button>
            <Button
              to="/services/ambulance"
              size="lg"
              variant="emergencySoft"
              icon="ambulance"
              iconPosition="left"
            >
              Book an ambulance
            </Button>
          </motion.div>

          <motion.ul
            variants={item}
            className="grid grid-cols-2 gap-x-6 gap-y-3 pt-1 sm:flex sm:flex-wrap"
          >
            {TRUST_POINTS.map((point) => (
              <li
                key={point.label}
                className="flex items-center gap-2 text-sm font-medium text-ink-600"
              >
                <Icon name={point.icon} size={17} className="text-brand-600" />
                {point.label}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <div className="relative lg:col-span-5 lg:pl-4">
          <div className="relative mx-auto aspect-square w-full max-w-[33rem]">
            {/* The 360° ring: slow dashed orbit with a dot riding it, echoing the logo. */}
            <div aria-hidden="true" className="absolute -inset-[7%] animate-spin-slow">
              <div className="h-full w-full rounded-full border-2 border-dashed border-brand-200" />
              <span className="absolute top-[14.6%] left-[14.6%] h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aqua-400 ring-4 ring-white" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: EASE_OUT, delay: 0.15 }}
              className="absolute inset-0"
            >
              <Photo
                src={heroImage}
                alt="A doctor listening to an elderly patient's heartbeat with a stethoscope"
                priority
                width={1200}
                height={1200}
                className="h-full w-full rounded-[3rem] shadow-float"
              />
            </motion.div>

            <FloatIn
              delay={0.75}
              from="left"
              className="absolute top-[7%] -left-2 sm:-left-10"
            >
              <div className="animate-float">
                <AmbulanceEtaCard />
              </div>
            </FloatIn>

            <FloatIn
              delay={0.95}
              from="right"
              className="absolute top-[46%] -right-2 sm:-right-8"
            >
              <div className="animate-float-slow">
                <CareBookingCard />
              </div>
            </FloatIn>

            <FloatIn
              delay={1.15}
              from="bottom"
              className="absolute bottom-[5%] left-[4%] hidden sm:block"
            >
              <LabReportCard />
            </FloatIn>
          </div>
        </div>
      </Container>
    </section>
  )
}
