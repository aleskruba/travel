import React,{useState,useEffect} from 'react'
import { useTourContext } from '../../context/tourContext';
import moment from 'moment';
import YourTourUpdate from './YourTourUpdate';
import { useNavigate } from 'react-router-dom';
import { TourProps } from '../../types';
import BASE_URL from '../../config/config';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../context/authContext';
import ConfirmationModal from '../ConfirmationModal';
import {  Flip, toast } from 'react-toastify';

function YourTourDetail() {

  let { id } = useParams<string>(); // id is of type string | undefined
  const intId = id ? parseInt(id) : NaN;


  const navigate = useNavigate();
  const { user} = useAuthContext();
  const {yourTours,setYourTours} = useTourContext()
  const [yourTour, setYourTour] = useState<TourProps>()
  const [isLoading, setIsLoading] = useState(false);
  const [updateToggle, setUpdateToggle] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedTourId, setSelectedTourId] = useState<number | null>(null);

  useEffect(() => {
    const tour =  yourTours.find(yourTour => yourTour.id === intId)
    setYourTour(tour)

  }, []);


  const formattedDate = moment(yourTour?.date).format('DD.MM YYYY');
  moment.locale('cs');
  const tourStart = moment(yourTour?.tourdate).format('MMMM');
  const tourEnd = moment(yourTour?.tourdateEnd).format('MMMM YYYY ');


  const handleDeleteTourClick = (ID: number) => {
    setSelectedTourId(ID);
    setShowModal(true);
    };

  const deleteYourTour = async () => {
    const updatedTour = yourTours.filter(tour => tour.id !== selectedTourId);

  try{
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: {
        user_id:user?.id,
        tourId: id 
      }
    };
    setYourTours(updatedTour)
    const response = await axios.delete(`${BASE_URL}/yourtours`, config);

    setShowModal(false)
    if (response.status === 201) {
      toast.success(response.data.message,  {
        position: "top-left",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Flip,
        });
        navigate('/tvojespolucesty')

      }
  } catch (error) {
    console.error("Error deleting message:", error);
   toast.error('Chyba při ukládání',  {
          position: "top-left",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Flip,
          });
}



  }
  
  return (
    <div className='dark:text-white flex flex-col items-center '>
        
        {!updateToggle ? 
    <div className=' flex flex-col items-center'>
        <div className=' dark:bg-gray-800 rounded-lg p-6 shadow-lg'>
            <div className='mb-4'>
            <div className='flex flex-col items-center text-xl font-semibold'> 
            <h3 className='text-xl font-semibold'>Destinace: {yourTour?.destination}</h3>
            </div>
            <div className='flex flex-col md:flex-row md:space-x-10 pt-2'><div className='min-w-[100px] font-extrabold '>Vloženo dne:</div> <div >{formattedDate}</div></div>
            <div className='flex flex-col md:flex-row md:space-x-10 pt-2'><div className='min-w-[100px]  font-extrabold '>termín od:</div> <div>{tourStart} až {tourEnd}</div></div>
            <div className='flex flex-col md:flex-row md:space-x-10 pt-2'><div className='min-w-[100px]  font-extrabold '>Typ cesty:</div> <div>{yourTour?.tourtype}</div></div>
            <div className='flex flex-col md:flex-row md:space-x-10 pt-2'><div className='min-w-[100px] font-extrabold '>Hledám dd:</div> <div className='text-justify break-all'>{yourTour?.fellowtraveler}  </div></div>
            <div className='flex flex-col md:flex-row md:space-x-10 pt-2'><div className='min-w-[100px]  font-extrabold '>O mně:</div> <div className='text-justify break-all'>{yourTour?.aboutme}</div></div>
            
            </div>
        </div>
        
        <div className=' flex justify-center items-center space-x-4 w-full mt-2 mb-2 '>
        <button className='px-2 py-2 min-w-[100px] bg-red-500 text-white hover:bg-red-400 rounded'
                onClick={()=> yourTour && handleDeleteTourClick(yourTour?.id)}>Smaž tour</button>
        <button className='px-2 py-2 min-w-[100px] bg-green-500 text-white hover:bg-green-400 rounded'
                onClick={()=>{setUpdateToggle(true)}}>Aktualizovat</button>
        <button className='px-2 py-2 min-w-[100px] bg-gray-500 text-white hover:bg-gray-400 rounded'
                onClick={()=>{    navigate('/tvojespolucesty')}}>Zpět</button>
        </div>
    </div>
    : 
    yourTour &&
    <YourTourUpdate setUpdateToggle={setUpdateToggle} yourTour={yourTour}/>
    }


<ConfirmationModal
  show={showModal}
  onClose={() => setShowModal(false)}
  onConfirm={ deleteYourTour}
  message="Chceš opravdu smazat tuto zprávu?"

/>
  </div>
  )
}

export default YourTourDetail