import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Fingerprint, Lock, LogIn, Mail, ScanFace, Sparkles, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getApiErrorMessage } from '@/services/api';
import { cn } from '@/utils/cn';
import {
  authenticateWithBiometric,
  getBiometricProfile,
  isBiometricEnabled,
  isBiometricSupported,
} from '@/utils/webauthn';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type LoginFormValues = z.infer<typeof loginSchema>;

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'At least 2 characters'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'At least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type RegisterFormValues = z.infer<typeof registerSchema>;

const DEMO_EMAIL = 'admin@healthy.uz';
const DEMO_PASSWORD = 'Admin123!';

const inputClass = (hasError: boolean) =>
  cn(
    'w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-3 text-sm text-slate-900 shadow-soft',
    'placeholder:text-slate-400 transition-shadow',
    'focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500',
    hasError && 'border-rose-300 focus:ring-rose-500/30 focus:border-rose-400',
  );

export function LoginPage() {
  const { login, loginWithToken, register: registerAccount } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricReady, setBiometricReady] = useState(isBiometricEnabled());
  const [isBiometricSubmitting, setIsBiometricSubmitting] = useState(false);

  useEffect(() => {
    isBiometricSupported().then(setBiometricSupported);
  }, []);

  const signInForm = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });
  const signUpForm = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  async function onSignIn(values: LoginFormValues) {
    setIsSubmitting(true);
    try {
      const user = await login(values.email, values.password);
      if (user.role !== 'ADMIN') {
        toast.error('Only admins can access this panel');
        return;
      }
      toast.success(`Welcome back, ${user.fullName.split(' ')[0]}`);
      const from = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSignUp(values: RegisterFormValues) {
    setIsSubmitting(true);
    try {
      await registerAccount(values.fullName, values.email, values.password);
      toast.success('Account created — new accounts start as Patient. Sign in below.', {
        duration: 5000,
      });
      signInForm.setValue('email', values.email);
      signUpForm.reset();
      setMode('signin');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onBiometricSignIn() {
    setIsBiometricSubmitting(true);
    try {
      const token = await authenticateWithBiometric();
      const user = await loginWithToken(token);
      if (user.role !== 'ADMIN') {
        toast.error('Only admins can access this panel');
        return;
      }
      toast.success(`Welcome back, ${user.fullName.split(' ')[0]}`);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setBiometricReady(isBiometricEnabled());
      toast.error(
        error instanceof Error && error.name === 'NotAllowedError'
          ? 'Face ID was cancelled'
          : getApiErrorMessage(error) || 'Face ID sign-in failed — use your password',
      );
    } finally {
      setIsBiometricSubmitting(false);
    }
  }

  function fillDemo() {
    signInForm.setValue('email', DEMO_EMAIL, { shouldValidate: true });
    signInForm.setValue('password', DEMO_PASSWORD, { shouldValidate: true });
  }

  const biometricProfile = getBiometricProfile();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {mode === 'signin' ? t('login.welcome') : t('login.createTitle')}
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          {mode === 'signin' ? t('login.subtitle') : t('login.createSubtitle')}
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setMode('signin')}
          className={cn(
            'rounded-lg py-2 text-sm font-medium transition-colors',
            mode === 'signin' ? 'bg-white text-slate-900 shadow-soft' : 'text-slate-500 hover:text-slate-700',
          )}
        >
          {t('login.signIn')}
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={cn(
            'rounded-lg py-2 text-sm font-medium transition-colors',
            mode === 'signup' ? 'bg-white text-slate-900 shadow-soft' : 'text-slate-500 hover:text-slate-700',
          )}
        >
          {t('login.createAccount')}
        </button>
      </div>

      {mode === 'signin' ? (
        <>
          {biometricSupported && biometricReady && (
            <button
              type="button"
              onClick={onBiometricSignIn}
              disabled={isBiometricSubmitting}
              className="mb-4 flex w-full items-center gap-3 rounded-xl border border-primary-200 bg-primary-50/70 px-4 py-3 text-left transition-colors hover:bg-primary-50 disabled:opacity-60"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white">
                <ScanFace className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-primary-700">
                  {isBiometricSubmitting ? t('login.faceIdWaiting') : t('login.faceId')}
                </p>
                {biometricProfile && (
                  <p className="truncate text-xs text-primary-600/70">{biometricProfile.email}</p>
                )}
              </div>
            </button>
          )}
          {biometricSupported && biometricReady && (
            <div className="mb-4 flex items-center gap-3 text-xs text-slate-400">
              <div className="h-px flex-1 bg-slate-200" />
              {t('login.orPassword')}
              <div className="h-px flex-1 bg-slate-200" />
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={signInForm.handleSubmit(onSignIn)} noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                {t('login.email')}
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@healthy.uz"
                  className={inputClass(!!signInForm.formState.errors.email)}
                  {...signInForm.register('email')}
                />
              </div>
              {signInForm.formState.errors.email && (
                <p className="text-xs text-rose-600">{signInForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                {t('login.password')}
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={cn(inputClass(!!signInForm.formState.errors.password), 'pr-11')}
                  {...signInForm.register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
              {signInForm.formState.errors.password && (
                <p className="text-xs text-rose-600">{signInForm.formState.errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="mt-2 w-full !py-2.5 shadow-glow"
              isLoading={isSubmitting}
              icon={<LogIn className="h-4 w-4" />}
            >
              {t('login.signIn')}
            </Button>
          </form>

          <button
            type="button"
            onClick={fillDemo}
            className="mt-6 flex w-full items-center gap-2.5 rounded-xl border border-dashed border-primary-200 bg-primary-50/60 px-4 py-3 text-left transition-colors hover:bg-primary-50"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-primary-700">{t('login.demoHint')}</p>
              <p className="truncate text-xs text-primary-600/70">{DEMO_EMAIL} · click to autofill</p>
            </div>
          </button>

          {biometricSupported && !biometricReady && (
            <p className="mt-4 flex items-center gap-1.5 text-center text-xs text-slate-400">
              <Fingerprint className="h-3.5 w-3.5" />
              Enable Face ID sign-in from Settings after logging in.
            </p>
          )}
        </>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={signUpForm.handleSubmit(onSignUp)} noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="fullName" className="text-sm font-medium text-slate-700">
              {t('login.fullName')}
            </label>
            <div className="relative">
              <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                placeholder="Ali Valiyev"
                className={inputClass(!!signUpForm.formState.errors.fullName)}
                {...signUpForm.register('fullName')}
              />
            </div>
            {signUpForm.formState.errors.fullName && (
              <p className="text-xs text-rose-600">{signUpForm.formState.errors.fullName.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="signup-email" className="text-sm font-medium text-slate-700">
              {t('login.email')}
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="you@healthy.uz"
                className={inputClass(!!signUpForm.formState.errors.email)}
                {...signUpForm.register('email')}
              />
            </div>
            {signUpForm.formState.errors.email && (
              <p className="text-xs text-rose-600">{signUpForm.formState.errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="signup-password" className="text-sm font-medium text-slate-700">
              {t('login.password')}
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                className={cn(inputClass(!!signUpForm.formState.errors.password), 'pr-11')}
                {...signUpForm.register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
              </button>
            </div>
            {signUpForm.formState.errors.password && (
              <p className="text-xs text-rose-600">{signUpForm.formState.errors.password.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
              {t('login.confirmPassword')}
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                className={cn(inputClass(!!signUpForm.formState.errors.confirmPassword), 'pr-11')}
                {...signUpForm.register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-[18px] w-[18px]" />
                ) : (
                  <Eye className="h-[18px] w-[18px]" />
                )}
              </button>
            </div>
            {signUpForm.formState.errors.confirmPassword && (
              <p className="text-xs text-rose-600">{signUpForm.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-700">
            {t('login.patientNote')}
          </p>

          <Button type="submit" className="mt-1 w-full !py-2.5 shadow-glow" isLoading={isSubmitting}>
            {t('login.createAccount')}
          </Button>
        </form>
      )}
    </div>
  );
}
