import React from 'react';
import { VideoCard } from '../../types';
  
  type Props = {
    card: VideoCard;
    isVideoLoading: boolean;
  };
  
  const Card: React.FC<Props> = ({ card, isVideoLoading }) => {
  return (
    <div className={` ${isVideoLoading ? 'bg-gray-300 py-1 px-1 animate-pulse blur-sm' : 'rounded overflow-hidden shadow-lg bg-gray-300 py-1 px-1 '} w-[300px] h-[260px] `}>
      <div className={`px-6 py-2`}>
        <div className="font-bold text-xl mb-2">{card.title.length > 20 ? `${card.title.slice(0, 20)} ...` : card.title}</div>
        <div className="flex justify-between">
          <div className="text-gray-700 text-base">nahráno: {card.posted}</div>
          <div className="text-gray-700 text-base">autor: Pepa</div>
        </div>
      </div>
      <div className={`${isVideoLoading ? 'bg-black w-full h-[60%]' : 'w-full aspect-w-16 aspect-h-9'}`}>
        <div className={`${isVideoLoading ? 'hidden' : ''}`}>
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
  );
};

export default Card;
