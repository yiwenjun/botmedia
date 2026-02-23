import Link from 'next/link';
import Image from 'next/image';
import ArticleCard from '@/components/ArticleCard';
import ProductCard from '@/components/ProductCard';
import { getArticles, getProducts } from '@/lib/api';
import { Article, Product } from '@/types';

// Mock data as fallback
const mockArticles: Article[] = [
  {
    id: 1,
    title: '2024年人形机器人发展趋势展望',
    slug: 'humanoid-robots-2024-trends',
    summary: '深入分析人形机器人领域的最新技术突破及其对社会的潜在影响，探讨未来发展方向。',
    content: '',
    coverImage: '/images/humanoid-robot.png',
    author: '博智媒体',
    categoryId: 1,
    category: { id: 1, name: '行业动态', slug: 'industry-news', createdAt: '', updatedAt: '' },
    status: 'PUBLISHED',
    viewCount: 1250,
    publishedAt: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    title: '工业机器人选购指南：五款高效制造利器',
    slug: 'top-5-industrial-robots',
    summary: '全面评测市场上最受欢迎的五款工业机器人，为您的智能制造升级提供专业参考。',
    content: '',
    coverImage: '/images/robot-arm.png',
    author: '博智媒体',
    categoryId: 2,
    category: { id: 2, name: '产品评测', slug: 'product-reviews', createdAt: '', updatedAt: '' },
    status: 'PUBLISHED',
    viewCount: 980,
    publishedAt: '2024-01-14T10:00:00Z',
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z',
  },
  {
    id: 3,
    title: 'AI与机器人融合：开启智能新纪元',
    slug: 'ai-integration-robotics',
    summary: '探索人工智能如何赋能机器人产业，推动自动化技术革命性变革。',
    content: '',
    coverImage: '/images/ai-chip.png',
    author: '博智媒体',
    categoryId: 3,
    category: { id: 3, name: '技术前沿', slug: 'technology', createdAt: '', updatedAt: '' },
    status: 'PUBLISHED',
    viewCount: 1520,
    publishedAt: '2024-01-13T10:00:00Z',
    createdAt: '2024-01-13T10:00:00Z',
    updatedAt: '2024-01-13T10:00:00Z',
  },
];

const mockProducts: Product[] = [
  {
    id: 1,
    name: '智能协作机械臂 Pro X1',
    slug: 'roboarm-pro-x1',
    brand: '博智科技',
    model: 'X1-2024',
    description: '新一代高精度协作机械臂，适用于精密制造与智能装配',
    coverImage: '/images/robot-arm.png',
    price: 45000,
    categoryId: 1,
    status: 'ACTIVE',
    viewCount: 350,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: 2,
    name: '仓储物流机器人 WA-500',
    slug: 'autobot-warehouse',
    brand: '博智科技',
    model: 'WA-500',
    description: '自主导航仓储机器人，实现智能物流全自动化',
    coverImage: '/images/warehouse-robot.png',
    price: 78000,
    categoryId: 2,
    status: 'ACTIVE',
    viewCount: 420,
    createdAt: '2024-01-09T10:00:00Z',
    updatedAt: '2024-01-09T10:00:00Z',
  },
];

async function getHomeData() {
  try {
    const articlesResponse = await getArticles(1, 3);
    const productsResponse = await getProducts(1, 2);
    return {
      articles: articlesResponse.data?.content || mockArticles,
      products: productsResponse.data?.content || mockProducts,
    };
  } catch (error) {
    console.error('Failed to fetch home data, using mock data:', error);
    return {
      articles: mockArticles,
      products: mockProducts,
    };
  }
}

export default async function Home() {
  const { articles, products } = await getHomeData();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-robot.png"
            alt="机器人科技"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/50"></div>
        </div>
        <div className="container-custom relative z-10 py-24 md:py-32">
          <div className="max-w-3xl space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              探索
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                机器人科技
              </span>
              的无限可能
            </h1>
            <p className="text-xl md:text-2xl text-gray-200">
              专业的机器人行业资讯平台，为您提供最新行业动态、深度产品评测与前沿技术洞察
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/news" className="btn-primary text-center">
                浏览资讯
              </Link>
              <Link href="/products" className="btn-secondary bg-white/10 border-white text-white hover:bg-white hover:text-slate-900 text-center">
                查看产品
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-800 py-12">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-400">500+</div>
              <div className="text-gray-400 mt-2">深度文章</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-400">100+</div>
              <div className="text-gray-400 mt-2">产品评测</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-cyan-400">50万+</div>
              <div className="text-gray-400 mt-2">月度读者</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-400">200+</div>
              <div className="text-gray-400 mt-2">合作企业</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="section-padding bg-slate-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">最新资讯</h2>
            <p className="text-gray-400 text-lg">紧跟机器人行业前沿动态</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/news" className="btn-primary">
              查看全部资讯
            </Link>
          </div>
        </div>
      </section>

      {/* Product Showcase Section */}
      <section className="section-padding bg-slate-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">精选产品</h2>
            <p className="text-gray-400 text-lg">发现前沿机器人科技产品</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/products" className="btn-primary">
              浏览全部产品
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-slate-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">为什么选择博智媒体</h2>
            <p className="text-gray-400 text-lg">专业、权威、值得信赖</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800 rounded-xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">专业洞察</h3>
              <p className="text-gray-400">资深行业专家团队，提供深度技术分析与市场洞察</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">实时更新</h3>
              <p className="text-gray-400">7x24小时追踪全球机器人行业最新动态与突破</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">社区互动</h3>
              <p className="text-gray-400">连接行业专家、企业与爱好者，共建机器人技术生态</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-slate-800">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">关于博智媒体</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                博智媒体是中国领先的机器人行业自媒体平台，致力于为读者提供最专业、最全面的机器人技术资讯与产品信息。
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                我们的使命是连接前沿科技与产业应用，帮助企业和个人更好地了解和应用机器人技术，共同推动智能制造与自动化产业的发展。
              </p>
              <div className="pt-4">
                <Link href="/about" className="btn-secondary">
                  了解更多
                </Link>
              </div>
            </div>
            <div className="relative h-80 md:h-96 rounded-xl overflow-hidden">
              <Image
                src="/images/humanoid-robot.png"
                alt="关于博智媒体"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding tech-gradient">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            订阅我们的资讯
          </h2>
          <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
            关注博智媒体微信公众号，第一时间获取机器人行业最新资讯与独家报告
          </p>
          <Link href="/contact" className="btn-primary bg-white text-slate-900 hover:bg-gray-100">
            立即关注
          </Link>
        </div>
      </section>
    </div>
  );
}
