import axios from 'axios';
import type { LoginRequest, LoginResponse, ApiResponse } from '@/types';

const TOKEN_KEY = 'botmedia_admin_token';
const USER_KEY = 'botmedia_admin_user';

// Login function
export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const apiBaseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
  
  const response = await axios.post<ApiResponse<LoginResponse>>(
    `${apiBaseURL}/auth/login`,
    { username, password } as LoginRequest
  );

  if (response.data.code === 0 && response.data.data) {
    const { token, user } = response.data.data;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return response.data.data;
  }

  throw new Error(response.data.message || 'Login failed');
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = '/login';
};

// Get token
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Check if authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};
