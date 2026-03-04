import { redirect } from 'next/navigation';

// Redirect old /compare to /running-shoes/compare
export default function CompareRedirect() {
  redirect('/running-shoes/compare');
}
