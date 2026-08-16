import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { sportService, type SportPayload } from '@/services/sport.service';
import { getApiErrorMessage } from '@/services/api';

export function useSports() {
  return useQuery({
    queryKey: ['sports'],
    queryFn: sportService.list,
  });
}

export function useCreateSport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SportPayload) => sportService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sports'] });
      toast.success('Sport created');
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useUpdateSport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<SportPayload> }) =>
      sportService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sports'] });
      toast.success('Sport updated');
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useDeleteSport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sportService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sports'] });
      toast.success('Sport deleted');
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
