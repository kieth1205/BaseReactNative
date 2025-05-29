import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    secondary: '#03dac6',
    error: '#b00020',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#bb86fc',
    secondary: '#03dac6',
    error: '#cf6679',
  },
};

export type ThemeType = 'light' | 'dark' | 'system';

export const getTheme = (themeType: ThemeType) => {
  const systemTheme = useColorScheme();
  if (themeType === 'system') {
    return systemTheme === 'dark' ? darkTheme : lightTheme;
  }
  return themeType === 'dark' ? darkTheme : lightTheme;
};
