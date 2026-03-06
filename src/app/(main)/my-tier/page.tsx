import { Metadata } from 'next';
import { MyTierListContent } from './MyTierListContent';

export const metadata: Metadata = {
  title: '내가 만든 계급도 | 계급도',
  description: '사용자들이 만든 다양한 계급도를 둘러보고, 나만의 계급도를 만들어보세요!',
  openGraph: {
    title: '내가 만든 계급도',
    description: '사용자들이 만든 다양한 계급도를 둘러보고, 나만의 계급도를 만들어보세요!',
  },
};

export default function MyTierListPage() {
  return <MyTierListContent />;
}
