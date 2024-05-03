import React from 'react'
import moment from 'moment';
import { Link } from 'react-router-dom';


interface TourProps {
  id: number;
  fname: string;
  email:string;
  img:string;
  date: Date;
  tourdate: Date;
  tourdateEnd: Date;
  destination: string;
  type: string[];
  fellowtraveler: string;
  aboutme: string;
  user_id: number;
}

type Props = {

  tour: TourProps;

};

const Tour: React.FC<Props> = ({tour }) => {


  return ( 
    <Link to={`/spolucesty/${tour.id}`} className={`mt-4 rounded overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-600 dark:text-gray-200 py-1 px-1 '} w-[300px] h-[270px] px-4 cursor-pointer `}>
     
      <div className='flex items-center space-x-6'>
          <div className='w-16 h-16'>
            <img src="man.png" alt="" className='w-full rounded-full' />
         </div>
          <div>
            <h4 className='text-xl font-thin dark:text-white'>{tour.fname}</h4>
         </div>
    </div>
      <div className={`mt-2`}>
         <div className="font-bold text-xl mb-1 dark:text-white">{tour.destination}</div> 
         <div className="  text-base italic">{tour.type} </div>
         <div className=" text-base">  {moment(tour.tourdate).format('YYYY-MM-DD')} - {moment(tour.tourdateEnd).format('YYYY-MM-DD')}
 </div>
      
      </div>
      <div className={`mt-4`}>
      {tour.fellowtraveler.length > 40 ? `${tour.fellowtraveler.slice(0, 40)}...` : tour.fellowtraveler}

      </div>

      <div className='w-full justify-center items-center  '>
        <div className='px-2 py-2 shadow-lg text-center text-xl font-bold bg-gray-400 hover:bg-gray-500 hover:text-white rounded'>
        detail
        </div>
        
      </div>
    </Link>
  )
}

export default Tour