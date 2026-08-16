import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { FormInput } from '@/components/ui/FormInput';
import { Button } from '@/components/ui/Button';
import { useCreateCategory, useUpdateCategory } from '@/hooks/useCategories';
import type { Category } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'At least 2 characters'),
  slug: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
}

export function CategoryFormModal({ isOpen, onClose, category }: CategoryFormModalProps) {
  const isEdit = !!category;
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const isSubmitting = createCategory.isPending || updateCategory.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isOpen) {
      reset({ name: category?.name ?? '', slug: category?.slug ?? '' });
    }
  }, [isOpen, category, reset]);

  function onSubmit(values: FormValues) {
    const payload = { name: values.name, slug: values.slug || undefined };
    if (isEdit && category) {
      updateCategory.mutate({ id: category.id, payload }, { onSuccess: onClose });
    } else {
      createCategory.mutate(payload, { onSuccess: onClose });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit category' : 'Add category'} size="sm">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormInput label="Name" error={errors.name?.message} {...register('name')} />
        <FormInput label="Slug (optional)" placeholder="auto-generated" error={errors.slug?.message} {...register('slug')} />
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? 'Save changes' : 'Create category'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
