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
    firstName: string;
    date: Date;
    image: string;
    message: string 
    country:string;
    user_id: number | null;
    votes_id?: number | null;
  
  };

  export type TourMessageProps = {
    id: number;
    firstName: string;
    date: Date;
    image: string;
    message: string ;
    user_id: number | null;
    tour_id: number | null;
  
  };
  
  export interface ReplyProps {
    id: number;
    firstName?: string;
    date?: Date;
    image?: string;
    message: string | undefined;
    messageType?:number | null;
    message_id: number | null;
    user_id: number | null;
  }

  
export type VideoCard = {
    id: number;
    country: string;
    firstName: string;
    title: string;
    video: string;
    user_id: number | null;
  };
  
export type ChosenCountryData = {
    name: string;
    population: string;
    currency: string;
    language: string;
    capital: string;
    area: string;
    continent: string;
    flag:string;
  };


  export interface TourProps {
    id: number;
    firstName?: string;
    email?: string;
    image?: string;
    date: Date ;
    tourdate: Date ;
    tourdateEnd: Date;
    destination: string;
    tourtype: string[] ;
    fellowtraveler: string;
    aboutme: string;
    user_id: number | null;
  }


