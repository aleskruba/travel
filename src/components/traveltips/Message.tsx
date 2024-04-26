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
    <div className='flex flex-col bg-gray-100  px-4 py-2  shadow-md'>
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

  <div>{replies.map(reply=>{
  
      if (reply.message_id === message.id) {
      return (
          <div  key={reply.id} className='flex flex-col md:flex-row md:items-center  border border-t mt-2 gap-4 bg-gray-200'>
            <div className={`flex items-center gap-2 pl-5 cursor-pointer ${reply.user_id === 1 && 'pl-1'}`}>
                {reply.user_id === 1 &&
                  <div className="text-red-700 hover:text-red-500" 
                      onClick={()=>deleteReply(reply.id)}
                      >
                      <FaRegTrashAlt />
                  </div>
                  }
              
                <div className="w-12 h-12 overflow-hidden rounded-full">
                  <img src='lide.svg' alt="Profile" className="w-full h-full object-cover" />
                </div>
              <div className="flex gap-2">
                  <p className="text-gray-600">{moment(reply.date).format('YYYY DD-MM HH:mm')}</p>
                  <p className="text-gray-600 font-semibold">{reply.fname}Test name</p>
                
      
              </div>
            </div>
            <div className='flex items-center'> {reply.message}</div>
          </div>
          )
          }
        })}
      </div>

    </div>

        </div>
  );
};

export default Message;
