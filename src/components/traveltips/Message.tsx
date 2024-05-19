import React, {useEffect, useState,useCallback } from 'react';
import { BiLike,BiDislike  } from "react-icons/bi";
import moment from 'moment';
import Reply from './Reply';
import { FaRegTrashAlt } from "react-icons/fa";
import { GoTriangleDown ,GoTriangleUp } from "react-icons/go";
import { MessageProps } from '../../types';
import { ReplyProps } from '../../types';
import { useAuthContext } from '../../context/authContext';
import axios from 'axios';
import BASE_URL from '../../config/config';
import { motion, useAnimation } from 'framer-motion';


type Props = {
  messages:MessageProps[];
  setMessages:React.Dispatch<React.SetStateAction<MessageProps[]>>;
  message: MessageProps;
  setReplies: React.Dispatch<React.SetStateAction<ReplyProps[]>>
  replies:  ReplyProps[]
  isLoading:boolean
  allowedToDelete:boolean
  setAllowedToDelete: React.Dispatch<React.SetStateAction<boolean>>
  isSubmitted:boolean
};

const Message: React.FC<Props> = ({messages, message,setMessages,replies,setReplies,allowedToDelete ,isLoading,setAllowedToDelete,isSubmitted}) => {

  const { user} = useAuthContext();
    const [replyDiv, setReplyDiv] = useState<boolean>(false);
    const [hiddenAnswers,setHiddenAnswes] = useState(true);
    const [deleted, setDeleted] = useState(false);
    const controls = useAnimation();

console.log(message);

    const shakeAnimation = {
      shake: {
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.5 }
      },
      fadeOut: {
        opacity: 0,
        transition: { duration: 1 }
      },
      visible: {
        opacity: 1,
     
      }
    };
    

    useEffect(() => {
      if (deleted) { // If deleted is true, start the animation sequence
        controls.start("shake").then(() => {
          controls.start("fadeOut").then(() => {
            // Reset deleted state and trigger the visible animation after fadeOut completes
            setDeleted(false);
            controls.start("visible");
          });
        });
      }
    }, [deleted, controls]);
    
const deleteMessage = async (ID: any) => {

      setAllowedToDelete(false)
      setDeleted(true)
           
     
          const updatedMessages = messages.filter(message => message.id !== ID);    
  
          console.log(updatedMessages)
 
          setTimeout(()=>{setMessages(updatedMessages)},1500) 


         const config = {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          data: {
            user_id:user?.id,
            messageId: ID 
          }
        };
  
      try {
          const response = await axios.delete(`${BASE_URL}/deletemessage`, config);
          console.log(response);
          setReplyDiv(false);
          if (response.status === 201) {
          setAllowedToDelete(true) }
          console.log(messages);
        } catch (error) {
          console.error("Error deleting message:", error);
      }
};

const deleteReply = (ID: any) => {
   const updatedReplies = replies.filter(reply => reply.id !== ID);
   setReplies(updatedReplies);
        setReplyDiv(false);
};


const imageUrl = message?.image ? message?.image : '/profile.png';

return (
  <motion.div
  className='flex flex-col dark:bg-gray-500 dark:text-gray-100 px-4 py-2 shadow-2xl rounded-lg'
  animate={controls}
  variants={shakeAnimation}
/*   onAnimationComplete={(animationName) => {
    if (animationName === "fadeOut") {
      controls.start("visible");
    }
  }} */
> 


    <div className="flex flex-col md:flex-row md:items-center gap-4 ">
      <div className="flex  items-center gap-2"> 
         {message.user_id === user?.id &&
                 
                 <div className={`${!isSubmitted && allowedToDelete? '' : 'pointer-events-none '} min-w-[25px] text-red-700  cursor-pointer hover:text-red-500`} 
                      onClick={ ()=>deleteMessage(message.id)}
                      >
        <FaRegTrashAlt />
                  </div>
                  }
        <div className="w-14 h-14 overflow-hidden rounded-full">
        <img
          src={imageUrl}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

        <div className="flex flex-row gap-4 md:gap-2"> {message.id}
        <p className="text-gray-600 dark:bg-gray-500 dark:text-gray-100 font-semibold">{message?.firstName?.slice(0, 10)}</p>
        <p className="text-gray-600 dark:bg-gray-500 dark:text-gray-100 w-[80px]">{moment(message.date).format('DD-MM YYYY ')}</p>

     
        </div>
      </div>
        <div className="md:px-4" >
          <p className="">{message.message} </p>
      </div>
     </div>
    

{user?.id !== message.user_id &&
    <div>

     <div className='flex items-center gap-2'>
        
         <div className='cursor-pointer'><BiLike/></div>  
              <div>126</div>
           <div className='cursor-pointer'><BiDislike/></div>  


       {!replyDiv &&  
     <button className='bg-gray-300 text-gray-700 px-4 py-1 text-sm	 rounded-full hover:bg-gray-400 focus:outline-none focus:ring focus:border-gray-500'
             onClick={()=>{setReplyDiv(true);setHiddenAnswes(false)}} >
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
</div>}

<div className=''>
  <div className='flex gap-4' onClick={()=>setHiddenAnswes(!hiddenAnswers)}>
    {replies.filter(reply => reply.message_id === message.id).length > 0 && <>
      {hiddenAnswers ?
      <GoTriangleDown />
        :
      <GoTriangleUp />
  }
  </>}

<h4 className='text-sm font-bold cursor-pointer'>
  {replies.filter(reply => reply.message_id === message.id).length > 1 ? 
    `${replies.filter(reply => reply.message_id === message.id).length} odpovědí`   
    :
    replies.filter(reply => reply.message_id === message.id).length > 0 ?
      `${replies.filter(reply => reply.message_id === message.id).length} odpověď`
      :
      ''
  }
</h4>
    </div>
<div className={`${hiddenAnswers ? 'hidden' : 'block'}`}>
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

        <div className='shadow-xl	rounded-lg ' key={reply.id}>
        <div key={reply.id} className='flex flex-col relative pt-2  border-t border-gray-400 dark:bg-gray-500 dark:text-gray-100'>
          <div className={`flex items-center gap-6 md:gap-2  cursor-pointer mt-1 ${reply.user_id ===  user?.id ? 'pl-1': 'p3-6' }`}>
            {reply.user_id === user?.id &&
              <div className="text-red-700 hover:text-red-500 absolute top-20 left-24 md:left-4" onClick={() => deleteReply(reply.id)}>
                <FaRegTrashAlt />
              </div>
            }
            <div className="w-12 h-12 overflow-hidden rounded-full">
            <img
              src={reply.image ? reply.image : 'profile.png' }
              alt="Profile"
              className="w-full h-full object-cover"
            />
            </div>
            <div className="flex gap-1 ">
            <p className={` ${reply.user_id ===  user?.id ? 'text-red-500 dark:text-red-300' : 'text-gray-600 ' }  font-bold dark:bg-gray-500 dark:text-gray-100`}>{reply.firstName ? reply.firstName.slice(0, 10) : '' }</p>
            <p className="text-gray-600  dark:bg-gray-500 dark:text-gray-100 italic">   {displayText}</p>
            </div>
          </div>
         
          <div className="md:pl-14 " >
            <p className={` ${reply.user_id ===  user?.id ? 'text-red-500 dark:text-red-300' : 'text-gray-600 ' }`}>{reply.message}</p>
         </div>
  
      </div>
        
         <div className='flex items-center gap-2 md:pl-14'>
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

    </motion.div>
  );
};

export default Message;
