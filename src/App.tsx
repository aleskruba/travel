import { useThemeContext } from './context/themeContext';
import Navbar from './components/Navbar';
import {Routes,Route} from "react-router-dom";
import LoginDialog from './pages/login';
import Layout from './components/Layout';
import { useDialogContext } from './context/dialogContext';
import SignUpDialog from './pages/signup';
import Footer from './components/Footer';
import Home from './components/Home';

function App() {
  const { theme } = useThemeContext();
  const { showDialog,showSignUpDialog } = useDialogContext();

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
            <Routes>
                <Route path="/" element={<Layout />} >
                <Route index element={<Home />}/> 
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

