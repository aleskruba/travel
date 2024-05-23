import React, { useEffect, useState } from 'react'
import axios from 'axios';
import BASE_URL, { config } from '../../config/config';
import { VideoCard } from '../../types';

function YourBlogs() {

  const [backendError, setBackendError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [blogs,setBlogs] = useState<VideoCard[]>([]);

  useEffect(() => {
    if (!isLoading ) {
      setIsLoading(true);
  
      const fetchData = async () => {
        try {
          const resultBlogs= await axios.get(`${BASE_URL}/getyourblogs`,config);
          console.log(resultBlogs)
          setBlogs(resultBlogs.data.cards );


          setIsLoading(false);
     
        } catch (error) {
          console.error('Error fetching data:', error);
          setIsLoading(false);
        }
      };
  
      fetchData();
    }
  }, [backendError]);


  console.log(blogs)
  return (

    <div>YourBlogs</div>
  )
}

export default YourBlogs