import React from 'react'
import { useCountryContext } from '../context/countryContext';
import { countriesData } from '../constants';

function Country() {
    
    const {chosenCountryData} = useCountryContext();


  return (
    <div className='dark:text-lighTextColor'>
      {chosenCountryData ?<>
       <div>{chosenCountryData?.name}</div>
       <div>počet obyvatel{chosenCountryData?.population}</div>
       <div>měna {chosenCountryData?.currency}</div>
       <div>jazyk {chosenCountryData?.language}</div>
       <div>hlavní město {chosenCountryData?.capital}</div>
       <div>area {chosenCountryData?.area}</div>
       <div>časová zóna {chosenCountryData?.timezone}</div>
       <div>continent {chosenCountryData?.continent}</div>
       <div> <img src={chosenCountryData?.continent} alt="" /></div>
       </> :<>
       NO DATA</>}
</div>
  )
}

export default Country