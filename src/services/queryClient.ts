import { QueryClient } from '@tanstack/react-query';
import { storageService, STORAGE_KEYS } from '@/services/storageService';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query keys
export const QUERY_KEYS = {
  POKEMON: {
    LIST: 'pokemon-list',
    DETAIL: (id: string | number) => ['pokemon-detail', id],
    SEARCH: (query: string) => ['pokemon-search', query],
  },
  AUTH: {
    USER: 'auth-user',
    TOKEN: 'auth-token',
  },
  TRADE: {
    LIST: 'trade-list',
    DETAIL: (id: string) => ['trade-detail', id],
    OFFERS: 'trade-offers',
  },
} as const;

// Cache persistence
export const persistQueryClient = async () => {
  try {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    const cacheData = queries.map(query => ({
      queryKey: query.queryKey,
      data: query.state.data,
      state: query.state,
    }));

    storageService.setObject(STORAGE_KEYS.QUERY_CACHE, cacheData);
  } catch (error) {
    console.error('Error persisting query cache:', error);
  }
};

export const restoreQueryClient = async () => {
  try {
    const cacheData = storageService.getObject(STORAGE_KEYS.QUERY_CACHE);
    if (cacheData) {
      cacheData.forEach(({ queryKey, data, state }) => {
        queryClient.setQueryData(queryKey, data);
      });
    }
  } catch (error) {
    console.error('Error restoring query cache:', error);
  }
};
