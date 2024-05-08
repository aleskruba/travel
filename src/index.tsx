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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter >
    <React.StrictMode>
    <GoogleOAuthProvider clientId="85802491961-b7t13blg4rkgqbira2i00fni49cg8rmm.apps.googleusercontent.com">
      <AuthProvider>
        <TourProvider>
          <DialogProvider>  
            <ThemeProvider>
              <CountryProvider>
                <Routes>
                  <Route path="/*" element={<App/>} />
                </Routes>
                <ToastContainer 
                /> {/* Add ToastContainer here */}
              </CountryProvider>
          </ThemeProvider>
          </DialogProvider>
        </TourProvider>
      </AuthProvider>
      </GoogleOAuthProvider>
    </React.StrictMode>
   </BrowserRouter>
);
