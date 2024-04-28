import { useEffect, useState } from 'react';
import { useThemeContext } from '../context/themeContext';
import { useDialogContext } from '../context/dialogContext';
import { Link } from 'react-router-dom';


function Navbar() {
    const { theme, setTheme, options } = useThemeContext();
    const { handleLoginClick ,handleSignUpClick} = useDialogContext();

    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);


    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
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
        <div className="hidden md:block text-white bg-transparent border cursor-pointer hover:bg-lightAccent hover:text-darkBackground hover:transition duration-100 border-white px-3 py-1 rounded-lg"
              onClick={handleSignUpClick}
        >Registrace</div>
        <div className="hidden md:block text-white bg-transparent border cursor-pointer hover:bg-lightAccent hover:text-darkBackground hover:transition duration-100 border-white px-3 py-1 rounded-lg"
             onClick={handleLoginClick}
          >Přihlásit</div>

        {options?.map((opt) => (
          <button
            key={opt.text}
            onClick={() => setTheme(opt.text)}
            className={`flex items-center justify-center  h-8   rounded-full  hover:text-sky600 ${
              theme === opt.text && `text-sky600`
            } `}
          >
            {opt.icon}
          </button>
        ))}
   
    </div>
    <div className={`${visible ? 'md:hidden fixed  bg-darkAccent   bottom-1 border rounded-lg shadow-lg left-1/2 transform -translate-x-1/2 w-[95%] md:w-[50%] ' : 'fixed  bg-darkAccent  bottom-1 border rounded-lg shadow-lg left-1/2 transform -translate-x-1/2 w-[95%] md:w-[60%] '}`}>
        
    <div className='flex justify-between w-full px-2 py-4 text-white text-xs'>
             
                <div className='flex gap-2 md:gap-6'>
                <Link to="/traveltips" className="hover:bg-lightAccent hover:text-darkBackground hover:transition duration-100 cursor-pointer border border-white px-1 py-1 rounded-lg">TravelTips</Link>
                <Link to="/spolucesty" className="hover:bg-lightAccent hover:text-darkBackground  hover:transition duration-100 cursor-pointer border border-white px-1 py-1 rounded-lg">Spolucesty</Link>
                </div>
                <div className='flex ml-4 gap-2 md:gap-6'>
                    <div className="hover:bg-lightAccent hover:text-darkBackground hover:transition duration-100 cursor-pointer border border-white px-1 py-1 rounded-lg"
                         onClick={handleSignUpClick}>
                          Registrace</div>
                    <div className="hover:bg-lightAccent hover:text-darkBackground  hover:transition duration-100 cursor-pointer border border-white px-1 py-1 rounded-lg"
                          onClick={handleLoginClick}>
                          Přihlásit</div>
               </div>
       </div>  
    </div>


</nav>
  )
}

export default Navbar