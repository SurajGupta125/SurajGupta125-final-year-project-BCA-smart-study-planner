import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const THEME_KEY = 'smart-study-planner-theme';

const ThemeContext = createContext(null);

function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return 'light';
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('theme-dark');
  } else {
    document.documentElement.classList.remove('theme-dark');
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  }, [theme]);

  const value = useMemo(() => {
    const isDark = theme === 'dark';
    const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
    return { theme, isDark, setTheme, toggleTheme };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

