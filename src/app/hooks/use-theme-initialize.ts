import { useEffect } from 'react';

export const useThemeInitialize = () => {
  useEffect(() => {
    // Initialize theme from localStorage
    const theme = localStorage.getItem('theme') || 'system';
    const root = document.documentElement;

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, []);
};
