export interface UserProps {
  id:number | null ;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null ;
  email: string | null ;
  password: string | null;
  image?: string | null ;
  registrationDate: Date | null
  googleId?: string | null;
  googleEmail?: string | null;
  googleName?: string | null;
  googleProfilePicture?: string | null;
}

export type MessageProps = {
    id: number;
    email: string;
    fname: string;
    date: Date;
    img: string;
    message: string;
    user_id: number ;
  
  };
  
  export interface ReplyProps {
    id: number;
    fname: string;
    date: Date;
    img: string;
    message: string; 
    message_id: number,
    user_id: number;
  }

  
export type VideoCard = {
    id: number;
    country: string;
    title: string;
    video: string;
    posted: string;
  };
  
export type ChosenCountryData = {
    name: string;
    population: string;
    currency: string;
    language: string;
    capital: string;
    area: string;
    timezone: string;
    continent: string;
    flag:string;
  };


  export interface TourProps {
    id: number;
    fname: string;
    email: string;
    img: string;
    date: Date ;
    tourdate: Date ;
    tourdateEnd: Date;
    destination: string;
    type: string[];
    fellowtraveler: string;
    aboutme: string;
    user_id: number;
  }


