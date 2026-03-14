'use client';

import Link from 'next/link';
import { useTranslations } from '@/i18n';
import { useLocaleStore } from '@/store/localeStore';
import { useCategories } from '@/hooks/useBrands';
import { NAV_CATEGORIES } from '@/config/categories';

export function Footer() {
  const t = useTranslations('footer');
  const { locale } = useLocaleStore();
  const { data: apiCategories } = useCategories();
  // API 카테고리 우선, 폴백으로 하드코딩 유지
  const navCategories = (apiCategories && apiCategories.length > 0)
    ? apiCategories.map(c => ({ slug: c.slug, name: c.name, icon: c.icon || '📦' }))
    : NAV_CATEGORIES;
  const currentYear = new Date().getFullYear();
  const logoChar = locale === 'ko' ? '티' : 'T';

  return (
    <footer className="border-t border-border bg-card">
      <div className="py-8 md:py-12 px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                {logoChar}
              </div>
              <span className="font-bold text-lg">{t('brand')}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t('tagline')}
            </p>
          </div>

          {navCategories.slice(0, 3).map((category) => (
            <div key={category.slug}>
              <h3 className="font-semibold mb-3">{category.icon} {category.name}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href={`/${category.slug}/tier`} className="hover:text-foreground transition-colors">
                    {t('viewTier')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${category.slug}/quiz`} className="hover:text-foreground transition-colors">
                    {t('quiz')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${category.slug}/compare`} className="hover:text-foreground transition-colors">
                    {t('compare')}
                  </Link>
                </li>
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-semibold mb-3">{t('info')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  {t('terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {t('copyright', { year: currentYear })}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('affiliate')}
          </p>
        </div>
      </div>
    </footer>
  );
}
