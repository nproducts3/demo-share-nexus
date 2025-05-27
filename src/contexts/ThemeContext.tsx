
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  colorScheme: 'blue' | 'green' | 'purple' | 'orange';
  fontSize: 'sm' | 'md' | 'lg';
  sidebarCollapsed: boolean;
}

interface ThemeContextType {
  appearance: AppearanceSettings;
  updateAppearance: (key: keyof AppearanceSettings, value: any) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appearance, setAppearance] = useState<AppearanceSettings>(() => {
    const saved = localStorage.getItem('appearanceSettings');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      colorScheme: 'blue',
      fontSize: 'md',
      sidebarCollapsed: false,
    };
  });

  const [isDark, setIsDark] = useState(false);

  // Update theme based on system preference or user selection
  useEffect(() => {
    const updateTheme = () => {
      let shouldBeDark = false;
      
      if (appearance.theme === 'dark') {
        shouldBeDark = true;
      } else if (appearance.theme === 'system') {
        shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      
      setIsDark(shouldBeDark);
      
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (appearance.theme === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [appearance.theme]);

  // Update CSS custom properties for color scheme
  useEffect(() => {
    const root = document.documentElement;
    
    const colorSchemes = {
      blue: {
        primary: '222.2 47.4% 11.2%',
        primaryForeground: '210 40% 98%',
      },
      green: {
        primary: '142.1 76.2% 36.3%',
        primaryForeground: '355.7 100% 97.3%',
      },
      purple: {
        primary: '262.1 83.3% 57.8%',
        primaryForeground: '210 40% 98%',
      },
      orange: {
        primary: '24.6 95% 53.1%',
        primaryForeground: '60 9.1% 97.8%',
      }
    };

    const scheme = colorSchemes[appearance.colorScheme];
    root.style.setProperty('--primary', scheme.primary);
    root.style.setProperty('--primary-foreground', scheme.primaryForeground);
  }, [appearance.colorScheme]);

  // Update font size
  useEffect(() => {
    const root = document.documentElement;
    const fontSizes = {
      sm: '14px',
      md: '16px',
      lg: '18px'
    };
    
    root.style.fontSize = fontSizes[appearance.fontSize];
  }, [appearance.fontSize]);

  // Save to localStorage when appearance changes
  useEffect(() => {
    localStorage.setItem('appearanceSettings', JSON.stringify(appearance));
  }, [appearance]);

  const updateAppearance = (key: keyof AppearanceSettings, value: any) => {
    setAppearance(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ThemeContext.Provider value={{ appearance, updateAppearance, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
