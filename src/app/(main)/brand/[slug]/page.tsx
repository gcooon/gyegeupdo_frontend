import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

// Redirect old /brand/[slug] to /running-shoes/brand/[slug]
export default async function BrandRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(`/running-shoes/brand/${slug}`);
}
