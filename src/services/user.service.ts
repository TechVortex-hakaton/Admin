import { api } from './api';
import type { ApiResponse, User } from '@/types';

export const userService = {
  async list(): Promise<User[]> {
    const res = await api.get<ApiResponse<User[]>>('/admin/users');
    return res.data.data;
  },

  async setStatus(id: string, isActive: boolean): Promise<User> {
    const res = await api.put<ApiResponse<User>>(`/admin/users/${id}/status`, { isActive });
    return res.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  },
};
