import React, { useState, useEffect, FormEvent } from 'react';
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

const ITEMS_PER_PAGE = 10;
//type PartialMessageProps = Partial<MessageProps>;

function Messages() {
  const { user } = useAuthContext();
  const { handleLoginClick } = useDialogContext();
  const [currentPage, setCurrentPage] = useState(0);
  const [replies, setReplies] = useState<ReplyProps[]>([]);
  const { chosenCountry } = useCountryContext();
  const [message, setMessage] = useState<MessageProps>({
    id: 0,
    firstName: '',
    email:'',
    date: new Date(),
    image: '',
    message: '' ,
    country:'',
    user_id: null,
  });
  const [backendError, setBackendError] = useState('');
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allowedToDelete, setAllowedToDelete] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
      const fetchData = async () => {
        try {
          const resultMessages = await axios.get(`${BASE_URL}/messages/${chosenCountry}`);
          const resultReplies = await axios.get(`${BASE_URL}/replies/${chosenCountry}`);
          setReplies(resultReplies.data);
          setMessages(resultMessages.data);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [chosenCountry, backendError]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedMessage = DOMPurify.sanitize(event.target.value);
    setMessage({ ...message, [event.target.name]: sanitizedMessage });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAllowedToDelete(false);
    setIsSubmitted(true);

    if (!message.message || !message.message.trim()) {
      setAllowedToDelete(true);
      setIsSubmitted(false);
      return;
    }

    if (message.message !== undefined && message.message.length > 400) {
      setBackendError('Příliš dlouhý text , max 400 znaků ');
      setAllowedToDelete(true);
      setIsSubmitted(false);
      setTimeout(() => setBackendError(''), 1500);
      return;
    }

    try {
      const newMessage = {
        id: messages.length + 1,
        email: user?.email || '',
        country: chosenCountry,
        firstName: user?.firstName || '',
        date: new Date(),
        image: user?.image || '',
        message: message.message,
        user_id: user?.id || 0
      };

      const response = await axios.post(`${BASE_URL}/message`, newMessage, config);
      setAllowedToDelete(true);
      
      if (response.status === 201) {
        const updatedMessage = { ...newMessage, id: response.data.message };
        setMessages((prevMessages) => [updatedMessage, ...prevMessages].sort((a, b) => b.id - a.id));
        setIsSubmitted(false);
        setMessage({
          id: 0,
          email: '',
          country: '',
          firstName: '',
          date: new Date(),
          image: '',
          message: '',
          user_id: null
        });
      }

      if (response.status === 401 || response.status === 403) {
        setBackendError(response.data.error);
        setMessage({
          id: 0,
          email: '',
          country: '',
          firstName: '',
          date: new Date(),
          image: '',
          message: '',
          user_id: null
        });
        setTimeout(() => setBackendError(''), 1500);
      }
    } catch (err: any) {
      console.error(err);
      setMessage({
        id: 0,
        email: '',
        country: '',
        firstName: '',
        date: new Date(),
        image: '',
        message: '',
        user_id: null
      });
      setBackendError(err.response.data.error);
      setTimeout(() => setBackendError(''), 1500);
    }
  };

  const handlePageChange = ({ selected }: any) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = (currentPage + 1) * ITEMS_PER_PAGE;
  const currentMessages = messages.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col px-2 md:px-4 w-full">
      {user ? (
        <CreateMessage
          onSubmit={handleSubmit}
          handleChange={handleChange}
          user={user}
          message={message}
          backendError={backendError}
          setMessage={setMessage}
        />
      ) : (
        <div className="p-4 bg-blue-100 text-blue-800 border border-blue-300 rounded-md shadow-lg">
          Jenom přihlášení uživatelé mohou sdílet své názory,
          <span onClick={() => handleLoginClick()} className="cursor-pointer text-blue-500 hover:underline">
            Přihlaš se zde
          </span>
        </div>
      )}

      <div className="flex flex-col mt-4 gap-1">
        {!isLoading ? (
   
   currentMessages
   .sort((b, a) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((message, idx) => (
            <Message
              key={idx}
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
          <div className="text-black dark:text-white">moment prosím ...</div>
        )}
      </div>

      {messages.length > ITEMS_PER_PAGE  ? (
        <ReactPaginate
          previousLabel={'<<'}
          nextLabel={'>>'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={Math.ceil(messages.length / ITEMS_PER_PAGE)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={'pagination z-10'}
          activeClassName={'active z-10'}
          previousClassName={'pagination-previous z-10'}
          nextClassName={'pagination-next z-10'}
          disabledClassName={'pagination-disabled z-10'}
        />
      ) : (
        ''
      )}
    </div>
  );
}

export default Messages;
