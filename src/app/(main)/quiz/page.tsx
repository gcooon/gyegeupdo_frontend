import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Redirect old /quiz to /running-shoes/quiz
export default function QuizRedirect() {
  redirect('/running-shoes/quiz');
}
