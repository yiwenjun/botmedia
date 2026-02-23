import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.coverImage || (product.images && product.images.length > 0 ? product.images[0] : null);

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden card-hover border border-gray-700">
      {/* Product Image */}
      <div className="relative h-64 bg-gray-700">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
            <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {product.status === 'COMING_SOON' && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
            即将上市
          </div>
        )}
        {product.status === 'DISCONTINUED' && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
            已停产
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        {/* Brand */}
        {product.brand && (
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/20 text-primary rounded-full">
            {product.brand}
          </span>
        )}

        {/* Product Name */}
        <h3 className="text-xl font-bold text-white line-clamp-2 hover:text-primary transition-colors">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h3>

        {/* Model */}
        {product.model && (
          <p className="text-sm text-gray-400">型号：{product.model}</p>
        )}

        {/* Price */}
        {product.price && (
          <div className="text-2xl font-bold text-primary">
            ¥{product.price.toLocaleString()}
          </div>
        )}

        {/* View Details Link */}
        <div className="pt-4">
          <Link
            href={`/products/${product.id}`}
            className="inline-block w-full text-center px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            查看详情
          </Link>
        </div>
      </div>
    </div>
  );
}
