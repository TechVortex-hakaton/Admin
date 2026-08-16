import { api } from './api';
import type { ApiResponse, Appointment } from '@/types';

export const appointmentService = {
  async list(): Promise<Appointment[]> {
    const res = await api.get<ApiResponse<Appointment[]>>('/admin/appointments');
    return res.data.data;
  },
};
