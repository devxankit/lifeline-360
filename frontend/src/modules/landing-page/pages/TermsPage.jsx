import LegalDocument from '../components/common/LegalDocument'
import { termsAndConditions } from '../data/legal'

export default function TermsPage() {
  return (
    <LegalDocument
      doc={termsAndConditions}
      description="The terms that govern your use of the Lifeline 360 apps and website."
    />
  )
}
