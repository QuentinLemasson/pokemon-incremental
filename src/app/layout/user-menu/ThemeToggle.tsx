import * as React from 'react';
import { Moon, Sun } from 'lucide-react';

import { DropdownMenuItem } from '@/common/ui/dropdown-menu';

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window === 'undefined') return 'system';
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return 'system';
  });

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <>
      <DropdownMenuItem onClick={() => handleThemeChange('light')}>
        <Sun className="mr-2 h-4 w-4" />
        <span>Light</span>
        {theme === 'light' && <span className="ml-auto">✓</span>}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
        <Moon className="mr-2 h-4 w-4" />
        <span>Dark</span>
        {theme === 'dark' && <span className="ml-auto">✓</span>}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => handleThemeChange('system')}>
        <span className="mr-2 h-4 w-4">💻</span>
        <span>System</span>
        {theme === 'system' && <span className="ml-auto">✓</span>}
      </DropdownMenuItem>
    </>
  );
}
