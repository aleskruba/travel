import React, {useState } from 'react';
import { BiLike,BiDislike  } from "react-icons/bi";
import moment from 'moment';
import Reply from './Reply';
import { FaRegTrashAlt } from "react-icons/fa";


type MessageProps = {
  id: number;
  email: string;
  fname: string;
  date: Date;
  img: string;
  message: string;
  user_id: number;
};

interface ReplyProps {
  id: number;
  fname: string;
  date: Date;
  img: string;
  message: string; 
  message_id: number,
  user_id: number;
}


type Props = {
  messages:MessageProps[];
  setMessages:React.Dispatch<React.SetStateAction<MessageProps[]>>;
  message: MessageProps;
  setReplies: React.Dispatch<React.SetStateAction<ReplyProps[]>>
  replies:  ReplyProps[]
};

const Message: React.FC<Props> = ({messages, message,setMessages,replies,setReplies }) => {


    const [replyDiv, setReplyDiv] = useState<boolean>(false);
  


const deleteMessage = (ID: any) => {
  const updatedMessages = messages.filter(message => message.id !== ID);
   setMessages(updatedMessages);
        setReplyDiv(false);
};

const deleteReply = (ID: any) => {
   const updatedReplies = replies.filter(reply => reply.id !== ID);
   setReplies(updatedReplies);
        setReplyDiv(false);
};




return (
    <div className='flex flex-col bg-gray-100 dark:bg-gray-500 dark:text-gray-100  px-4 py-2  shadow-md '>
     <div className="flex  items-center gap-4 ">
      <div className="flex items-center gap-2"> 
         {message.user_id === 4 &&
                  <div className="text-red-700  cursor-pointer hover:text-red-500" 
                      onClick={()=>deleteMessage(message.id)}
                      >
                      <FaRegTrashAlt />
                  </div>
                  }
        <div className="w-14 h-14 overflow-hidden rounded-full">
          <img src={message.img} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col md:flex-row md:gap-2">
        <p className="text-gray-600 dark:bg-gray-500 dark:text-gray-100 font-semibold">{message.fname.slice(0, 10)}</p>
        <p className="text-gray-600 dark:bg-gray-500 dark:text-gray-100 w-[80px]">{moment(message.date).format('DD-MM YYYY ')}</p>

     
        </div>
      </div>
      <div className="px-4" >
        <p className="">{message.message} </p>
    </div>
     </div>
     <div className='flex items-center gap-2'>
        
         <div className='cursor-pointer'><BiLike/></div>  
              <div>126</div>
           <div className='cursor-pointer'><BiDislike/></div>  

       {!replyDiv &&  
     <button className='bg-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-400 focus:outline-none focus:ring focus:border-gray-500'
             onClick={()=>setReplyDiv(true)} >
        Odpověz
      </button>
      }
    </div>
    {replyDiv &&

      <Reply setReplyDiv={setReplyDiv} 
             setReplies={setReplies}
             replies={replies} 
             message={message}
             />
    }

<div className=''>
<h4 className='text-sm font-bold'>{replies.filter(reply => reply.message_id === message.id).length > 1 ? 
      ` ${replies.filter(reply => reply.message_id === message.id).length } odpovědí `   
        :
        ` ${replies.filter(reply => reply.message_id === message.id).length } odpověď `   } 
</h4>

<div>
  {replies.map(reply => {
    if (reply.message_id === message.id) {

      const currentDate = moment();
      const replyDate = moment(reply.date);
      const diffMinutes = currentDate.diff(replyDate, 'minutes');
      const diffDays = currentDate.diff(replyDate, 'days');
      const diffMonths = currentDate.diff(replyDate, 'months');
      let displayText;

      if (diffMinutes < 1) {
        displayText = 'před chvílí';
      } else if (diffDays === 0) { // Check if it's today
        displayText = 'dnes';
      } else if (diffDays === 1) { // Check if it's yesterday
        displayText = 'vcera';
      } else if (diffDays > 1) { // Check for other past days
        displayText = `pred ${diffDays} dny`;
      } else if (diffMonths === 1) { // Check if it's one month ago
        displayText = 'pred mesicem';
      } else if (diffMonths > 1) { // Check for other past months
        displayText = `pred ${diffMonths} mesici`;
      } else { // For dates in the future or more than a day ago
        displayText = moment(reply.date).format('YY DD-MM HH:mm');
      }
    
      return (

        <div>
        <div key={reply.id} className='flex flex-col  mt-2  bg-gray-200 dark:bg-gray-500 dark:text-gray-100'>
          <div className={`flex items-center gap-6 md:gap-2  cursor-pointer ${reply.user_id === 1 ? 'pl-1': 'pl-6' }`}>
            {reply.user_id === 1 &&
              <div className="text-red-700 hover:text-red-500" onClick={() => deleteReply(reply.id)}>
                <FaRegTrashAlt />
              </div>
            }
            <div className="w-12 h-12 overflow-hidden rounded-full">
              <img src='lide.svg' alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-1 ">
            <p className="text-gray-600 font-bold dark:bg-gray-500 dark:text-gray-100">{reply.fname ? reply.fname.slice(0, 10) : 'Jan' }</p>
            <p className="text-gray-600  dark:bg-gray-500 dark:text-gray-100 italic">   {displayText}</p>
            </div>
          </div>
         
          <div className="md:pl-20 " >
            <p className="">{reply.message}</p>
         </div>
  
      </div>
        
         <div className='flex items-center gap-2 md:pl-20'>
            <div className='cursor-pointer'><BiLike/></div>  
              <div>126</div>
           <div className='cursor-pointer'><BiDislike/></div>  
        </div>
        
      </div>
  
          );
    } else {
      return null; // Add a default return statement for other cases
    }
  })}
</div>

    </div>

        </div>
  );
};

export default Message;
