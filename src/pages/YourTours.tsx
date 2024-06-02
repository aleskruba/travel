import { useEffect, useState } from "react";
import { useTourContext } from "../context/tourContext";
import YourTour from "../components/spolucesty/YourTour";
import { TourProps } from "../types";
import { useNavigate } from "react-router-dom";
import { BsArrowReturnLeft } from "react-icons/bs";
import axios from "axios";
import BASE_URL from "../config/config";

function YourTours() {

  const { yourTours, setYourTours} = useTourContext();
  const [isLoading,setIsLoading] = useState(false);
  const [error,setError] = useState('');

   const navigate = useNavigate();


   useEffect(() => {

    setIsLoading(true);
    const fetchData = async () => {
      try {

        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
  
        };
      
        const resultTourMessages = await axios.get(`${BASE_URL}/yourtours`,config);

           setYourTours(resultTourMessages.data.tours);
        setIsLoading(false);
      } catch (error:any) {
        if (error.response.status === 404) {
          setYourTours([]);
          setError('Error fetching data');
        }
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={`flex flex-col items-center pt-4 pb-6`}>
      <div
        onClick={() => navigate("/profile")}
        className="flex items-center text-2xl pb-6 font-semibold italic justify-center dark:text-white cursor-pointer hover:dark:text-gray-300 hover:text-gray-500"
      >
        {" "}
        <BsArrowReturnLeft />
        <span className="ml-4">ZPĚT</span>
      </div>

      <div className="flex justify-center flex-wrap gap-2">
  {!isLoading ? 
  
    yourTours.map(yourTour=> { return (   

        <YourTour yourTour={yourTour} key={yourTour.id} /> 

 
    )})

  : <p>Loading...</p>} 

</div>   
    </div>
  );
}

export default YourTours;
