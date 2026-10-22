import { useCallback, useEffect, useRef, useState } from 'react'

/** How long the submit button holds its success/error state before resetting. */
const BUTTON_RESET_MS = 3500

/**
 * Shared submit behaviour for the website's forms.
 *
 * Owns three things each form would otherwise duplicate:
 *   - the submit state machine driving the button (idle → submitting → done)
 *   - the persistent success/error banner, which outlives the button state
 *   - mapping the server's `fieldErrors` back onto the matching inputs, so a
 *     server-side rejection renders exactly like a client-side one
 *
 * `formStartedAt` is passed through so the backend can reject submissions that
 * were filled in faster than a person could type.
 *
 * @param {Object} options
 * @param {(values: any, meta: {formStartedAt: number}) => Promise<{message?: string}>} options.submitFn
 * @param {(name: string, error: {type: string, message: string}) => void} options.setError
 * @param {() => void} options.reset
 */
export function useFormSubmit({ submitFn, setError, reset }) {
  const [submitState, setSubmitState] = useState('idle')
  const [banner, setBanner] = useState({ state: 'idle', message: '' })

  const formStartedAt = useRef(Date.now())
  const resetTimer = useRef(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      if (resetTimer.current) clearTimeout(resetTimer.current)
    }
  }, [])

  const scheduleButtonReset = useCallback(() => {
    if (resetTimer.current) clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => {
      if (mounted.current) setSubmitState('idle')
    }, BUTTON_RESET_MS)
  }, [])

  const onSubmit = useCallback(
    async (values) => {
      setSubmitState('submitting')
      setBanner({ state: 'idle', message: '' })

      try {
        const data = await submitFn(values, { formStartedAt: formStartedAt.current })

        if (!mounted.current) return

        setSubmitState('success')
        setBanner({
          state: 'success',
          message: data?.message ?? 'Thank you. We have received your details.',
        })

        reset()
        // A fresh timestamp for the next submission, so the timing check
        // measures this form fill rather than the original page load.
        formStartedAt.current = Date.now()
        scheduleButtonReset()
      } catch (error) {
        if (!mounted.current) return

        if (error.fieldErrors) {
          for (const [field, message] of Object.entries(error.fieldErrors)) {
            setError(field, { type: 'server', message })
          }
        }

        setSubmitState('error')
        setBanner({
          state: 'error',
          message: error.message ?? 'Something went wrong. Please try again.',
        })
        scheduleButtonReset()
      }
    },
    [submitFn, setError, reset, scheduleButtonReset]
  )

  return { submitState, banner, onSubmit }
}
