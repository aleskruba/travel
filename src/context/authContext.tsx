import React, { createContext, useState, ReactNode, useContext, Dispatch, SetStateAction, useEffect } from 'react';
import { UserProps } from '../types';
  

interface AuthContextProps {
    user:UserProps;
    setUser:Dispatch<SetStateAction<UserProps>>,


}

export const AuthContext = createContext<AuthContextProps>({
    user: {
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        image: '',

    },
    setUser:() => {},

});

interface AuthProviderProps {
  children: ReactNode;
}




export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProps>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    image: '',

},);


  

  return (
    <AuthContext.Provider value={{ user, setUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useCountryContext must be used within a CountryProvider");
  }
  return context;
}
