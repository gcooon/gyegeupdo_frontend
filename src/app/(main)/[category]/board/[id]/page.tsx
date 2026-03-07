import { Metadata } from 'next';
import { Suspense } from 'react';
import { BoardPostDetailContent } from './BoardPostDetailContent';
import { getMockPostMeta } from './mockPosts';

interface PageProps {
  params: Promise<{ category: string; id: string }>;
}

const CATEGORY_META: Record<string, { name: string }> = {
  'running-shoes': { name: '러닝화' },
  'chicken': { name: '치킨' },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, id } = await params;
  const postMeta = getMockPostMeta(category, id);
  const categoryName = CATEGORY_META[category]?.name || '계급도';

  if (postMeta) {
    return {
      title: `${postMeta.title} — ${categoryName} 게시판`,
      description: postMeta.content.slice(0, 160),
    };
  }

  return {
    title: `게시글 #${id} — ${categoryName} 게시판`,
    description: '게시글 상세 내용을 확인하세요.',
  };
}

function PostDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
      <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
      <div className="space-y-3 mt-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 bg-muted rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default async function BoardPostDetailPage({ params }: PageProps) {
  const { category, id } = await params;

  return (
    <div className="container py-8">
      <Suspense fallback={<PostDetailSkeleton />}>
        <BoardPostDetailContent category={category} postId={id} />
      </Suspense>
    </div>
  );
}
