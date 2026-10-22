import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import FloatingField from '@/components/forms/FloatingField'
import FormStatus from '@/components/forms/FormStatus'
import HoneypotField from '@/components/forms/HoneypotField'
import SelectField from '@/components/forms/SelectField'
import SubmitButton from '@/components/forms/SubmitButton'
import { isEnquiryApiEnabled } from '@/config/env'
import { useFormSubmit } from '@/hooks/useFormSubmit'
import { CONTACT_TOPICS, contactSchema } from '../../schemas'
import { submitContact } from '../../services/enquiryService'
import PreviewNotice from '../common/PreviewNotice'

/**
 * General enquiry form. `defaultTopic` preselects the topic, e.g. when the
 * membership page links here with ?topic=membership.
 */
export default function ContactForm({ defaultTopic = '' }) {
  const validTopic = CONTACT_TOPICS.some((topic) => topic.value === defaultTopic)
    ? defaultTopic
    : ''

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      topic: validTopic,
      message: '',
      website: '',
    },
  })

  const { submitState, banner, onSubmit } = useFormSubmit({
    submitFn: submitContact,
    setError,
    reset,
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="relative flex flex-col gap-5"
    >
      <FormStatus state={banner.state} message={banner.message} />

      <div className="grid gap-5 sm:grid-cols-2">
        <FloatingField
          label="Full name"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
        <FloatingField
          label="Mobile number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FloatingField
          label="Email (optional)"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <SelectField
          label="Topic"
          placeholder="Choose a topic"
          options={CONTACT_TOPICS}
          error={errors.topic?.message}
          {...register('topic')}
        />
      </div>

      <FloatingField
        as="textarea"
        label="How can we help?"
        rows={5}
        error={errors.message?.message}
        {...register('message')}
      />

      <HoneypotField registration={register('website')} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton
          state={submitState}
          idleLabel="Send message"
          submittingLabel="Sending…"
          successLabel={isEnquiryApiEnabled ? 'Message sent' : 'Details checked'}
        />
        <p className="text-xs leading-relaxed text-ink-400 sm:max-w-[16rem] sm:text-right">
          We use your details only to reply. See our{' '}
          <Link
            to="/privacy-policy"
            className="font-medium text-ink-600 underline underline-offset-2 hover:text-brand-700"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      <PreviewNotice />
    </form>
  )
}
