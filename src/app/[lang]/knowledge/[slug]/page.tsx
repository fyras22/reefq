import { Metadata, Viewport } from 'next';
import { createMetadata, createViewport } from '@/app/metadata';
import { getDictionary } from '@/lib/dictionary';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

async function getArticle(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/jewelry-knowledge/${slug}`, { 
    cache: 'no-store' 
  });
  
  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch article');
  }
  
  return res.json();
}

async function getRelatedArticles(category: string, currentSlug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/jewelry-knowledge`, { 
    cache: 'no-store' 
  });
  
  if (!res.ok) {
    return [];
  }
  
  const { articles } = await res.json();
  return articles
    .filter(article => article.category === category && article.slug !== currentSlug)
    .slice(0, 3);
}

export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const article = await getArticle(params.slug);
  
  if (!article) {
    return createMetadata({
      title: 'Article Not Found',
      description: 'The requested article could not be found',
    });
  }
  
  return createMetadata({
    title: article.title,
    description: article.summary,
    openGraph: {
      images: [{ url: article.image || '/images/placeholder.jpg' }],
    },
  });
}

export const viewport: Viewport = createViewport();

export default async function ArticlePage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const dictionary = await getDictionary(params.lang);
  const article = await getArticle(params.slug);
  
  if (!article) {
    notFound();
  }
  
  const relatedArticles = await getRelatedArticles(article.category, params.slug);
  
  return (
    <main className="container mx-auto py-8 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6 text-gray-500">
          <ol className="flex flex-wrap items-center">
            <li className="flex items-center">
              <Link href={`/${params.lang}`} className="hover:text-blue-600">Home</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link href={`/${params.lang}/knowledge`} className="hover:text-blue-600">Knowledge</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-800 font-medium truncate">{article.title}</li>
          </ol>
        </nav>
        
        {/* Article Header */}
        <header className="mb-8">
          <div className="text-sm text-blue-600 font-medium mb-2">{article.categoryName}</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
          <div className="flex items-center text-gray-500 mb-6">
            <span className="mr-4">{article.author}</span>
            <span>Published: {new Date(article.publishDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          
          {article.image && (
            <div className="relative h-[300px] md:h-[400px] w-full rounded-xl overflow-hidden mb-8">
              <Image 
                src={article.image} 
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          
          <p className="text-xl text-gray-600 mb-8">{article.summary}</p>
        </header>
        
        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        
        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-semibold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link 
                  href={`/${params.lang}/knowledge/${related.slug}`}
                  key={related.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  {related.image && (
                    <div className="relative h-40 w-full">
                      <Image 
                        src={related.image} 
                        alt={related.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{related.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{related.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
        
        {/* Back to Knowledge */}
        <div className="mt-8 text-center">
          <Link 
            href={`/${params.lang}/knowledge`}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Knowledge Base
          </Link>
        </div>
      </div>
    </main>
  );
} 