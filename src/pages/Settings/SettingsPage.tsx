import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Camera, Fingerprint, Languages, Leaf, LogOut, Moon, ScanFace, Sun, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { LOCALE_LABELS, LOCALES } from '@/i18n/translations';
import type { LanguageSetting } from '@/context/LanguageContext';
import { getApiErrorMessage, TOKEN_KEY } from '@/services/api';
import { formatDateTime } from '@/utils/format';
import { getLocalAvatar, setLocalAvatar, clearLocalAvatar } from '@/utils/avatar';
import {
  disableBiometric,
  enableBiometric,
  isBiometricEnabled,
  isBiometricSupported,
} from '@/utils/webauthn';

const profileSchema = z
  .object({
    fullName: z.string().min(2, 'At least 2 characters'),
    email: z.string().email('Enter a valid email'),
    currentPassword: z.string().optional(),
    newPassword: z.union([z.string().length(0), z.string().min(6, 'At least 6 characters')]).optional(),
  })
  .refine((v) => !v.newPassword || !!v.currentPassword, {
    message: 'Enter your current password to set a new one',
    path: ['currentPassword'],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;

function SectionCard({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        {hint && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

export function SettingsPage() {
  const { user, logout, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const { setting, setLanguage, t } = useLanguage();

  const [avatar, setAvatar] = useState<string | null>(user ? getLocalAvatar(user.id) : null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(isBiometricEnabled());
  const [isBiometricBusy, setIsBiometricBusy] = useState(false);

  useEffect(() => {
    isBiometricSupported().then(setBiometricSupported);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    if (user) {
      reset({ fullName: user.fullName, email: user.email, currentPassword: '', newPassword: '' });
    }
  }, [user, reset]);

  async function onPhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !user) return;
    try {
      const dataUrl = await setLocalAvatar(user.id, file);
      setAvatar(dataUrl);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not use this image');
    }
  }

  function removePhoto() {
    if (!user) return;
    clearLocalAvatar(user.id);
    setAvatar(null);
  }

  async function onSubmitProfile(values: ProfileFormValues) {
    setIsSavingProfile(true);
    try {
      const payload: Record<string, string> = {};
      if (values.fullName !== user?.fullName) payload.fullName = values.fullName;
      if (values.email !== user?.email) payload.email = values.email;
      if (values.newPassword) {
        payload.newPassword = values.newPassword;
        payload.currentPassword = values.currentPassword ?? '';
      } else if (values.email !== user?.email && values.currentPassword) {
        payload.currentPassword = values.currentPassword;
      }

      if (Object.keys(payload).length === 0) {
        toast('Nothing to update');
        return;
      }

      await updateProfile(payload);
      toast.success(t('settings.saved'));
      reset({ fullName: values.fullName, email: values.email, currentPassword: '', newPassword: '' });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function onToggleBiometric() {
    if (!user) return;
    setIsBiometricBusy(true);
    try {
      if (biometricEnabled) {
        disableBiometric();
        setBiometricEnabled(false);
        toast.success(t('settings.faceIdDisable'));
      } else {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) throw new Error('You need to be signed in to enable Face ID');
        await enableBiometric({ email: user.email, fullName: user.fullName, token });
        setBiometricEnabled(true);
        toast.success(t('settings.faceIdEnable'));
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Face ID setup failed');
    } finally {
      setIsBiometricBusy(false);
    }
  }

  const initials = (user?.fullName ?? 'A')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <SectionCard title={t('settings.profile')} hint={t('settings.profileHint')}>
        <div className="mb-5 flex items-center gap-4">
          {avatar ? (
            <img src={avatar} alt="" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-lg font-semibold text-white">
              {initials}
            </div>
          )}
          <div>
            <p className="mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              {t('settings.photo')}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon={<Camera className="h-3.5 w-3.5" />}
                onClick={() => fileInputRef.current?.click()}
              >
                {t('settings.uploadPhoto')}
              </Button>
              {avatar && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon={<Trash2 className="h-3.5 w-3.5" />}
                  onClick={removePhoto}
                >
                  {t('settings.removePhoto')}
                </Button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPhotoChange}
            />
            <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">{t('settings.photoHint')}</p>
          </div>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmitProfile)} noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput label={t('login.fullName')} error={errors.fullName?.message} {...register('fullName')} />
            <FormInput
              label={t('login.email')}
              type="email"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label={t('settings.currentPassword')}
              type="password"
              error={errors.currentPassword?.message}
              {...register('currentPassword')}
            />
            <FormInput
              label={t('settings.newPassword')}
              type="password"
              error={errors.newPassword?.message}
              {...register('newPassword')}
            />
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">{t('settings.newPasswordHint')}</p>
          <div>
            <Button type="submit" isLoading={isSavingProfile}>
              {t('common.save')}
            </Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title={t('settings.security')} hint={t('settings.securityHint')}>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 dark:border-slate-700">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
            <ScanFace className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
              {t('settings.faceIdTitle')}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {biometricSupported ? t('settings.faceIdHint') : t('settings.faceIdUnsupported')}
            </p>
          </div>
          <Button
            type="button"
            variant={biometricEnabled ? 'secondary' : 'primary'}
            size="sm"
            disabled={!biometricSupported}
            isLoading={isBiometricBusy}
            icon={<Fingerprint className="h-3.5 w-3.5" />}
            onClick={onToggleBiometric}
          >
            {biometricEnabled ? t('settings.faceIdDisable') : t('settings.faceIdEnable')}
          </Button>
        </div>
      </SectionCard>

      <SectionCard title={t('settings.preferences')} hint={t('settings.preferencesHint')}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 dark:border-slate-700">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Languages className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {t('settings.language')}
              </p>
            </div>
            <select
              value={setting}
              onChange={(e) => setLanguage(e.target.value as LanguageSetting)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="auto">{t('lang.auto')}</option>
              {LOCALES.map((locale) => (
                <option key={locale} value={locale}>
                  {LOCALE_LABELS[locale]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 dark:border-slate-700">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {theme === 'dark' ? <Moon className="h-5 w-5" /> : theme === 'green' ? <Leaf className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{t('settings.theme')}</p>
            </div>
            <ThemeSwitcher />
          </div>
        </div>
      </SectionCard>

      <SectionCard title={t('settings.session')}>
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('settings.memberSince')}: {user ? formatDateTime(user.createdAt) : '—'}
          </p>
          <Button variant="danger" size="sm" icon={<LogOut className="h-3.5 w-3.5" />} onClick={logout}>
            {t('settings.logoutButton')}
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
