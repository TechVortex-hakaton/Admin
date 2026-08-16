import { useQuery } from '@tanstack/react-query';
import { patientService } from '@/services/patient.service';

export function usePatients() {
  return useQuery({
    queryKey: ['patients'],
    queryFn: patientService.list,
  });
}
