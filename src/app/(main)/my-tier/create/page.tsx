import { Metadata } from 'next';
import { CreateTierContent } from './CreateTierContent';

export const metadata: Metadata = {
  title: '계급도 만들기',
  description: '나만의 계급도를 만들어보세요! 어떤 주제든 가능합니다.',
  openGraph: {
    title: '계급도 만들기',
    description: '나만의 계급도를 만들어보세요! 어떤 주제든 가능합니다.',
  },
};

export default function CreateTierPage() {
  return <CreateTierContent />;
}
