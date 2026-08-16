import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { articleService, type ArticlePayload } from '@/services/article.service';
import { getApiErrorMessage } from '@/services/api';

export function useArticles() {
  return useQuery({
    queryKey: ['articles'],
    queryFn: articleService.list,
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ArticlePayload) => articleService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Article created');
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ArticlePayload> }) =>
      articleService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Article updated');
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => articleService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Article deleted');
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
