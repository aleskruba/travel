import React, { useState,FormEvent } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DOMPurify from 'dompurify';

interface Tour {
  id: number;
  fname: string;
  date: Date;
  tourdate: Date;
  destination: string;
  type: string;
  fellowtraveler: string;
  aboutme: string;
  user_id: number;
}

function CreateTour() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState('');

  const [tour, setTour] = useState<Tour>({
    id: 0,
    fname: '',
    date: new Date(),
    tourdate: new Date(),
    destination: '',
    type: '',
    fellowtraveler: '',
    aboutme: '',
    user_id: 4
  });

  const [tours,setTours] = useState<Tour[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value); // Sanitizar el valor
    setTour(prevState => ({
      ...prevState,
      [name]: sanitizedValue
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date); // Update selectedDate state with the selected date
    setTour(prevState => ({ ...prevState, tourdate: date || new Date() })); // Update tourdate property in the tour state with the selected date
  };
  
  const onSubmitFunction = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let isValid = true;
    const newErrors: { [key: string]: string } = {};

    if (!tour.destination || !tour.type || !tour.fellowtraveler || !tour.aboutme || !selectedDate) {
      newErrors['all'] = 'Všechny pole musí být vyplněné';
      isValid = false;
    }
  
    if (!isValid) {
      setErrors(newErrors['all']);
      return;
    }
    const newTour: Tour = {
      id: tours.length + 1, // Generate a unique ID
      fname: tour.fname,
      date: tour.date,
      tourdate: tour.tourdate,
      destination: tour.destination,
      type: tour.type,
      fellowtraveler: tour.fellowtraveler,
      aboutme: tour.aboutme,
      user_id: tour.user_id
    };
  
    setTours([newTour, ...tours]); // Prepend the new tour to the existing list of tours
  
    // Reset the tour input
    setTour({
      id: 0,
      fname: '',
      date: new Date(),
      tourdate: new Date(),
      destination: '',
      type: '',
      fellowtraveler: '',
      aboutme: '',
      user_id: 4
    });
    setSelectedDate(null);
    setErrors('');
  };
  
console.log(tours)
  return (
    <div className="text-black dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Jak vytvořit Spolucestu</h1>
        <h2 className="text-xl font-semibold mb-4">1. Začněte Registrací:</h2>
        <p className="mb-4">Pokud jste již zaregistrovaní uživatelé, můžete tento krok přeskočit. Pokud ne, zaregistrujte se na našem webu a vytvořte si účet. Tím se vám umožní spravovat vaše nabídky spolucesty a komunikovat s ostatními uživateli.</p>
        <h2 className="text-xl font-semibold mb-4">2. Přihlaste se:</h2>
        <p className="mb-4">Po registraci nebo pokud už máte účet, přihlaste se pomocí svého uživatelského jména a hesla.</p>
        <h2 className="text-xl font-semibold mb-4">3. Vyplňte Formulář:</h2>
        <p className="mb-4">Po přihlášení klikněte na tlačítko "Vytvořit novou nabídku spolucesty". Vyplňte formulář s následujícími informacemi:</p>
        <ul className="list-disc ml-8 mb-4">
          <li><strong>Destinace:</strong> Kam se chystáte? Uveďte místo, které plánujete navštívit.</li>
          <li><strong>Datum:</strong> Kdy plánujete odjet? Uveďte přesný datum odjezdu.</li>
          <li><strong>Typ cesty:</strong> Jaký druh cesty plánujete? Moře, hory, výlety, atd. Zde můžete specifikovat typ vaší dobrodružné plánované cesty.</li>
          <li><strong>Koho hledáte:</strong> Jakého spolucestujícího hledáte? Zadejte požadavky na pohlaví, věk, zájmy, atd.</li>
          <li><strong>Informace o sobě:</strong> Napište krátký popis o sobě. Zahrňte vaše zájmy, preference a vše, co si myslíte, že by měli ostatní uživatelé vědět.</li>
        </ul>
      </div>
      
      <div>Vytvoř spolucestu 
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">Vytvoř spolucestu</h1>
          <div>
            <form onSubmit={onSubmitFunction}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="destination">Destinace:</label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="destination"
                  type="text"
                  placeholder="Destinace"
                  name="destination"
                  value={tour.destination}
                  onChange={handleChange}
                />
              </div>
              <label className="block text-sm font-bold mb-2" htmlFor="date">Termín cesty:</label>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}

                dateFormat="MM/yyyy"
                showMonthYearPicker
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="journey-type">Typ cesty:</label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="journey-type"
                  type="text"
                  placeholder="Typ cesty"
                  name="type"
                  value={tour.type}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="looking-for">Koho hledáte:</label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="looking-for"
                  rows={5}
                  placeholder="Jakého spolucestujícího hledáte? Zadejte požadavky na pohlaví, věk, zájmy, atd. Omezte se na 500 znaků."
                  maxLength={500}
                  name="fellowtraveler"
                  value={tour.fellowtraveler}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="about-you">Informace o sobě:</label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="about-you"
                  rows={5}
                  placeholder="Napište krátký popis o sobě. Zahrňte vaše zájmy, preference a vše, co si myslíte, že by měli ostatní uživatelé vědět. Omezte se na 500 znaků."
                  maxLength={500}
                  name="aboutme"
                  value={tour.aboutme}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className='text-lightError pb-4 text-xl '>{errors ? errors : ''}</div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Odeslat
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTour;

