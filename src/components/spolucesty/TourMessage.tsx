import React, {useState } from 'react';
import { BiLike,BiDislike  } from "react-icons/bi";
import moment from 'moment';
//import Reply from './Reply';
import { FaRegTrashAlt } from "react-icons/fa";
import { GoTriangleDown ,GoTriangleUp } from "react-icons/go";
import TourReply from './TourReply';
import { MessageProps } from '../../types';
import { ReplyProps } from '../../types';



type Props = {
    tourMessages:MessageProps[];
  setTourMessages:React.Dispatch<React.SetStateAction<MessageProps[]>>;
  tourMessage: MessageProps;
  setTourReplies: React.Dispatch<React.SetStateAction<ReplyProps[]>>
  tourReplies:  ReplyProps[]
};

const TourMessage: React.FC<Props> = ({tourMessages, tourMessage,setTourMessages,tourReplies,setTourReplies }) => {


    const [replyDiv, setReplyDiv] = useState<boolean>(false);
    const [hiddenAnswers,setHiddenAnswes] = useState(true);

const deleteMessage = (ID: any) => {
  const updatedMessages = tourMessages.filter(message => message.id !== ID);
  setTourMessages(updatedMessages);
        setReplyDiv(false);
};

const deleteReply = (ID: any) => {
   const updatedReplies = tourReplies.filter(reply => reply.id !== ID);
   setTourReplies(updatedReplies);
        setReplyDiv(false);
};




return (
    <div className='flex flex-col  dark:bg-gray-500 dark:text-gray-100  px-4 py-2  shadow-2xl rounded-lg'>
     <div className="flex flex-col md:flex-row md:items-center gap-4 ">
      <div className="flex  items-center gap-2"> 
         {tourMessage.user_id === 4 &&
                  <div className="text-red-700  cursor-pointer hover:text-red-500" 
                      onClick={()=>deleteMessage(tourMessage.id)}
                      >
                      <FaRegTrashAlt />
                  </div>
                  }
        <div className="w-14 h-14 overflow-hidden rounded-full">
          <img src='/man.png' alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-row gap-4 md:gap-2">
        <p className="text-gray-600 dark:bg-gray-500 dark:text-gray-100 font-semibold">{tourMessage.fname.slice(0, 10)}</p>
        <p className="text-gray-600 dark:bg-gray-500 dark:text-gray-100 w-[80px]">{moment(tourMessage.date).format('DD-MM YYYY ')}</p>

     
        </div>
      </div>
        <div className="md:px-4" >
          <p className="">{tourMessage.message} </p>
      </div>
     </div>
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
        <TourReply setReplyDiv={setReplyDiv} 
                    setTourReplies={setTourReplies}
                    tourReplies={tourReplies} 
                    tourMessage={tourMessage}
                    />

    }

<div className=''>
  <div className='flex gap-4' onClick={()=>setHiddenAnswes(!hiddenAnswers)}>
    {tourReplies.filter(reply => reply.message_id === tourMessage.id).length > 0 && <>
      {hiddenAnswers ?
      <GoTriangleDown />
        :
      <GoTriangleUp />
  }
  </>}

<h4 className='text-sm font-bold cursor-pointer'>
  {tourReplies.filter(reply => reply.message_id === tourMessage.id).length > 1 ? 
    `${tourReplies.filter(reply => reply.message_id === tourMessage.id).length} odpovědí`   
    :
    tourReplies.filter(reply => reply.message_id === tourMessage.id).length > 0 ?
      `${tourReplies.filter(reply => reply.message_id === tourMessage.id).length} odpověď`
      :
      ''
  }
</h4>
    </div>
<div className={`${hiddenAnswers ? 'hidden' : 'block'}`}>
  {tourReplies.map(reply => {
    if (reply.message_id === tourMessage.id) {

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
        <div key={reply.id} className='flex flex-col  mt-2  border-t border-gray-400 dark:bg-gray-500 dark:text-gray-100'>
          <div className={`flex items-center gap-6 md:gap-2  cursor-pointer mt-1 ${reply.user_id === 1 ? 'pl-1': 'pl-6' }`}>
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

export default TourMessage;
