import { Metadata } from 'next';
import { LoginContent } from './LoginContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '로그인',
  description: '계급도 서비스에 로그인하세요.',
};

export default function LoginPage() {
  return <LoginContent />;
}
