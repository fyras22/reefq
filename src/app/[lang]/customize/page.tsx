import { Metadata, Viewport } from 'next';
import { createMetadata, createViewport } from '@/app/metadata';
import { getDictionary } from '@/lib/dictionary';

export const metadata: Metadata = createMetadata({
  title: 'Customize Your Ring',
  description: 'Customize your perfect ring with our interactive design tool',
});

export const viewport: Viewport = createViewport();

export default async function CustomizePage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dictionary = await getDictionary(lang);

  return (
    <main className="container mx-auto py-8">
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {dictionary.customize.title || 'Customize Your Ring'}
        </h1>
        <p className="text-lg text-gray-600">
          {dictionary.customize.description || 'Create your perfect ring with our customization tools'}
        </p>
      </section>
      
      {/* Customize content will be implemented here */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-center text-gray-500">Ring customization interface coming soon</p>
      </div>
    </main>
  );
} 