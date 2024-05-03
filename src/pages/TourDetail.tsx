import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/cs';
import TourMessages from '../components/spolucesty/TourMessages';

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

function TourDetail() {
  let { id } = useParams<string>(); // id is of type string | undefined
  let intId: number | undefined;
  if (id !== undefined) {
    intId = parseInt(id); // parseInt expects a string
  }

  const [isLoading, setIsLoading] = useState(false);

  const [tours, setTours] = useState<TourProps[]>([]);
  const [tourDetail, setTourDetail] = useState<TourProps>({
    id: 0,
    fname: '',
    email: '',
    img: '',
    date: new Date(),
    tourdate: new Date(),
    tourdateEnd: new Date(),
    destination: '',
    type: [],
    fellowtraveler: '',
    aboutme: '',
    user_id: 4
  });

  useEffect(() => {
   
    const fetchData = async () => {
      try {
        const resultTours = await axios.get('/tours.json');
        console.log(resultTours.data)
        if (intId !== undefined) {
        setTourDetail(resultTours.data.tours[intId-1]);
        setIsLoading(false)
        }
      } catch (error) {
        console.error('Error fetching tours:', error);
      }
    };

    fetchData();
  }, []);
  const formattedDate = moment(tourDetail?.date).format('DD.MM YYYY');
  moment.locale('cs');
  const tourStart = moment(tourDetail?.tourdate).format('MMMM');
  const tourEnd = moment(tourDetail?.tourdateEnd).format('MMMM YYYY ');


  console.log(tourDetail)
  return (
    <div className='dark:text-white flex flex-col items-center'>
  
      <h2 className='text-3xl font-semibold mb-4'>Tour Detail</h2>
      {!isLoading ? (
      <div className=' flex flex-col items-center'>
      <div className='bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow-lg'>
          <div className='mb-4'>
          <div className='flex flex-col items-center text-xl font-semibold'> 
            <h3 className='text-xl font-semibold'>Destinace: {tourDetail?.destination}</h3>
          </div>

      <div className='pt-4'>
      <img src="/man.png"alt={tourDetail?.fname} className='rounded-full h-24 w-24 mx-auto' />
          </div>
          <div>
      <h3 className='flex flex-col items-center text-xl font-semibold'> {tourDetail?.fname}</h3>  
        </div> 
            <p className='flex flex-col md:flex-row md:space-x-10 pt-2'><div className='min-w-[100px] font-extrabold '>Vloženo dne:</div> <div >{formattedDate}</div></p>
            <p className='flex flex-col md:flex-row md:space-x-10 pt-2'><div className='min-w-[100px]  font-extrabold '>termín od:</div> <div>{tourStart} až {tourEnd}</div></p>
            <p className='flex flex-col md:flex-row md:space-x-10 pt-2'><div className='min-w-[100px]  font-extrabold '>Typ cesty:</div> <div>{tourDetail?.type}</div></p>
            <p className='flex flex-col md:flex-row md:space-x-10 pt-2'><div className='min-w-[100px] font-extrabold '>Hledám dd:</div> <div className='text-justify'>{tourDetail?.fellowtraveler} Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi ex enim facilis ad nihil? Cumque sed eaque accusantium assumenda vel quaerat blanditiis voluptates, minus optio eligendi quis perspiciatis. Omnis sapiente modi voluptas quasi culpa iure labore facilis. Similique esse voluptates mollitia possimus nihil ullam cum non culpa, accusamus omnis reiciendis quia totam expedita dolorum corporis inventore ipsum sit exercitationem illo? </div></p>
            <p className='flex flex-col md:flex-row md:space-x-10 pt-2'><div className='min-w-[100px]  font-extrabold '>O mně:</div> <div className='text-justify'>{tourDetail?.aboutme} Odio laudantium consequuntur quisquam eaque quos! Earum quaerat ut dicta repellat eaque tempora repudiandae reprehenderit dignissimos ratione facere. Facilis maiores repudiandae, libero, vel omnis totam non id eum praesentium enim est quidem provident labore ea illo incidunt. Dicta ea at odit voluptate deserunt, doloribus ipsum quas? Explicabo iusto dolore natus cumque eveniet, repellat facilis alias dignissimos expedita, molestias quaerat dolorem commodi quia fuga doloribus quibusdam aspernatur nulla! Quam eum, est vel natus tempore itaque eveniet distinctio id harum sequi ullam a cupiditate eligendi ad reiciendis perspiciatis atque quos quae vitae voluptatibus. Ipsa fugit dignissimos in dolorem ab! Necessitatibus saepe vitae soluta quasi, maiores beatae iure facilis culpa neque possimus cumque molestias sint eius similique quae nam! Porro sed cum nihil repellendus, culpa soluta natus tenetur alias. Dolores molestias unde reprehenderit asperiores dolore sequ</div></p>
          
          </div>
     
        </div>

        <div className='flex justify-center items-center  border-t w-full py-4 '>
          <TourMessages/>
        </div>
    </div>

      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default TourDetail;
