import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { FormInput } from '@/components/ui/FormInput';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCategories } from '@/hooks/useCategories';
import { useCreateArticle, useUpdateArticle } from '@/hooks/useArticles';
import type { Article } from '@/types';

const schema = z.object({
  title: z.string().min(2, 'At least 2 characters'),
  slug: z.string().optional(),
  description: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  image: z.string().optional(),
  categoryId: z.string().optional(),
  isPublished: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface ArticleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  article?: Article | null;
}

export function ArticleFormModal({ isOpen, onClose, article }: ArticleFormModalProps) {
  const isEdit = !!article;
  const { data: categories } = useCategories();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const isSubmitting = createArticle.isPending || updateArticle.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isOpen) {
      reset({
        title: article?.title ?? '',
        slug: article?.slug ?? '',
        description: article?.description ?? '',
        content: article?.content ?? '',
        image: article?.image ?? '',
        categoryId: article?.categoryId ?? '',
        isPublished: article?.isPublished ?? true,
      });
    }
  }, [isOpen, article, reset]);

  function onSubmit(values: FormValues) {
    const payload = {
      title: values.title,
      slug: values.slug || undefined,
      description: values.description || undefined,
      content: values.content,
      image: values.image || undefined,
      categoryId: values.categoryId || null,
      isPublished: values.isPublished,
    };

    if (isEdit && article) {
      updateArticle.mutate({ id: article.id, payload }, { onSuccess: onClose });
    } else {
      createArticle.mutate(payload, { onSuccess: onClose });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit article' : 'Add article'} size="lg">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput label="Title" error={errors.title?.message} {...register('title')} />
          <FormInput label="Slug (optional)" placeholder="auto-generated" error={errors.slug?.message} {...register('slug')} />
        </div>
        <FormTextarea label="Description" rows={2} error={errors.description?.message} {...register('description')} />
        <FormTextarea label="Content" rows={6} error={errors.content?.message} {...register('content')} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput label="Image URL" error={errors.image?.message} {...register('image')} />
          <Select label="Category" error={errors.categoryId?.message} {...register('categoryId')}>
            <option value="">No category</option>
            {(categories ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register('isPublished')} />
          Published
        </label>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? 'Save changes' : 'Create article'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
