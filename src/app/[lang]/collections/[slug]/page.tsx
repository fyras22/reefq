'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCollections } from '@/services/collectionService';
import { useTranslation } from '@/app/i18n-client';
import Image from 'next/image';
import Link from 'next/link';
import { WishlistHeart } from '@/components/ui/WishlistHeart';
import { motion } from 'framer-motion';

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
    <>
      {/* Hero Section */}
      <div className="relative h-96 w-full overflow-hidden">
        <Image
          src={collection.image}
          alt={collection.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div className="container mx-auto px-4 h-full relative z-10">
          <div className="flex flex-col justify-end h-full pb-12">
            <nav className="flex mb-6 text-sm md:text-base text-white">
              <Link href={`/${lang}`} className="text-gray-300 hover:text-white transition-colors">
                {t('home')}
              </Link>
              <span className="mx-2 text-gray-500">/</span>
              <Link href={`/${lang}/collections`} className="text-gray-300 hover:text-white transition-colors">
                {t('collections.title')}
              </Link>
              <span className="mx-2 text-gray-500">/</span>
              <span className="text-white font-medium">{collection.name}</span>
            </nav>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              {collection.name}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-200 max-w-2xl"
            >
              {collection.description}
            </motion.p>
          </div>
        </div>
      </div>
      
      {/* Products Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{t('collections.productsInCollection')}</h2>
          <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">
            {t('collections.itemCount', { count: collection.products.length })}
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {collectionProducts.map((product, index) => (
            <motion.div 
              key={product.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group relative border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative">
                <Link href={`/${lang}/products/${product.id}`}>
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </Link>
                <div className="absolute top-2 right-2 z-10">
                  <WishlistHeart itemId={product.id} />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium truncate group-hover:text-primary transition-colors">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <div className="flex items-center justify-between">
                  <p className="font-semibold">${product.price.toFixed(2)}</p>
                  <button className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-dark transition">
                    {t('collections.addToCart')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">{t('collections.exploreMore')}</p>
          <Link
            href={`/${lang}/collections`}
            className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition"
          >
            {t('collections.backToCollections')}
          </Link>
        </div>
      </div>
    </>
  );
} 