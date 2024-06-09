import React,{useEffect, useState} from 'react';
import Select from 'react-select';
import {  typeOfTourObjects } from '../../constants';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../config/config';
import { TourProps } from '../../types';

type countryNamesObjects =  {
        value: string;
        label: string;

}

interface SearchComponentProps {
    filterTours: (country: string | null, tourType: string | null, date: string | Date | null) => void;
    selectedCountry: { value: string; label: string } | null;
    selectedTourType: { value: string; label: string } | null;
    selectedDate: { value: string; label: string } | null;
    setSelectedCountry: (selectedCountry: { value: string; label: string } | null) => void;
    setSelectedTourType: (selectedTourType: { value: string; label: string } | null) => void;
    setSelectedDate: (selectedDate: { value: string; label: string } | null) => void;
    countryNamesObjects: countryNamesObjects[]
}

function SearchComponent({ countryNamesObjects,filterTours, selectedCountry, selectedTourType, selectedDate, setSelectedCountry, setSelectedTourType, setSelectedDate }: SearchComponentProps) {
   
  


   
    const [searchParams, setSearchParams] = useSearchParams();

    const futureDates = [];
    const currentDate = new Date();
    const monthNames = [
        "leden", "únor", "březen", "duben", "květen", "červen",
        "červenec", "srpen", "září", "říjen", "listopad", "prosinec"
    ];

    for (let i = 0; i < 15; i++) {
        const futureDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
        const formattedDate = `${futureDate.getFullYear()}-${('0' + (futureDate.getMonth() + 1)).slice(-2)}-01`;
        const label = `${monthNames[futureDate.getMonth()]} ${futureDate.getFullYear()}`;
        futureDates.push({ value: formattedDate, label });
    }

    const handleCountryChange = (selectedOption: any) => {
        setSelectedCountry(selectedOption || null);
    };

    const handleTourTypeChange = (selectedOption: any) => {
        setSelectedTourType(selectedOption || null);
    };

    const handleDateChange = (selectedOption: any) => {
        setSelectedDate(selectedOption || null);
    };

    const handleSubmit = () => {
        const params = new URLSearchParams(searchParams);
        if (selectedCountry) params.set('country', selectedCountry.value);
        else params.delete('country');
        if (selectedTourType) params.set('type', selectedTourType.value);
        else params.delete('type');
        if (selectedDate) params.set('date', selectedDate.value);
        else params.delete('date');

        setSearchParams(params.toString());
        filterTours(selectedCountry ? selectedCountry.value : null, selectedTourType ? selectedTourType.value : null, selectedDate ? selectedDate.value : null);
    };

    const handleCancelFilters = () => {
        setSelectedCountry(null);
        setSelectedTourType(null);
        setSelectedDate(null);
        filterTours(null, null, null);
        

        setSearchParams({});
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className='flex flex-col items-center justify-center md:flex-row w-full px-2 gap-2 md:px-4 '>
            <Select
                options={countryNamesObjects}
                className="basic-single w-full md:w-[200px] flex-shrink-0"
                classNamePrefix="select"
                onChange={handleCountryChange}
                isClearable={true}
                value={selectedCountry}
                placeholder="vyber zemi"
            />
            <Select
                options={typeOfTourObjects}
                className="basic-single w-full md:w-[200px] flex-shrink-0"
                classNamePrefix="select"
                onChange={handleTourTypeChange}
                isClearable={true}
                value={selectedTourType}
                placeholder="vyber typ cesty"
            />
            <Select
                options={futureDates}
                className="basic-single w-full md:w-[200px] flex-shrink-0"
                classNamePrefix="select"
                onChange={handleDateChange}
                value={selectedDate}
                isClearable={true}
                onKeyDown={handleKeyPress}
                placeholder="vyber termin"
            />
            <div className='flex space-x-3'>
                <div className='text-lg w-[110px] px-3 py-1 bg-green-500 text-white flex hover:bg-green-400 cursor-pointer items-center justify-center rounded'
                    onClick={handleSubmit}>
                    Hledat
                </div>
                <div className='text-lg w-[110px] px-3 py-1 bg-gray-700 text-white flex hover:bg-gray-600 cursor-pointer items-center justify-center rounded'
                    onClick={handleCancelFilters}>
                    Zrušit filtry
                </div>
            </div>
        </div>
    );
}

export default SearchComponent;
