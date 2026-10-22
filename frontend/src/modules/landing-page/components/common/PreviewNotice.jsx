import Icon from '@/components/ui/Icon'
import { isEnquiryApiEnabled } from '@/config/env'
import { cn } from '@/lib/cn'

/**
 * Shown under forms until an enquiry endpoint is configured, so nobody
 * mistakes the preview build for a live inbox. Renders nothing once
 * VITE_ENQUIRY_API_URL is set.
 */
export default function PreviewNotice({ className }) {
  if (isEnquiryApiEnabled) return null

  return (
    <p
      className={cn(
        'flex items-start gap-2.5 rounded-2xl bg-ink-50 px-4 py-3 text-[0.8125rem] leading-relaxed text-ink-500 ring-1 ring-ink-100 ring-inset',
        className
      )}
    >
      <Icon name="info" size={16} className="mt-0.5 text-brand-600" />
      <span>
        <strong className="font-semibold text-ink-700">Preview build.</strong> This form
        checks your details but does not send them yet. Submissions go live once the
        Lifeline 360 backend is connected.
      </span>
    </p>
  )
}
