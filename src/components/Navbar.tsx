import { useEffect, useState } from 'react';
import { useThemeContext } from '../context/themeContext';
import { useDialogContext } from '../context/dialogContext';


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
<nav  className={` ${visible ? 'sticky' : 'none'} top-0 z-10 flex justify-between items-center bg-darkBackground text-navbarTextColor py-4 px-4 md:px-8 poppins-medium`}>
    

    <div className="flex items-center">
    <span className={`text-lightAccent text-2xl poppins-extrabold-italic`} style={{ WebkitTextStroke: '1px violet' }}>Rady na cesty</span>

    </div>

    <div className="hidden md:flex space-x-6">
        <div className="hover:text-lightAccent hover:transition duration-100 cursor-pointer">TravelTips</div>
        <div className="hover:text-lightAccent hover:transition duration-100 cursor-pointer">Spolucesty</div>
    </div>

    <div className="flex items-center space-x-4">
        <div className="hidden md:block bg-transparent border cursor-pointer hover:bg-lightAccent hover:text-darkBackground border-white px-3 py-1 rounded-lg"
              onClick={handleSignUpClick}
        >Register</div>
        <div className="hidden md:block bg-transparent border cursor-pointer hover:bg-lightAccent hover:text-darkBackground border-white px-3 py-1 rounded-lg"
             onClick={handleLoginClick}
          >Login</div>

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
    <div className={`${visible ? 'md:hidden fixed  bg-darkAccent   bottom-1 border rounded-lg shadow-lg left-1/2 transform -translate-x-1/2 w-[95%] md:w-[50%] ' : 'fixed  bg-darkAccent  bottom-1 border rounded-lg shadow-lg left-1/2 transform -translate-x-1/2 w-[95%] md:w-[50%] '}`}>
        
    <div className='flex justify-between w-full px-2 py-2 '>
             
                <div className='flex gap-2 md:gap-6'>
                <div className="hover:text-lightAccent hover:transition duration-100">TravelTips</div>
                <div className="hover:text-lightAccent hover:transition duration-100">Spolucesty</div>
                </div>
                <div className='flex ml-4 gap-2 md:gap-6'>
                    <div className="hover:text-lightAccent hover:transition duration-100 cursor-pointer"
                         onClick={handleSignUpClick}>
                          Register</div>
                    <div className="hover:text-lightAccent hover:transition duration-100 cursor-pointer"
                          onClick={handleLoginClick}>
                          Login</div>
               </div>
       </div>  
    </div>


</nav>
  )
}

export default Navbar