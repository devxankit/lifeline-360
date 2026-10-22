import { useEffect } from 'react'
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
import { PARTNER_OPTIONS, partnerSchema } from '../../schemas'
import { submitPartner } from '../../services/enquiryService'
import PreviewNotice from '../common/PreviewNotice'

/**
 * Partner registration (Scope of Work §13: Partner/Vendor Registration).
 * `partnerType` preselects the type, and follows the partner picked above the
 * form on the Partners page.
 */
export default function PartnerForm({ partnerType = '' }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(partnerSchema),
    mode: 'onBlur',
    defaultValues: {
      partnerType,
      name: '',
      organisation: '',
      phone: '',
      email: '',
      city: '',
      message: '',
      website: '',
    },
  })

  useEffect(() => {
    if (partnerType) setValue('partnerType', partnerType, { shouldValidate: false })
  }, [partnerType, setValue])

  const { submitState, banner, onSubmit } = useFormSubmit({
    submitFn: submitPartner,
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

      <SelectField
        label="I am registering as"
        placeholder="Choose your partner type"
        options={PARTNER_OPTIONS}
        error={errors.partnerType?.message}
        {...register('partnerType')}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <FloatingField
          label="Full name"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
        <FloatingField
          label="Business or organisation (optional)"
          autoComplete="organization"
          error={errors.organisation?.message}
          {...register('organisation')}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FloatingField
          label="Mobile number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <FloatingField
          label="Email address"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <FloatingField
        label="City"
        autoComplete="address-level2"
        error={errors.city?.message}
        {...register('city')}
      />

      <FloatingField
        as="textarea"
        label="Anything we should know? (optional)"
        rows={4}
        error={errors.message?.message}
        {...register('message')}
      />

      <HoneypotField registration={register('website')} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton
          state={submitState}
          idleLabel="Register interest"
          submittingLabel="Sending…"
          successLabel={isEnquiryApiEnabled ? 'Registered' : 'Details checked'}
        />
        <p className="text-xs leading-relaxed text-ink-400 sm:max-w-[16rem] sm:text-right">
          Registering starts verification; it is not an agreement. See our{' '}
          <Link
            to="/terms"
            className="font-medium text-ink-600 underline underline-offset-2 hover:text-brand-700"
          >
            Terms
          </Link>
          .
        </p>
      </div>

      <PreviewNotice />
    </form>
  )
}
