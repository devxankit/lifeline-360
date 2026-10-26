import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import FloatingField from '@/components/forms/FloatingField'
import FormStatus from '@/components/forms/FormStatus'
import HoneypotField from '@/components/forms/HoneypotField'
import SelectField from '@/components/forms/SelectField'
import SubmitButton from '@/components/forms/SubmitButton'
import Icon from '@/components/ui/Icon'
import { isEnquiryApiEnabled } from '@/config/env'
import { useFormSubmit } from '@/hooks/useFormSubmit'
import { BLOOD_GROUPS, BLOOD_UNIT_OPTIONS, bloodRequestSchema } from '../../schemas'
import { submitBloodRequest } from '../../services/enquiryService'
import PreviewNotice from '../common/PreviewNotice'

/**
 * Blood request for a patient at the hospital chosen in the PM-JAY locator,
 * following the Scope of Work blood flow: blood group → units → request →
 * blood bank response.
 */
export default function BloodRequestForm({ hospital }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bloodRequestSchema),
    mode: 'onBlur',
    defaultValues: { bloodGroup: '', units: '', patientName: '', phone: '', website: '' },
  })

  const submitFn = useCallback(
    (values, meta) =>
      submitBloodRequest(
        { ...values, hospitalId: hospital.id, hospitalName: hospital.name },
        meta
      ),
    [hospital]
  )

  const { submitState, banner, onSubmit } = useFormSubmit({ submitFn, setError, reset })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <FormStatus state={banner.state} message={banner.message} />

      <div className="flex items-start gap-3 rounded-2xl bg-emergency-50 p-4 ring-1 ring-emergency-100 ring-inset">
        <Icon name="hospital" size={20} className="mt-0.5 text-emergency-700" />
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.12em] text-emergency-700 uppercase">
            Blood needed at
          </p>
          <p className="font-display text-base font-bold text-ink-900">{hospital.name}</p>
          <p className="text-sm text-ink-500">
            {hospital.bloodBank
              ? 'This hospital has its own blood bank.'
              : 'Sent to registered blood banks serving this hospital.'}
          </p>
        </div>
      </div>

      <fieldset aria-describedby={errors.bloodGroup ? 'blood-group-error' : undefined}>
        <legend className="mb-2.5 text-sm font-semibold text-ink-700">Blood group</legend>
        <div className="grid grid-cols-4 gap-2">
          {BLOOD_GROUPS.map((group) => (
            <label key={group} className="relative">
              <input
                type="radio"
                value={group}
                className="peer sr-only"
                {...register('bloodGroup')}
              />
              <span className="flex h-12 cursor-pointer items-center justify-center rounded-xl font-display text-base font-bold text-ink-800 ring-1 ring-ink-200 transition-all duration-200 ring-inset peer-checked:scale-[1.04] peer-checked:bg-emergency-600 peer-checked:text-white peer-checked:ring-emergency-600 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500 hover:ring-emergency-300">
                {group}
              </span>
            </label>
          ))}
        </div>
        {errors.bloodGroup ? (
          <p
            id="blood-group-error"
            role="alert"
            className="mt-1.5 flex items-center gap-1.5 px-1 text-xs text-danger"
          >
            <Icon name="alert" size={13} />
            {errors.bloodGroup.message}
          </p>
        ) : null}
      </fieldset>

      <SelectField
        label="Units needed"
        placeholder="Choose units"
        options={BLOOD_UNIT_OPTIONS}
        error={errors.units?.message}
        {...register('units')}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <FloatingField
          label="Patient’s name"
          autoComplete="name"
          error={errors.patientName?.message}
          {...register('patientName')}
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

      <HoneypotField registration={register('website')} />

      <SubmitButton
        state={submitState}
        idleLabel="Request blood"
        submittingLabel="Requesting…"
        successLabel={isEnquiryApiEnabled ? 'Request sent' : 'Details checked'}
        tone="emergency"
        fullWidth
      />

      <PreviewNotice />
    </form>
  )
}
