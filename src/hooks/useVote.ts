import { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL, { config } from '../config/config';
import { useCountryContext } from '../context/countryContext';
import { useAuthContext } from '../context/authContext';

interface UserProps {
  id: number | null;
  email: string | null;
  firstName?: string | null;
  [key: string]: any;
}


type VoteResponse = {
  id?: number,
  user_id:number | null,
  message_id:string,
  vote_type:string,
  vote_date? :Date
}
  const useVote = (country:string)=> {

    const { chosenCountry } = useCountryContext();
    const { user } = useAuthContext();
  //const [vote, setVote] = useState<'thumb_up' | 'thumb_down' | null>(null);
  const [votes, setVotes] = useState<VoteResponse[]>([]);


  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/${chosenCountry}/votes`);
        console.log(response.data)
        setVotes(response.data.votes)

      } catch (error) {
        console.error('Error fetching votes:', error);
      }
    };

    fetchVotes();
  }, []);

  const handleVote = async (voteType: 'thumb_up' | 'thumb_down',message_id:any) => {

    if (user) {

      const newVote = {
        user_id: user.id,
        vote_type: voteType,
        message_id:message_id
      }
   
    try {
      const response = await axios.post(`${BASE_URL}/${country}/vote`,newVote,config);

      console.log(response);
      if (response.status === 201 ) {
  
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  }
  };

  return {

  votes,
  handleVote,
  setVotes
};
};

export default useVote;
