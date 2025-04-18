import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/app/i18n/index';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Jewelry Knowledge | ReefQ',
  description: 'Explore our collection of articles about diamonds, gemstones, precious metals, and jewelry care.',
};

async function getJewelryKnowledge() {
  try {
    // In a real app, this would use an environment variable for the base URL
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/jewelry-knowledge`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch jewelry knowledge data');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching jewelry knowledge:', error);
    return { articles: [], categories: [] };
  }
}

export default async function JewelryKnowledgePage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const { t } = await useTranslation(lang);
  const { articles, categories } = await getJewelryKnowledge();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">{t('jewelry_knowledge')}</h1>
      
      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <Link 
          href={`/${lang}/jewelry-knowledge`}
          className="px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-full text-primary font-medium transition"
        >
          {t('all_articles')}
        </Link>
        {categories.map((category) => (
          <Link 
            key={category.id}
            href={`/${lang}/jewelry-knowledge?category=${category.slug}`}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-800 font-medium transition"
          >
            {category.name}
          </Link>
        ))}
      </div>
      
      {/* Featured Article */}
      {articles.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{t('featured_article')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-80 md:h-full overflow-hidden rounded-lg">
              <Image 
                src={articles[0].image || '/images/placeholder.jpg'} 
                alt={articles[0].title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm text-primary font-medium mb-2">{articles[0].categoryName}</span>
              <h3 className="text-2xl font-bold mb-3">{articles[0].title}</h3>
              <p className="text-gray-600 mb-4">{articles[0].summary}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <span>{articles[0].author}</span>
                <span>•</span>
                <span>{formatDate(articles[0].publishDate, lang)}</span>
              </div>
              <Link 
                href={`/${lang}/jewelry-knowledge/${articles[0].slug}`}
                className="self-start px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
              >
                {t('read_more')}
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* All Articles */}
      <div>
        <h2 className="text-2xl font-bold mb-6">{t('all_articles')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(1).map((article) => (
            <div key={article.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src={article.image || '/images/placeholder.jpg'} 
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <span className="text-xs text-primary font-medium mb-2 block">{article.categoryName}</span>
                <h3 className="text-xl font-bold mb-3 line-clamp-2">{article.title}</h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-3">{article.summary}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{article.author}</span>
                  <span>{formatDate(article.publishDate, lang)}</span>
                </div>
                <Link 
                  href={`/${lang}/jewelry-knowledge/${article.slug}`}
                  className="text-primary hover:text-primary/80 font-medium text-sm transition"
                >
                  {t('read_more')} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 