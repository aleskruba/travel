import React from 'react'
import { VideoCard } from '../../types';


type UpdateCardProps = {
    handleUpdateSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    handleUpdateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setUpdateClick:React.Dispatch<React.SetStateAction<boolean>>
    card: VideoCard;
    updateCard:VideoCard | undefined;
    backendError:string
    setSelectedCard:React.Dispatch<React.SetStateAction<number|null>>
  };

  const UpdateCard: React.FC<UpdateCardProps> = ({ handleUpdateSubmit, handleUpdateChange,backendError,card,setUpdateClick,setSelectedCard,updateCard}) => {

  return (
    <form onSubmit={handleUpdateSubmit}>

    <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 mb-2">Titulek</label>
        <input type="text" 
               id="title" 
               name="title" 
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
               placeholder="Titulek" 
               onChange={handleUpdateChange}
               value={updateCard?.title}
               />
    </div>
    <div className="mb-4">
        <label htmlFor="url" className="block text-gray-700 mb-2">Změň zde pouze <b>kód !!!!</b> za posledním "/"  </label>
        <input type="text" 
               id="video" 
               name="video" 
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
               placeholder="YouTube video URL adresa" 
               onChange={handleUpdateChange}
               value={updateCard?.video}
               />
    </div>
    <div className="flex justify-around space-x-4 p-4 bg-gray-100 dark:bg-gray-700">
            <button className=" flex justify-center items-center px-4 py-2  cursor-pointer text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-200"
                    type='submit'               
            >Uložit</button>
            <div className=" flex justify-center items-center px-4 py-2 cursor-pointer text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-200"
              onClick={()=>setUpdateClick(false)}
            >Zrušit</div>
          </div>
    {backendError && <div className='text-red-500'>{backendError}</div>}
</form>
  )
}

export default UpdateCard