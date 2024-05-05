import {useState} from 'react'
import { useTourContext } from '../context/tourContext';

import YourTour from '../components/spolucesty/YourTour';

interface TourProps {
  id: number;
  fname: string;
  email: string;
  img: string;
  date: Date;
  tourdate: Date;
  tourdateEnd: Date;
  destination: string;
  type: string[];
  fellowtraveler: string;
  aboutme: string;
  user_id: number;
}

function YourTours() {
  const {tours} = useTourContext()
  const [isLoading] = useState(false);


  const yourTour: TourProps = tours[5];



  return (
    <div className={`flex flex-col items-center`}>
    
    {!isLoading ?  (

      <YourTour yourTour={yourTour}/>


    ):(
      <p>Loading...</p>
    ) }
  </div>
  )
}

export default YourTours