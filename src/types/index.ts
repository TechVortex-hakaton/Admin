export type Role = 'ADMIN' | 'DOCTOR' | 'PATIENT';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Doctor {
  id: string;
  userId: string;
  fullName: string;
  specialization: string;
  experience: number | null;
  phone: string | null;
  email: string | null;
  bio: string | null;
  avatar: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Patient {
  id: string;
  userId: string;
  fullName: string;
  birthDate: string | null;
  gender: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  reason: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  doctor?: Doctor;
  patient?: Patient;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  diagnosis: string;
  notes: string | null;
  recommendations: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string;
  image: string | null;
  categoryId: string | null;
  authorId: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category | null;
  author?: User | null;
}

export interface Sport {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  duration: number | null;
  difficulty: string | null;
  calories: number | null;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  todayAppointments: number;
}
