import { CategoryTabNav } from '@/components/category/CategoryTabNav';

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}

export default async function CategoryLayout({ children, params }: CategoryLayoutProps) {
  const { category } = await params;

  return (
    <>
      <CategoryTabNav category={category} />
      {children}
    </>
  );
}
