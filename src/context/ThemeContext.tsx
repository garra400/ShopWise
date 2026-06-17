import React, { createContext, useContext } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';

/** The effective color scheme, taking into account user preference */
type ColorScheme = 'light' | 'dark';

interface ThemeContextValue {
  colorScheme: ColorScheme;
}

const ThemeContext = createContext<ThemeContextValue>({ colorScheme: 'light' });

interface ThemeContextProviderProps {
  preference: 'system' | 'light' | 'dark';
  children: React.ReactNode;
}

export function ThemeContextProvider({ preference, children }: ThemeContextProviderProps) {
  const systemScheme = useNativeColorScheme();

  let colorScheme: ColorScheme;
  if (preference === 'system') {
    colorScheme = systemScheme === 'dark' ? 'dark' : 'light';
  } else {
    colorScheme = preference;
  }

  return (
    <ThemeContext.Provider value={{ colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppColorScheme(): ColorScheme {
  return useContext(ThemeContext).colorScheme;
}
