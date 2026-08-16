import { api } from './api';
import type { Sport, ApiResponse } from '@/types';

export interface SportPayload {
  title: string;
  description?: string;
  category?: string;
  duration?: number;
  difficulty?: string;
  calories?: number;
  image?: string;
  isActive?: boolean;
}

export const sportService = {
  async list(): Promise<Sport[]> {
    const res = await api.get<ApiResponse<Sport[]>>('/admin/sports');
    return res.data.data;
  },

  async create(payload: SportPayload): Promise<Sport> {
    const res = await api.post<ApiResponse<Sport>>('/admin/sports', payload);
    return res.data.data;
  },

  async update(id: string, payload: Partial<SportPayload>): Promise<Sport> {
    const res = await api.put<ApiResponse<Sport>>(`/admin/sports/${id}`, payload);
    return res.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/admin/sports/${id}`);
  },
};
