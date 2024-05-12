import { useThemeContext } from './context/themeContext';
import Navbar from './components/Navbar';
import {Routes,Route} from "react-router-dom";
import LoginDialog from './pages/Login';
import Layout from './components/Layout';
import { useDialogContext } from './context/dialogContext';
import { useAuthContext } from './context/authContext';
import SignUpDialog from './pages/Signup';
import Footer from './components/Footer';
import Home from './components/Home';
import TravelTips from './pages/TravelTips';
import Test from './pages/Test';
import Tours from './pages/Tours';
import CreateTour from './components/spolucesty/CreateTour';
import Profile from './pages/Profile';
import TourDetail from './pages/TourDetail';
import YourTours from './pages/YourTours';
import YourTourDetail from './components/spolucesty/YourTourDetail';
import NotFound404 from './pages/NotFound404';
import { useState } from 'react';

function App() {
  const { theme } = useThemeContext();
  const { showDialog,showSignUpDialog } = useDialogContext();
  const { backendServerError } = useAuthContext();

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} relative screen`}>
      {showDialog  || showSignUpDialog ? (
        <div className="fixed inset-0 bg-black opacity-50"></div>
      ) : null}

      {showDialog || showSignUpDialog ? (
          showDialog ?<LoginDialog /> :<SignUpDialog/>
              
        ) : (
        <>
          <Navbar />
          <div className="dark:bg-darkBackground  ">
            {backendServerError && <h1 className='text-red-500 text-6xl font-bold'>ZAPNI SI SERVER VOLE</h1>}
            <Routes>
                <Route path="/" element={<Layout />} >
                <Route index element={<Home />}/> 
                <Route path="/traveltips" element={<TravelTips />}/> 
                <Route path="/spolucesty" element={<Tours />}/> 
                <Route path="/spolucesty/:id" element={<TourDetail />} />
                <Route path="/novacesta" element={<CreateTour />}/>
                <Route path="/profile" element={<Profile />}/> 
                <Route path="/tvojespolucesty" element={<YourTours />}/> 
                <Route path="/tvojespolucesty/:id" element={<YourTourDetail />}/> 


                <Route path="/test" element={<Test />}/> 
                <Route path='*' element={<NotFound404 />} />
                </Route>
            </Routes>
          </div>
          <Footer/>
        </>
      )}
    </div>
  );
}


export default App;

