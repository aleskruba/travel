import React, {useState } from 'react';
import { BiLike,BiDislike  } from "react-icons/bi";
import moment from 'moment';
//import Reply from './Reply';
import { FaRegTrashAlt } from "react-icons/fa";
import { GoTriangleDown ,GoTriangleUp } from "react-icons/go";
import TourReply from './TourReply';
import { TourMessageProps } from '../../types';
import { ReplyProps } from '../../types';
import { useAuthContext } from '../../context/authContext';
import BASE_URL, { SOCKET_URL } from '../../config/config';
import axios from 'axios';
import ConfirmationModal from '../ConfirmationModal';
import Modal from '../Modal';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

type Props = {
    tourMessages:TourMessageProps[];
  setTourMessages:React.Dispatch<React.SetStateAction<TourMessageProps[]>>;
  tourMessage: TourMessageProps;
  setReplies: React.Dispatch<React.SetStateAction<ReplyProps[]>>
  replies:  ReplyProps[]
  isSubmitted:boolean
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>
  allowedToDelete:boolean
  setAllowedToDelete: React.Dispatch<React.SetStateAction<boolean>>
};

const TourMessage: React.FC<Props> = ({tourMessages, tourMessage,setTourMessages,setReplies,replies,isSubmitted,setIsSubmitted,allowedToDelete,setAllowedToDelete }) => {

  const { user} = useAuthContext();
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
  const [selectedReplyId, setSelectedReplyId] = useState<number | null>(null);
  const [selectedReplyDivId, setSelectedReplyDivId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [hiddenAnswers,setHiddenAnswes] = useState(true);
  const[deletedReply,setDeletedReply] = useState<number | null>(null);
  const socket = io(SOCKET_URL);
  let { id } = useParams<string>(); // id is of type string | undefined
  const intId = id ? parseInt(id) : NaN;
  const [replyDiv, setReplyDiv] = useState<boolean>(false);

const handleDeleteMessageClick = (ID: number) => {
  setSelectedMessageId(ID);
  setShowModal(true);
  };

const deleteMessage = async () => {
  const updatedMessages = tourMessages.filter(message => message.id !== selectedMessageId);
  setAllowedToDelete(false)

  socket.emit('delete_message_tour', {messageID:selectedMessageId,messages:tourMessages,tour_room: intId.toString()});
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    data: {
      user_id:user?.id,
      messageId: selectedMessageId 
    }
  };

  try {
    setTourMessages(updatedMessages);
    const response = await axios.delete(`${BASE_URL}/tourmessage`, config);
  
    setShowModal(false)
    if (response.status === 201) {
      setAllowedToDelete(true)
}
  } catch (error) {
    console.error("Error deleting message:", error);
 
}
}


const handleDeleteClick = (ID: number) => {
  setSelectedReplyId(ID);
  setShowModal(true);
};

const deleteReply = async () => {


  if (selectedReplyId !== null)  {
    setAllowedToDelete(false)
    setDeletedReply(selectedReplyId)
    setShowModal(false);

    socket.emit('delete_reply_tour', {replyID:selectedReplyId,replies:replies,tour_room: intId.toString()});

    const updatedReplies = replies.filter(reply => reply.id !== selectedReplyId);

   
   setTimeout(()=>{   setReplies(updatedReplies);setDeletedReply(null);},1100) 

   const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    data: {
      user_id:user?.id,
      messageId: selectedReplyId 
    }
  };

  try {
    const response = await axios.delete(`${BASE_URL}/tourreplies`, config);
    setReplyDiv(false);
    if (response.status === 201) {
      setAllowedToDelete(true)
}
  } catch (error) {
    console.error("Error deleting message:", error);
}


  }
};

const [showFoto,setShowFoto] = useState(false)
const [showReplyFoto,setShowReplyFoto] = useState(false)


const showFotoFunction = () => {
  setShowFoto(true);

};

const closeModal = () => {
  setShowFoto(false);
};


return (
    <div className='flex flex-col  dark:bg-gray-500 dark:text-gray-100  px-4 py-2  shadow-2xl rounded-lg '>
      <div className='flex flex-col'>
     <div className="flex flex-col md:flex-row md:items-center gap-4 relative ">
      <div className="flex  items-center gap-2"> 
         {tourMessage.user_id == user?.id &&
                  <div className={`${allowedToDelete ? ' text-red-700  cursor-pointer hover:text-red-500' : 'pointer-events-none opacity-20  cursor-default'} absolute right-1 top-1 `} 
                      onClick={()=>handleDeleteMessageClick(tourMessage.id)}
                      >
                      <FaRegTrashAlt />
                  </div>
                  }


        <div
            className={'w-14 h-14 overflow-hidden rounded-full cursor-pointer'}
            onClick={showFotoFunction}
          >
          <img src={tourMessage?.image ? tourMessage?.image : '/profile.png'} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <Modal show={showFoto} onClose={closeModal} imageUrl={tourMessage?.image ? tourMessage?.image : '/profile.png'} />


        <div className="flex flex-row gap-8 md:gap-2 bg-blue-400 w-full">
        <p className="text-gray-600 dark:bg-gray-500 dark:text-gray-100 font-semibold">{tourMessage?.firstName.slice(0, 10)}</p>
        <p className="text-gray-600 dark:bg-gray-500 dark:text-gray-100 w-[80px]  shrink-0 whitespace-nowrap overflow-hidden text-ellipsis">{moment(tourMessage.date).format('DD-MM YYYY ')}</p>

     
        </div>
      </div>
        <div className="md:px-4 break-all " >
          <p className="">{tourMessage.message} </p>
      </div>
  
      </div>

      {!replyDiv &&  user?.id !== tourMessage.user_id  &&
      <button className='bg-gray-300 text-gray-700 px-4 py-1 text-sm mt-2	w-[100px] rounded-full hover:bg-gray-400 focus:outline-none focus:ring focus:border-gray-500'
             onClick={()=>{setReplyDiv(!replyDiv);setHiddenAnswes(false);setSelectedReplyDivId(tourMessage.id )}} >
        Odpověz
      </button>
  }
      {replyDiv && tourMessage.id === selectedReplyDivId &&
        <TourReply setReplyDiv={setReplyDiv} 
             setReplies={setReplies}
             replies={replies} 
             tourMessage={tourMessage}
             setAllowedToDelete={setAllowedToDelete}
             setIsSubmitted={setIsSubmitted}
             />

    }

<div className=''>
  <div className='flex gap-4' onClick={()=>setHiddenAnswes(!hiddenAnswers)}>
    {replies.filter(reply => reply.message_id === tourMessage.id).length > 0 && <>
      {hiddenAnswers ?
      <GoTriangleDown />
        :
      <GoTriangleUp />
  }
  </>}

<h4 className='text-sm font-bold cursor-pointer'>
  {replies.filter(reply => reply.message_id === tourMessage.id).length > 1 ? 
    `${replies.filter(reply => reply.message_id === tourMessage.id).length} odpovědí`   
    :
    replies.filter(reply => reply.message_id === tourMessage.id).length > 0 ?
      `${replies.filter(reply => reply.message_id === tourMessage.id).length} odpověď`
      :
      ''
  }
</h4>
    </div>
<div className={`${hiddenAnswers ? 'hidden' : 'block'}`}>
  {replies.sort((a, b) => b.id - a.id).map(reply => {

  
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

        <div           className={`shadow-xl rounded-lg transition-opacity duration-1000 ${deletedReply === reply.id ? 'opacity-0  bg-red-500 pointer-events-none '  : 'opacity-100'}`}
        key={reply.id}>
        <div key={reply.id} className={`${reply?.messageType === 1 ? 'dark:bg-gradient-to-r dark:from-shinyblack to-gray dark:text-white rounded-lg bg-gradient-to-r bg-gray-300 to-gray-400 ':''} flex flex-col px-1 relative pt-2 pb-2  border-t border-gray-400 dark:text-gray-100`}>
        <span className='absolute text-xs left-16 top-1 px-6 text-center'>{reply.messageType == 1 ? `Tato zpáva je zašifrovaná a vidí ji pouze ${tourMessage.firstName}  a ${reply.firstName} `:''}</span>
          <div className={`flex items-center gap-6 md:gap-2 px-2   mt-1 ${reply.user_id ===  user?.id ? 'pl-1': 'p3-6' }`}>
            {reply.user_id === user?.id &&
              <div className="text-red-700 hover:text-red-500 absolute  cursor-pointer top-1 right-1 " onClick={() => handleDeleteClick(reply.id)}>
             {allowedToDelete &&  <FaRegTrashAlt />}
              </div>
            }
            <div className={'w-14 h-14 overflow-hidden rounded-full cursor-pointer'}
            onClick={()=>!showReplyFoto && setShowReplyFoto(true)}>
            <img
              src={reply.image ? reply.image : 'profile.png' }
              alt="Profile"
              className="w-full z-30 h-full object-cover"
            />
    <Modal show={showReplyFoto} onClose={()=>setShowReplyFoto(false)} imageUrl={reply.image} />




            </div>
            <div className="flex gap-1 ">
            <p className={` ${reply.user_id ===  user?.id ? 'text-blue-800 dark:text-lightAccent' : 'text-gray-600 dark:text-gray-100' }  font-bold  `}>{reply.firstName ? reply.firstName.slice(0, 10) : '' }</p>
            <p className="text-gray-600   dark:text-gray-100 italic">   {displayText}</p> 
            </div>
          </div>
         
          <div className="md:pl-14 break-all" >
            <p className={` ${reply.user_id ===  user?.id ? 'text-blue-800 dark:text-lightAccent'  : 'text-gray-600 dark:text-gray-100' }`}>{reply.message}</p>
         </div>
  
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
 

     
     <ConfirmationModal
  show={showModal}
  onClose={() => setShowModal(false)}
  onConfirm={selectedReplyId ? deleteReply : deleteMessage}
  message="Chceš opravdu smazat tuto zprávu?"
/>

        </div>
  );
};

export default TourMessage;
