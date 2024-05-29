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


type Props = {
    tourMessages:TourMessageProps[];
  setTourMessages:React.Dispatch<React.SetStateAction<TourMessageProps[]>>;
  tourMessage: TourMessageProps;

};

const TourMessage: React.FC<Props> = ({tourMessages, tourMessage,setTourMessages }) => {

  const { user} = useAuthContext();
 
const deleteMessage = (ID: any) => {
  const updatedMessages = tourMessages.filter(message => message.id !== ID);
  setTourMessages(updatedMessages);

}

console.log(tourMessage.user_id ,user?.id)

return (
    <div className='flex flex-col  dark:bg-gray-500 dark:text-gray-100  px-4 py-2  shadow-2xl rounded-lg '>
     <div className="flex flex-col md:flex-row md:items-center gap-4 ">
      <div className="flex  items-center gap-2"> 
         {tourMessage.user_id == user?.id &&
                  <div className="text-red-700  cursor-pointer hover:text-red-500" 
                      onClick={()=>deleteMessage(tourMessage.id)}
                      >
                      <FaRegTrashAlt />
                  </div>
                  }
        <div className="w-14 h-14 overflow-hidden rounded-full">
          <img src={tourMessage?.image ? tourMessage?.image : '/profile.png'} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-row gap-4 md:gap-2">
        <p className="text-gray-600 dark:bg-gray-500 dark:text-gray-100 font-semibold">{tourMessage?.firstName.slice(0, 10)}</p>
        <p className="text-gray-600 dark:bg-gray-500 dark:text-gray-100 w-[80px]">{moment(tourMessage.date).format('DD-MM YYYY ')}</p>

     
        </div>
      </div>
        <div className="md:px-4 break-all " >
          <p className="">{tourMessage.message} </p>
      </div>
     </div>
 



        </div>
  );
};

export default TourMessage;
