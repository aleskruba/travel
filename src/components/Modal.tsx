import React, { useState, useEffect } from 'react';

const Modal = ({ show, onClose, imageUrl }: any) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      // Delay the removal from DOM to allow the animation to complete
      const timer = setTimeout(() => setIsVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      onClose();
      

    }
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 transition-opacity w-full duration-1000 ${
        show ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`relative bg-white p-4 rounded-lg transform transition-transform duration-1000 ${
          show ? 'scale-100' : 'scale-0'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black bg-gray-200 rounded-full p-1 focus:outline-none"
        >
          &times;
        </button>
        <img src={imageUrl} alt="Profile" className="w-[380px] max-h-full" />
      </div>
    </div>
  );
};

export default Modal;
