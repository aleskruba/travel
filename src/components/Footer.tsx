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
    <footer className="bg-gray-800 text-gray-300  pb-20  pt-32">
      <div className=" px-8  flex flex-around border-t border-white  py-8  ">
        <div className="w-full flex justify-center  mb-4 ">
          <div>
          <h3 className="text-lg font-bold mb-4 text-darkAccent ">Odkazy</h3>
          <ul>
            {footerItems.map((item, index) => (
              <li key={index} className="mb-2">
                <a href="#" className="hover:text-white">{item}</a>
              </li>
            ))}
          </ul>
          </div>
        </div>

        {/* 
            <img src="footer.svg" alt="lide" className='hidden md:flex  w-full '/> */}
        
        <div className="w-full flex justify-center mb-4  ">
          <div>
          <h3 className="text-lg font-bold mb-4 text-darkAccent ">Podmínky</h3>
          <ul>
            {footerConditions.map((condition, index) => (
              <li key={index} className="mb-2">
                <a href="#" className="hover:text-white">{condition}</a>
              </li>
            ))}
          </ul>
        </div>
        </div>
        {/* Add more sections as needed */}
      </div>
    </footer>
  );
}

export default Footer;
