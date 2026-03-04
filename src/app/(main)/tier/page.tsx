import { redirect } from 'next/navigation';

// Redirect old /tier to /running-shoes/tier
export default function TierRedirect() {
  redirect('/running-shoes/tier');
}
