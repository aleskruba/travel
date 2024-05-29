import React, { useEffect, useState } from 'react';
import Tour from '../components/spolucesty/Tour';
import axios from 'axios';
import { Link,useSearchParams  } from 'react-router-dom';
import SearchComponent from '../components/spolucesty/SearchComponent';
import { useTourContext } from '../context/tourContext';
import { TourProps } from '../types';
import BASE_URL from '../config/config';

function Tours() {
  const {tours, setTours} = useTourContext()
  const [filteredTours, setFilteredTours] = useState<TourProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<{ value: string; label: string } | null>(null);
  const [selectedTourType, setSelectedTourType] = useState<{ value: string; label: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState<{ value: string; label: string } | null>(null);
  const [searchParams] = useSearchParams();
  const [updateParaams,setUpdateParams] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const resultTours = await axios.get(`${BASE_URL}/tours`)
        console.log('resultTours:',resultTours);
        setTours(resultTours.data.tours);
        setFilteredTours(resultTours.data.tours)
        setIsLoading(false);
        

           const country = searchParams.get('country');
           const tourType = searchParams.get('type');
           const date = searchParams.get('date') as string | Date | null; // Explicitly cast to string | null
          
           if ((country || tourType || date)) {
         
             console.log(country ,tourType ,date)
             setUpdateParams(true)
       
           }
    
      } catch (error) {
        console.error('Error fetching tours:', error);
        setIsLoading(false);
      }
    };

    fetchData();

  }, []);


  

  const filterTours = (country: string | null, tourType: string | null, date: string | Date | null) => {
    let filtered = [...tours];

    if (country) {
      filtered = filtered.filter(tour => tour.destination === country);
    }
    if (tourType) {
      filtered = filtered.filter(tour => tour.tourtype.includes(tourType));
    }
    if (date) {
      const selectedDate = typeof date === 'string' ? date : date.toISOString().split('T')[0]; // Convert to ISO string and extract date part
      const [selectedYear, selectedMonth] = selectedDate.split('-'); // Extract year and month from the selected date
    
      filtered = filtered.filter(tour => {
        const tourDate = typeof tour.tourdate === 'string' ? tour.tourdate : tour.tourdate.toISOString().split('T')[0]; // Convert to ISO string and extract date part
        const [tourYear, tourMonth] = tourDate.split('-'); // Extract year and month from the tourdate
        return tourYear === selectedYear && tourMonth === selectedMonth;
      });
    }
    


    setFilteredTours(filtered);
  };


  useEffect(() => { 
  if (filteredTours.length) {
    const country = searchParams.get('country');
    const tourType = searchParams.get('type');
    const date = searchParams.get('date');

    if (country || tourType || date) {
    setSelectedCountry(country ? { value: country, label: country } : null);
    setSelectedTourType(tourType ? { value: tourType, label: tourType } : null);
    setSelectedDate(date ? { value: date, label: date } : null);
    console.log(country, tourType, date)

        if(country || tourType || date) {
        filterTours(country, tourType, date);
        }
  }
}

},[updateParaams])




  return (
    <div className={`flex flex-col items-center`}>
      <div className='dark:text-white'>Přidat novou spolucestu <Link to='/novacesta' className='text-blue-400 underline'>zde</Link>  </div>
    <div className='w-full md:w-3/4  justify-center mt-4'>
    <SearchComponent
          filterTours={filterTours}
          selectedCountry={selectedCountry}
          selectedTourType={selectedTourType}
          selectedDate={selectedDate}
          setSelectedCountry={setSelectedCountry}
          setSelectedTourType={setSelectedTourType}
          setSelectedDate={setSelectedDate}
        />
    </div>

    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        filteredTours.map((tour) =>  <Tour key={tour.id} tour={tour} />)
      )}
    </div>
    </div>
  );
}

export default Tours;