import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getArticle, getArticles } from '@/lib/api';
import { Article } from '@/types';
import dayjs from 'dayjs';
import ArticleCard from '@/components/ArticleCard';

// Mock article data as fallback
const mockArticle: Article = {
  id: 1,
  title: 'The Future of Humanoid Robots in 2024',
  slug: 'future-humanoid-robots-2024',
  summary: 'Exploring the latest advancements in humanoid robotics and their potential impact on society.',
  content: `
    <h2>Introduction</h2>
    <p>Humanoid robots have made significant progress in recent years, with advancements in artificial intelligence, mechanical engineering, and sensor technology converging to create increasingly capable machines.</p>
    
    <h2>Key Developments</h2>
    <p>The robotics industry has witnessed breakthrough innovations in several areas:</p>
    <ul>
      <li><strong>Advanced AI Integration:</strong> Modern humanoid robots leverage sophisticated AI algorithms for natural language processing, computer vision, and decision-making.</li>
      <li><strong>Improved Mobility:</strong> New actuator designs and control systems have dramatically enhanced the walking, balancing, and manipulation capabilities of humanoid robots.</li>
      <li><strong>Human-Robot Interaction:</strong> Enhanced sensors and more intuitive interfaces make it easier for humans to work alongside robotic companions.</li>
    </ul>
    
    <h2>Applications</h2>
    <p>Humanoid robots are finding applications across various sectors:</p>
    <ul>
      <li>Healthcare and elderly care assistance</li>
      <li>Manufacturing and logistics</li>
      <li>Education and research</li>
      <li>Entertainment and hospitality</li>
    </ul>
    
    <h2>Future Outlook</h2>
    <p>As technology continues to advance, we can expect humanoid robots to become more prevalent in our daily lives. The combination of decreasing costs and increasing capabilities will likely drive wider adoption across multiple industries.</p>
    
    <h2>Conclusion</h2>
    <p>The future of humanoid robotics is bright, with continuous innovations pushing the boundaries of what these machines can achieve. As we move forward, the focus will be on creating robots that can safely and effectively collaborate with humans in various settings.</p>
  `,
  coverImage: undefined,
  author: 'BotMedia Team',
  categoryId: 1,
  category: { id: 1, name: 'Industry News', slug: 'industry-news', createdAt: '', updatedAt: '' },
  status: 'PUBLISHED',
  viewCount: 1250,
  publishedAt: '2024-01-15T10:00:00Z',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
};

const mockRelatedArticles: Article[] = [
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
];

async function getArticleData(id: string) {
  try {
    const articleResponse = await getArticle(parseInt(id));
    const relatedResponse = await getArticles(1, 3);
    return {
      article: articleResponse.data || mockArticle,
      relatedArticles: relatedResponse.data?.content || mockRelatedArticles,
    };
  } catch (error) {
    console.error('Failed to fetch article data:', error);
    return {
      article: mockArticle,
      relatedArticles: mockRelatedArticles,
    };
  }
}

export default async function ArticleDetailPage({ params }: { params: { id: string } }) {
  const { article, relatedArticles } = await getArticleData(params.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="bg-slate-900 min-h-screen">
      {/* Article Header */}
      <section className="tech-gradient py-16">
        <div className="container-custom max-w-4xl">
          <Link
            href="/news"
            className="inline-flex items-center text-white hover:text-gray-200 mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to News
          </Link>
          
          {article.category && (
            <span className="inline-block px-4 py-2 text-sm font-semibold bg-white/20 text-white rounded-full mb-4">
              {article.category.name}
            </span>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{article.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-200">
            <span>By {article.author}</span>
            <span>•</span>
            <span>
              {article.publishedAt
                ? dayjs(article.publishedAt).format('MMMM DD, YYYY')
                : dayjs(article.createdAt).format('MMMM DD, YYYY')}
            </span>
            <span>•</span>
            <span>{article.viewCount} views</span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <article className="flex-1 max-w-4xl">
              {/* Cover Image */}
              {article.coverImage && (
                <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Article Body */}
              <div
                className="prose prose-invert prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
                style={{
                  color: '#e2e8f0',
                }}
              />
            </article>

            {/* Sidebar */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="bg-slate-800 rounded-lg p-6 border border-gray-700 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-6">Related Articles</h2>
                <div className="space-y-6">
                  {relatedArticles
                    .filter((related) => related.id !== article.id)
                    .slice(0, 3)
                    .map((related) => (
                      <div key={related.id} className="space-y-2">
                        <Link
                          href={`/news/${related.id}`}
                          className="text-white hover:text-primary transition-colors font-semibold line-clamp-2"
                        >
                          {related.title}
                        </Link>
                        <p className="text-sm text-gray-400">
                          {related.publishedAt
                            ? dayjs(related.publishedAt).format('MMM DD, YYYY')
                            : dayjs(related.createdAt).format('MMM DD, YYYY')}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

    </div>
  );
}
