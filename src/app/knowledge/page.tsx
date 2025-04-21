'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KnowledgeRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the language-specific knowledge page
    // Default to English if no language preference is detected
    const lang = navigator.language.split('-')[0] || 'en';
    router.replace(`/${lang}/knowledge`);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nile-teal"></div>
    </div>
  );
} 