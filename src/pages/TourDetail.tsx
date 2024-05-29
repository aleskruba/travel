import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/cs';
import TourMessages from '../components/spolucesty/TourMessages';
import { TourProps } from '../types';
import { useNavigate } from 'react-router-dom';
import { BsArrowReturnLeft } from "react-icons/bs";
import BASE_URL from '../config/config';
import ConfirmationModal from '../components/ConfirmationModal';
import Modal from '../components/Modal';
import NotFound404 from './NotFound404';


function TourDetail() {
  let { id } = useParams<string>(); // id is of type string | undefined
  const intId = id ? parseInt(id) : NaN;

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [tours, setTours] = useState<TourProps[]>([]);
  const [tourDetail, setTourDetail] = useState<TourProps>({
    id: 0,
    date: new Date(),
    tourdate: new Date(),
    tourdateEnd: new Date(),
    destination: '',
    tourtype: [],
    fellowtraveler: '',
    aboutme: '',
    user_id: 4
  });
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {

    if (isNaN(intId)) {
      setError('Invalid tour ID');
      return;
    }
   
    const fetchData = async () => {
      try {
       const resultTours = await axios.get(`${BASE_URL}/tours/${id}`)
   
        if (intId !== undefined) {
        setTourDetail(resultTours.data.tour[0]);
        setIsLoading(false)
        }
      } catch (error:any) {
        if (error.response.status === 404) {
          setTourDetail({
            id: 0,
            date: new Date(),
            tourdate: new Date(),
            tourdateEnd: new Date(),
            destination: '',
            tourtype: [],
            fellowtraveler: '',
            aboutme: '',
            user_id: 4
          });
          setError('Error fetching data');
        }
      }
    };

    fetchData();
  }, []);
  const formattedDate = moment(tourDetail?.date).format('DD.MM YYYY');
  moment.locale('cs');
  const tourStart = moment(tourDetail?.tourdate).format('MMMM');
  const tourEnd = moment(tourDetail?.tourdateEnd).format('MMMM YYYY ');

console.log(moment(tourDetail?.tourdate).format('MMMM') == moment(tourDetail?.tourdateEnd).format('MMMM') )
  const [showFoto,setShowFoto] = useState(false)


const showFotoFunction = () => {
  setShowFoto(true);

};
console.log(tourEnd,tourStart)
  return (
  
    <div className='dark:text-white flex flex-col items-center '>

{error ? (
        <div><NotFound404/></div>
      ) : ( <> 
 
       <div onClick={() => navigate(-1) } className='flex items-center text-2xl font-semibold italic justify-center cursor-pointer hover:dark:text-gray-300 hover:text-gray-500'> <BsArrowReturnLeft />
 <span className='ml-4'>ZPĚT</span></div>

      {!isLoading ? (
      <div className=' flex flex-col items-center w-full md:px-12 px-1'>
      <div className='bg-gray-100 dark:bg-gray-800 rounded-lg min-w-[380px]  w-full shadow-lg  '>
          <div className='mb-4  px-1  md:text-xl'>
   
        <div className='flex gap-4 items-center justify-center md:justify-start b md:gap-24'>

      <div className=' w-16 h-16 md:w-20 md:h-20'
          onClick={showFotoFunction}>
         <img  src={tourDetail.image ? tourDetail?.image : 'profile.png' } alt="" className='w-full h-full object-cover rounded-full' />
      </div>
     
     
      <div>

        <h3 className='flex flex-col items-center justify-center text-xl md:text-2xl font-semibold  '> {tourDetail?.firstName}</h3>  
      </div> 
      </div>
      
      <div className='flex justify-between md:justify-start md:flex-row md:space-x-10 pt-2'><div className='w-[130px] font-bold '>Destinace:</div> <div className="tracking-wide" >{tourDetail?.destination}</div></div>
            <div className='flex justify-between md:justify-start  md:flex-row md:space-x-10 pt-2 '><div className='w-[130px] font-bold '>Vloženo dne:</div> <div className="  tracking-wide" >{formattedDate}</div></div>
            <div className='flex justify-between md:justify-start  md:flex-row md:space-x-10 pt-2'><div className='w-[130px]  font-bold '>Termín od:</div> <div className="  tracking-wide"> {moment(tourDetail?.tourdate).format('MMMM') !== moment(tourDetail?.tourdateEnd).format('MMMM')? `${tourStart} až ${tourEnd}` : `${tourEnd}` } </div></div>
            <div className='flex flex-col md:flex-row justify-start pt-2 '>
                
                 <div className='min-w-[100px]  font-bold '>Typ cesty:</div> 
              
                <div  className="flex flex-col  items-end md:items-start w-full  md:pl-16">
                   <ul className="list-disc list-inside space-y-2 rounded-lg shadow-lg px-2 py-1 border ">
                      {tourDetail?.tourtype.map(el => {
                        return (
                          <li key={el} className="text-base font-medium tracking-wide">
                            {el}
                          </li>
                        );
                      })}
                    </ul>
              </div>
            </div>
            
              <div className="max-w-[800px] ">

     <div className="flex flex-col md:flex-row md:space-x-10 pt-2 w-full break-words">
        <div className="min-w-[100px] font-bold">Hledám:</div>
        <div className="flex text-justify text-base  tracking-wide break-all ">
          {tourDetail?.fellowtraveler}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-10 pt-2 w-full break-words">
                <div className='min-w-[100px]  font-bold '>O mně:</div> 
                <div className="flex text-justify text-base font-medium tracking-wide break-all ">{tourDetail?.aboutme} </div>
            </div>
            </div>
          
          </div>
     
        </div>

        <div className='flex justify-center items-center  border-t w-full py-4 '>
      <TourMessages/> 
        </div>

        <Modal show={showFoto} onClose={()=>setShowFoto(false)} imageUrl={tourDetail.image} />
    </div>

      ) : (
        <p>Loading...</p>
      )}
    
    </> )}

    </div>

    
  );
}

export default TourDetail;
