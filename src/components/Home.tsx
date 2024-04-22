import { useEffect } from 'react';
import Country from './Country';
import PopularCountries from './PopularCountries';
import ComboBox from './Countries';
import { useCountryContext } from '../context/countryContext';
import { countriesData } from '../constants';


function Home() {
    const { chosenCountry, setChosenCountry, setChosenCountryData } = useCountryContext();
      
  useEffect(() => {
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
    <div className="flex h-screen flex-col md:flex-row">
      {/* Navbar */}
      <div className="w-full md:w-[250px] md:bg-darkAccent text-navbarTextColor   pt-4 flex items-center flex-col">
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

export default Home;
