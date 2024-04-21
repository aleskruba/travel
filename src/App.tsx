import {useContext } from 'react';
import { ThemeContext } from './context/themeContext';

function App() {
  const { theme, setTheme, options } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="fixed flex top-5 right-10 duration-100 dark:bg-darkBackground rounded">
        {options?.map((opt) => (
          <button
            key={opt.text}
            onClick={() => setTheme(opt.text)}
            className={`flex items-center justify-center w-8 h-8 leading-9 text-2xl rounded-full m-1 hover:text-sky600 ${
              theme === opt.text && `text-sky600`
            } `}
          >
            {opt.icon}
          </button>
        ))}
      </div>
      <h1 className="text-3xl h-screen font-bold underline dark:text-darkError dark:bg-darkBackground duration-100">
        Ahoj cestovatelé!
      </h1>
    </div>
  );
}

export default App;

