import React, { useState, FormEvent, useRef } from 'react';
import DOMPurify from 'dompurify';
import axios from 'axios';
import BASE_URL, { config } from '../../config/config';
import { useAuthContext } from '../../context/authContext';
import { TourMessageProps, ReplyProps } from '../../types';
import { GoTriangleDown ,GoTriangleUp } from "react-icons/go";

interface Props {
  setReplyDiv: React.Dispatch<boolean>;
  setReplies: React.Dispatch<React.SetStateAction<ReplyProps[]>>;
  replies: ReplyProps[];
  tourMessage: TourMessageProps;
  setAllowedToDelete: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

function TourReply({
  setReplyDiv,
  setReplies,
  replies,
  tourMessage,
  setAllowedToDelete,
  setIsSubmitted,
}: Props) {
  const { user } = useAuthContext();
  const [backendError, setBackendError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const [isPrivate, setIsPrivate] = useState<number | null>(null);

  const [reply, setReply] = useState({
    id: 0,
    firstName: '',
    date: new Date(),
    image: '',
    messageType: null,
    message: '',
    message_id: null,
    user_id: null,
  });

  const handleChangeReply = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedMessage = DOMPurify.sanitize(event.target.value);
    setReply((prevState) => ({
      ...prevState,
      message: sanitizedMessage,
    }));
  };

  const handleButtonClick = (messageType: number) => {
    setIsPrivate(messageType);
    // Delay form submission to ensure state update
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }, 0);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user) {
      if (!tourMessage.message || !tourMessage.message.trim()) {
        return;
      }

      if (tourMessage.message !== undefined && tourMessage.message.length > 400) {
        setBackendError('Příliš dlouhý text , max 400 znaků ');
        return;
      }
      try {
        const newReply = {
          id: replies.length + 1, // Generate a unique ID
          image: user?.image || '',
          messageType: isPrivate,
          message: reply.message,
          message_id: tourMessage.id,
          user_id: user.id,
        };

        const response = await axios.post(`${BASE_URL}/tourreplies`, newReply, config);

        if (response.status === 201) {
          const updatedMessage = { ...newReply, id: response.data.message };
          setReplies((prevMessages) => [updatedMessage, ...prevMessages].sort((a, b) => b.id - a.id));
          setBackendError('')
          setReply({
            id: 0,
            firstName: '',
            date: new Date(),
            image: '',
            messageType: null,
            message: '',
            message_id: null,
            user_id: null,
          });

          setReplyDiv(false);
        }
      } catch (error:any) {
        console.log(error);
        setBackendError(error.response.data.error);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} ref={formRef}>
      <div className="flex flex-col items-center space-y-4 mt-4">
        <textarea
          name="reply"
          value={reply.message}
          onChange={handleChangeReply}
          className="w-full min-h-[100px] py-2 px-4 bg-gray-200 dark:text-black rounded-lg focus:outline-none focus:ring focus:border-blue-500 resize-none"
          style={{ maxWidth: '100%', overflowWrap: 'break-word' }}
          placeholder="Sdlej svůj názor (max 500 znaků)"
          maxLength={500}
        />
        <div className="flex justify-center space-x-4">
          <button
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition-all duration-300 md:w-[130px] text-xs md:text-base text-white py-2 px-4 rounded-md focus:outline-none focus:ring focus:border-blue-700"
            type="button"
            onClick={() => handleButtonClick(1)}
          >
            Odešli private
          </button>
          <button
            className="bg-blue-500 md:w-[130px] text-xs md:text-base text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-700"
            type="button"
            onClick={() => handleButtonClick(0)}
          >
            Odešli public
          </button>
          <button
            className="bg-gray-300 md:w-[130px] text-xs md:text-base text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:border-gray-500"
            onClick={() => setReplyDiv(false)}
            type="button"
          >
            Zpět
          </button>
        </div>
        {backendError && <span className='text-red-500'>{backendError}</span>}
      </div>
    </form>
  );
}

export default TourReply;
