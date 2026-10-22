// Centralised access to Vite env vars.
// Add new VITE_* variables here so the rest of the app never touches
// import.meta.env directly.
export const env = {
  appName: import.meta.env.VITE_APP_NAME || 'Lifeline 360',
  siteUrl: import.meta.env.VITE_SITE_URL || 'http://localhost:5173',
  mode: import.meta.env.MODE,

  /**
   * Base URL for website enquiries (contact form and partner registration).
   * Empty until the backend exposes those endpoints: the forms then run in
   * preview mode and say so on screen, rather than pretending to send.
   */
  enquiryApiUrl: import.meta.env.VITE_ENQUIRY_API_URL || '',
}

/** True once an enquiry endpoint has been configured. */
export const isEnquiryApiEnabled = Boolean(env.enquiryApiUrl)
