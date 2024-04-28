import { useEffect, useState } from 'react';
import Country from '../components/Country';
import PopularCountries from '../components/PopularCountries';
import ComboBox from '../components/Countries';
import { useCountryContext } from '../context/countryContext';
import { countriesData } from '../constants';
import Cards from '../components/traveltips/Cards';
import Messages from '../components/traveltips/Messages';




function TravelTips() {
    const { chosenCountry,  setChosenCountryData } = useCountryContext();
    const [selectComp,setSelectComp] = useState(false)
      
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
    <div className="flex  flex-col md:flex-row pb-16">
      <div className="w-full h-[90%] md:w-[250px] md:bg-transparent md:border-r md:border-gray-300 md:rounded text-navbarTextColor   pt-4 flex items-center flex-col">
    <ComboBox/>
    <div className='hidden md:block '>
    <PopularCountries /> 
    </div>
      </div>
      {/* Content */}
      <div className="flex-1 ">
         <Country/>
         <div className='flex justify-center py-4 dark:text-white'>
         
          { chosenCountry &&
           <button onClick={()=>{setSelectComp(!selectComp)}}
                  className="bg-green-500 py-3 px-4 rounded-lg shadow-md transform transition duration-300 hover:scale-105 text-xl text-white"

           >{selectComp ? 'Video blogy - klikni zde' : 'Fórum -  klikni zde'} 
           </button> }
         </div>
      {selectComp ?
      
        <Messages/>
        :
        <Cards/>
          }
      
      </div>
    </div>
  );
}

export default TravelTips;
