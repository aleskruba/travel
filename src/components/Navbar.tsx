import { useEffect, useState } from 'react';
import { useThemeContext } from '../context/themeContext';
import { useDialogContext } from '../context/dialogContext';
import { useAuthContext } from '../context/authContext';
import { Link } from 'react-router-dom';
import BASE_URL from '../config/config';
import axios from 'axios';
import { Flip, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { IoHomeOutline } from "react-icons/io5";


function Navbar() {
    const { theme, setTheme, options } = useThemeContext();
    const { handleLoginClick ,handleSignUpClick} = useDialogContext();
    const { user,setUser,setUpdateUser} = useAuthContext();
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const navigate = useNavigate()

    const logOutFunction = () => { 
      const fetchUserData = async () => {

        try {
          const url = `${BASE_URL}/logout`;
          const response = await axios.get(url, { withCredentials: true });
          if (response.status === 201) {
            toast.success(response.data.message,  {
              position: "top-left",
              autoClose: 1500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Flip,
              });
              setUpdateUser(null)
          setUser(null)
          navigate('/')
            }
        
        } catch (err) {
          console.log('Error fetching user data:', err);
      };
    
    }
      fetchUserData();

    }
    useEffect(() => {
        const handleScroll = () => {
          const currentScrollPos = window.scrollY;
          const visible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

            setPrevScrollPos(currentScrollPos);
            setVisible(visible);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos]);
    

  return (
<nav  className={` ${visible ? 'sticky' : 'none'} top-0 z-10 flex justify-between gap-4 items-center bg-darkBackground text-navbarTextColor py-4 px-4 md:px-8 poppins-medium`}>
    

    <Link to="/" className="flex items-center">
    <span className={`text-lightAccent text-2xl poppins-extrabold-italic cursor-pointer`} style={{ WebkitTextStroke: '0.8px white' }}>Rady na cesty</span>

    </Link>

    <div className="hidden md:flex space-x-2">
        <Link to="/traveltips" className="text-white hover:bg-lightAccent hover:text-darkBackground hover:transition duration-100 cursor-pointer border border-white px-3 py-1 rounded-lg">TravelTips</Link>
        <Link to="/spolucesty" className="text-white hover:bg-lightAccent hover:text-darkBackground hover:transition duration-100 cursor-pointer border border-white px-3 py-1 rounded-lg">Spolucesty</Link>
    </div>

    <div className="flex items-center space-x-2">
  {!user ? (
    <>
      <div className="hidden md:block text-white bg-transparent border cursor-pointer hover:bg-lightAccent hover:text-darkBackground hover:transition duration-100 border-white px-3 py-1 rounded-lg" onClick={handleSignUpClick}>Registrace</div>
      <div className="hidden md:block text-white bg-transparent border cursor-pointer hover:bg-lightAccent hover:text-darkBackground hover:transition duration-100 border-white px-3 py-1 rounded-lg" onClick={handleLoginClick}>Přihlásit</div>
    </>
  ) : (
    <>
      <Link to={'/profile'} className="hidden md:flex md:justify-between md:text-base  min-w-[100px] text-center text-white bg-transparent border cursor-pointer hover:bg-lightAccent hover:text-darkBackground hover:transition duration-100 border-white px-3 py-1 rounded-lg" >Profil
      <div className='w-6 h-6'>
              
                  <img src={user.image ? user.image : 'profile.png'} alt="profile" className='w-full h-full rounded-full object-cover' />
              
                  </div></Link>
      <div className="hidden md:block text-white bg-transparent border cursor-pointer hover:bg-lightAccent hover:text-darkBackground hover:transition duration-100 border-white px-3 py-1 rounded-lg"   onClick={logOutFunction}>Odhlásit</div>
    </>
  )}

  {options?.map((opt) => (
    <button
      key={opt.text}
      onClick={() => setTheme(opt.text)}
      className={`flex items-center justify-center h-8 rounded-full hover:text-sky600 ${theme === opt.text && `text-sky600`}`}
    >
      {opt.icon}
    </button>
  ))}
</div>



    <div className={`${visible ? 'md:hidden fixed  bg-darkAccent   bottom-1 border rounded-lg shadow-lg left-1/2 transform -translate-x-1/2 w-[95%] md:w-[50%] ' : 'fixed  bg-darkAccent  bottom-1 border rounded-lg shadow-lg left-1/2 transform -translate-x-1/2 w-[95%] md:w-[60%] '}`}>
        
    <div className='flex justify-between w-full px-2 py-4 text-white text-xs'>
             
                <div className='flex gap-1 md:gap-6'>
                
             
                <Link to="/traveltips" className="hover:bg-lightAccent hover:text-darkBackground hover:transition duration-100 cursor-pointer border border-white px-1 py-1 rounded-lg relative">TravelTips                </Link>
                <Link to="/spolucesty" className="hover:bg-lightAccent hover:text-darkBackground  hover:transition duration-100 cursor-pointer border border-white px-1 py-1 rounded-lg">Spolucesty</Link>
               
               <Link to="/" className="hover:bg-lightAccent hover:text-darkBackground hover:transition duration-100 cursor-pointer border border-white px-4 py-1 rounded-lg text-base" >
                <IoHomeOutline /> 
                
                </Link>

                </div>

                {!user ?

                 <div className='flex  ml-1 gap-2 md:gap-6'>
                    <div className="hover:bg-lightAccent hover:text-darkBackground hover:transition duration-100 cursor-pointer border border-white px-1 py-1 rounded-lg"
                         onClick={handleSignUpClick}>
                          Registrace</div>
                    <div className="hover:bg-lightAccent hover:text-darkBackground  hover:transition duration-100 cursor-pointer border border-white px-1 py-1 rounded-lg"
                          onClick={handleLoginClick}>
                          Přihlásit</div>
               </div>
               : 
               
               <div className='flex ml-1 gap-2 md:gap-6'>
               <Link to={'/profile'} className="hover:bg-lightAccent min-w-[60px] text-center hover:text-darkBackground hover:transition duration-100 cursor-pointer border border-white px-1 py-1 rounded-lg">
                  Profil </Link>
               
         
               <div className="hover:bg-lightAccent hover:text-darkBackground  hover:transition duration-100 cursor-pointer border border-white px-1 py-1 rounded-lg"
                     onClick={logOutFunction}>
                     Odhlásit</div>
          </div>
               } 
       </div>  
    </div>


</nav>
  )
}

export default Navbar