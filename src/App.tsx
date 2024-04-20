import React,{useContext} from 'react';
import { ThemeContext } from './context/themeContext';



function App() {

  const { theme ,setTheme,options} = useContext(ThemeContext);
    console.log(options)
  return (
    <div className="min-h-screen dark:text-gray-100 dark:bg-slate-900 duration-100 ">
      <div className='fixed flex top-5 right-10 duration-100 dark:bg-slate-900 rounded '>
        
    {options?.map(opt=>(     
          <button 
            key={opt.text}
            onClick={()=>setTheme(opt.text)}
            className={`flex items-center justify-center w-8 h-8 leading-9 text-2xl rounded-full m-1 ${
              theme === opt.text && "text-sky-600"
            } `}>
          
            {opt.icon}
         
          </button>
    ))}

      </div>
  <h1 className="text-3xl h-screen font-bold underline dark:text-red-200 dark:bg-slate-900 duration-100">
    Hello world!
  </h1>
    </div>
  );
}

export default App;
