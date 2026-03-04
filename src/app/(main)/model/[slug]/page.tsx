import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

// Redirect old /model/[slug] to /running-shoes/model/[slug]
export default async function ModelRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(`/running-shoes/model/${slug}`);
}
