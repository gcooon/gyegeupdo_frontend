import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Redirect old /tier to /running-shoes/tier
export default function TierRedirect() {
  redirect('/running-shoes/tier');
}
