import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
      <p className="text-5xl font-bold text-slate-300">404</p>
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Page not found</h1>
        <p className="mt-1 text-sm text-slate-500">The page you're looking for doesn't exist.</p>
      </div>
      <Link to="/dashboard">
        <Button variant="secondary">Go to dashboard</Button>
      </Link>
    </div>
  );
}
