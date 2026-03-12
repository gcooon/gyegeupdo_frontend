import { Metadata } from 'next';
import { SignupContent } from './SignupContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '회원가입',
  description: '계급도 서비스에 가입하세요.',
};

export default function SignupPage() {
  return <SignupContent />;
}
