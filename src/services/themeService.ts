import { storageService, STORAGE_KEYS } from './storageService';
import { ThemeType } from '@theme';

export const THEME_KEY = 'app-theme';

export const themeService = {
  getTheme: (): ThemeType => {
    return (storageService.getString(THEME_KEY) as ThemeType) || 'system';
  },

  setTheme: (theme: ThemeType) => {
    storageService.setString(THEME_KEY, theme);
  },
};
