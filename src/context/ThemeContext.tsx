import React, { createContext, useContext, useState, useEffect } from 'react';

export type AstraTheme = 'white-black' | 'black-white' | 'white-blue' | 'black-blue';

interface ThemeContextType {
  theme: AstraTheme;
  toggleTheme: () => void;
  setTheme: (theme: AstraTheme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AstraTheme>(() => {
    const saved = localStorage.getItem('astra_theme');
    if (saved === 'black-white' || saved === 'black-blue') return 'black-white';
    return 'white-black'; // Default to clean, modern White and Black theme
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-white-blue', 'theme-black-blue', 'theme-white-black', 'theme-black-white', 'dark');
    
    if (theme === 'black-white') {
      root.classList.add('dark', 'theme-black-white');
    } else {
      root.classList.add('theme-white-black');
    }

    localStorage.setItem('astra_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'white-black' ? 'black-white' : 'white-black'));
  };

  const setTheme = (newTheme: AstraTheme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isDark: theme === 'black-white' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
