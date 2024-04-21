import React, { createContext, useState, useEffect, ReactNode ,useContext} from 'react';
import { FaRegSun } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";
import { MdDevices } from "react-icons/md";


type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  options: { icon: React.ReactNode; text: Theme }[];
  
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  setTheme: () => {},
  options: [],
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    return storedTheme || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  const element = document.documentElement;

  const options = [
    {
      icon: <FaRegSun />,
      text: "light" as Theme
    },
    {
      icon: <FaMoon />,
      text: "dark" as Theme
    },
    {
      icon: <MdDevices/>,
      text: "device" as Theme // Represents the theme based on user's system preference
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
  }, [theme,element.classList]);

  useEffect(() => {
    const handleDeviceThemeChange = () => {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDarkMode ? 'dark' : 'light');
    };

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleDeviceThemeChange);

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleDeviceThemeChange);
    };
  }, []);


  return (
    <ThemeContext.Provider value={{ theme, setTheme, options }}>
      {children}
    </ThemeContext.Provider>
  );
};


export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
      throw new Error("useThemeContext must be used within a ThemeContextProvider");
  }
  return context;
}