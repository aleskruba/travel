import React,{useState,FormEvent} from 'react'
import DOMPurify from 'dompurify';

type MessageProps = {
    id: number;
    email: string;
    fname: string;
    date: Date;
    img: string;
    message: string;
  };

interface ReplyProps {
    id: number;
    fname: string;
    date: Date;
    img: string;
    message: string; 
    message_id:number,
    user_id: number }

  interface Props {
    setReplyDiv: React.Dispatch<boolean>; 
    setReplies: React.Dispatch<React.SetStateAction<ReplyProps[]>>
    replies:  ReplyProps[]
    message:MessageProps
}

function Reply({setReplyDiv,setReplies,replies,message}:Props) {

    const [reply, setReply] = useState({
        id: 0,
        fname: '',
        date: new Date(),
        img: '',
        message: '',
        message_id: null,
        user_id: null

      });

   
      const handleChangeReply = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const sanitizedMessage = DOMPurify.sanitize(event.target.value);
        setReply(prevState => ({
          ...prevState,
          message: sanitizedMessage
        }));
      };
      

      
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const newReply = {

      id: replies.length + 1, // Generate a unique ID
      fname: 'ales',
      date: new Date(),
      img: 'man.png',
      message: reply.message,
      message_id: message.id,
      user_id: 1
    };
  
    setReplies([newReply, ...replies]); // Prepend the new message
  
    // Reset the message input
    setReply({
      id: 0,
      fname: '',
      date: new Date(),
      img: '',
      message: '',
      message_id: null,
      user_id: null
    });
  };
  

  return (
    <form onSubmit={onSubmit}>
    <div className="flex flex-col items-center space-y-4 mt-4">
    <textarea
      name="reply"
      value={reply.message}
      onChange={handleChangeReply}
      className="w-full py-2 px-4 bg-gray-200 rounded-lg focus:outline-none focus:ring focus:border-blue-500 resize-none"
      placeholder="Share your opinion (max 500 characters)"
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