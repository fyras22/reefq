import { Metadata, Viewport } from 'next';
import { createMetadata, createViewport } from '@/app/metadata';
import { getDictionary } from '@/lib/dictionary';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = createMetadata({
  title: 'Jewelry Knowledge Base',
  description: 'Learn about diamonds, gemstones, metals, and ring design',
});

export const viewport: Viewport = createViewport();

async function getKnowledgeArticles() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/jewelry-knowledge`, { 
    cache: 'no-store' 
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch knowledge articles');
  }
  
  return res.json();
}

export default async function KnowledgePage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dictionary = await getDictionary(lang);
  const { categories, articles } = await getKnowledgeArticles();

  return (
    <main className="container mx-auto py-8 px-4 md:px-6">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Jewelry Knowledge Base
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover everything you need to know about jewelry, from gemstones and metals to care guides and design trends
        </p>
      </section>
      
      {/* Categories Navigation */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <Link 
          href={`/${lang}/knowledge`} 
          className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition"
        >
          All
        </Link>
        {categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/${lang}/knowledge?category=${category.id}`}
            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition"
          >
            {category.name}
          </Link>
        ))}
      </div>
      
      {/* Featured Articles */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Featured Knowledge</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(0, 3).map((article) => (
            <Link 
              href={`/${lang}/knowledge/${article.slug}`} 
              key={article.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex flex-col h-full"
            >
              <div className="relative h-48 w-full">
                <Image 
                  src={article.image || '/images/placeholder.jpg'} 
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex-grow">
                <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold mb-1">
                  {categories.find(c => c.id === article.category)?.name}
                </div>
                <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                <p className="text-gray-600">{article.summary}</p>
              </div>
              <div className="px-6 pb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">{article.author}</span>
                  <span>•</span>
                  <span className="ml-2">{new Date(article.publishDate).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* All Articles */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">All Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link 
              href={`/${lang}/knowledge/${article.slug}`} 
              key={article.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col h-full"
            >
              <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{article.summary}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-blue-600 font-medium">Read more →</span>
                <span className="text-gray-500">{new Date(article.publishDate).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
} 