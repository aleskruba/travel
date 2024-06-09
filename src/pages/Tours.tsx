import React, { useEffect, useState } from 'react';
import Tour from '../components/spolucesty/Tour';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import SearchComponent from '../components/spolucesty/SearchComponent';
import { useTourContext } from '../context/tourContext';
import { TourProps } from '../types';
import BASE_URL from '../config/config';
import ReactPaginate from 'react-paginate';

const ITEMS_PER_PAGE = 20;



type countryNamesObjects =  {
  value: string;
  label: string;

}

function Tours() {
  const { tours, setTours } = useTourContext();
  const [filteredTours, setFilteredTours] = useState<TourProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<{ value: string; label: string } | null>(null);
  const [selectedTourType, setSelectedTourType] = useState<{ value: string; label: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState<{ value: string; label: string } | null>(null);
  const [searchParams] = useSearchParams();
  const [updateParams, setUpdateParams] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [countryNamesObjects,setCountryNamesObjects] = useState<countryNamesObjects[]>([])


  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const resultTours = await axios.get(`${BASE_URL}/tours`);
        setTours(resultTours.data.tours);
        setFilteredTours(resultTours.data.tours);
        setIsLoading(false);
        
        if (resultTours.data.tours) {
          const uniqueDestinations = new Set();
          const arr = resultTours.data.tours.reduce((acc: { value: string; label: string; }[], tour: { destination: string; }) => {
            if (!uniqueDestinations.has(tour.destination)) {
              uniqueDestinations.add(tour.destination);
              acc.push({
                value: tour.destination,
                label: tour.destination
              });
            }
            return acc;
          }, []);
      
          console.log(arr);
          setCountryNamesObjects(arr);
        }
        
        const country = searchParams.get('country');
        const tourType = searchParams.get('type');
        const date = searchParams.get('date') as string | Date | null;

        if (country || tourType || date) {
          setUpdateParams(true);

       

        }
      } catch (error) {
        console.error('Error fetching tours:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ ]);

  const filterTours = (country: string | null, tourType: string | null, date: string | Date | null) => {
    let filtered = [...tours];

    if (country) {
      filtered = filtered.filter(tour => tour.destination === country);
    }
    if (tourType) {
      filtered = filtered.filter(tour => tour.tourtype.includes(tourType));
    }
    if (date) {
      const selectedDate = typeof date === 'string' ? date : date.toISOString().split('T')[0];
      const [selectedYear, selectedMonth] = selectedDate.split('-');

      filtered = filtered.filter(tour => {
        const tourDate = typeof tour.tourdate === 'string' ? tour.tourdate : tour.tourdate.toISOString().split('T')[0];
        const [tourYear, tourMonth] = tourDate.split('-');
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

        if (country || tourType || date) {
          filterTours(country, tourType, date);
        }
      }
    }
  }, [updateParams, filteredTours.length, searchParams]);

  const handlePageChange = ({ selected }: any) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = (currentPage + 1) * ITEMS_PER_PAGE;
  const currentMessages = filteredTours.slice(startIndex, endIndex);

  return (
    <div className={`flex flex-col items-center pb-4`}>
      <div className='dark:text-white'>Přidat novou spolucestu <Link to='/novacesta' className='text-blue-400 underline'>zde</Link></div>
      <div className='w-full md:w-3/4 justify-center mt-4'>
        <SearchComponent
          filterTours={filterTours}
          selectedCountry={selectedCountry}
          selectedTourType={selectedTourType}
          selectedDate={selectedDate}
          setSelectedCountry={setSelectedCountry}
          setSelectedTourType={setSelectedTourType}
          setSelectedDate={setSelectedDate}
          countryNamesObjects={countryNamesObjects}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-4 dark:text-white">
        {isLoading ? (
          <p>Moment prosím ...</p>
        ) : (

          currentMessages.length > 0 ?
            currentMessages.map((tour) => <Tour key={tour.id} tour={tour} />)
                                    :
              <div className='flex justify-center items-center flex-col pb-52'>  Žádná shoda  
              
              <div className='w-64 h-64'>
              <img src={process.env.PUBLIC_URL + '/emojisad.png'} alt="" className='flex pt-12 w-full object-cover'/>
              </div>
                 </div>
        )}
      </div>

      {filteredTours.length > ITEMS_PER_PAGE &&
        <ReactPaginate
          previousLabel={'<<'}
          nextLabel={'>>'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={Math.ceil(filteredTours.length / ITEMS_PER_PAGE)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={'pagination'}
          activeClassName={'active'}
          previousClassName={'pagination-previous'}
          nextClassName={'pagination-next'}
          disabledClassName={'pagination-disabled'}
        />
      }
    </div>
  );
}

export default Tours;
