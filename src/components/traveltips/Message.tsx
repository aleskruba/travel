import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { BiLike,BiDislike  } from "react-icons/bi";
import moment from 'moment';

type MessageProps = {
  id: number;
  email: string;
  fname: string;
  date: Date;
  img: string;
  message: string;
};

type Props = {
  message: MessageProps;
};

const Message: React.FC<Props> = ({ message }) => {

    const [reply, setReply] = useState('');
    const [replyDiv, setReplyDiv] = useState(false);
  

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const sanitizedMessage = DOMPurify.sanitize(event.target.value);
        setReply(sanitizedMessage);
      };
    

  return (
    <div className='flex flex-col bg-gray-100  px-4 py-2  shadow-md'>
     <div className="flex  items-center gap-4 ">
      <div className="flex items-center gap-2"> 
        <div className="w-14 h-14 overflow-hidden rounded-full">
          <img src={message.img} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col md:flex-row md:gap-2">
        <p className="text-gray-600">{moment(message.date).format('YYYY DD-MM HH:mm')}</p>

          <p className="text-gray-600 font-semibold">{message.fname}</p>
        </div>
      </div>
      <div>
        <p className="text-gray-600">{message.message}</p>
      </div>
     </div>
     <div className='flex items-center gap-2'>
        
        <BiLike/>
        <div>126</div>
        <BiDislike/>
        
     <button className='bg-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-400 focus:outline-none focus:ring focus:border-gray-500'
             onClick={()=>setReplyDiv(true)} >
        Odpověz
      </button>
    </div>
    {replyDiv &&
        <div className="flex flex-col items-center space-y-4 mt-4">
      <textarea
        name="message"
        value={reply}
        onChange={handleChange}
        className="w-full py-2 px-4 bg-gray-200 rounded-lg focus:outline-none focus:ring focus:border-blue-500 resize-none"
        placeholder="Share your opinion (max 500 characters)"
      />
      <div className="flex justify-center space-x-4">
        <button className="bg-blue-500 w-[80px] text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-700">
          Odešli
        </button>
        <button className="bg-gray-300 w-[80px] text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:border-gray-500" onClick={() => setReplyDiv(false)}>
          Zpět
        </button>
        <button className="bg-red-700 w-[80px] text-gray-200 py-2 px-4 rounded-md hover:bg-red-800 focus:outline-none focus:ring focus:border-gray-300" onClick={() => setReplyDiv(false)}>
          Smaž
        </button>
      </div>
    </div>
    }
        </div>
  );
};

export default Message;
