import React, { useState,useEffect ,FormEvent } from 'react';
import ReactPaginate from 'react-paginate';
import DOMPurify from 'dompurify';
import axios from 'axios';
import Message from './Message';
import { MessageProps } from '../../types';
import { ReplyProps } from '../../types';
import { useAuthContext } from '../../context/authContext';
import { useDialogContext } from '../../context/dialogContext';
import { useCountryContext } from '../../context/countryContext';
import BASE_URL, { config } from '../../config/config';
import CreateMessage from './CreateMessage';
import moment from 'moment';

const ITEMS_PER_PAGE = 15;
type PartialMessageProps = Partial<MessageProps>;

function Messages() {

  const { user} = useAuthContext();
  const { handleLoginClick} = useDialogContext();

  const [currentPage, setCurrentPage] = useState(0);
  const [replies, setReplies] = useState<ReplyProps[]>([]);
  const {chosenCountry } = useCountryContext();
  const [message, setMessage] = useState<PartialMessageProps>({});
  const [backendError, setBackendError] = useState('');
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allowedToDelete, setAllowedToDelete] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  


  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
  
      const fetchData = async () => {
        try {
          const resultMessages = await axios.get(`${BASE_URL}/getmessages/${chosenCountry}`);
          const resultReplies = await axios.get(`${BASE_URL}/getreplies/${chosenCountry}`);
          setReplies(resultReplies.data );
          console.log('resultReplies',resultReplies.data )
          setMessages(resultMessages.data);
          setIsLoading(false);
          console.log('data fetched');
        } catch (error) {
          console.error('Error fetching data:', error);
          setIsLoading(false);
        }
      };
  
      fetchData();
    }
  }, [chosenCountry,backendError]);


  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedMessage = DOMPurify.sanitize(event.target.value);
    setMessage({...message,[event.target.name]:sanitizedMessage});
  };


  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
     event.preventDefault();
     setAllowedToDelete(false)
     setIsSubmitted(true)
     if (message.message != undefined && !message.message.length ) {
      setAllowedToDelete(true)
      setIsSubmitted(false)
      return;
    }

    if (message.message != undefined && message?.message?.length > 400) {
      setBackendError('Příliš dlouhý text , max 400 znaků ')
      setAllowedToDelete(true)
      setIsSubmitted(false)
      setTimeout(() =>  setBackendError(''),1500);
      return;
    }

    
  try {
    const newMessage = {
      id: messages.length + 1, 
      email: user?.email || '', 
      country:chosenCountry,
      firstName: user?.firstName || '',
      date: new Date(),
      image: user?.image || '',
      message: message?.message,
      user_id: user?.id || 0 
    };
  
    setMessages([newMessage, ...messages]); 
   
    const response = await axios.post(`${BASE_URL}/createmessage`, newMessage, config);
    
     if (response.status === 201){

      console.log(response.data.message)   // id from database

      const updatedMessage = { ...newMessage, id: response.data.message };
      setMessages([updatedMessage, ...messages]);

      setAllowedToDelete(true)
      setIsSubmitted(false)
      setMessage({
          id: 0,
          email: '',
          country:'',
          firstName: '',
          date: new Date(),
          image: '',
          message: '',
          user_id: null,
    });
  }
  if (response.status === 401 || response.status === 403){
    setBackendError(response.data.error);
    setMessage({
      id: 0,
      email: '',
      country:'',
      firstName: '',
      date: new Date(),
      image: '',
      message: '',
      user_id: null,
});
    setTimeout(() =>  setBackendError(''),1500);
  }
  }
  catch (err:any) {
    console.error(err)
    setMessage({
      id: 0,
      email: '',
      country:'',
      firstName: '',
      date: new Date(),
      image: '',
      message: '',
      user_id: null,
});
    setBackendError(err.response.data.error)
    setTimeout(() =>  setBackendError(''),1500);

  }
  
};
  
  const handlePageChange = ({ selected }: any) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = (currentPage + 1) * ITEMS_PER_PAGE;

    const currentMessages = messages?.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col  px-2 md:px-4 w-full">
      {user ?
      <CreateMessage 
          onSubmit={onSubmit} 
          handleChange={handleChange} 
          user={user} 
          message={message} 
          backendError={backendError}
   
          />
        : 
        <div className="p-4 bg-blue-100 text-blue-800 border border-blue-300 rounded-md shadow-lg">
        Jenom přihlášení uživatelé mohou sdílet své názory, 
        <span onClick={() => handleLoginClick()} className="cursor-pointer text-blue-500 hover:underline">Přihlaš se zde</span>
      </div>
      }

      <div className='flex flex-col mt-4 gap-1'>
      {
        !isLoading ? (
          currentMessages
          .sort((a, b) => b.id - a.id)
            .map((message, idx) => (
              <Message key={idx} 
                       messages={messages} 
                       message={message} 
                       replies={replies} 
                       setMessages={setMessages} 
                       setReplies={setReplies} 
                       allowedToDelete={allowedToDelete}
                       setAllowedToDelete={setAllowedToDelete}
                       isLoading={isLoading}
                       isSubmitted={isSubmitted}
                       setIsSubmitted={setIsSubmitted}
                       />
            ))
        ) : (
          <div className='text-black dark:text-white'>moment prosím ...</div>
        )
      }

      </div>


      { messages.length ?
      <ReactPaginate
        previousLabel={'<<'}
        nextLabel={'>>'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={Math.ceil(messages.length / ITEMS_PER_PAGE)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={'pagination'}
        activeClassName={'active'}
        previousClassName={'pagination-previous'}
        nextClassName={'pagination-next'}
        disabledClassName={'pagination-disabled'}
      /> : ''
    }
   
    </div>
  );
}

export default Messages;

