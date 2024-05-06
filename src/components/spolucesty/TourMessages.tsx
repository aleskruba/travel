import React, { useState,useEffect ,FormEvent } from 'react';
import ReactPaginate from 'react-paginate';
import DOMPurify from 'dompurify';
import axios from 'axios';
import TourMessage from './TourMessage';
import { MessageProps } from '../../types';
import { ReplyProps } from '../../types';



const ITEMS_PER_PAGE = 5;

function TourMessages() {

  const [currentPage, setCurrentPage] = useState(0);
  const [tourReplies, setTourReplies] = useState<ReplyProps[]>([]);
  const [tourMessage, setTourMessage] = useState<MessageProps>({
    id: 0,
    email: '',
    fname: '',
    date: new Date(),
    img: '',
    message: '',
    user_id: 4
  });

  const [isLoading, setIsLoading] = useState(false);
  const [tourMessages, setTourMessages] = useState<MessageProps[]>([]);
 
   useEffect(() => {
 
      setIsLoading(true);
      const fetchData = async () => {
        try {
          const resultTourMessages = await axios.get('/messages.json');
          setTourMessages(resultTourMessages.data.messages);
/*           const resultTourReplies = await axios.get('/replies.json');

         
    
            setTourReplies(resultTourReplies.data.tourReplies); */

      /*       console.log(resultTourMessages.data.messages)
            
            console.log(resultTourReplies.data.tourReplies) */
            
      setIsLoading(false);
        } catch (error) {
            // Handle errors
            console.error('Error fetching data:', error);
        }
    };
    

      fetchData();
  
  }, []); 
  
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedMessage = DOMPurify.sanitize(event.target.value);
    setTourMessage({...tourMessage,[event.target.name]:sanitizedMessage});
  };


  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

 
    if (!tourMessage.message.length) {
      return;
    }

  
    const newMessage = {
      id: tourMessages.length + 1, // Generate a unique ID
      email: 'new@example.com',
      fname: 'ales',
      date: new Date(),
      img: '/man.png',
      message: tourMessage.message,
      user_id:4
    };
  
    setTourMessages([newMessage, ...tourMessages]); // Prepend the new message
  
    // Reset the message input
    setTourMessage({
      id: 0,
      email: '',
      fname: '',
      date: new Date(),
      img: '',
      message: '',
      user_id: 4,
    });
  };
  



  const handlePageChange = ({ selected }: any) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = (currentPage + 1) * ITEMS_PER_PAGE;

  const currentMessages = tourMessages?.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col  px-2 md:px-4 w-full">


      <form onSubmit={onSubmit}>
        <div className="flex justify-between items-center dark:text-lighTextColor gap-4 bg-gray-100 px-2 py-2 md:rounded-lg shadow-md mt-2">
          <div className="flex items-center gap-2"> 
            <div className="w-14 h-14 overflow-hidden rounded-full">
              <img src="/man.png" alt="Profile" className="w-full h-full object-cover" />
            </div>
           </div>
          <div className="flex-1 hidden md:flex">
            <textarea
              name="message"
              value={tourMessage.message}
              onChange={handleChange}
              className="w-full py-2 px-4 bg-gray-200 rounded-lg text-black focus:outline-none focus:ring focus:border-blue-500 resize-none"
              placeholder="Zde můžeš cestovateli napsat (max 500 characters)"
              maxLength={500} 

           />
          </div>
          <div>
            <button type="submit" className="py-2 px-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-700">Odešli</button>
          </div>
        </div>

        <div className="md:hidden">
          <textarea
            name="message"
            value={tourMessage.message}
            onChange={handleChange}
            className="w-full py-2 px-4 bg-gray-200 text-black focus:outline-none focus:ring focus:border-blue-500 resize-none"
            placeholder="Zde můžeš cestovateli napsat"
            maxLength={500} 
       />
        </div>
      </form>


      <div className='flex flex-col mt-4 gap-1'>
      <div className='flex flex-col mt-4 gap-1'>
      {
        !isLoading ? (
          currentMessages
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Reverse sorting order
            .map((tourMessage, idx) => (
              <TourMessage key={idx} tourMessages={tourMessages} tourMessage={tourMessage} tourReplies={tourReplies} setTourMessages={setTourMessages} setTourReplies={setTourReplies} />
            ))
        ) : (
          <>moment prosím</>
        )
      } 

      </div>

      </div>

      { tourMessages.length &&
      <ReactPaginate
        previousLabel={'<<'}
        nextLabel={'>>'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={Math.ceil(tourMessages.length / ITEMS_PER_PAGE)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={'pagination'}
        activeClassName={'active'}
        previousClassName={'pagination-previous'}
        nextClassName={'pagination-next'}
        disabledClassName={'pagination-disabled'}
      />
    }
   
    </div>
  );
}

export default TourMessages;

