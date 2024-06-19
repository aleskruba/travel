import React, {useEffect, useState } from 'react';
import { BiLike,BiDislike  } from "react-icons/bi";
import moment from 'moment';
import Reply from './Reply';
import { FaRegTrashAlt } from "react-icons/fa";
import { GoTriangleDown ,GoTriangleUp } from "react-icons/go";
import { MessageProps } from '../../types';
import { ReplyProps } from '../../types';
import { useAuthContext } from '../../context/authContext';
import axios from 'axios';
import BASE_URL, { SOCKET_URL } from '../../config/config';
import { motion, useAnimation } from 'framer-motion';
import ConfirmationModal from '../ConfirmationModal';
import Modal from '../Modal';
import useVote from '../../hooks/useVote';
import { useCountryContext } from '../../context/countryContext';
import { useNavigate  } from 'react-router-dom';
import { useDialogContext } from '../../context/dialogContext';
import { io } from 'socket.io-client';

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
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>
  replyDiv:  boolean
  setReplyDiv:React.Dispatch<React.SetStateAction<boolean>>

};

const Message: React.FC<Props> = ({messages, message,replyDiv, setReplyDiv,setMessages,replies,setReplies,allowedToDelete ,setIsSubmitted,setAllowedToDelete,isSubmitted}) => {

  const { user} = useAuthContext();

    const [hiddenAnswers,setHiddenAnswes] = useState(true);
    const [deleted, setDeleted] = useState(false);
    const controls = useAnimation();
    const[deletedReply,setDeletedReply] = useState<number | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedReplyId, setSelectedReplyId] = useState<number | null>(null);
    const [selectedReplyDivId, setSelectedReplyDivId] = useState<number | null>(null);
    const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
    const { chosenCountry } = useCountryContext();
    const {  votes,votesReply,handleVote,handleVoteReply,setVotes,setVotesReply,isLoading} = useVote(chosenCountry);
    const [liked, setLiked] = useState(false);
    const [disliked, setdisLiked] = useState(false);
    const [likedReply, setLikedReply] = useState(false);
    const [dislikedReply, setdisLikedReply] = useState(false);
    const { handleLoginClick } = useDialogContext();
    const navigate = useNavigate();
    const socket = io(SOCKET_URL);

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


const handleDeleteMessageClick = (ID: number) => {
      setSelectedMessageId(ID);
      setShowModal(true);
      };
    
const deleteMessage = async () => {

  if (selectedMessageId !== null)  {
    setAllowedToDelete(false)
    setTimeout(()=>{setAllowedToDelete(true)},1500) 
      
      setShowModal(false);
      setDeleted(true)
           
     
      socket.emit('delete_message', {messageID:selectedMessageId,messages:messages,chosenCountry});
          const updatedMessages = messages.filter(message => message.id !== selectedMessageId);    
  
           
          setTimeout(()=>{setMessages(updatedMessages)},1500) 


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
          const response = await axios.delete(`${BASE_URL}/message`, config);
          setReplyDiv(false);
          
          if (response.status === 201) {

        
          }
        } catch (error) {
          console.error("Error deleting message:", error);
      }
    }
};


const handleDeleteClick = (ID: number) => {
  setSelectedReplyId(ID);
  setShowModal(true);
};

const deleteReply = async () => {


  if (selectedReplyId !== null)  {
    setAllowedToDelete(false)
    setDeletedReply(selectedReplyId)
    setShowModal(false);


    socket.emit('delete_reply', {replyID:selectedReplyId,replies:replies,chosenCountry});
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
    const response = await axios.delete(`${BASE_URL}/reply`, config);
    setReplyDiv(false);
    if (response.status === 201) {
      setAllowedToDelete(true)
}
  } catch (error) {
    console.error("Error deleting message:", error);
}


  }
};


const imageUrl = message?.image ? message?.image : '/profile.png';

const [showFoto,setShowFoto] = useState(false)
const [showReplyFoto,setShowReplyFoto] = useState(false)
const [replyImage,setReplyImage] = useState<string>()


const showFotoFunction = () => {
  setShowFoto(true);

};

const closeModal = () => {
  setShowFoto(false);
};


const handleVoteClick = async (voteType: 'thumb_up' | 'thumb_down',message_id:any) => {

  if (!user) {
    navigate('/')
    handleLoginClick()
  } 

  if (voteType === 'thumb_up') {
  setLiked(true);
  setTimeout(() => {
    setLiked(false);
  }, 500); 
}
else if (voteType === 'thumb_down') {
  setdisLiked(true);
  setTimeout(() => {
    setdisLiked(false);
  }, 500); 
}

  try {
    handleVote(voteType,message_id);

    const newValue = votes.map(vote => {
      if (vote.message_id === message_id && vote.user_id === user?.id) {
        return { ...vote, vote_type: voteType };
      }
      return vote;
    });
    
    const voteExists = votes.some(vote => vote.message_id === message_id && vote.user_id === user?.id);
    
    if (!voteExists && user) {
      newValue.push({
        message_id: message_id,
        user_id: user?.id ,
        vote_type: voteType,
      });
    }
    
    setVotes(newValue);
    

    // Optionally, update state or UI after voting
  } catch (error) {
    console.error('Error handling vote:', error);
  }
};


const handleVoteClickReply = async (voteType: 'thumb_up' | 'thumb_down',reply_id:any,message_id:any) => {

  if (!user) {
    navigate('/')
    handleLoginClick()
  } 
  
  if (voteType === 'thumb_up') {
    setLikedReply(true);
    setTimeout(() => {
      setLikedReply(false);
    }, 500); 
  }
  if (voteType === 'thumb_down') {
    setdisLikedReply(true);
    setTimeout(() => {
      setdisLikedReply(false);
    }, 500); 
  }

  try {
    handleVoteReply(voteType,reply_id,message_id);

    const newValue = votesReply.map(vote => {
      if (vote.reply_id === reply_id && vote.user_id === user?.id) {
        return { ...vote, vote_type: voteType };
      }
      return vote;
    });
    
    const voteExists = votesReply.some(vote => vote.reply_id === reply_id && vote.user_id === user?.id);
    
    if (!voteExists && user) {
      newValue.push({
        reply_id:reply_id,
        message_id: message_id,
        user_id: user?.id ,
        vote_type: voteType,
      });
    }
    
    setVotesReply(newValue);
    

    // Optionally, update state or UI after voting
  } catch (error) {
    console.error('Error handling vote:', error);
  }
};


const countThumbsUp = (message_id:any) =>{
  let counter = 0;
  votes.forEach(vote => {
    if (vote.message_id === message_id && vote.vote_type === 'thumb_up') {
            counter++
          }
      }) ;
  return counter 
}

const countThumbsDown = (message_id:any) =>{
  let counter = 0;
  votes.forEach(vote => {
    if (vote.message_id === message_id && vote.vote_type === 'thumb_down') {
            counter++
          }
        }) ;
  return counter 
}

const countThumbsUpReply = (reply_id:any) =>{
  let counter = 0;
  votesReply.forEach(vote => {
    if (vote.reply_id === reply_id && vote.vote_type === 'thumb_up') {
            counter++
          }
      }) ;
  return counter 
}

const countThumbsDownReply = (reply_id:any) =>{
  let counter = 0;
  votesReply.forEach(vote => {
    if (vote.reply_id === reply_id && vote.vote_type === 'thumb_down') {
            counter++
          }
        }) ;
  return counter 
}

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


    <div className="flex flex-col md:flex-row md:items-center gap-4 relative ">
      <div className="flex  items-center gap-2"> 
         {message.user_id === user?.id &&
                 
                 <div className={`${!isSubmitted && allowedToDelete ? '' : 'pointer-events-none '} absolute top-1 right-1 min-w-[25px] text-red-700  cursor-pointer hover:text-red-500`} 
                      onClick={ ()=>handleDeleteMessageClick(message.id)}
                      >
            <FaRegTrashAlt /> 
                  </div>
                  }
     <div
  
        className={'w-14 h-14 overflow-hidden rounded-full cursor-pointer'}
        onClick={showFotoFunction}
      >
        <img src={imageUrl} alt="Profile" className='w-full h-full object-cover'/>
      </div>
      <Modal show={showFoto} onClose={closeModal} imageUrl={imageUrl} />


        <div className="flex flex-row gap-4 md:gap-2"> 
        <p className="text-gray-600 dark:bg-gray-500 dark:text-gray-100 font-semibold">{message?.firstName?.slice(0, 10)}</p>
        <p className="text-gray-600 dark:bg-gray-500 dark:text-gray-100  shrink-0 whitespace-nowrap overflow-hidden text-ellipsis">
{moment(message.date).format('DD-MM YYYY ')}</p>

     
        </div>
      </div>
        <div className="md:px-4 pt-4 break-all" >
          <p className="">{message.message} </p>
      </div>
     </div>
    


 
     <div className='flex items-center gap-2'>
        {!isLoading &&
     <div className='flex gap-4'>
          <div className='flex flex-col'>         
            <div onClick={() => handleVoteClick('thumb_up',message.id)} 
            className={`
              ${user?.id === message.user_id ? 'opacity-20 pointer-events-none' : `cursor-pointer transition-transform
                ${liked 
                                   ? 'scale-150 rotate-10 ' 
                                   : 'scale-100 rotate-0 '}
                `}
     
       
            `} >
            
                        
                    
              
  
              <BiLike />

              </div>
               
            <div>{ countThumbsUp(message.id)}</div>
          </div>
          <div className='flex flex-col'>    
            <div onClick={() => handleVoteClick('thumb_down',message.id)} 
                 className={`
                  ${user?.id === message.user_id ? 'opacity-20 pointer-events-none' : `cursor-pointer transition-transform
                    ${disliked 
                                       ? 'scale-150 rotate-10 ' 
                                       : 'scale-100 rotate-0 '}
                    `}
         
           
                `} >
                
              <BiDislike /></div>
        
            <div>{countThumbsDown((message.id))}</div>
          </div>
        </div>}



       {!replyDiv &&  user?.id !== message.user_id  &&
     <button className='bg-gray-300 text-gray-700 px-4 py-1 text-sm	 rounded-full hover:bg-gray-400 focus:outline-none focus:ring focus:border-gray-500'
             onClick={()=>{setReplyDiv(true);setHiddenAnswes(false);setSelectedReplyDivId(message.id )}} >
        Odpověz
      </button>
      }


    </div>
    
    {replyDiv && message.id === selectedReplyDivId &&
        <Reply setReplyDiv={setReplyDiv} 
             setReplies={setReplies}
             replies={replies} 
             message={message}
             setAllowedToDelete={setAllowedToDelete}
             setIsSubmitted={setIsSubmitted}
      
             />

    }



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
  {replies.sort((a, b) => b.id - a.id).map(reply => {
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

        <div           className={`shadow-xl rounded-lg transition-opacity duration-1000 ${deletedReply === reply.id ? 'opacity-0  bg-red-500 pointer-events-none '  : 'opacity-100'}`}
        key={reply.id}>
        <div key={reply.id} className='flex flex-col  pt-2  border-t border-gray-400 dark:text-gray-100 relative'>
          <div className={`flex items-center gap-6 md:gap-2  cursor-pointer mt-1 ${reply.user_id ===  user?.id ? 'pl-1': 'p3-6' }`}>
            {reply.user_id === user?.id &&
              <div className="text-red-700 hover:text-red-500 absolute  top-3 right-1" onClick={() => handleDeleteClick(reply.id)}>
             {allowedToDelete &&  <FaRegTrashAlt />}
              </div>
            }
          <div className={'w-14 h-14 overflow-hidden rounded-full cursor-pointer'}
            onClick={()=> {!showReplyFoto && setShowReplyFoto(true) ;setReplyImage(reply.image)}  }>
            <img
              src={reply.image ? reply.image : 'profile.png' }
              alt="Profile"
              className="w-full z-30 h-full object-cover"
            />
  
            {showReplyFoto &&
          <Modal show={showReplyFoto} onClose={()=>setShowReplyFoto(false)} imageUrl={replyImage && showReplyFoto && replyImage} />
            }


            </div>
            <div className="flex gap-1 ">
            <p className={` ${reply.user_id ===  user?.id ? 'text-red-600 dark:text-lightAccent' : 'text-gray-600 dark:text-gray-100' }  font-bold  `}>{reply.firstName ? reply.firstName.slice(0, 10) : '' }</p>
            <p className="text-gray-600  dark:bg-gray-500 dark:text-gray-100 italic">  text {displayText}</p>
            </div>
          </div>
         
          <div className="md:pl-14 break-all" >
            <p className={` ${reply.user_id ===  user?.id ? 'text-red-600 dark:text-lightAccent'  : 'text-gray-600 dark:text-gray-100' }`}>{reply.message}</p>
         </div>
  
      </div>
        
        <div className='flex gap-4 md:pl-14'>
          <div className='flex flex-col'>         
            <div onClick={() => handleVoteClickReply('thumb_up',reply.id,message.id)} 
                     className={`
                  ${user?.id === reply.user_id ? 'opacity-20 pointer-events-none' : `cursor-pointer transition-transform
                    ${likedReply 
                                       ? 'scale-150 rotate-10 ' 
                                       : 'scale-100 rotate-0 '}
                    `}
         
           
                `} >
              
              <BiLike /></div>
               
            <div>{ countThumbsUpReply(reply.id)}</div>
          </div>
          <div className='flex flex-col'>    
            <div onClick={() => handleVoteClickReply('thumb_down',reply.id,message.id)} 
                  className={`
                    ${user?.id === reply.user_id ? 'opacity-20 pointer-events-none' : `cursor-pointer transition-transform
                      ${dislikedReply 
                                         ? 'scale-150 rotate-10 ' 
                                         : 'scale-100 rotate-0 '}
                      `}
           
             
                  `} >
              
              <BiDislike /></div>
        
            <div>{countThumbsDownReply((reply.id))}</div>
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

    <ConfirmationModal
  show={showModal}
  onClose={() => setShowModal(false)}
  onConfirm={selectedReplyId ? deleteReply : deleteMessage}
  message="Chceš opravdu smazat tuto zprávu?"
/>
    </motion.div>
  );
};

export default Message;
