import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter,Routes,Route } from "react-router-dom";
import { ThemeProvider } from './context/themeContext';
import { DialogProvider } from './context/dialogContext';
import { CountryProvider } from './context/countryContext';
import { TourProvider } from './context/tourContext';
import { AuthProvider } from './context/authContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter >
    <React.StrictMode>
      <AuthProvider>
        <TourProvider>
          <DialogProvider>  
            <ThemeProvider>
              <CountryProvider>
                <Routes>
                  <Route path="/*" element={<App/>} />
                </Routes>
              </CountryProvider>
          </ThemeProvider>
          </DialogProvider>
        </TourProvider>
      </AuthProvider>
    </React.StrictMode>
   </BrowserRouter>
);
