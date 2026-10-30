import { PartnerSession } from '../store/types';

/** Where a session should land: the next onboarding step, or the role's home tabs. */
export function homeRouteFor(session: PartnerSession): string {
  if (!session.isLoggedIn) return 'Login';
  if (!session.role) return 'RoleSelection';
  if (!session.detailsDone) return 'BasicDetails';
  if (session.kycStatus === 'missing' || session.kycStatus === 'rejected') return 'KycDocuments';
  if (session.kycStatus === 'pending') return 'KycPending';
  return session.role === 'vendor' ? 'VendorTabs' : 'CaretakerTabs';
}
