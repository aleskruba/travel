import React, { useEffect, useState } from 'react';
import Tour from './Tour';
import axios from 'axios';

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

function Tours() {
  const [tours, setTours] = useState<TourProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const resultTours = await axios.get('tours.json');
        setTours(resultTours.data.tours);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tours:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={`flex flex-col items-center`}>
    <div className="flex flex-wrap justify-center gap-4">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        tours.map((tour) => <Tour key={tour.id} tour={tour} />)
      )}
    </div>
    </div>
  );
}

export default Tours;
