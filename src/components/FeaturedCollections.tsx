'use client';

import { useEffect } from 'react';
import { useCollections } from '@/services/collectionService';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/app/i18n-client';

export function FeaturedCollections() {
  const { featuredCollections, isLoading, error, fetchCollections } = useCollections();
  const params = useParams();
  const lang = params?.lang as string || 'en';
  const { t } = useTranslation(lang, 'common');
  
  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || featuredCollections.length === 0) {
    return null;
  }
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">{t('collections.featuredTitle')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('collections.featuredDescription')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCollections.slice(0, 3).map((collection) => (
            <Link 
              key={collection.id} 
              href={`/${lang}/collections/${collection.slug}`}
              className="group block"
            >
              <div className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="relative h-80 w-full">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    {t('collections.featured')}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {collection.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{collection.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {t('collections.itemCount', { count: collection.products.length })}
                    </span>
                    <span className="text-primary font-medium group-hover:underline">
                      {t('collections.viewCollection')} &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link
            href={`/${lang}/collections`}
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            {t('collections.viewAllCollections')}
          </Link>
        </div>
      </div>
    </section>
  );
} 