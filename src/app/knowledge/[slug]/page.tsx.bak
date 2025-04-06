'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/app/i18n';
import { ChevronLeftIcon, ClockIcon, ShareIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  categoryName: string;
  author: string;
  publishedAt: string;
  readingTime: number;
}

const ArticlePage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      
      try {
        const response = await fetch(`/api/jewelry-knowledge?slug=${slug}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch article');
        }
        
        const data = await response.json();
        
        if (data.error) {
          setError('Article not found');
        } else {
          setArticle(data.article);
          // Fetch related articles from same category
          fetchRelatedArticles(data.article.category);
        }
        
        setIsLoading(false);
      } catch (err) {
        setError('Error loading article. Please try again later.');
        setIsLoading(false);
        console.error(err);
      }
    };
    
    fetchArticle();
  }, [slug]);

  // Fetch related articles
  const fetchRelatedArticles = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/jewelry-knowledge?category=${categoryId}&limit=3`);
      
      if (response.ok) {
        const data = await response.json();
        // Filter out the current article
        const filtered = data.articles.filter((a: Article) => a.slug !== slug);
        setRelatedArticles(filtered.slice(0, 2)); // Only take up to 2 articles
      }
    } catch (err) {
      console.error('Error fetching related articles:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nile-teal"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Article Not Found</h1>
        <p className="text-gray-600 mb-8">{error || 'The requested article could not be found'}</p>
        <Link href="/knowledge" className="bg-nile-teal text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors">
          Back to Knowledge Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-24">
      {/* Article Header */}
      <header className="bg-bg-light pt-12 pb-8 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/knowledge" 
              className="inline-flex items-center text-nile-teal hover:text-pharaonic-gold mb-6"
            >
              <ChevronLeftIcon className="h-5 w-5 mr-1" />
              Back to Knowledge Hub
            </Link>
            
            <div className="flex items-center mb-4">
              <span className="text-xs font-semibold text-pharaonic-gold uppercase tracking-wide">
                {article.categoryName}
              </span>
              <span className="mx-2 text-gray-300">·</span>
              <div className="flex items-center text-gray-500 text-sm">
                <ClockIcon className="h-4 w-4 mr-1" />
                {article.readingTime} min read
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif">
              {article.title}
            </h1>
            
            <p className="mt-4 text-xl text-gray-600 leading-relaxed">
              {article.excerpt}
            </p>
            
            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="flex items-center">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{article.author}</p>
                  <p className="text-gray-500">{formatDate(article.publishedAt)}</p>
                </div>
              </div>
              <button className="inline-flex items-center text-gray-500 hover:text-nile-teal">
                <ShareIcon className="h-5 w-5 mr-1" />
                Share
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Article content */}
      <motion.div 
        className="py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Cover image */}
            <div className="mb-12 relative h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={article.coverImage}
                alt={article.title}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>
            
            {/* Article content */}
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>
            
            {/* Article footer */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900 font-semibold">Category</h3>
                  <Link 
                    href={`/knowledge?category=${article.category}`} 
                    className="text-nile-teal hover:text-pharaonic-gold"
                  >
                    {article.categoryName}
                  </Link>
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold">Share this article</h3>
                  <div className="flex space-x-4 mt-2">
                    <button className="text-gray-500 hover:text-blue-600">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                      </svg>
                    </button>
                    <button className="text-gray-500 hover:text-blue-400">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </button>
                    <button className="text-gray-500 hover:text-blue-500">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 bg-bg-light">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 font-serif text-nile-teal">Related Articles</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="h-48 relative">
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-semibold text-pharaonic-gold uppercase tracking-wide">
                        {article.categoryName}
                      </span>
                      <h3 className="mt-2 text-xl font-bold leading-tight">
                        <Link href={`/knowledge/${article.slug}`} className="hover:text-nile-teal transition-colors">
                          {article.title}
                        </Link>
                      </h3>
                      <p className="mt-2 text-gray-600 line-clamp-2">{article.excerpt}</p>
                      <Link
                        href={`/knowledge/${article.slug}`}
                        className="mt-4 inline-flex items-center text-nile-teal hover:text-pharaonic-gold font-medium"
                      >
                        Read more
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-10 text-center">
                <Link 
                  href="/knowledge" 
                  className="inline-block rounded-md bg-nile-teal px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 transition-all"
                >
                  View All Articles
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ArticlePage; 