import React, { useState, useRef, useEffect } from 'react';
import { countryNames } from '../constants';
import { useCountryContext } from '../context/countryContext';

const ComboBox: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1); // Track highlighted index
  const { setChosenCountry } = useCountryContext();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true); // Open dropdown when typing
    setHighlightedIndex(-1); // Reset highlighted index when input changes
  };

  const handleSelectCountry = (country: string) => {
    console.log(country);
    setChosenCountry(country);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleDropdownClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dropdownRef.current || !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  const handleInputClick = () => {
    setIsOpen(!isOpen); // Toggle dropdown when clicking on input
  };

  const maxDisplayedCountries = 15;

  let filteredCountries = countryNames.filter((country) => {
    const normalizedCountry = country.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normalizedSearchTerm = searchTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return (
      normalizedCountry.toLowerCase().includes(normalizedSearchTerm.toLowerCase()) ||
      country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (filteredCountries.length > maxDisplayedCountries) {
    filteredCountries = filteredCountries.slice(0, maxDisplayedCountries);
  }

  // Add event listener for arrow key presses
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setHighlightedIndex((prevIndex) =>
            prevIndex === filteredCountries.length - 1 ? 0 : prevIndex + 1
          );
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setHighlightedIndex((prevIndex) =>
            prevIndex === 0 ? filteredCountries.length - 1 : prevIndex - 1
          );
        } else if (e.key === "Enter" && highlightedIndex !== -1) {
          handleSelectCountry(filteredCountries[highlightedIndex]);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, highlightedIndex, filteredCountries]);

  // Add event listener to handle clicks outside of the dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full px-2" >
      <input
        type="text"
        placeholder="ostatní země"
        value={searchTerm}
        onChange={handleInputChange}
        onClick={handleInputClick} // Toggle dropdown when clicking on input
        className="w-full border rounded px-4 py-2 focus:outline-none text-black focus:border-blue-500 "
      />
      {isOpen && (
        <div
          className="absolute px-4 z-10 mt-1 w-[97%] md:w-[94%]  bg-white text-black border rounded shadow-lg"
          ref={dropdownRef}
          onClick={handleDropdownClick}
        >
          {filteredCountries.length === 0 ? (
            <div className="px-4 py-2">Žádná shoda</div>
          ) : (
            filteredCountries.map((country, index) => (
              <div
                key={index}
                onClick={() => handleSelectCountry(country)} // Pass country directly to handleSelectCountry
                className={`px-4 py-2 hover:bg-gray-300 cursor-pointer ${
                  index === highlightedIndex ? "bg-gray-300" : ""
                }`}
              >
                {country}
              </div>
            ))
          )}
          {countryNames.length > maxDisplayedCountries && (
            <div className="flex items-center justify-center opacity-50 italic">
              + dalších {countryNames.length - maxDisplayedCountries} zemí
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComboBox;
