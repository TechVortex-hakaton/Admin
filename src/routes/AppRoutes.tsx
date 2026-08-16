import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { LoginPage } from '@/pages/Login/LoginPage';
import { DashboardPage } from '@/pages/Dashboard/DashboardPage';
import { UsersPage } from '@/pages/Users/UsersPage';
import { DoctorsPage } from '@/pages/Doctors/DoctorsPage';
import { PatientsPage } from '@/pages/Patients/PatientsPage';
import { AppointmentsPage } from '@/pages/Appointments/AppointmentsPage';
import { ArticlesPage } from '@/pages/Articles/ArticlesPage';
import { SportsPage } from '@/pages/Sports/SportsPage';
import { CategoriesPage } from '@/pages/Categories/CategoriesPage';
import { SettingsPage } from '@/pages/Settings/SettingsPage';
import { AccessDeniedPage } from '@/pages/AccessDeniedPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route path="/access-denied" element={<AccessDeniedPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/sports" element={<SportsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
