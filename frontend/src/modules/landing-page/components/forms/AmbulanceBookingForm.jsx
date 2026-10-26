import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import FloatingField from '@/components/forms/FloatingField'
import FormStatus from '@/components/forms/FormStatus'
import HoneypotField from '@/components/forms/HoneypotField'
import SubmitButton from '@/components/forms/SubmitButton'
import Icon from '@/components/ui/Icon'
import { isEnquiryApiEnabled } from '@/config/env'
import { siteConfig } from '@/config/site'
import { useFormSubmit } from '@/hooks/useFormSubmit'
import { ambulanceBookingSchema } from '../../schemas'
import { submitAmbulanceBooking } from '../../services/enquiryService'
import PreviewNotice from '../common/PreviewNotice'

/**
 * Ambulance request with the hospital chosen in the PM-JAY locator already set
 * as the destination. "Use my location" fills the pickup point from the
 * browser; the coordinates stay on the device until the form is sent.
 */
export default function AmbulanceBookingForm({ hospital }) {
  const [locating, setLocating] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ambulanceBookingSchema),
    mode: 'onBlur',
    defaultValues: { pickup: '', patientName: '', phone: '', note: '', website: '' },
  })

  const submitFn = useCallback(
    (values, meta) =>
      submitAmbulanceBooking(
        { ...values, hospitalId: hospital.id, hospitalName: hospital.name },
        meta
      ),
    [hospital]
  )

  const { submitState, banner, onSubmit } = useFormSubmit({ submitFn, setError, reset })

  const fillPickupFromLocation = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setValue(
          'pickup',
          `My current location (${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)})`,
          { shouldValidate: true }
        )
        setLocating(false)
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <FormStatus state={banner.state} message={banner.message} />

      <div className="flex items-start gap-3 rounded-2xl bg-brand-50 p-4 ring-1 ring-brand-100 ring-inset">
        <Icon name="hospital" size={20} className="mt-0.5 text-brand-700" />
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.12em] text-brand-700 uppercase">
            Destination
          </p>
          <p className="font-display text-base font-bold text-ink-900">{hospital.name}</p>
          <p className="text-sm text-ink-500">
            {hospital.area}, {hospital.city}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <FloatingField
          label="Pickup address"
          autoComplete="street-address"
          error={errors.pickup?.message}
          {...register('pickup')}
        />
        <button
          type="button"
          onClick={fillPickupFromLocation}
          disabled={locating}
          className="inline-flex items-center gap-1.5 self-start rounded-full px-2 py-1 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 disabled:opacity-60"
        >
          <Icon
            name={locating ? 'spinner' : 'locate'}
            size={16}
            className={locating ? 'animate-spin' : undefined}
          />
          {locating ? 'Finding your location…' : 'Use my current location'}
        </button>
      </div>

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

      <FloatingField
        as="textarea"
        label="Anything the crew should know? (optional)"
        rows={3}
        error={errors.note?.message}
        {...register('note')}
      />

      <HoneypotField registration={register('website')} />

      <SubmitButton
        state={submitState}
        idleLabel="Request ambulance"
        submittingLabel="Requesting…"
        successLabel={isEnquiryApiEnabled ? 'Request sent' : 'Details checked'}
        tone="emergency"
        fullWidth
      />

      <p className="flex items-center gap-2 text-sm text-ink-500">
        <Icon name="info" size={16} className="text-emergency-600" />
        In a life-threatening emergency, also call {siteConfig.emergencyNumber}.
      </p>

      <PreviewNotice />
    </form>
  )
}
