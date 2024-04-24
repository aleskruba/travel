
import { popularCountryNames } from '../constants';
import { useCountryContext } from '../context/countryContext';


function PopularCountries() {
  const { chosenCountry, setChosenCountry } = useCountryContext();


  
  return (
    <div className='mt-6 flex flex-col justify-start item-start text-base '>
      {popularCountryNames.map(country => (
        <div 
          key={country} 
          className={`dark:text-white text-black cursor-pointer px-2 py-1 rounded ${chosenCountry === country ? 'bg-green-500  text-lighTextColor' : ''}`} 
          onClick={() => setChosenCountry(country)} 
        >
          {country}
        </div>
      ))}
      <div>+dalších 80 zemí</div>
    </div>
  );
}

export default PopularCountries;
