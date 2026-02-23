'use client';

import { useState, useEffect } from 'react';
import ArticleCard from '@/components/ArticleCard';
import { getArticles, getCategories } from '@/lib/api';
import { Article, Category } from '@/types';

// Mock data as fallback
const mockArticles: Article[] = [
  {
    id: 1,
    title: 'The Future of Humanoid Robots in 2024',
    slug: 'future-humanoid-robots-2024',
    summary: 'Exploring the latest advancements in humanoid robotics and their potential impact on society.',
    content: '',
    author: 'BotMedia Team',
    categoryId: 1,
    category: { id: 1, name: 'Industry News', slug: 'industry-news', createdAt: '', updatedAt: '' },
    status: 'PUBLISHED',
    viewCount: 1250,
    publishedAt: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'Top 5 Industrial Robots for Manufacturing',
    slug: 'top-5-industrial-robots',
    summary: 'A comprehensive review of the most efficient industrial robots available in the market.',
    content: '',
    author: 'BotMedia Team',
    categoryId: 2,
    category: { id: 2, name: 'Product Reviews', slug: 'product-reviews', createdAt: '', updatedAt: '' },
    status: 'PUBLISHED',
    viewCount: 980,
    publishedAt: '2024-01-14T10:00:00Z',
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z',
  },
  {
    id: 3,
    title: 'AI Integration in Robotics: A New Era',
    slug: 'ai-integration-robotics',
    summary: 'How artificial intelligence is revolutionizing the robotics industry.',
    content: '',
    author: 'BotMedia Team',
    categoryId: 3,
    category: { id: 3, name: 'Technology', slug: 'technology', createdAt: '', updatedAt: '' },
    status: 'PUBLISHED',
    viewCount: 1520,
    publishedAt: '2024-01-13T10:00:00Z',
    createdAt: '2024-01-13T10:00:00Z',
    updatedAt: '2024-01-13T10:00:00Z',
  },
  {
    id: 4,
    title: 'Autonomous Robots in Healthcare',
    slug: 'autonomous-robots-healthcare',
    summary: 'The role of autonomous robots in modern healthcare facilities and patient care.',
    content: '',
    author: 'BotMedia Team',
    categoryId: 1,
    category: { id: 1, name: 'Industry News', slug: 'industry-news', createdAt: '', updatedAt: '' },
    status: 'PUBLISHED',
    viewCount: 890,
    publishedAt: '2024-01-12T10:00:00Z',
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z',
  },
  {
    id: 5,
    title: 'Robot Navigation Systems Explained',
    slug: 'robot-navigation-systems',
    summary: 'Understanding the technology behind autonomous robot navigation and path planning.',
    content: '',
    author: 'BotMedia Team',
    categoryId: 3,
    category: { id: 3, name: 'Technology', slug: 'technology', createdAt: '', updatedAt: '' },
    status: 'PUBLISHED',
    viewCount: 750,
    publishedAt: '2024-01-11T10:00:00Z',
    createdAt: '2024-01-11T10:00:00Z',
    updatedAt: '2024-01-11T10:00:00Z',
  },
  {
    id: 6,
    title: 'Collaborative Robots vs Traditional Robots',
    slug: 'cobots-vs-traditional-robots',
    summary: 'Comparing collaborative robots (cobots) with traditional industrial robots.',
    content: '',
    author: 'BotMedia Team',
    categoryId: 2,
    category: { id: 2, name: 'Product Reviews', slug: 'product-reviews', createdAt: '', updatedAt: '' },
    status: 'PUBLISHED',
    viewCount: 1100,
    publishedAt: '2024-01-10T10:00:00Z',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
];

const mockCategories: Category[] = [
  { id: 1, name: 'Industry News', slug: 'industry-news', createdAt: '', updatedAt: '' },
  { id: 2, name: 'Product Reviews', slug: 'product-reviews', createdAt: '', updatedAt: '' },
  { id: 3, name: 'Technology', slug: 'technology', createdAt: '', updatedAt: '' },
];

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const pageSize = 6;

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, [currentPage, selectedCategory]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await getArticles(currentPage, pageSize, selectedCategory);
      if (response.data?.content) {
        setArticles(response.data.content);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch articles, using mock data:', error);
      setArticles(mockArticles);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories, using mock data:', error);
      setCategories(mockCategories);
    }
  };

  const handleCategoryChange = (categoryId: number | undefined) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  return (
    <div className="bg-slate-900 min-h-screen">
      {/* Page Header */}
      <section className="tech-gradient py-16">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Latest News</h1>
          <p className="text-xl text-gray-200">
            Stay informed with the latest developments in robotics
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Category Filter */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-slate-800 rounded-lg p-6 border border-gray-700 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-4">Categories</h2>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange(undefined)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === undefined
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary text-white'
                          : 'text-gray-300 hover:bg-slate-700'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Articles Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-400 mt-4">Loading articles...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {articles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-4 mt-12">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-6 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-700"
                      >
                        Previous
                      </button>
                      <span className="px-6 py-3 bg-slate-800 text-white rounded-lg font-semibold border border-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-6 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-700"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
