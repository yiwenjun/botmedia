export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string;
  author: string;
  categoryId: number;
  category?: Category;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  brand: string;
  model: string;
  description: string;
  specifications?: Record<string, any>;
  price?: number;
  categoryId: number;
  category?: ProductCategory;
  coverImage?: string;
  images?: string[];
  status: 'ACTIVE' | 'DISCONTINUED' | 'COMING_SOON';
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleStats {
  articleId: number;
  viewCount: number;
  shareCount: number;
  article?: Article;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}
