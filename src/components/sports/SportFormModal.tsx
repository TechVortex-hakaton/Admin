import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { FormInput } from '@/components/ui/FormInput';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { Button } from '@/components/ui/Button';
import { useCreateSport, useUpdateSport } from '@/hooks/useSports';
import type { Sport } from '@/types';

const optionalPositiveInt = () =>
  z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? undefined : val),
    z.coerce.number().int().positive().optional(),
  );

const schema = z.object({
  title: z.string().min(2, 'At least 2 characters'),
  description: z.string().optional(),
  category: z.string().optional(),
  duration: optionalPositiveInt(),
  difficulty: z.string().optional(),
  calories: optionalPositiveInt(),
  image: z.string().optional(),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface SportFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  sport?: Sport | null;
}

export function SportFormModal({ isOpen, onClose, sport }: SportFormModalProps) {
  const isEdit = !!sport;
  const createSport = useCreateSport();
  const updateSport = useUpdateSport();
  const isSubmitting = createSport.isPending || updateSport.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isOpen) {
      reset({
        title: sport?.title ?? '',
        description: sport?.description ?? '',
        category: sport?.category ?? '',
        duration: sport?.duration ?? undefined,
        difficulty: sport?.difficulty ?? '',
        calories: sport?.calories ?? undefined,
        image: sport?.image ?? '',
        isActive: sport?.isActive ?? true,
      });
    }
  }, [isOpen, sport, reset]);

  function onSubmit(values: FormValues) {
    const payload = {
      title: values.title,
      description: values.description || undefined,
      category: values.category || undefined,
      duration: values.duration,
      difficulty: values.difficulty || undefined,
      calories: values.calories,
      image: values.image || undefined,
      isActive: values.isActive,
    };

    if (isEdit && sport) {
      updateSport.mutate({ id: sport.id, payload }, { onSuccess: onClose });
    } else {
      createSport.mutate(payload, { onSuccess: onClose });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit sport' : 'Add sport'}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput label="Title" error={errors.title?.message} {...register('title')} />
          <FormInput label="Category" placeholder="Cardio" error={errors.category?.message} {...register('category')} />
          <FormInput label="Duration (min)" type="number" min={1} error={errors.duration?.message} {...register('duration')} />
          <FormInput label="Difficulty" placeholder="Beginner" error={errors.difficulty?.message} {...register('difficulty')} />
          <FormInput label="Calories" type="number" min={1} error={errors.calories?.message} {...register('calories')} />
          <FormInput label="Image URL" error={errors.image?.message} {...register('image')} />
        </div>
        <FormTextarea label="Description" error={errors.description?.message} {...register('description')} />
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register('isActive')} />
          Active
        </label>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? 'Save changes' : 'Create sport'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
