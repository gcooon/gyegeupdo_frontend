import { AllCategoriesOverview } from '@/components/home';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="py-4 md:py-6">
      <AllCategoriesOverview />
    </div>
  );
}
