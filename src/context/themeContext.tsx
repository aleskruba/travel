import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { FaRegSun } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";


type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  options: { icon: React.ReactNode; text: Theme }[];
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  setTheme: () => {},
  options: []
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const storedTheme = localStorage.getItem('theme') as Theme | null;
  const [theme, setTheme] = useState<Theme>(storedTheme || 'light');

  const element = document.documentElement;

  const options = [
    {
      icon: <FaRegSun />,
      text: "light" as Theme
    },
    {
      icon: <FaMoon />,
      text: "dark" as Theme
    }
  ];

  useEffect(() => {
    switch (theme) {
      case 'dark':
        element.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        break;
      case 'light':
        element.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        break;
      default:
        break;
    }
  }, [theme,element.classList]);  // or disable ESlint

  return (
    <ThemeContext.Provider value={{ theme, setTheme, options }}>
      {children}
    </ThemeContext.Provider>
  );
};
