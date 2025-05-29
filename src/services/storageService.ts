import { MMKV } from 'react-native-mmkv';

// Initialize MMKV
const storage = new MMKV();

// Storage keys
export const STORAGE_KEYS = {
  LANGUAGE: 'user-language',
  AUTH_TOKEN: 'auth-token',
  USER_DATA: 'user-data',
  POKEMON_FAVORITES: 'pokemon-favorites',
  POKEMON_TRADES: 'pokemon-trades',
  QUERY_CACHE: 'query-cache',
} as const;

// Type for storage keys
export type StorageKey = keyof typeof STORAGE_KEYS;

// Storage service
export const storageService = {
  // String operations
  setString: (key: StorageKey, value: string) => {
    storage.set(STORAGE_KEYS[key], value);
  },
  getString: (key: StorageKey) => {
    return storage.getString(STORAGE_KEYS[key]);
  },

  // Number operations
  setNumber: (key: StorageKey, value: number) => {
    storage.set(STORAGE_KEYS[key], value);
  },
  getNumber: (key: StorageKey) => {
    return storage.getNumber(STORAGE_KEYS[key]);
  },

  // Boolean operations
  setBoolean: (key: StorageKey, value: boolean) => {
    storage.set(STORAGE_KEYS[key], value);
  },
  getBoolean: (key: StorageKey) => {
    return storage.getBoolean(STORAGE_KEYS[key]);
  },

  // Object operations
  setObject: <T extends object>(key: StorageKey, value: T) => {
    storage.set(STORAGE_KEYS[key], JSON.stringify(value));
  },
  getObject: <T extends object>(key: StorageKey): T | null => {
    const value = storage.getString(STORAGE_KEYS[key]);
    return value ? JSON.parse(value) : null;
  },

  // Array operations
  setArray: <T>(key: StorageKey, value: T[]) => {
    storage.set(STORAGE_KEYS[key], JSON.stringify(value));
  },
  getArray: <T>(key: StorageKey): T[] => {
    const value = storage.getString(STORAGE_KEYS[key]);
    return value ? JSON.parse(value) : [];
  },

  // Delete operations
  delete: (key: StorageKey) => {
    storage.delete(STORAGE_KEYS[key]);
  },
  deleteAll: () => {
    storage.clearAll();
  },

  // Check if key exists
  contains: (key: StorageKey) => {
    return storage.contains(STORAGE_KEYS[key]);
  },
};
