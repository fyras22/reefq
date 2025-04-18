'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCollections } from '@/services/collectionService';
import { useTranslation } from '@/app/i18n-client';
import Image from 'next/image';
import Link from 'next/link';
import { WishlistHeart } from '@/components/ui/WishlistHeart';

// Mock product data that we'll use with collection
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const mockProducts: Record<string, Product> = {
  '1': {
    id: '1',
    name: 'Gold Hoop Earrings',
    price: 129.99,
    image: '/images/products/gold-hoop-earrings.jpg',
    category: 'Earrings'
  },
  '2': {
    id: '2',
    name: 'Diamond Tennis Bracelet',
    price: 999.99,
    image: '/images/products/diamond-tennis-bracelet.jpg',
    category: 'Bracelets'
  },
  '3': {
    id: '3',
    name: 'Pearl Necklace',
    price: 249.99,
    image: '/images/products/pearl-necklace.jpg',
    category: 'Necklaces'
  },
  '4': {
    id: '4',
    name: 'Diamond Stud Earrings',
    price: 599.99,
    image: '/images/products/diamond-stud-earrings.jpg',
    category: 'Earrings'
  },
  '5': {
    id: '5',
    name: 'Rose Gold Ring',
    price: 349.99,
    image: '/images/products/rose-gold-ring.jpg',
    category: 'Rings'
  },
  '6': {
    id: '6',
    name: 'Gold Chain Necklace',
    price: 179.99,
    image: '/images/products/gold-chain-necklace.jpg',
    category: 'Necklaces'
  },
  '7': {
    id: '7',
    name: 'Diamond Pendant',
    price: 699.99,
    image: '/images/products/diamond-pendant.jpg',
    category: 'Necklaces'
  },
  '8': {
    id: '8',
    name: 'Silver Cuff Bracelet',
    price: 149.99,
    image: '/images/products/silver-cuff-bracelet.jpg',
    category: 'Bracelets'
  },
  '9': {
    id: '9',
    name: 'Diamond Engagement Ring',
    price: 2499.99,
    image: '/images/products/diamond-engagement-ring.jpg',
    category: 'Rings'
  },
  '10': {
    id: '10',
    name: 'Gold Bangle Bracelet',
    price: 299.99,
    image: '/images/products/gold-bangle-bracelet.jpg',
    category: 'Bracelets'
  },
  '11': {
    id: '11',
    name: 'Gold Drop Earrings',
    price: 229.99,
    image: '/images/products/gold-drop-earrings.jpg',
    category: 'Earrings'
  },
  '12': {
    id: '12',
    name: 'Gold Statement Ring',
    price: 379.99,
    image: '/images/products/gold-statement-ring.jpg',
    category: 'Rings'
  },
  '13': {
    id: '13',
    name: 'Silver Pendant Necklace',
    price: 159.99,
    image: '/images/products/silver-pendant-necklace.jpg',
    category: 'Necklaces'
  }
};

export default function CollectionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { collections, isLoading, fetchCollections, getCollectionBySlug } = useCollections();
  const [collectionProducts, setCollectionProducts] = useState<Product[]>([]);
  
  const lang = params?.lang as string || 'en';
  const slug = params?.slug as string;
  const { t } = useTranslation(lang, 'common');

  useEffect(() => {
    if (collections.length === 0) {
      fetchCollections();
    } else {
      const collection = getCollectionBySlug(slug);
      if (collection) {
        // Get the products for this collection
        const products = collection.products.map(id => mockProducts[id]).filter(Boolean);
        setCollectionProducts(products);
      }
    }
  }, [collections, fetchCollections, getCollectionBySlug, slug]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const collection = getCollectionBySlug(slug);
  
  if (!collection) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold mb-4">{t('collections.notFound')}</h1>
          <p className="text-gray-600 mb-6">{t('collections.notFoundDescription')}</p>
          <button 
            onClick={() => router.push(`/${lang}/collections`)} 
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition"
          >
            {t('collections.backToCollections')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href={`/${lang}/collections`} className="text-primary hover:underline mb-4 inline-block">
          &larr; {t('collections.backToCollections')}
        </Link>
        
        <div className="flex flex-col md:flex-row gap-8 mt-4">
          <div className="md:w-1/2">
            <div className="relative h-80 md:h-96 w-full rounded-lg overflow-hidden">
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              {collection.featured && (
                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  {t('collections.featured')}
                </div>
              )}
            </div>
          </div>
          
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-3">{collection.name}</h1>
            <p className="text-gray-600 mb-4">{collection.description}</p>
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-sm text-gray-500">
                {t('collections.itemCount', { count: collection.products.length })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-8" />
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">{t('collections.productsInCollection')}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collectionProducts.map((product) => (
            <div key={product.id} className="group relative border rounded-lg overflow-hidden">
              <div className="aspect-square relative">
                <Link href={`/${lang}/products/${product.id}`}>
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </Link>
                <div className="absolute top-2 right-2">
                  <WishlistHeart itemId={product.id} />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium truncate">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <div className="flex items-center justify-between">
                  <p className="font-semibold">${product.price.toFixed(2)}</p>
                  <button className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-dark transition">
                    {t('collections.addToCart')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 