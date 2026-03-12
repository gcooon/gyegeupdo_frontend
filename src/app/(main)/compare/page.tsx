import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Redirect old /compare to /running-shoes/compare
export default function CompareRedirect() {
  redirect('/running-shoes/compare');
}
