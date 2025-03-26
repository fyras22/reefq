import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { getOptions } from './i18n-settings';

// Initialize an i18next instance for server-side
export async function initI18next(lng: string, ns: string = 'common') {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => {
      // In Next.js App Router, we need to use dynamic imports instead of fs
      return import(`../../public/locales/${language}/${namespace || 'common'}.json`)
        .catch(() => {
          console.error(`Failed to load translation file for ${language}/${namespace}`);
          return {};
        });
    }))
    .init({
      ...getOptions(),
      lng,
      ns,
    });

  return i18nInstance;
}

// SSR translation function for use in Server Components
export async function getTranslation(lng: string, ns: string = 'common') {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(lng, ns),
    i18n: i18nextInstance,
  };
} 