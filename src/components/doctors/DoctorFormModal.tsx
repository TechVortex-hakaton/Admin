import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { FormInput } from '@/components/ui/FormInput';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { Button } from '@/components/ui/Button';
import { useCreateDoctor, useUpdateDoctor } from '@/hooks/useDoctors';
import type { Doctor } from '@/types';

const optionalInt = (min: number) =>
  z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? undefined : val),
    z.coerce.number().int().min(min).optional(),
  );

const baseSchema = {
  fullName: z.string().min(2, 'At least 2 characters'),
  email: z.string().email('Enter a valid email'),
  specialization: z.string().min(2, 'At least 2 characters'),
  experience: optionalInt(0),
  phone: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
};

const createSchema = z.object({
  ...baseSchema,
  password: z.string().min(6, 'At least 6 characters'),
});

const updateSchema = z.object({
  ...baseSchema,
  password: z.union([z.string().length(0), z.string().min(6, 'At least 6 characters')]).optional(),
});

type FormValues = z.infer<typeof createSchema>;

interface DoctorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor?: Doctor | null;
}

export function DoctorFormModal({ isOpen, onClose, doctor }: DoctorFormModalProps) {
  const isEdit = !!doctor;
  const createDoctor = useCreateDoctor();
  const updateDoctor = useUpdateDoctor();
  const isSubmitting = createDoctor.isPending || updateDoctor.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(isEdit ? updateSchema : createSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        fullName: doctor?.fullName ?? '',
        email: doctor?.email ?? '',
        specialization: doctor?.specialization ?? '',
        experience: doctor?.experience ?? undefined,
        phone: doctor?.phone ?? '',
        bio: doctor?.bio ?? '',
        avatar: doctor?.avatar ?? '',
        password: '',
      } as FormValues);
    }
  }, [isOpen, doctor, reset]);

  function onSubmit(values: FormValues) {
    const payload = {
      fullName: values.fullName,
      email: values.email,
      specialization: values.specialization,
      experience: values.experience,
      phone: values.phone || undefined,
      bio: values.bio || undefined,
      avatar: values.avatar || undefined,
      ...(values.password ? { password: values.password } : {}),
    };

    if (isEdit && doctor) {
      updateDoctor.mutate({ id: doctor.id, payload }, { onSuccess: onClose });
    } else {
      createDoctor.mutate(payload as FormValues, { onSuccess: onClose });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit doctor' : 'Add doctor'}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput label="Full name" error={errors.fullName?.message} {...register('fullName')} />
          <FormInput label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <FormInput
            label={isEdit ? 'New password (optional)' : 'Password'}
            type="password"
            error={errors.password?.message}
            {...register('password')}
          />
          <FormInput
            label="Specialization"
            placeholder="Cardiologist"
            error={errors.specialization?.message}
            {...register('specialization')}
          />
          <FormInput
            label="Experience (years)"
            type="number"
            min={0}
            error={errors.experience?.message}
            {...register('experience')}
          />
          <FormInput label="Phone" error={errors.phone?.message} {...register('phone')} />
        </div>
        <FormInput label="Avatar URL" error={errors.avatar?.message} {...register('avatar')} />
        <FormTextarea label="Bio" error={errors.bio?.message} {...register('bio')} />

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? 'Save changes' : 'Create doctor'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
