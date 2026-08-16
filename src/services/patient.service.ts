import { api } from './api';
import type { ApiResponse, Patient } from '@/types';

export const patientService = {
  async list(): Promise<Patient[]> {
    const res = await api.get<ApiResponse<Patient[]>>('/admin/patients');
    return res.data.data;
  },
};
