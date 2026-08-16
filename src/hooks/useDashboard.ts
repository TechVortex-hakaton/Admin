import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: adminService.getDashboard,
  });
}
