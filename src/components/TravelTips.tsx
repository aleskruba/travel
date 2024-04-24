import { useEffect } from 'react';
import Country from './Country';
import PopularCountries from './PopularCountries';
import ComboBox from './Countries';
import { useCountryContext } from '../context/countryContext';
import { countriesData } from '../constants';


function TravelTips() {
    const { chosenCountry,  setChosenCountryData } = useCountryContext();
      
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (chosenCountry) {
      const selectedCountryData = countriesData.find(country => country.name === chosenCountry);
      if (selectedCountryData) {
        setChosenCountryData(selectedCountryData);
      }
      else {
        setChosenCountryData(null);
      }
    }
  }, [chosenCountry, setChosenCountryData]);


  return (
    <div className="flex  flex-col md:flex-row ">
      <div className="w-full md:w-[250px] md:bg-transparent md:border md:border-solid md:border-gray-300 md:rounded text-navbarTextColor   pt-4 flex items-center flex-col">
    <ComboBox/>
    <div className='hidden md:block'>
    <PopularCountries /> 
    </div>
      </div>
      {/* Content */}
      <div className="flex-1 ">
        <Country/>
      </div>
    </div>
  );
}

export default TravelTips;
