import { useThemeContext } from './context/themeContext';
import Navbar from './components/Navbar';
import {Routes,Route} from "react-router-dom";
import LoginDialog from './pages/login';
import Layout from './components/Layout';
import { useDialogContext } from './context/dialogContext';
import SignUpDialog from './pages/signup';

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
          <div className="dark:bg-darkBackground px-2 ">
            <Routes>
              <Route path="/" element={<Layout />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
}


export default App;

