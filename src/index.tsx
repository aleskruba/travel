import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter,Routes,Route } from "react-router-dom";
import { ThemeProvider } from './context/themeContext';
import { DialogProvider } from './context/dialogContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter >
    <React.StrictMode>
      <DialogProvider>  
        <ThemeProvider>
          <Routes>
            <Route path="/*" element={<App/>} />
          </Routes>
      </ThemeProvider>
      </DialogProvider>
    </React.StrictMode>
   </BrowserRouter>
);
