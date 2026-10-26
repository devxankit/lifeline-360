import { env, isEnquiryApiEnabled } from '@/config/env'

/** Long enough for the submit button's progress state to read naturally. */
const PREVIEW_DELAY_MS = 900

const firstName = (name = '') => name.trim().split(/\s+/)[0]

/**
 * In preview mode nothing leaves the browser, and the confirmation says so
 * plainly rather than implying a message was delivered.
 */
const PREVIEW_MESSAGES = {
  contact: (values) =>
    `Thank you, ${firstName(values.name)}. This is a preview build, so nothing was sent. On the live site your message goes straight to the Lifeline 360 care team.`,
  partner: (values) =>
    `Thank you, ${firstName(values.name)}. This is a preview build, so nothing was sent. On the live site our partner team will contact you about verification.`,
  ambulance: (values) =>
    `Thank you, ${firstName(values.patientName)}. This is a preview build, so no ambulance was booked. In the app, this request goes to verified drivers near your pickup point with ${values.hospitalName} as the destination, and you can track the ambulance live.`,
  blood: (values) =>
    `Thank you, ${firstName(values.patientName)}. This is a preview build, so no blood was requested. In the app, your request for ${values.units} ${values.units === '1' ? 'unit' : 'units'} of ${values.bloodGroup} goes to blood banks serving ${values.hospitalName}, and you see their response in the app.`,
}

/**
 * Sends a website enquiry or booking request.
 *
 * Posts to `${VITE_ENQUIRY_API_URL}/${kind}` once that variable is set. The
 * endpoint should reply `{ message }` on success, or `{ message, fieldErrors }`
 * with a 4xx status, and the form maps fieldErrors back onto its inputs.
 *
 * @param {'contact'|'partner'|'ambulance'|'blood'} kind
 * @param {Object} values - validated form values (including the honeypot)
 * @param {{formStartedAt?: number}} [meta]
 */
export async function submitEnquiry(kind, values, meta = {}) {
  if (!isEnquiryApiEnabled) {
    await new Promise((resolve) => setTimeout(resolve, PREVIEW_DELAY_MS))
    return { message: PREVIEW_MESSAGES[kind](values) }
  }

  let response
  try {
    response = await fetch(`${env.enquiryApiUrl}/${kind}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, formStartedAt: meta.formStartedAt }),
    })
  } catch {
    throw new Error(
      'We could not reach our servers. Check your connection and try again.'
    )
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(
      data.message || 'We could not send your details. Please try again.'
    )
    error.fieldErrors = data.fieldErrors
    throw error
  }

  return data
}

export const submitContact = (values, meta) => submitEnquiry('contact', values, meta)
export const submitPartner = (values, meta) => submitEnquiry('partner', values, meta)
export const submitAmbulanceBooking = (values, meta) =>
  submitEnquiry('ambulance', values, meta)
export const submitBloodRequest = (values, meta) => submitEnquiry('blood', values, meta)
