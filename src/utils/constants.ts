import type { AppointmentStatus, Role } from '@/types';

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Admin',
  DOCTOR: 'Doctor',
  PATIENT: 'Patient',
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-rose-100 text-rose-700',
};

export const CHART_COLORS = ['#2563eb', '#0ea5e9', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];
