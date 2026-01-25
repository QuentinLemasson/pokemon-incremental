import { useMemo } from 'react';
import { useMatches } from 'react-router-dom';

export type RouteHandle = {
  title?: string;
};

export const usePageTitle = (): string | undefined => {
  const matches = useMatches();

  // Get the title from the deepest matching route's handle
  const pageTitle = useMemo(() => {
    // Find the last match with a title in its handle
    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i];
      const handle = match.handle as RouteHandle | undefined;
      if (handle?.title) {
        return handle.title;
      }
    }
    return undefined;
  }, [matches]);

  return pageTitle;
};
