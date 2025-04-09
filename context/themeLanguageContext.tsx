'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeLanguageContextProps {
  theme: string;
  language: string;
  toggleTheme: () => void;
  toggleLanguage: () => void;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextProps | undefined>(undefined);

export const ThemeLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<string>('light');
  const [language, setLanguage] = useState<string>('RU');

  // Загружаем сохранённые настройки
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const storedLanguage = localStorage.getItem('language');

    if (storedTheme) {
      setTheme(storedTheme);
      // Если сохранённая тема – тёмная, сразу добавляем класс
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
    if (storedLanguage) setLanguage(storedLanguage);
  }, []);

  // Переключение темы
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Переключение языка
  const toggleLanguage = () => {
    const newLanguage = language === 'RU' ? 'EN' : 'RU';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  return (
    <ThemeLanguageContext.Provider value={{ theme, language, toggleTheme, toggleLanguage }}>
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = () => {
  const context = useContext(ThemeLanguageContext);
  if (!context) {
    throw new Error('useThemeLanguage должен использоваться внутри ThemeLanguageProvider');
  }
  return context;
};
