import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

// Redirect old /model/[slug] to /running-shoes/model/[slug]
export default async function ModelRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(`/running-shoes/model/${slug}`);
}
