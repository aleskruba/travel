import React, { useEffect, useState } from 'react'
import axios from 'axios';
import BASE_URL, { config } from '../../config/config';
import { VideoCard } from '../../types';

function YourCards() {

  const [backendError, setBackendError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cards,setCards] = useState<VideoCard[]>([]);

  useEffect(() => {
    if (!isLoading ) {
      setIsLoading(true);
  
      const fetchData = async () => {
        try {
          const resultBlogs= await axios.get(`${BASE_URL}/getyourblogs`,config);
          console.log(resultBlogs)
          setCards(resultBlogs.data.cards );


          setIsLoading(false);
     
        } catch (error) {
          console.error('Error fetching data:', error);
          setIsLoading(false);
        }
      };
  
      fetchData();
    }
  }, [backendError]);


  console.log(cards)
  return (
    <div className='max-w-[80%]'>
    <div className="grid grid-cols-1 md:grid-cols-auto lg:grid-cols-3 gap-4 border-b-4 border-indigo-500 pb-4">

      {cards.map((el) => (
        <div key={el.id} className="flex flex-col">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-lg shadow-md flex-1">
          <div className=" text-2xl pb-2">{el.country}</div>
            <div className="text-lg font-semibold">{el.title}</div>
            <div className="text-lg font-semibold">{el.video}</div>
     
            <div className="aspect-w-16 aspect-h-9 mt-4">
              {/* Assuming `el.video` is a URL to a video */}
              <iframe
                title={el.title}
                className="w-full h-full object-cover"
                src={el.video}
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <div className="flex justify-center space-x-4 p-4 bg-gray-100 dark:bg-gray-700">
            <button className=" text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-200">Upravit</button>
            <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-200">Smazat</button>
          </div>
        </div>
      ))}

</div>
    </div>


  )
}

export default YourCards