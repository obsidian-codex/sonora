import { QueryClient } from '@tanstack/react-query';

/**
 * Shared TanStack Query client for SONORA.
 *
 * Defaults are tuned for an album-browsing app where data changes infrequently
 * and users often navigate back to previously viewed pages.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /** Data is fresh for 5 minutes before a background refetch is triggered */
      staleTime: 5 * 60 * 1000,

      /** Unused cache entries are garbage-collected after 30 minutes */
      gcTime: 30 * 60 * 1000,

      /** Retry once on failure (e.g., transient network blip) */
      retry: 1,

      /** Don't refetch on window focus — album data rarely changes that fast */
      refetchOnWindowFocus: false,
    },
    mutations: {
      /** Retry mutations once as well */
      retry: 1,
    },
  },
});
