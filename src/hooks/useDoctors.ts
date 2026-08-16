import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { doctorService, type CreateDoctorPayload, type UpdateDoctorPayload } from '@/services/doctor.service';
import { getApiErrorMessage } from '@/services/api';

export function useDoctors() {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: doctorService.list,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDoctorPayload) => doctorService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Doctor created');
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useUpdateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDoctorPayload }) =>
      doctorService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Doctor updated');
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => doctorService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Doctor deleted');
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
