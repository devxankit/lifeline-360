import LegalDocument from '../components/common/LegalDocument'
import { privacyPolicy } from '../data/legal'

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      doc={privacyPolicy}
      description="How Lifeline 360 collects, uses and protects your information."
    />
  )
}
