// Common types
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// Article types
export interface Article extends BaseEntity {
  title: string;
  summary: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  viewCount: number;
  author: string;
  authorId: number;
}

export interface ArticleCreateDTO {
  title: string;
  summary: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
}

export interface ArticleUpdateDTO extends Partial<ArticleCreateDTO> {}

// Product types
export interface Product extends BaseEntity {
  name: string;
  model: string;
  brand: string;
  price: number;
  category: string;
  description?: string;
  specifications?: Record<string, any>;
  images: string[];
  status: 'active' | 'inactive';
}

export interface ProductCreateDTO {
  name: string;
  model: string;
  brand: string;
  price: number;
  category: string;
  description?: string;
  specifications?: Record<string, any>;
  images: string[];
  status: 'active' | 'inactive';
}

export interface ProductUpdateDTO extends Partial<ProductCreateDTO> {}

// User types
export interface User extends BaseEntity {
  username: string;
  nickname?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  roles: string[];
  status: 'active' | 'banned';
  wechatOpenId?: string;
}

export interface UserCreateDTO {
  username: string;
  password: string;
  nickname?: string;
  email?: string;
  phone?: string;
  roles: string[];
  status: 'active' | 'banned';
}

export interface UserUpdateDTO extends Partial<Omit<UserCreateDTO, 'password'>> {
  password?: string;
}

// Order types
export interface Order extends BaseEntity {
  orderNo: string;
  userId: number;
  userName: string;
  productId: number;
  productName: string;
  amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled' | 'refunded';
  paymentMethod?: 'wechat' | 'alipay' | 'credit_card';
  paymentTime?: string;
  shippingAddress?: string;
  trackingNo?: string;
}

export interface OrderCreateDTO {
  userId: number;
  productId: number;
  amount: number;
  shippingAddress: string;
}

export interface OrderUpdateDTO {
  status?: Order['status'];
  paymentMethod?: Order['paymentMethod'];
  trackingNo?: string;
}

// Analytics types
export interface ViewStats {
  date: string;
  views: number;
}

export interface CategoryStats {
  category: string;
  count: number;
}

export interface DashboardStats {
  totalArticles: number;
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  todayViews: number;
  totalViews: number;
}

// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// API Response types
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Query params
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface ArticleQueryParams extends PaginationParams {
  title?: string;
  category?: string;
  status?: Article['status'];
  authorId?: number;
}

export interface ProductQueryParams extends PaginationParams {
  name?: string;
  brand?: string;
  category?: string;
  status?: Product['status'];
}

export interface OrderQueryParams extends PaginationParams {
  orderNo?: string;
  userId?: number;
  status?: Order['status'];
  startDate?: string;
  endDate?: string;
}

export interface UserQueryParams extends PaginationParams {
  username?: string;
  email?: string;
  status?: User['status'];
}
