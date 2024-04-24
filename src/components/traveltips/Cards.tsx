import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { useCountryContext } from '../../context/countryContext';
import axios from 'axios';

type VideoCard = {
  id: number;
  country: string;
  title: string;
  video: string;
  posted: string;
};

const ITEMS_PER_PAGE = 5;

function Cards() {
  const { chosenCountry } = useCountryContext();
  const [currentPage, setCurrentPage] = useState(0);
  const [cards, setCards] = useState<VideoCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  useEffect(() => {
    if (chosenCountry) {
      setIsLoading(true);
      setIsVideoLoading(true)
      const fetchData = async () => {
        const result = await axios.get('cards.json');
          setCards(result.data.cards);
          setIsLoading(false)
                   
      };

      fetchData();
      setTimeout(() => {setIsVideoLoading(false)},1500)
    }
  }, [chosenCountry]);






  const handlePageChange = ({ selected }: any) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = (currentPage + 1) * ITEMS_PER_PAGE;

  const currentCards = cards?.slice(startIndex, endIndex);

  return (
    <div className={`flex flex-col items-center`}>
      <div className="flex flex-wrap justify-center gap-4">
        {isLoading ? (
          // Render loading state for each card while data is being fetched
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
          // Render actual cards once data is fetched
          currentCards?.map((card, idx) => (
            <div key={idx} className={` ${isVideoLoading ? 'bg-gray-300 py-1 px-1 animate-pulse blur-sm' : 'rounded overflow-hidden shadow-lg bg-gray-300 py-1 px-1 '} w-[300px] h-[260px] `}>
            
              <div className={`px-6 py-2`}>
                <div className="font-bold text-xl mb-2">{card.title.length > 20 ? `${card.title.slice(0, 20)} ...` : card.title}</div>
                <div className="flex justify-between">
                  <div className="text-gray-700 text-base">nahráno: {card.posted}</div>
                  <div className="text-gray-700 text-base">autor: Pepa</div>
                </div>
              </div>
              <div className={`${isVideoLoading ? 'bg-black w-full h-[60%]': 'w-full aspect-w-16 aspect-h-9'}`}>
                 <div className={`${isVideoLoading ? 'hidden': ''}`}>
                        <iframe
                        width="full"
                        height="full"
                        src={card.video}
                        title={card.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        ></iframe>
                  </div>
              </div>
            </div>
          ))
        )}
      </div>
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
      />
    </div>
  );
}

export default Cards;

