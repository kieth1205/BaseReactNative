import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeType, ThemeColors, getTheme } from '@configs/theme';
import { themeService } from '@services/themeService';

type ThemeContextType = {
  themeType: ThemeType;
  setThemeType: (theme: ThemeType) => void;
  colors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextType>({
  themeType: 'system',
  setThemeType: () => {},
  colors: getTheme('system', 'light'),
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemTheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>(themeService.getTheme());
  const colors = getTheme(themeType, systemTheme);

  useEffect(() => {
    themeService.setTheme(themeType);
  }, [themeType]);

  return (
    <ThemeContext.Provider value={{ themeType, setThemeType, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
