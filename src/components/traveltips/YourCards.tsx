import React, { useState,useEffect ,FormEvent } from 'react';
import axios from 'axios';
import BASE_URL, { config } from '../../config/config';
import { VideoCard } from '../../types';
import UpdateCard from './UpdateCard';
import DOMPurify from 'dompurify';
import {  Flip, toast } from 'react-toastify';
import { useAuthContext } from '../../context/authContext';
import ConfirmationModal from '../ConfirmationModal';

function YourCards() {

  const [backendError, setBackendError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [cards,setCards] = useState<VideoCard[]>([]);
  const [updateClick,setUpdateClick] = useState(false);
  const [selectedCard,setSelectedCard] = useState<number | null>(null)
  const [updateCard,setUpdateCard] = useState<VideoCard>()
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCardToDelete, setSelectedCardToDelete] = useState<number | null>(null);
  const { user} = useAuthContext();

  useEffect(() => {
    setBackendError('');
    if (!isLoading ) {
      setIsLoading(true);
  
      const fetchData = async () => {
        try {
          const resultBlogs= await axios.get(`${BASE_URL}/yourblogs`,config);
    
          setCards(resultBlogs.data.cards );


          setIsLoading(false);
     
        } catch (error) {
          console.error('Error fetching data:', error);
          setIsLoading(false);
        }
      };
  
      fetchData();
    }
  }, [backendError]);


const setUpdateClickFunction = (ID:number) => {
  setUpdateClick(true);
  setSelectedCard(ID)

  cards.forEach(card => {
    if (card.id ===ID) {

      setUpdateCard(card)
    }
})  

}
const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  const sanitizedValue = DOMPurify.sanitize(value);

  setUpdateCard((prevUser: VideoCard | undefined) => {
    if (!prevUser) return undefined;
    return {
      ...prevUser,
      [name]: sanitizedValue,
    };
  });
};

const handleUpdateSubmit = async (e: FormEvent<HTMLFormElement>)=> {

 
  if (!updateCard) {
    return;
  }

  const newValue = cards.map((element) => {
    if (element.id === updateCard.id) {
      return { ...element, ...updateCard };
    }
    return element;
  });

  setCards(newValue);
  setSelectedCard(null);
  setUpdateClick(false);

  try{
    const response = await axios.put(`${BASE_URL}/blogs`, updateCard, config);
  console.log(response)
    if (response.status === 201){ 

      toast.success('Váš odkaz byl uspěšně přidán',  {
        position: "top-left",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Flip,
        });

    }
    setBackendError('')

  } catch (err:any) {
    setBackendError(err.response.data.error)

    toast.error('Chyba při ukládání',  {
      position: "top-left",
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Flip,
      });
  } 
};


const handleDeleteCardClick = (ID: number) => {
  setSelectedCardToDelete(ID);
  setShowModal(true);
  };


const deleteCard = async () => {
  setIsLoadingDelete(true)
setShowModal(false);
if (selectedCardToDelete !== null) {


  const updatedCards = cards.filter(card => card.id !== selectedCardToDelete);
  setCards(updatedCards)

  console.log(selectedCardToDelete)
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    data: {
      user_id:user?.id,
      id: selectedCardToDelete 
    }
  };

  try {
    const response = await axios.delete(`${BASE_URL}/blogs`, config);
    console.log(response)
   if (response.status === 201){ 
    setIsLoadingDelete(false)
      toast.success('Váš video blog byl smazán',  {
        position: "top-left",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Flip,
        });

    }
    setBackendError('')

  } catch (err:any) {
      setBackendError(err.response.data.error)
      setIsLoadingDelete(false)
      toast.error('Něco se pokazilo... ',  {
        position: "top-left",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Flip,
        });
  }
}
}


return (
  <div className="grid grid-cols-1 md:grid-cols-auto lg:grid-cols-3 gap-4 border-b-4 border-indigo-500 pb-4">
    {cards.map((card) => (
      <div key={card.id} className="flex flex-col">
        {updateClick && selectedCard === card.id ? (
          <UpdateCard
            handleUpdateSubmit={handleUpdateSubmit}
            handleUpdateChange={handleUpdateChange}
            card={card}
            backendError={backendError}
            setUpdateClick={setUpdateClick}
            setSelectedCard={setSelectedCard}
            updateCard={updateCard}
          />
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-lg shadow-md flex-1">
              <div className="text-2xl pb-2">{card.country}</div>
              <div className="text-lg font-semibold">
                {card.title.length > 27 ? `${card.title.slice(0, 27)}...` : card.title}
              </div>
              <div className="text-lg font-semibold">
                {card.video.length > 27 ? `${card.video.slice(0, 27)}...` : card.video}
              </div>
              <div className="aspect-w-16 aspect-h-9 mt-4">
                {/* Assuming `card.video` is a URL to a video */}
                <iframe
                  title={card.title}
                  className="w-full h-full object-cover"
                  src={card.video}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <div className="flex justify-around space-x-4 p-4 bg-gray-100 dark:bg-gray-700">
              <div
                className="flex justify-center items-center px-4 py-2 cursor-pointer text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-200"
                onClick={() => setUpdateClickFunction(card.id)}
              >
                Upravit
              </div>
              <div className="flex justify-center items-center px-4 py-2 cursor-pointer text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-200"
                onClick={()=> !isLoadingDelete &&  handleDeleteCardClick(card.id)}
              >
                Smazat
              </div>
            </div>
          </>
        )}
      </div>
    ))}

<ConfirmationModal
  show={showModal}
  onClose={() => setShowModal(false)}
  onConfirm={ deleteCard}
  message="Chceš opravdu smazat tento Blog?"
/>
  </div>
);

}

export default YourCards