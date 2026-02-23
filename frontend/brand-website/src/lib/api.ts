import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getArticles = async (page: number = 1, size: number = 10, categoryId?: number) => {
  const params: any = { page, size };
  if (categoryId !== undefined) {
    params.categoryId = categoryId;
  }
  const response = await apiClient.get('/api/v1/articles', { params });
  return response.data;
};

export const getArticle = async (id: number) => {
  const response = await apiClient.get(`/api/v1/articles/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await apiClient.get('/api/v1/categories');
  return response.data;
};

export const getProducts = async (page: number = 1, size: number = 10, categoryId?: number) => {
  const params: any = { page, size };
  if (categoryId !== undefined) {
    params.categoryId = categoryId;
  }
  const response = await apiClient.get('/api/v1/products', { params });
  return response.data;
};

export const getProduct = async (id: number) => {
  const response = await apiClient.get(`/api/v1/products/${id}`);
  return response.data;
};

export const getProductCategories = async () => {
  const response = await apiClient.get('/api/v1/products/categories');
  return response.data;
};

export const getTopArticles = async (limit: number = 5) => {
  const response = await apiClient.get('/api/v1/analytics/articles/top', {
    params: { limit },
  });
  return response.data;
};

export default apiClient;
