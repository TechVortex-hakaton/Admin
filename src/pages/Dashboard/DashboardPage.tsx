import { useMemo } from 'react';
import { Users, Stethoscope, HeartPulse, CalendarClock, CalendarCheck, Newspaper } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { StatCard } from '@/components/ui/StatCard';
import { ChartCard } from '@/components/ui/ChartCard';
import { useDashboard } from '@/hooks/useDashboard';
import { useUsers } from '@/hooks/useUsers';
import { useDoctors } from '@/hooks/useDoctors';
import { usePatients } from '@/hooks/usePatients';
import { useAppointments } from '@/hooks/useAppointments';
import { useArticles } from '@/hooks/useArticles';
import { lastNMonthKeys, monthKey, monthLabel } from '@/utils/format';
import { APPOINTMENT_STATUS_LABELS, CHART_COLORS } from '@/utils/constants';

function useMonthlyGrowth(createdDates: string[] | undefined) {
  return useMemo(() => {
    const keys = lastNMonthKeys(6);
    const counts = new Map(keys.map((k) => [k, 0]));
    (createdDates ?? []).forEach((date) => {
      const key = monthKey(date);
      if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return keys.map((key) => ({ month: monthLabel(key), count: counts.get(key) ?? 0 }));
  }, [createdDates]);
}

export function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboard();
  const { data: users } = useUsers();
  const { data: doctors } = useDoctors();
  const { data: patients } = usePatients();
  const { data: appointments } = useAppointments();
  const { data: articles } = useArticles();

  const usersGrowth = useMonthlyGrowth(users?.map((u) => u.createdAt));
  const patientsGrowth = useMonthlyGrowth(patients?.map((p) => p.createdAt));

  const appointmentsByStatus = useMemo(() => {
    const counts = new Map<string, number>();
    (appointments ?? []).forEach((a) => {
      counts.set(a.status, (counts.get(a.status) ?? 0) + 1);
    });
    return Object.entries(APPOINTMENT_STATUS_LABELS).map(([status, label]) => ({
      status: label,
      count: counts.get(status) ?? 0,
    }));
  }, [appointments]);

  const doctorsBySpecialization = useMemo(() => {
    const counts = new Map<string, number>();
    (doctors ?? []).forEach((d) => {
      const key = d.specialization || 'Other';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return Array.from(counts.entries()).map(([specialization, count]) => ({ specialization, count }));
  }, [doctors]);

  const publishedArticles = (articles ?? []).filter((a) => a.isPublished).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          accent="blue"
          isLoading={statsLoading}
        />
        <StatCard
          label="Total Doctors"
          value={stats?.totalDoctors ?? 0}
          icon={Stethoscope}
          accent="violet"
          isLoading={statsLoading}
        />
        <StatCard
          label="Total Patients"
          value={stats?.totalPatients ?? 0}
          icon={HeartPulse}
          accent="rose"
          isLoading={statsLoading}
        />
        <StatCard
          label="Total Appointments"
          value={stats?.totalAppointments ?? 0}
          icon={CalendarClock}
          accent="amber"
          isLoading={statsLoading}
        />
        <StatCard
          label="Today's Appointments"
          value={stats?.todayAppointments ?? 0}
          icon={CalendarCheck}
          accent="emerald"
          isLoading={statsLoading}
        />
        <StatCard
          label="Published Articles"
          value={publishedArticles}
          icon={Newspaper}
          accent="blue"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Users Growth">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={usersGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Appointments by Status">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={appointmentsByStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="status" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {appointmentsByStatus.map((entry, index) => (
                  <Cell key={entry.status} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Doctors by Specialization">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={doctorsBySpecialization}
                dataKey="count"
                nameKey="specialization"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
              >
                {doctorsBySpecialization.map((entry, index) => (
                  <Cell key={entry.specialization} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Patients Growth">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={patientsGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="count" fill={CHART_COLORS[2]} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
