import { api } from './api';
import type { ApiResponse, AuthResponse, User } from '@/types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    return res.data.data;
  },

  async me(): Promise<User> {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};
