import { ColorSchemeName } from 'react-native';

export type ThemeType = 'light' | 'dark' | 'system';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

export const lightTheme: ThemeColors = {
  primary: '#6200ee',
  secondary: '#03dac6',
  background: '#ffffff',
  surface: '#ffffff',
  text: '#000000',
  error: '#b00020',
  success: '#4caf50',
  warning: '#ff9800',
  info: '#2196f3',
};

export const darkTheme: ThemeColors = {
  primary: '#bb86fc',
  secondary: '#03dac6',
  background: '#121212',
  surface: '#1e1e1e',
  text: '#ffffff',
  error: '#cf6679',
  success: '#81c784',
  warning: '#ffb74d',
  info: '#64b5f6',
};

export const getTheme = (themeType: ThemeType, systemTheme: ColorSchemeName): ThemeColors => {
  if (themeType === 'system') {
    return systemTheme === 'dark' ? darkTheme : lightTheme;
  }
  return themeType === 'dark' ? darkTheme : lightTheme;
};
