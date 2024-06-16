import React, { useState, FormEvent, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import axios from 'axios';
import BASE_URL, { SOCKET_URL, config } from '../../config/config';
import { useAuthContext } from '../../context/authContext';
import { TourMessageProps, ReplyProps } from '../../types';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { BsEmojiGrin } from "react-icons/bs";
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [reply, setReply] = useState({
    id: 0,
    firstName: user?.firstName || '',
    date: new Date(),
    image: '',
    messageType: null,
    message: '',
    message_id: null,
    user_id: null,
  });

  
  const socket = io(SOCKET_URL);

  let { id } = useParams<string>(); // id is of type string | undefined
  const intId = id ? parseInt(id) : NaN;

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

  const onSubmitFunction = async (event: FormEvent<HTMLFormElement>) => {
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
        const newReplyId = replies.reduce((maxId, msg) => Math.max(msg.id, maxId), 0) + 1;

        const newReply = {
          id: newReplyId,
          image: user?.image || '',
          firstName:reply.firstName,
          messageType: isPrivate,
          message: reply.message,
          message_id: tourMessage.id,
          user_id: user.id,
        };
        console.log(newReply);

        const response = await axios.post(`${BASE_URL}/tourreplies`, newReply, config);

        if (response.status === 201) {
          const updatedMessage = { ...newReply, id: response.data.message };
          console.log("send_message_tour",updatedMessage);
          if (isPrivate === 1) {
            socket.emit('send_private_reply_tour',  {reply:updatedMessage,tour_room:tourMessage.user_id} );
          } else 
          socket.emit('send_reply_tour', {reply:updatedMessage,tour_room: intId.toString(),user_id:user?.id});    

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





  const addEmoji = (event: any) => {
      const sym = event.unified.split("_");
  
      const codeArray: any[] = [];
    
      sym.forEach((el: any) => {
        codeArray.push("0x" + el);
      });
      let emoji = String.fromCodePoint(...codeArray);
    
      
    
      // Ensure the message object is updated correctly
      setReply((prevMessage: any) => ({
        ...prevMessage,
        message: (prevMessage.message || '') + emoji,
      }));
    };

    useEffect(() => {
      setShowEmojiPicker(false)
    },[reply])

  return (
    <div className='flex flex-col '>
    <form onSubmit={onSubmitFunction} ref={formRef}>
      <div className="flex flex-col items-center space-y-4 mt-4 relative">
        <textarea
          name="reply"
          value={reply.message}
          onChange={handleChangeReply}
          className="w-full min-h-[100px] py-2 px-4 bg-gray-200 dark:text-black rounded-lg focus:outline-none focus:ring focus:border-blue-500 resize-none"
          style={{ maxWidth: '100%', overflowWrap: 'break-word' }}
          placeholder="Sdlej svůj názor (max 500 znaků)"
          maxLength={500}
        />
          <div className='absolute top-5 right-2 dark:text-black text-xl cursor-pointer ' onClick={() => setShowEmojiPicker(!showEmojiPicker)} ><BsEmojiGrin /></div> 

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
        <div className='flex justify-center items-center flex-col mt-1 '>

        {showEmojiPicker && (
         <Picker
               data={data}
          onEmojiSelect={addEmoji}
     />
      )}
      </div>
      </div>
  );
}

export default TourReply;
