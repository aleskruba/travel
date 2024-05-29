import React from 'react'
import moment from 'moment';
import { Link } from 'react-router-dom';
import { TourProps } from '../../types';
import 'moment/locale/cs';



type Props = {

  tour: TourProps;

};

const Tour: React.FC<Props> = ({tour }) => {
  moment.locale('cs');

// @ts-ignore
//const tourtypeArray = JSON.parse(tour.tourtype);

moment.locale('cs');
const tourStart = moment(tour?.tourdate).format('MMMM');
const tourEnd = moment(tour?.tourdateEnd).format('MMMM YYYY ');

  return ( 
    <Link to={`/spolucesty/${tour.id}`} className={`relative mt-4 rounded overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-600 dark:text-gray-200 py-1 px-1 '} w-[300px] h-[270px] px-4 cursor-pointer `}>
     
      <div className='flex items-center space-x-6 '>
          <div className='w-16 h-16'>
            
            <img  src={tour.image ? tour.image : 'profile.png' } alt="" className='w-full h-full object-cover rounded-full' />
         </div>
          <div>
            <h4 className='text-xl font-thin dark:text-white'>{tour.firstName}</h4>
         </div>
    </div>
      <div className={`mt-0`}>
          <div className='flex flex-col leading-none'>
            <div className="font-bold text-lg  dark:text-white">{tour.destination}  </div>
            <div className=" text-sm">   {moment(tour?.tourdate).format('MMMM') !== moment(tour?.tourdateEnd).format('MMMM')? `${tourStart} až ${tourEnd}` : `${tourEnd}` }</div> 
          </div>
         <div className="text-base italic">
          {tour.tourtype.slice(0, 2).map((el, index) => (
            <div key={index} className='text-xs'>{el}{index < 1 ? ',' : '...'}</div>
          ))}
     {/*      {tour.tourtype.length > 2 && <div className='text-xs'>...</div>} */}
        </div>


 </div>        
      <div className={`mt-4`}>
      {tour.fellowtraveler.length > 32 ? `${tour.fellowtraveler.slice(0, 32)}...` : tour.fellowtraveler}

      </div>

      <div className='w-[90%] justify-center items-center absolute bottom-5  '>
        <div className='px-2 py-2 shadow-lg text-center text-xl font-bold bg-gray-400 hover:bg-gray-500 hover:text-white rounded'>
        detail
        </div>
        
      </div>
    </Link>
  )
}

export default Tour

/* function stringToArray(tourtype: string[]) {
  throw new Error('Function not implemented.');
}
 */