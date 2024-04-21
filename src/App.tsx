import { useThemeContext } from './context/themeContext';
import Navbar from './components/Navbar';

function App() {
  const { theme} = useThemeContext();

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <Navbar/>
      <div className="min-h-screen dark:bg-darkBackground rounded px-4">
      <h1 className="text-3xl h-screen font-bold underline dark:text-darkError dark:bg-darkBackground duration-100">
        Ahoj cestovatelé!

        <p>lorem1000</p>
      </h1>

      </div>
    </div>
  );
}

export default App;

