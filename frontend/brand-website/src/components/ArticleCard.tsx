import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import dayjs from 'dayjs';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden card-hover border border-gray-700">
      {/* Cover Image */}
      <div className="relative h-48 bg-gray-700">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        {/* Category Badge */}
        {article.category && (
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/20 text-primary rounded-full">
            {article.category.name}
          </span>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-white line-clamp-2 hover:text-primary transition-colors">
          <Link href={`/news/${article.id}`}>{article.title}</Link>
        </h3>

        {/* Summary */}
        <p className="text-gray-400 text-sm line-clamp-3">{article.summary}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <span className="text-xs text-gray-500">
            {article.publishedAt
              ? dayjs(article.publishedAt).format('YYYY-MM-DD')
              : dayjs(article.createdAt).format('YYYY-MM-DD')}
          </span>
          <Link
            href={`/news/${article.id}`}
            className="text-primary hover:text-blue-400 text-sm font-semibold transition-colors"
          >
            阅读更多 →
          </Link>
        </div>
      </div>
    </div>
  );
}
