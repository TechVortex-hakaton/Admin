import { api } from './api';
import type { ApiResponse, DashboardStats } from '@/types';

export const adminService = {
  async getDashboard(): Promise<DashboardStats> {
    const res = await api.get<ApiResponse<DashboardStats>>('/admin/dashboard');
    return res.data.data;
  },
};
