import React, { useState,useEffect ,FormEvent } from 'react';
import ReactPaginate from 'react-paginate';
import { useCountryContext } from '../../context/countryContext';
import { useAuthContext } from '../../context/authContext';
import axios from 'axios';
import Card from './Card';
import { VideoCard } from '../../types';
import CreateCard from './CreateCard';
import DOMPurify from 'dompurify';
import BASE_URL from '../../config/config';
import { config } from '../../config/config';
import {  Flip, toast } from 'react-toastify';
import { useDialogContext } from '../../context/dialogContext';

const ITEMS_PER_PAGE = 5;

function Cards() {
  const { chosenCountry } = useCountryContext();
  const { handleLoginClick} = useDialogContext();
  const { user} = useAuthContext();
  const [currentPage, setCurrentPage] = useState(0);
  const [card, setCard] = useState<VideoCard>({
    id: 0,
    country: '',
    firstName: '',
    title: '',
    video: '',
    user_id: null
  });
  const [cards, setCards] = useState<VideoCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [backendError, setBackendError] = useState('');



  useEffect(() => {
    if (chosenCountry ) {
      setIsLoading(true);
      setIsVideoLoading(true)

      try { 
      const fetchData = async () => {
        const result = await axios.get(`${BASE_URL}/blogs/${chosenCountry}`);
          setCards(result.data.cards);
          setIsLoading(false)
          
      };

      fetchData();
      setTimeout(() => {setIsVideoLoading(false)},1500)

    }
   catch (error) {
    console.error('Error fetching data:', error);
    setIsLoading(false);
    }
  }
  }, [chosenCountry]);





  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = DOMPurify.sanitize(event.target.value);
    setCard(prevCard => ({
      ...prevCard,
      country: chosenCountry|| '',
      user_id: user?.id || null,
      [event.target.name]: sanitizedValue
    }));
  };
  

  function getEmbedUrl(youtubeUrl:string) {
    const videoIdMatch = youtubeUrl.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/) || youtubeUrl.match(/(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (videoIdMatch && videoIdMatch[1]) {
        const videoId = videoIdMatch[1];

        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        return embedUrl;
    } else {
        throw new Error("Invalid YouTube URL");
    }
}
  
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!card.title.trim()  || !card.video.trim()) { // Check if reply.message is falsy or empty after trimming whitespace
        setBackendError('Všechny pole musí být vyplněné')
        return;
      } 
        console.log(card)

        const embedUrl = getEmbedUrl(card.video);
        const updatedCard = { ...card, video: embedUrl };
        console.log(updatedCard);
 try{
        const response = await axios.post(`${BASE_URL}/blogs`, updatedCard, config);
      console.log(response)
        if (response.status === 201){ 
          setShowCreateCard(false)
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

  //id         console.log(response.data.message)
   
            const updatedCard= { ...card, id: response.data.message };
            setCards([updatedCard, ...cards]);
   
        }
        setBackendError('')
       setCard({
          id: 0,
          country: '',
          firstName: '',
          title: '',
          video: '',
          user_id: 0
        })

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
    }


  const handlePageChange = ({ selected }: any) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = (currentPage + 1) * ITEMS_PER_PAGE;

  const currentCards = cards?.slice(startIndex, endIndex);

  return (
    <div className={`flex flex-col items-center`}>
      <div className='px-4 py-2 mb-2 rounded underline text-blue-500 cursor-pointer'
          onClick={()=>{setShowCreateCard(!showCreateCard)}}>
       {!showCreateCard ? "Vložit video Blog" : "Zpět"} 
      </div>
      <div className={`${showCreateCard ? 'block' : 'hidden'}`}>
        {user ? 
        <CreateCard  
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          card={card}
          backendError={backendError}
       
          /> :        <div className="p-4 bg-blue-100 text-blue-800 border border-blue-300 rounded-md shadow-lg mb-4">
          Jenom přihlášení uživatelé mohou přidávat videa, 
          <span onClick={() => handleLoginClick()} className="cursor-pointer text-blue-500 hover:underline">Přihlaš se zde</span>
        </div>}

      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {isLoading ? (
             Array.from({ length: 10}).map((_, idx) => (
            <div key={idx} className={`w-[300px] h-[260px] rounded overflow-hidden shadow-lg bg-gray-300 py-1 px-1 animate-pulse`}>
              <div className="px-6 py-2">
                <div className="animate-pulse h-4 bg-gray-400 w-3/4 mb-2"></div>
                <div className="animate-pulse h-4 bg-gray-400 w-1/2 mb-2"></div>
                <div className="flex justify-between">
                  <div className="animate-pulse h-4 bg-gray-400 w-1/3"></div>
                  <div className="animate-pulse h-4 bg-gray-400 w-1/3"></div>
                </div>
              </div>
              <div className={`w-full aspect-w-16 aspect-h-9 animate-pulse bg-gray-400`}></div>
            </div>
          ))
        ) : (
           currentCards?.map((card, idx) => (
            <Card key={idx} card={card} isVideoLoading={isVideoLoading} />
          ))
        )}
      </div>
      {chosenCountry && cards?.length ?
      <ReactPaginate
        previousLabel={'<<'}
        nextLabel={'>>'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={Math.ceil(cards.length / ITEMS_PER_PAGE)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={'pagination'}
        activeClassName={'active'}
        previousClassName={'pagination-previous'}
        nextClassName={'pagination-next'}
        disabledClassName={'pagination-disabled'}
      />:""
    }
    </div>
  );
}

export default Cards;

