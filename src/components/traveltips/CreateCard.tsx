import React, { useState,useEffect ,FormEvent } from 'react';
import { VideoCard } from '../../types';

type CreateCardProps = {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    card: VideoCard;
    backendError:string
  };

  const CreateCard: React.FC<CreateCardProps> = ({ handleSubmit, handleChange,backendError,card}) => {



  return (

        <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] md:w-[550px] mb-4 dark:bg-gray-200">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">Přidat YouTube Video</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 mb-2">Titulek</label>
                <input type="text" 
                       id="title" 
                       name="title" 
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                       placeholder="Titulek" 
                       onChange={handleChange}
                       value={card.title}
                       />
            </div>
            <div className="mb-4">
                <label htmlFor="url" className="block text-gray-700 mb-2">YouTube video URL adresa</label>
                <input type="text" 
                       id="video" 
                       name="video" 
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                       placeholder="YouTube video URL adresa" 
                       onChange={handleChange}
                       value={card.video}
                       />
            </div>
            <div>
                <input type="submit" value="Odeslat" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 cursor-pointer" />
            </div>
            {backendError && <div className='text-red-500'>{backendError}</div>}
        </form>
    </div>


  )
}

export default CreateCard