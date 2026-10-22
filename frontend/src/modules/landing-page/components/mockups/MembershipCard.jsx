import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import { LogoMark } from '@/components/brand/Logo'
import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { sampleMember } from '../../data/membership'

const SPRING = { stiffness: 180, damping: 18, mass: 0.6 }

/**
 * The digital membership card (Scope of Work §9) at credit-card proportions.
 * It tilts toward the pointer with a light sheen sliding across, like a real
 * card catching the light. Member details are sample data.
 */
export default function MembershipCard({ className }) {
  const prefersReducedMotion = useReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [9, -9]), SPRING)
  const rotateY = useSpring(useTransform(px, [0, 1], [-12, 12]), SPRING)
  const sheenLeft = useTransform(px, [0, 1], ['-35%', '95%'])

  const onPointerMove = (event) => {
    if (prefersReducedMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    px.set((event.clientX - rect.left) / rect.width)
    py.set((event.clientY - rect.top) / rect.height)
  }

  const onPointerLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <div className={cn('[perspective:1200px]', className)}>
      <motion.div
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        role="img"
        aria-label={`Sample Lifeline 360 digital membership card for ${sampleMember.name}, ${sampleMember.plan}, valid till ${sampleMember.validTill}`}
        className="relative aspect-[1.586/1] w-full overflow-hidden rounded-[1.75rem] bg-linear-to-br from-brand-800 via-brand-600 to-aqua-500 p-6 text-white shadow-float sm:p-7"
      >
        <div
          aria-hidden="true"
          className="absolute -top-16 -right-16 h-56 w-56 rounded-full border-[28px] border-white/8"
        />
        <div
          aria-hidden="true"
          className="absolute -right-4 -bottom-24 h-56 w-56 rounded-full border border-white/15"
        />
        <motion.div
          aria-hidden="true"
          style={{ left: sheenLeft }}
          className="pointer-events-none absolute top-0 h-full w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/20 to-transparent"
        />

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <LogoMark tone="dark" className="h-8 w-8" />
              <span className="font-display text-base font-extrabold tracking-[-0.03em]">
                Lifeline<span className="text-aqua-200">360</span>
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[0.6875rem] font-bold tracking-[0.16em] uppercase ring-1 ring-white/25 ring-inset">
              <Icon name="crown" size={13} />
              Member
            </span>
          </div>

          <div>
            <p className="text-[0.6875rem] font-semibold tracking-[0.16em] text-white/65 uppercase">
              {sampleMember.plan}
            </p>
            <p className="mt-1 font-display text-xl font-bold sm:text-2xl">
              {sampleMember.name}
            </p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div className="flex gap-6 text-xs">
                <div>
                  <p className="text-white/60">Member ID</p>
                  <p className="mt-0.5 font-semibold tracking-[0.12em] tabular-nums">
                    {sampleMember.memberId}
                  </p>
                </div>
                <div>
                  <p className="text-white/60">Valid till</p>
                  <p className="mt-0.5 font-semibold tabular-nums">
                    {sampleMember.validTill}
                  </p>
                </div>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-ink-900">
                <Icon name="qrCode" size={26} />
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
