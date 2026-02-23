import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/api';
import { Product } from '@/types';

// Mock product data as fallback
const mockProduct: Product = {
  id: 1,
  name: 'RoboArm Pro X1',
  slug: 'roboarm-pro-x1',
  brand: 'TechRobotics',
  model: 'X1-2024',
  description: `
    <p>The RoboArm Pro X1 represents the pinnacle of precision robotic manipulation technology. Designed for demanding industrial applications, this advanced robotic arm combines cutting-edge engineering with intuitive controls to deliver unmatched performance and reliability.</p>
    
    <h3>Key Features</h3>
    <ul>
      <li>6-axis articulation for maximum flexibility</li>
      <li>Payload capacity: 10kg</li>
      <li>Reach: 900mm</li>
      <li>Repeatability: ±0.02mm</li>
      <li>Integrated vision system for precise object recognition</li>
      <li>Easy programming interface with drag-and-drop functionality</li>
      <li>Safety-rated collaborative operation mode</li>
    </ul>
    
    <h3>Applications</h3>
    <p>Perfect for precision assembly, pick-and-place operations, quality inspection, machine tending, and packaging. The RoboArm Pro X1 excels in automotive, electronics, pharmaceutical, and food processing industries.</p>
  `,
  specifications: {
    'Degrees of Freedom': '6',
    'Payload': '10 kg',
    'Reach': '900 mm',
    'Repeatability': '±0.02 mm',
    'Weight': '24 kg',
    'Power Consumption': '350W',
    'Operating Temperature': '0-45°C',
    'IP Rating': 'IP54',
    'Controller': 'Integrated with touchscreen',
    'Communication': 'Ethernet, Modbus TCP, EtherCAT',
  },
  price: 45000,
  categoryId: 1,
  category: { id: 1, name: 'Industrial Arms', slug: 'industrial-arms', createdAt: '', updatedAt: '' },
  images: [],
  status: 'ACTIVE',
  viewCount: 350,
  createdAt: '2024-01-10T10:00:00Z',
  updatedAt: '2024-01-10T10:00:00Z',
};

async function getProductData(id: string) {
  try {
    const response = await getProduct(parseInt(id));
    return response.data || mockProduct;
  } catch (error) {
    console.error('Failed to fetch product data:', error);
    return mockProduct;
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductData(params.id);

  if (!product) {
    notFound();
  }

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <div className="bg-slate-900 min-h-screen">
      {/* Breadcrumb */}
      <section className="bg-slate-800 py-4 border-b border-gray-700">
        <div className="container-custom">
          <Link
            href="/products"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </Link>
        </div>
      </section>

      {/* Product Details */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative h-96 lg:h-[500px] bg-slate-800 rounded-lg overflow-hidden border border-gray-700">
                {mainImage ? (
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-500 text-lg">No Image Available</span>
                  </div>
                )}
                {product.status === 'COMING_SOON' && (
                  <div className="absolute top-4 right-4 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-full">
                    Coming Soon
                  </div>
                )}
                {product.status === 'DISCONTINUED' && (
                  <div className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-full">
                    Discontinued
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.slice(1, 5).map((image, index) => (
                    <div
                      key={index}
                      className="relative h-24 bg-slate-800 rounded-lg overflow-hidden border border-gray-700 cursor-pointer hover:border-primary transition-colors"
                    >
                      <Image src={image} alt={`${product.name} ${index + 2}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Brand & Category */}
              <div className="flex items-center gap-4">
                <span className="px-4 py-2 text-sm font-semibold bg-primary/20 text-primary rounded-full">
                  {product.brand}
                </span>
                {product.category && (
                  <span className="px-4 py-2 text-sm font-semibold bg-slate-800 text-gray-300 rounded-full border border-gray-700">
                    {product.category.name}
                  </span>
                )}
              </div>

              {/* Product Name */}
              <h1 className="text-4xl lg:text-5xl font-bold text-white">{product.name}</h1>

              {/* Model */}
              <p className="text-xl text-gray-400">Model: {product.model}</p>

              {/* Price */}
              {product.price && (
                <div className="text-4xl font-bold text-primary">¥{product.price.toLocaleString()}</div>
              )}

              {/* Description */}
              <div
                className="prose prose-invert prose-lg max-w-none text-gray-300"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />

              {/* CTA Button */}
              <div className="pt-6">
                <Link
                  href="/contact"
                  className="inline-block px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
                >
                  Contact Us for Pricing
                </Link>
              </div>
            </div>
          </div>

          {/* Specifications Table */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-white mb-6">Technical Specifications</h2>
              <div className="bg-slate-800 rounded-lg border border-gray-700 overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value], index) => (
                      <tr
                        key={key}
                        className={`${index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-700/50'}`}
                      >
                        <td className="px-6 py-4 font-semibold text-white w-1/3">{key}</td>
                        <td className="px-6 py-4 text-gray-300">{String(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Custom styles */}
      <style jsx global>{`
        .prose h3 {
          color: #fff;
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .prose p {
          margin-bottom: 1rem;
          line-height: 1.75;
        }
        .prose ul {
          margin-top: 1rem;
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .prose li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}
