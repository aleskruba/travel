import React, { createContext, useState, ReactNode, useContext } from 'react';
import { TourProps } from '../types';



interface TourContextProps {
    tours: TourProps[];
    setTours: React.Dispatch<React.SetStateAction<TourProps[]>>; // Corrected type
  

}

export const TourContext = createContext<TourContextProps>({
  tours: [],
  setTours: () => {},

});

interface TourProviderProps {
  children: ReactNode;
}




export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
    const [tours, setTours] = useState<TourProps[]>([]);


  

  return (
    <TourContext.Provider value={{ tours, setTours }}>
      {children}
    </TourContext.Provider>
  );
};

export function useTourContext() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTourContext must be used within a TourProvider");
  }
  return context;
}
