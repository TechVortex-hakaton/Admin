import { api } from './api';
import type { ApiResponse, AuthResponse, User } from '@/types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    return res.data.data;
  },

  async register(fullName: string, email: string, password: string): Promise<AuthResponse> {
    // Always creates a PATIENT account server-side — there is no admin self-registration.
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', {
      fullName,
      email,
      password,
    });
    return res.data.data;
  },

  async me(): Promise<User> {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data.data;
  },

  async updateMe(payload: {
    fullName?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<User> {
    const res = await api.put<ApiResponse<User>>('/auth/me', payload);
    return res.data.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};
