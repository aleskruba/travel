const BASE_URL = 'http://localhost:5252/api';

//const BASE_URL = 'https://travelbackend-374j.onrender.com/api';
export default BASE_URL;


export const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Set the withCredentials option to true
  };