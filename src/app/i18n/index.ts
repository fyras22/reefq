import { getTranslation } from '../i18n-server';

// Server-side translation function for use in Server Components
export async function useTranslation(lng: string, ns?: string) {
  return getTranslation(lng, ns);
} 