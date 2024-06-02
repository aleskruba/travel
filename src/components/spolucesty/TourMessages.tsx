import React, { useState, useEffect, FormEvent } from 'react';
import ReactPaginate from 'react-paginate';
import DOMPurify from 'dompurify';
import axios from 'axios';
import TourMessage from './TourMessage';
import { ReplyProps, TourMessageProps } from '../../types';
import BASE_URL, { config } from '../../config/config';
import { useAuthContext } from '../../context/authContext';
import { useParams } from 'react-router-dom';

const ITEMS_PER_PAGE = 5;

function TourMessages() {
  let { id } = useParams<string>(); // id is of type string | undefined
  const intId = id ? parseInt(id) : NaN;

  const { user } = useAuthContext();
  const [currentPage, setCurrentPage] = useState(0);
  const [tourMessage, setTourMessage] = useState<TourMessageProps>({
    id: 0,
    firstName: '',
    date: new Date(),
    image: '',
    message: '',
    user_id: null,
    tour_id: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [tourMessages, setTourMessages] = useState<TourMessageProps[]>([]);
  const [backendError, setBackendError] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [replies, setReplies] = useState<ReplyProps[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [allowedToDelete, setAllowedToDelete] = useState(true);


  const configGet = {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,

  };

  useEffect(() => {
    if (isNaN(intId)) {
      setError('Invalid tour ID');
      return;
    }

    setIsLoading(true);
    const fetchData = async () => {
      try {
        const resultTourMessages = await axios.get(`${BASE_URL}/tourmessages/${intId}`);
        const resultTourReplies = await axios.get(`${BASE_URL}/tourreplies/${intId}`,configGet);
      
        setReplies(resultTourReplies.data.tourReplies);
        setTourMessages(resultTourMessages.data.tourMessages);
        setIsLoading(false);
      } catch (error:any) {
        if (error.response.status === 404) {
          setTourMessages([]);
          setError('Error fetching data');
        }
        setIsLoading(false);
      }
    };

    fetchData();
  }, [intId]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedMessage = DOMPurify.sanitize(event.target.value);
    setTourMessage({ ...tourMessage, [event.target.name]: sanitizedMessage });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!tourMessage.message || !tourMessage.message.trim()) {
      return;
    }

    if (tourMessage.message !== undefined && tourMessage.message.length > 400) {
      setBackendError('Příliš dlouhý text , max 400 znaků ');
      return;
    }

    try {
      const newMessage = {
        id: tourMessages.length + 1, // Generate a unique ID
        firstName: user?.firstName || '', // Default to empty string if undefined
        date: new Date(),
        image: user?.image || '', // Default to empty string if undefined
        message: tourMessage.message,
        user_id: user?.id || null,
        tour_id: intId || null,
      };

      const response = await axios.post(`${BASE_URL}/tourmessages`, newMessage, config);

      if (response.status === 201) {
        const updatedMessage = { ...newMessage, id: response.data.message };
        setBackendError('')
        setTourMessages((prevMessages) => [updatedMessage, ...prevMessages].sort((a, b) => b.id - a.id));
        setTourMessage({
          id: 0,
          firstName: '',
          date: new Date(),
          image: '',
          message: '',
          user_id: user?.id || null,
          tour_id: intId || null,
        });
      }
    } catch (error) {
      console.error(error);
      setBackendError('Příliš dlouhý text , max 400 znaků ');
    }
  };

  const handlePageChange = ({ selected }: any) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = (currentPage + 1) * ITEMS_PER_PAGE;

  const currentMessages = tourMessages?.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col px-2 md:px-4 w-full">
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          <form onSubmit={onSubmit}>
            <div className="flex justify-between items-center dark:text-lighTextColor gap-4 bg-gray-100 px-2 py-2 md:rounded-lg shadow-md mt-2">
              <div className="flex items-center gap-2">
                <div className="w-14 h-14 overflow-hidden rounded-full">
                  <img src={user?.image ? user?.image : '/profile.png'} alt="Profile" className="w-full h-full object-cover" />
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
                <button type="submit" className="py-2 px-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-700">
                  Odešli
                </button>
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

            {backendError && <span className='text-red-500'>{backendError}</span>}
          </form>

          <div className='flex flex-col mt-4 gap-1'>
            {!isLoading ? (
              currentMessages
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Reverse sorting order
                .map((tourMessage, idx) => (
                  <TourMessage key={idx} 
                               tourMessages={tourMessages} 
                               tourMessage={tourMessage} 
                               setTourMessages={setTourMessages} 
                               setReplies={setReplies}
                               replies={replies}
                               isSubmitted={isSubmitted}
                               setIsSubmitted={setIsSubmitted}
                               allowedToDelete={allowedToDelete}
                               setAllowedToDelete={setAllowedToDelete}
                               />
                ))
            ) : (
              <>moment prosím</>
            )}
          </div>

          {tourMessages.length > 0 &&
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
        </>
      )}
    </div>
  );
}

export default TourMessages;
