import React, { useState, useEffect, FormEvent } from 'react';
import ReactPaginate from 'react-paginate';
import DOMPurify from 'dompurify';
import axios from 'axios';
import TourMessage from './TourMessage';
import { ReplyProps, TourMessageProps } from '../../types';
import BASE_URL, { SOCKET_URL, config } from '../../config/config';
import { useAuthContext } from '../../context/authContext';
import { useParams } from 'react-router-dom';
import CreateTourMessage from './CreateTourMessage';
import { io } from 'socket.io-client';

const ITEMS_PER_PAGE = 15;

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
    message: '' ,
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
 

  const socket = io(SOCKET_URL);

  useEffect(() => {
    socket.on('receive_message_tour', (data) => {
      console.log(data);
      console.log(data.user_id,user?.id   );
      if (data.user_id !== user?.id ) {
        console.log('socket', data.senderId);
        setTourMessages((prevMessages) => [...prevMessages, data].sort((a, b) => b.id - a.id));
      }
    });


    socket.on('receive_deleted_message_tour', (data) => {

      console.log(data);
      console.log(data.messages,data.messageID,user?.id);
     // console.log(data.messages.some((message: { id: any, user_id:any; }) => message.id == data.messageID && message.user_id != user?.id))
      if (data.messages.some((message: { id: any, user_id:any; }) => message.id == data.messageID && message.user_id != user?.id)) {

        const newValue = data.messages.map((element: { id: any; }) => {
          if (element.id === data.messageID) {
            return { ...element, message:'TATO ZPRÁVA BYLA SMAZÁNA !!!!!' };
          }
          return element;
        });
      
        setTourMessages(newValue);
   
        const updatedMessages = data.messages.filter((message: { id: any; }) => message.id !== data.messageID);

   
        setTimeout(()=>{   setTourMessages(updatedMessages)},1100) 

    }
    });


    socket.on('receive_reply_tour', (data) => {
      console.log(data);
      if (data.user_id !== user?.id && !tourMessages.some(message => message.id === data.message_id)) {
        console.log('socket', data.senderId);
        setReplies((prevReplies) => [...prevReplies, data].sort((a, b) => b.id - a.id)
      );
      }
    });



/*     socket.on('receive_private_reply_tour', (data) => {
      console.log(data);
      if (user?.id == data.tour_room) {
        console.log('socket', data);
        setReplies((prevReplies) => [...prevReplies, data.reply].sort((a, b) => b.id - a.id)
      );
      }
    }); */

    socket.on('receive_deleted_reply_tour', (data) => {
      console.log(data);
      if (data.replies.some((reply: { id: any, user_id:any; }) => reply.id == data.replyID && reply.user_id != user?.id)) {

        const newValue = data.replies.map((element: { id: any; }) => {
          if (element.id === data.replyID) {
            return { ...element, message:'TATO ZPRÁVA BYLA SMAZÁNA !!!!!' };
          }
          return element;
        });
   
        setReplies(newValue);
        const updatedReplies = data.replies.filter((reply: { id: any; }) => reply.id !== data.replyID);

   
        setTimeout(()=>{   setReplies(updatedReplies)},1100) 
    }
  });

    return () => {
      socket.off('receive_message_tour');
      socket.off('receive_reply_tour');
      socket.off('receive_private_reply_tour');
      socket.off('receive_deleted_message_tour');
      socket.off('receive_deleted_reply_tour');
   
    };
  }, [user, intId]);

  useEffect(() => {
    if (intId) {
        socket.emit('join_tour_room', intId.toString(), user?.id);
        socket.emit('private_message_room', user?.id);
    }
    
  }, [intId, user?.id,]);
  

  useEffect(() => {
    socket.on('receive_private_reply_tour', (data) => {
        console.log(data);
        if (user?.id === data.tour_room) {
            console.log('socket', data);
            setReplies((prevReplies) => [...prevReplies, data.reply].sort((a, b) => b.id - a.id));
        }
    });

    // Clean up the socket listeners on component unmount
    return () => {
        socket.off('receive_private_reply_tour');
    };
}, [user]);




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

  const onSubmitFunction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!tourMessage.message || !tourMessage.message.trim()) {
      return;
    }

    if (tourMessage.message !== undefined && tourMessage.message.length > 400) {
      setBackendError('Příliš dlouhý text , max 400 znaků ');
      return;
    }

    try {

      const newMessageId = tourMessages.reduce((maxId, msg) => Math.max(msg.id, maxId), 0) + 1;

      const newMessage = {
        id: newMessageId,
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
        socket.emit('send_message_tour', {message:updatedMessage,tour_room: intId.toString()});    
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
        <CreateTourMessage
            onSubmitFunction={onSubmitFunction}
            handleChange={handleChange}
            tourMessage={tourMessage}
            backendError={backendError}
            setTourMessage={setTourMessage}
        />
      
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
              <>Moment prosím ...</>
            )}
          </div>

          {tourMessages.length > ITEMS_PER_PAGE &&
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
