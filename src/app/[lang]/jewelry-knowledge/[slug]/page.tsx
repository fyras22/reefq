import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/app/i18n/index';
import { formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation';

type ArticlePageProps = {
  params: {
    lang: string;
    slug: string;
  };
};

// Generate metadata for the page
export async function generateMetadata(
  { params }: ArticlePageProps
): Promise<Metadata> {
  const { slug } = params;
  
  try {
    const articleData = await getArticle(slug);
    
    if (!articleData) {
      return {
        title: 'Article Not Found | ReefQ',
      };
    }
    
    return {
      title: `${articleData.article.title} | ReefQ`,
      description: articleData.article.summary,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Jewelry Knowledge | ReefQ',
    };
  }
}

async function getArticle(slug: string) {
  try {
    // In a real app, this would use an environment variable for the base URL
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/jewelry-knowledge/${slug}`,
      { cache: 'no-store' }
    );
    
    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch article data');
    }
    
    return res.json();
  } catch (error) {
    console.error(`Error fetching article for slug ${slug}:`, error);
    throw error;
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { lang, slug } = params;
  const { t } = await useTranslation(lang);
  
  const articleData = await getArticle(slug);
  
  if (!articleData) {
    notFound();
  }
  
  const { article, relatedArticles } = articleData;
  
  return (
    <div className="container mx-auto px-4 py-12">
      <Link 
        href={`/${lang}/jewelry-knowledge`}
        className="inline-flex items-center text-primary hover:text-primary/80 mb-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
          <path d="m15 18-6-6 6-6" />
        </svg>
        {t('back_to_all_articles')}
      </Link>
      
      <article className="max-w-4xl mx-auto">
        {/* Article Header */}
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            {article.categoryName}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{article.summary}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="font-medium">{article.author}</span>
            <span>•</span>
            <time dateTime={article.publishDate}>{formatDate(article.publishDate, lang)}</time>
          </div>
        </div>
        
        {/* Article Featured Image */}
        <div className="relative w-full h-[400px] mb-10 rounded-lg overflow-hidden">
          <Image 
            src={article.image || '/images/placeholder.jpg'}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
      
      {/* Related Articles */}
      {relatedArticles && relatedArticles.length > 0 && (
        <div className="mt-16 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">{t('related_articles')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((relatedArticle) => (
              <div key={relatedArticle.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={relatedArticle.image || '/images/placeholder.jpg'}
                    alt={relatedArticle.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="text-xs text-primary font-medium mb-2 block">
                    {relatedArticle.categoryName}
                  </span>
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">
                    {relatedArticle.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                    {relatedArticle.summary}
                  </p>
                  <Link 
                    href={`/${lang}/jewelry-knowledge/${relatedArticle.slug}`}
                    className="text-primary hover:text-primary/80 font-medium text-sm transition"
                  >
                    {t('read_more')} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 