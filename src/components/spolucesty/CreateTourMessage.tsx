import React, { FormEvent, ChangeEvent, useState, useEffect } from 'react';
import { TourMessageProps, UserProps } from '../../types';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { BsEmojiGrin } from "react-icons/bs";
import { useAuthContext } from '../../context/authContext';

//type PartialMessageProps = Partial<TourMessageProps>;

interface CreateTourMessageProps {
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    handleChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    tourMessage: TourMessageProps;
    backendError: string;
    setTourMessage: React.Dispatch<React.SetStateAction<TourMessageProps>>;
  }

const  CreateTourMessage: React.FC<CreateTourMessageProps> = ({ onSubmit, handleChange,  tourMessage, backendError, setTourMessage }) => {
    const { user } = useAuthContext();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);


    const addEmoji = (event: any) => {
        const sym = event.unified.split("_");
    
        const codeArray: any[] = [];
      
        sym.forEach((el: any) => {
          codeArray.push("0x" + el);
        });
        let emoji = String.fromCodePoint(...codeArray);
      
        
      
        // Ensure the message object is updated correctly
        setTourMessage((prevMessage: any) => ({
          ...prevMessage,
          message: (prevMessage.message || '') + emoji,
        }));
      };

      useEffect(() => {
        setShowEmojiPicker(false)
      },[tourMessage])
      

return (
    <div className='flex flex-col '>
<form onSubmit={onSubmit}>
    <div className="flex justify-between items-center dark:text-lighTextColor gap-4 bg-gray-100 px-2 py-2 md:rounded-lg shadow-md mt-2">
      <div className="flex items-center gap-2">
        <div className="w-14 h-14 overflow-hidden rounded-full">
          <img src={user?.image ? user?.image : '/profile.png'} alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="flex-1 hidden md:flex relative">
        <textarea
          name="message"
          value={tourMessage.message}
          onChange={handleChange}
          className="w-full py-2 px-4 bg-gray-200 rounded-lg text-black focus:outline-none focus:ring focus:border-blue-500 resize-none"
          placeholder="Zde můžeš cestovateli napsat (max 500 characters)"
          maxLength={500}
        />
        <div className='absolute top-5 right-2 dark:text-black text-xl cursor-pointer ' onClick={() => setShowEmojiPicker(!showEmojiPicker)} ><BsEmojiGrin /></div> 

      </div>
      <div>
        <button type="submit" className="py-2 px-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-700">
          Odešli
        </button>
      </div>
    </div>

    <div className="md:hidden relative">
      <textarea
        name="message"
        value={tourMessage.message}
        onChange={handleChange}
        className="w-full py-2 px-4 bg-gray-200 text-black focus:outline-none focus:ring focus:border-blue-500 resize-none"
        placeholder="Zde můžeš cestovateli napsat"
        maxLength={500}
      />
    <div className='absolute top-5 right-2 dark:text-black text-xl cursor-pointer ' onClick={() => setShowEmojiPicker(!showEmojiPicker)} ><BsEmojiGrin /></div> 

    </div>

    {backendError && <span className='text-red-500'>{backendError}</span>}
  </form>
    <div className='flex justify-center items-center flex-col mt-1 '>

    {showEmojiPicker && (
     <Picker
           data={data}
      onEmojiSelect={addEmoji}
 />
  )}
  </div>
  </div>

  )
}

export default CreateTourMessage