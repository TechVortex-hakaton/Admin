import { useQuery } from '@tanstack/react-query';
import { appointmentService } from '@/services/appointment.service';

export function useAppointments() {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentService.list,
  });
}
