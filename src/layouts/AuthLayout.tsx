import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-lg font-bold text-white">
            A
          </div>
          <h1 className="text-lg font-semibold text-slate-900">Admin Panel</h1>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
