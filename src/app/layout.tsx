import { Outlet } from 'react-router-dom';
import { ThemeToggler } from '@/shared/components/ThemeToggler';

export default function Layout() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="absolute top-4 right-4 md:top-8 md:right-8">
        <ThemeToggler />
      </div>
      <main className="container mx-auto pt-8 md:pt-12 p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
            <Outlet />
        </div>
      </main>
    </div>
  );
}