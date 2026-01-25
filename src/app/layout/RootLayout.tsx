import { Outlet } from 'react-router-dom';
import { UserMenu } from './user-menu/UserMenu';
import { usePageTitle } from '@/app/hooks/use-page-title.hook';
import { useThemeInitialize } from '../hooks/use-theme-initialize';

export const RootLayout = () => {
  const pageTitle = usePageTitle();
  useThemeInitialize();

  return (
    <div className="min-h-screen max-h-screen bg-background text-foreground grid grid-rows-[auto_1fr] overflow-hidden">
      <header className="flex items-center justify-between h-full py-4 px-6">
        {pageTitle && <h1>{pageTitle}</h1>}
        <div className="text-sm">
          <UserMenu />
        </div>
      </header>
      <main className="overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};
