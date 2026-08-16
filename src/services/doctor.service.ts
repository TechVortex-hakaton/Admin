import { api } from './api';
import type { ApiResponse, Doctor } from '@/types';

export interface CreateDoctorPayload {
  fullName: string;
  email: string;
  password: string;
  specialization: string;
  experience?: number;
  phone?: string;
  bio?: string;
  avatar?: string;
}

export type UpdateDoctorPayload = Partial<CreateDoctorPayload> & { isActive?: boolean };

export const doctorService = {
  async list(): Promise<Doctor[]> {
    const res = await api.get<ApiResponse<Doctor[]>>('/admin/doctors');
    return res.data.data;
  },

  async create(payload: CreateDoctorPayload): Promise<Doctor> {
    const res = await api.post<ApiResponse<Doctor>>('/admin/doctors', payload);
    return res.data.data;
  },

  async update(id: string, payload: UpdateDoctorPayload): Promise<Doctor> {
    const res = await api.put<ApiResponse<Doctor>>(`/admin/doctors/${id}`, payload);
    return res.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/admin/doctors/${id}`);
  },
};
