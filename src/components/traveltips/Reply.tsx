import React,{useState,FormEvent, useEffect} from 'react'
import DOMPurify from 'dompurify';
import { MessageProps } from '../../types';
import { ReplyProps } from '../../types';
import { useAuthContext } from '../../context/authContext';
import axios from 'axios';
import BASE_URL, { config } from '../../config/config';

  interface Props {
    setReplyDiv: React.Dispatch<boolean>; 
    setReplies: React.Dispatch<React.SetStateAction<ReplyProps[]>>
    replies:  ReplyProps[]
    message:MessageProps
    setAllowedToDelete: React.Dispatch<React.SetStateAction<boolean>>
    setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>
}
type PartialReplyProps = Partial<ReplyProps>;

function Reply({setReplyDiv,setReplies,replies,message,setAllowedToDelete,setIsSubmitted}:Props) {
  const { user} = useAuthContext();

      const [reply, setReply] = useState<PartialReplyProps>({});
   
      const handleChangeReply = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const sanitizedMessage = DOMPurify.sanitize(event.target.value);
        setReply(prevState => ({
          ...prevState,
          message: sanitizedMessage
        }));
      };
      

      
      const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
      
        try {
          if (!reply.message || !reply.message.trim()) { // Check if reply.message is falsy or empty after trimming whitespace
            setAllowedToDelete(true);
            setIsSubmitted(false);
            return;
          }
      
          const newReply = {
            id: 0,
            firstName: user?.firstName || '',
            date: new Date(),
            image: user?.image || '',
            message: reply.message || '',
            message_id: message.id || 0,
            user_id: user?.id || 0,
          };
      
          setReplies([newReply, ...replies]);
      
          const response = await axios.post(`${BASE_URL}/createreply`, newReply, config);
      
          if (response.status === 201) {
            console.log(response);
            const updatedReply = { ...newReply, id: response.data.message };
            setReplies([updatedReply, ...replies]);
      
            setReply({
              id: 0,
              firstName: '',
              date: new Date(),
              image: '',
              message: '',
              message_id: null,
              user_id: null,
            });
      
            setReplyDiv(false);
          }
        } catch (error) {
          console.error('Error submitting reply:', error);
          // Handle error, e.g., show a toast message to the user
        }
      };
      
  useEffect(()=>console.log(replies),[replies])
  return (
    <form onSubmit={onSubmit}>
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
      <button className="bg-blue-500 w-[80px] text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-700"
              type="submit" 
      >
        Odešli
      </button>
      <button className="bg-gray-300 w-[80px] text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:border-gray-500" 
              onClick={() => setReplyDiv(false)}
              type='button'>
        Zpět
      </button>

    </div>
  </div>
  </form>
  )
}

export default Reply