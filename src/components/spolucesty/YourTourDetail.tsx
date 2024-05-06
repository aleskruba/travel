import React,{useState} from 'react'
import { useTourContext } from '../../context/tourContext';
import moment from 'moment';
import YourTourUpdate from './YourTourUpdate';
import { useNavigate } from 'react-router-dom';
  
function YourTourDetail() {

  const navigate = useNavigate();

  const {tours, setTours} = useTourContext()
  const [isLoading, setIsLoading] = useState(false);
  const [updateToggle, setUpdateToggle] = useState<boolean>(false);

  const yourTour= tours[5]
  const formattedDate = moment(yourTour?.date).format('DD.MM YYYY');
  moment.locale('cs');
  const tourStart = moment(yourTour?.tourdate).format('MMMM');
  const tourEnd = moment(yourTour?.tourdateEnd).format('MMMM YYYY ');


  const deleteYourTour = (id: any) => {
    const updatedTours = tours.filter(tour => tour.id !== id);
    setTours(updatedTours);


    navigate('/tvojespolucesty')
  }
  
  return (
    <div className='dark:text-white flex flex-col items-center '>
        
        

    {!isLoading ? (

        <>
        {!updateToggle ? 
    <div className=' flex flex-col items-center'>
        <div className=' dark:bg-gray-800 rounded-lg p-6 shadow-lg'>
            <div className='mb-4'>
            <div className='flex flex-col items-center text-xl font-semibold'> 
            <h3 className='text-xl font-semibold'>Destinace: {yourTour?.destination}</h3>
            </div>

        <div className='pt-4'>
        <img src="/man.png"alt={yourTour?.fname} className='rounded-full h-24 w-24 mx-auto' />
            </div>
            <div>
        <h3 className='flex flex-col items-center text-xl font-semibold'> {yourTour?.fname}</h3>  
        </div> 
            <div className='flex flex-col md:flex-row md:space-x-10 pt-2'><div className='min-w-[100px] font-extrabold '>Vloženo dne:</div> <div >{formattedDate}</div></div>
            <div className='flex flex-col md:flex-row md:space-x-10 pt-2'><div className='min-w-[100px]  font-extrabold '>termín od:</div> <div>{tourStart} až {tourEnd}</div></div>
            <div className='flex flex-col md:flex-row md:space-x-10 pt-2'><div className='min-w-[100px]  font-extrabold '>Typ cesty:</div> <div>{yourTour?.type}</div></div>
            <div className='flex flex-col md:flex-row md:space-x-10 pt-2'><div className='min-w-[100px] font-extrabold '>Hledám dd:</div> <div className='text-justify'>{yourTour?.fellowtraveler} Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi ex enim facilis ad nihil? Cumque sed eaque accusantium assumenda vel quaerat blanditiis voluptates, minus optio eligendi quis perspiciatis. Omnis sapiente modi voluptas quasi culpa iure labore facilis. Similique esse voluptates mollitia possimus nihil ullam cum non culpa, accusamus omnis reiciendis quia totam expedita dolorum corporis inventore ipsum sit exercitationem illo? </div></div>
            <div className='flex flex-col md:flex-row md:space-x-10 pt-2'><div className='min-w-[100px]  font-extrabold '>O mně:</div> <div className='text-justify'>{yourTour?.aboutme} Odio laudantium consequuntur quisquam eaque quos! Earum quaerat ut dicta repellat eaque tempora repudiandae reprehenderit dignissimos ratione facere. Facilis maiores repudiandae, libero, vel omnis totam non id eum praesentium enim est quidem provident labore ea illo incidunt. Dicta ea at odit voluptate deserunt, doloribus ipsum quas? Explicabo iusto dolore natus cumque eveniet, repellat facilis alias dignissimos expedita, molestias quaerat dolorem commodi quia fuga doloribus quibusdam aspernatur nulla! Quam eum, est vel natus tempore itaque eveniet distinctio id harum sequi ullam a cupiditate eligendi ad reiciendis perspiciatis atque quos quae vitae voluptatibus. Ipsa fugit dignissimos in dolorem ab! Necessitatibus saepe vitae soluta quasi, maiores beatae iure facilis culpa neque possimus cumque molestias sint eius similique quae nam! Porro sed cum nihil repellendus, culpa soluta natus tenetur alias. Dolores molestias unde reprehenderit asperiores dolore sequ</div></div>
            
            </div>
        </div>
        
        <div className=' flex justify-center items-center space-x-4 w-full mt-2 mb-2 '>
        <button className='px-2 py-2 min-w-[100px] bg-red-500 text-white hover:bg-red-400 rounded'
                onClick={(id)=>{deleteYourTour(yourTour?.id)}}>Smaž tour</button>
        <button className='px-2 py-2 min-w-[100px] bg-green-500 text-white hover:bg-green-400 rounded'
                onClick={()=>{setUpdateToggle(true)}}>Aktualizovat</button>
        <button className='px-2 py-2 min-w-[100px] bg-gray-500 text-white hover:bg-gray-400 rounded'
                onClick={()=>{    navigate('/tvojespolucesty')}}>Zpět</button>
        </div>
    </div>
    : 
    <YourTourUpdate setUpdateToggle={setUpdateToggle}/>
    }
    </>

    ) : (
      <p>Loading...</p>
    )}
  </div>
  )
}

export default YourTourDetail