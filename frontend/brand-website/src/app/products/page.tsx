'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { getProducts, getProductCategories } from '@/lib/api';
import { Product, ProductCategory } from '@/types';

// Mock data as fallback
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'RoboArm Pro X1',
    slug: 'roboarm-pro-x1',
    brand: 'TechRobotics',
    model: 'X1-2024',
    description: 'Advanced robotic arm for precision manufacturing',
    price: 45000,
    categoryId: 1,
    category: { id: 1, name: 'Industrial Arms', slug: 'industrial-arms', createdAt: '', updatedAt: '' },
    status: 'ACTIVE',
    viewCount: 350,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: 2,
    name: 'AutoBot Warehouse Assistant',
    slug: 'autobot-warehouse',
    brand: 'LogiBot',
    model: 'WA-500',
    description: 'Autonomous mobile robot for warehouse operations',
    price: 78000,
    categoryId: 2,
    category: { id: 2, name: 'Mobile Robots', slug: 'mobile-robots', createdAt: '', updatedAt: '' },
    status: 'ACTIVE',
    viewCount: 420,
    createdAt: '2024-01-09T10:00:00Z',
    updatedAt: '2024-01-09T10:00:00Z',
  },
  {
    id: 3,
    name: 'HumanBot Care Assistant',
    slug: 'humanbot-care',
    brand: 'CareRobotics',
    model: 'HC-200',
    description: 'Humanoid robot designed for healthcare and elderly care',
    price: 125000,
    categoryId: 3,
    category: { id: 3, name: 'Humanoid Robots', slug: 'humanoid-robots', createdAt: '', updatedAt: '' },
    status: 'ACTIVE',
    viewCount: 680,
    createdAt: '2024-01-08T10:00:00Z',
    updatedAt: '2024-01-08T10:00:00Z',
  },
  {
    id: 4,
    name: 'SmartGripper Elite',
    slug: 'smartgripper-elite',
    brand: 'GripTech',
    model: 'SG-E100',
    description: 'Intelligent gripper with adaptive pressure control',
    price: 12000,
    categoryId: 4,
    category: { id: 4, name: 'End Effectors', slug: 'end-effectors', createdAt: '', updatedAt: '' },
    status: 'ACTIVE',
    viewCount: 290,
    createdAt: '2024-01-07T10:00:00Z',
    updatedAt: '2024-01-07T10:00:00Z',
  },
  {
    id: 5,
    name: 'CoBot Collaborative Pro',
    slug: 'cobot-collaborative',
    brand: 'CollabRobotics',
    model: 'CP-300',
    description: 'Safe collaborative robot for human-robot teamwork',
    price: 38000,
    categoryId: 1,
    category: { id: 1, name: 'Industrial Arms', slug: 'industrial-arms', createdAt: '', updatedAt: '' },
    status: 'ACTIVE',
    viewCount: 540,
    createdAt: '2024-01-06T10:00:00Z',
    updatedAt: '2024-01-06T10:00:00Z',
  },
  {
    id: 6,
    name: 'DronBot Inspector X',
    slug: 'dronbot-inspector',
    brand: 'AeroBot',
    model: 'DI-X',
    description: 'Autonomous drone for industrial inspection',
    price: 52000,
    categoryId: 5,
    category: { id: 5, name: 'Drones', slug: 'drones', createdAt: '', updatedAt: '' },
    status: 'COMING_SOON',
    viewCount: 320,
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z',
  },
];

const mockCategories: ProductCategory[] = [
  { id: 1, name: 'Industrial Arms', slug: 'industrial-arms', createdAt: '', updatedAt: '' },
  { id: 2, name: 'Mobile Robots', slug: 'mobile-robots', createdAt: '', updatedAt: '' },
  { id: 3, name: 'Humanoid Robots', slug: 'humanoid-robots', createdAt: '', updatedAt: '' },
  { id: 4, name: 'End Effectors', slug: 'end-effectors', createdAt: '', updatedAt: '' },
  { id: 5, name: 'Drones', slug: 'drones', createdAt: '', updatedAt: '' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState<ProductCategory[]>(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const pageSize = 6;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts(currentPage, pageSize, selectedCategory);
      if (response.data?.content) {
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch products, using mock data:', error);
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getProductCategories();
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
          <h1 className="text-5xl font-bold text-white mb-4">Our Products</h1>
          <p className="text-xl text-gray-200">
            Discover cutting-edge robotics solutions for your needs
          </p>
        </div>
      </section>

      {/* Category Filter Tabs */}
      <section className="bg-slate-800 border-b border-gray-700">
        <div className="container-custom">
          <div className="flex overflow-x-auto py-4 gap-4">
            <button
              onClick={() => handleCategoryChange(undefined)}
              className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === undefined
                  ? 'bg-primary text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-4">Loading products...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
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
      </section>
    </div>
  );
}
