'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/app/i18n';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

// Types
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  categoryName: string;
  author: string;
  publishedAt: string;
  readingTime: number;
  featured: boolean;
}

const KnowledgeHub = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/jewelry-knowledge?type=categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        
        const data = await response.json();
        setCategories(data.categories);
      } catch (err) {
        setError('Error loading categories. Please try again later.');
        console.error(err);
      }
    };
    
    fetchCategories();
  }, []);

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        // Build URL based on selected category
        let url = '/api/jewelry-knowledge';
        if (selectedCategory) {
          url += `?category=${selectedCategory}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch articles');
        
        const data = await response.json();
        setArticles(data.articles);
        setIsLoading(false);
      } catch (err) {
        setError('Error loading articles. Please try again later.');
        setIsLoading(false);
        console.error(err);
      }
    };
    
    fetchArticles();
  }, [selectedCategory]);

  // Fetch featured articles (only on first load)
  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        const response = await fetch('/api/jewelry-knowledge?featured=true&limit=3');
        if (!response.ok) throw new Error('Failed to fetch featured articles');
        
        const data = await response.json();
        setFeaturedArticles(data.articles);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchFeaturedArticles();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white min-h-screen pt-24">
      {/* Header Banner */}
      <div className="bg-nile-teal text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4 font-serif text-center">Jewelry Knowledge Hub</h1>
          <p className="text-xl max-w-3xl mx-auto text-center">
            Explore our expert guides and insights to deepen your understanding of the jewelry world.
          </p>
        </div>
      </div>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-12 bg-bg-light">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8 font-serif text-nile-teal">Featured Insights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
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
                      sizes="(max-width: 768px) 100vw, 33vw"
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
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-500">{formatDate(article.publishedAt)}</span>
                      <span className="text-sm text-gray-500">{article.readingTime} min read</span>
                    </div>
                    <Link
                      href={`/knowledge/${article.slug}`}
                      className="mt-4 inline-flex items-center text-nile-teal hover:text-pharaonic-gold font-medium"
                    >
                      Read more
                      <ChevronRightIcon className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Navigation and Articles */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Category Navigation */}
            <div className="lg:w-1/4">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                <h3 className="text-lg font-bold mb-4 text-nile-teal">Categories</h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        selectedCategory === null
                          ? 'bg-nile-teal text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      All Articles
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-md ${
                          selectedCategory === category.id
                            ? 'bg-nile-teal text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Articles */}
            <div className="lg:w-3/4">
              <h2 className="text-2xl font-bold mb-8 font-serif text-nile-teal">
                {selectedCategory 
                  ? categories.find(c => c.id === selectedCategory)?.name || 'Articles'
                  : 'All Articles'
                }
              </h2>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nile-teal"></div>
                </div>
              ) : error ? (
                <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
              ) : articles.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No articles found in this category.
                </div>
              ) : (
                <div className="space-y-8">
                  {articles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      <div className="md:w-1/3 h-48 md:h-auto relative">
                        <Image
                          src={article.coverImage}
                          alt={article.title}
                          className="object-cover"
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="p-6 md:w-2/3">
                        <span className="text-xs font-semibold text-pharaonic-gold uppercase tracking-wide">
                          {article.categoryName}
                        </span>
                        <h3 className="mt-2 text-xl font-bold leading-tight">
                          <Link href={`/knowledge/${article.slug}`} className="hover:text-nile-teal transition-colors">
                            {article.title}
                          </Link>
                        </h3>
                        <p className="mt-2 text-gray-600">{article.excerpt}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <span className="text-sm text-gray-700 font-medium">{article.author}</span>
                            <span className="mx-2 text-gray-300">·</span>
                            <span className="text-sm text-gray-500">{formatDate(article.publishedAt)}</span>
                          </div>
                          <span className="text-sm text-gray-500">{article.readingTime} min read</span>
                        </div>
                        <Link
                          href={`/knowledge/${article.slug}`}
                          className="mt-4 inline-flex items-center text-nile-teal hover:text-pharaonic-gold font-medium"
                        >
                          Read more
                          <ChevronRightIcon className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 bg-pharaonic-gold/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4 font-serif text-nile-teal">Stay Updated</h2>
            <p className="text-gray-700 mb-6">
              Subscribe to our newsletter for the latest jewelry insights, trends, and educational content.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-nile-teal"
                required
              />
              <button
                type="submit"
                className="bg-nile-teal text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KnowledgeHub; 