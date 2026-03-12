import { Metadata } from 'next';
import { Suspense } from 'react';
import { EditTierContent } from './EditTierContent';
import { Loader2 } from 'lucide-react';

interface EditPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EditPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `계급도 수정 | 계급도`,
    description: '나만의 계급도를 수정하세요.',
    robots: { index: false, follow: false },
  };
}

function LoadingFallback() {
  return (
    <div className="container py-12 flex justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
    </div>
  );
}

export default async function EditPage({ params }: EditPageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<LoadingFallback />}>
      <EditTierContent slug={slug} />
    </Suspense>
  );
}
