import React, { createContext, useState, ReactNode, useContext, Dispatch, SetStateAction } from 'react';

type ChosenCountry = string;

type ChosenCountryData = {
  name: string;
  population: string;
  currency: string;
  language: string;
  capital: string;
  area: string;
  timezone: string;
  continent: string;
  flag:string;
};

interface CountryContextProps {
  chosenCountry: ChosenCountry;
  setChosenCountry: Dispatch<SetStateAction<ChosenCountry>>;
  chosenCountryData: ChosenCountryData | null; // Adjusted to accept null
  setChosenCountryData: Dispatch<SetStateAction<ChosenCountryData | null>>;
}

export const CountryContext = createContext<CountryContextProps>({
  chosenCountry: '',
  setChosenCountry: () => {},
  chosenCountryData: {
    name: '',
    population: '',
    currency: '',
    language: '',
    capital: '',
    area: '',
    timezone: '',
    continent: '',
    flag:''
  },
  setChosenCountryData: () => {},
});

interface CountryProviderProps {
  children: ReactNode;
}

export const CountryProvider: React.FC<CountryProviderProps> = ({ children }) => {
  const [chosenCountry, setChosenCountry] = useState<ChosenCountry>('');
  const [chosenCountryData, setChosenCountryData] = useState<ChosenCountryData | null>({
    name: '',
    population: '',
    currency: '',
    language: '',
    capital: '',
    area: '',
    timezone: '',
    continent: '',
    flag:'',
  } ) ;


  return (
    <CountryContext.Provider value={{ chosenCountry, setChosenCountry, chosenCountryData, setChosenCountryData }}>
      {children}
    </CountryContext.Provider>
  );
};

export function useCountryContext() {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error("useCountryContext must be used within a CountryProvider");
  }
  return context;
}
