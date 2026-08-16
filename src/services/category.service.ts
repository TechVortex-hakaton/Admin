import { api } from './api';
import type { Category, ApiResponse } from '@/types';

export interface CategoryPayload {
  name: string;
  slug?: string;
}

export const categoryService = {
  async list(): Promise<Category[]> {
    // No GET /api/admin/categories exists — use the public endpoint.
    const res = await api.get<ApiResponse<Category[]>>('/categories');
    return res.data.data;
  },

  async create(payload: CategoryPayload): Promise<Category> {
    const res = await api.post<ApiResponse<Category>>('/admin/categories', payload);
    return res.data.data;
  },

  async update(id: string, payload: Partial<CategoryPayload>): Promise<Category> {
    const res = await api.put<ApiResponse<Category>>(`/admin/categories/${id}`, payload);
    return res.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/admin/categories/${id}`);
  },
};
