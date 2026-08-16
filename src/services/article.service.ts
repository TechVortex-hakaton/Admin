import { api } from './api';
import type { Article, ApiResponse } from '@/types';

export interface ArticlePayload {
  title: string;
  slug?: string;
  description?: string;
  content: string;
  image?: string;
  categoryId?: string | null;
  isPublished?: boolean;
}

export const articleService = {
  async list(): Promise<Article[]> {
    const res = await api.get<ApiResponse<Article[]>>('/admin/articles');
    return res.data.data;
  },

  async create(payload: ArticlePayload): Promise<Article> {
    const res = await api.post<ApiResponse<Article>>('/admin/articles', payload);
    return res.data.data;
  },

  async update(id: string, payload: Partial<ArticlePayload>): Promise<Article> {
    const res = await api.put<ApiResponse<Article>>(`/admin/articles/${id}`, payload);
    return res.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/admin/articles/${id}`);
  },
};
