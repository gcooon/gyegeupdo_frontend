import { redirect } from 'next/navigation';

// Redirect old /quiz to /running-shoes/quiz
export default function QuizRedirect() {
  redirect('/running-shoes/quiz');
}
