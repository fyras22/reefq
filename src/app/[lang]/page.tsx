import { Suspense } from 'react';
import ClientHomePage from '@/components/pages/ClientHomePage';
import { useTranslation } from '@/app/i18n/index';
import { languages } from '@/app/i18n-settings';

// Generate metadata
export async function generateMetadata({ params }: { params: { lang: string } }) {
  // Get the translations for this page
  const { t } = await useTranslation(params.lang);
  
  return {
    title: t('meta.home.title'),
    description: t('meta.home.description'),
  };
}

// Generate static paths for all supported languages
export async function generateStaticParams() {
  return languages.map(lang => ({ lang }));
}

export default async function Home({ params: { lang } }: { params: { lang: string } }) {
  // Pre-load server translations
  const { t } = await useTranslation(lang);
  
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ClientHomePage lang={lang} />
    </Suspense>
  );
} 