import React from 'react'
import moment from 'moment';
import { Link } from 'react-router-dom';
import { TourProps } from '../../types';


type Props = {

    yourTour: TourProps;

};

const YourTour: React.FC<Props> = ({yourTour }) => {


  return ( 
    <Link to={`/tvojespolucesty/${yourTour.id}`} className={` rounded overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-600 dark:text-gray-200 py-1 px-1 '} w-[300px] h-[270px] px-4 cursor-pointer `}>
     
      <div className='flex items-center space-x-6'>
          <div className='w-16 h-16'>
            <img src="man.png" alt="" className='w-full rounded-full' />
         </div>
          <div>
            <h4 className='text-xl font-thin dark:text-white'>{yourTour.fname}</h4>
         </div>
    </div>
      <div className={`mt-2`}>
         <div className="font-bold text-xl mb-1 dark:text-white">{yourTour.destination}</div> 
         <div className="  text-base italic">{yourTour.type} </div>
         <div className=" text-base">  {moment(yourTour.tourdate).format('YYYY-MM-DD')} - {moment(yourTour.tourdateEnd).format('YYYY-MM-DD')}
 </div>
      
      </div>
      <div className={`mt-4`}>
      {yourTour.fellowtraveler.length > 40 ? `${yourTour.fellowtraveler.slice(0, 40)}...` : yourTour.fellowtraveler}

      </div>

      <div className='w-full justify-center items-center  '>
        <div className='px-2 py-2 shadow-lg text-center text-xl font-bold bg-gray-400 hover:bg-gray-500 hover:text-white rounded'>
        detail
        </div>
        
      </div>
    </Link>
  )
}

export default YourTour