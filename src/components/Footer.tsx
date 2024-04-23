import React from 'react';

function Footer() {
  const footerItems = [
    'O NÁS',
    'BLOG',
    'INSTAGRAM',
    'FACEBOOK',
    'KONTAKT',
    'SPOLUPRÁCE',
    'ČLENSTVÍ'
  ];

  const footerConditions = [
    'Obchodní podmínky',
    'Ochrana osobních údajů',
    'Cookies'
  ];

  return (
    <footer className="bg-gray-800 text-gray-300 py-8 pb-20">
      <div className=" px-8 md:pl-16 flex justify-between ">
        <div className="w-full   mb-4 ">
          <h3 className="text-lg font-bold mb-4 text-darkAccent ">Odkazy</h3>
          <ul>
            {footerItems.map((item, index) => (
              <li key={index} className="mb-2">
                <a href="#" className="hover:text-white">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* 
            <img src="footer.svg" alt="lide" className='hidden md:flex  w-full '/> */}
        
        <div className="w-full  mb-4 md:pl-32 ">
          <h3 className="text-lg font-bold mb-4 text-darkAccent ">Podmínky</h3>
          <ul>
            {footerConditions.map((condition, index) => (
              <li key={index} className="mb-2">
                <a href="#" className="hover:text-white">{condition}</a>
              </li>
            ))}
          </ul>
        </div>
        {/* Add more sections as needed */}
      </div>
    </footer>
  );
}

export default Footer;
