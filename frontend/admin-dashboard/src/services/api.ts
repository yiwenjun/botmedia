import axios from 'axios';
import { getToken } from './auth';
import type {
  Article,
  ArticleCreateDTO,
  ArticleUpdateDTO,
  ArticleQueryParams,
  Product,
  ProductCreateDTO,
  ProductUpdateDTO,
  ProductQueryParams,
  User,
  UserCreateDTO,
  UserUpdateDTO,
  UserQueryParams,
  Order,
  OrderCreateDTO,
  OrderUpdateDTO,
  OrderQueryParams,
  ApiResponse,
  PaginatedResponse,
  DashboardStats,
  ViewStats,
  CategoryStats,
} from '@/types';

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for 401 redirect
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Article API
export const articleAPI = {
  list: (params?: ArticleQueryParams) =>
    apiClient.get<ApiResponse<PaginatedResponse<Article>>>('/articles', { params }),

  get: (id: number) =>
    apiClient.get<ApiResponse<Article>>(`/articles/${id}`),

  create: (data: ArticleCreateDTO) =>
    apiClient.post<ApiResponse<Article>>('/articles', data),

  update: (id: number, data: ArticleUpdateDTO) =>
    apiClient.put<ApiResponse<Article>>(`/articles/${id}`, data),

  delete: (id: number) =>
    apiClient.delete<ApiResponse<void>>(`/articles/${id}`),

  publish: (id: number) =>
    apiClient.post<ApiResponse<Article>>(`/articles/${id}/publish`),

  archive: (id: number) =>
    apiClient.post<ApiResponse<Article>>(`/articles/${id}/archive`),
};

// Product API
export const productAPI = {
  list: (params?: ProductQueryParams) =>
    apiClient.get<ApiResponse<PaginatedResponse<Product>>>('/products', { params }),

  get: (id: number) =>
    apiClient.get<ApiResponse<Product>>(`/products/${id}`),

  create: (data: ProductCreateDTO) =>
    apiClient.post<ApiResponse<Product>>('/products', data),

  update: (id: number, data: ProductUpdateDTO) =>
    apiClient.put<ApiResponse<Product>>(`/products/${id}`, data),

  delete: (id: number) =>
    apiClient.delete<ApiResponse<void>>(`/products/${id}`),
};

// User API
export const userAPI = {
  list: (params?: UserQueryParams) =>
    apiClient.get<ApiResponse<PaginatedResponse<User>>>('/users', { params }),

  get: (id: number) =>
    apiClient.get<ApiResponse<User>>(`/users/${id}`),

  create: (data: UserCreateDTO) =>
    apiClient.post<ApiResponse<User>>('/users', data),

  update: (id: number, data: UserUpdateDTO) =>
    apiClient.put<ApiResponse<User>>(`/users/${id}`, data),

  delete: (id: number) =>
    apiClient.delete<ApiResponse<void>>(`/users/${id}`),

  toggleStatus: (id: number, status: 'active' | 'banned') =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}/status`, { status }),
};

// Order API
export const orderAPI = {
  list: (params?: OrderQueryParams) =>
    apiClient.get<ApiResponse<PaginatedResponse<Order>>>('/orders', { params }),

  get: (id: number) =>
    apiClient.get<ApiResponse<Order>>(`/orders/${id}`),

  create: (data: OrderCreateDTO) =>
    apiClient.post<ApiResponse<Order>>('/orders', data),

  update: (id: number, data: OrderUpdateDTO) =>
    apiClient.put<ApiResponse<Order>>(`/orders/${id}`, data),

  refund: (id: number) =>
    apiClient.post<ApiResponse<Order>>(`/orders/${id}/refund`),
};

// Analytics API
export const analyticsAPI = {
  getDashboardStats: () =>
    apiClient.get<ApiResponse<DashboardStats>>('/analytics/dashboard'),

  getViewStats: (days: number = 30) =>
    apiClient.get<ApiResponse<ViewStats[]>>('/analytics/views', { params: { days } }),

  getCategoryStats: () =>
    apiClient.get<ApiResponse<CategoryStats[]>>('/analytics/categories'),

  getTopArticles: (limit: number = 10) =>
    apiClient.get<ApiResponse<Article[]>>('/analytics/top-articles', { params: { limit } }),
};

export default apiClient;
