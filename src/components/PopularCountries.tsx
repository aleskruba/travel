import { useEffect } from 'react';
import { popularCountryNames } from '../constants';
import { useCountryContext } from '../context/countryContext';
import { countriesData } from '../constants';

function PopularCountries() {
  const { chosenCountry, setChosenCountry, setChosenCountryData } = useCountryContext();
  
/*   useEffect(() => {
    if (chosenCountry) {
      const selectedCountryData = countriesData.find(country => country.name === chosenCountry);
      if (selectedCountryData) {
        setChosenCountryData(selectedCountryData);
      }
    }
  }, [chosenCountry, setChosenCountryData]); */

  return (
    <div className='mt-4 flex flex-col justify-start item-start text-xl gap-2'>
      {popularCountryNames.map(country => (
        <div 
          key={country} 
          className={`cursor-pointer px-2 ${chosenCountry === country ? 'bg-darkBackground text-lighTextColor' : ''}`} 
          onClick={() => setChosenCountry(country)} 
        >
          {country}
        </div>
      ))}
    </div>
  );
}

export default PopularCountries;
