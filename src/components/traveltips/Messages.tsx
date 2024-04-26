import React, { useState,useEffect ,FormEvent } from 'react';
import ReactPaginate from 'react-paginate';
import DOMPurify from 'dompurify';
import axios from 'axios';
import Message from './Message';


type MessageProps = {
  id: number;
  email: string;
  fname: string;
  date: Date;
  img: string;
  message: string;
  user_id: number;
};

interface ReplyProps {
  id: number;
  fname: string;
  date: Date;
  img: string;
  message: string; 
  message_id: number;
  user_id: number;
}

const ITEMS_PER_PAGE = 5;

function Messages() {

  const [currentPage, setCurrentPage] = useState(0);
  const [replies, setReplies] = useState<ReplyProps[]>([]);
  const [message, setMessage] = useState<MessageProps>({
    id: 0,
    email: '',
    fname: '',
    date: new Date(),
    img: '',
    message: '',
    user_id: 4
  });

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  useEffect(() => {
 
      setIsLoading(true);
 
      const fetchData = async () => {
        const resultMessages = await axios.get('messages.json');
        const resultReplies = await axios.get('replies.json');
        setMessages(resultMessages.data.messages);
        setReplies(resultReplies.data.replies);

          setIsLoading(false)
                   
      };

      fetchData();
  
  }, []);
  
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedMessage = DOMPurify.sanitize(event.target.value);
    setMessage({...message,[event.target.name]:sanitizedMessage});
  };


  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const newMessage = {
      id: messages.length + 1, // Generate a unique ID
      email: 'new@example.com',
      fname: 'ales',
      date: new Date(),
      img: 'man.png',
      message: message.message,
      user_id:4
    };
  
    setMessages([newMessage, ...messages]); // Prepend the new message
  
    // Reset the message input
    setMessage({
      id: 0,
      email: '',
      fname: '',
      date: new Date(),
      img: '',
      message: '',
      user_id: 4,
    });
  };
  


  const handlePageChange = ({ selected }: any) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = (currentPage + 1) * ITEMS_PER_PAGE;

  const currentMessages = messages?.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col  px-2 md:px-4 ">


      <form onSubmit={onSubmit}>
        <div className="flex justify-between items-center dark:text-lighTextColor gap-4 bg-gray-100 px-2 py-2 md:rounded-lg shadow-md mt-2">
          <div className="flex items-center gap-2"> 
            <div className="w-14 h-14 overflow-hidden rounded-full">
              <img src="man.png" alt="Profile" className="w-full h-full object-cover" />
            </div>
           </div>
          <div className="flex-1 hidden md:flex">
            <textarea
              name="message"
              value={message.message}
              onChange={handleChange}
              className="w-full py-2 px-4 bg-gray-200 rounded-lg text-black focus:outline-none focus:ring focus:border-blue-500 resize-none"
              placeholder="Share your opinion (max 500 characters)"
            />
          </div>
          <div>
            <button type="submit" className="py-2 px-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-700">Odešli</button>
          </div>
        </div>

        <div className="md:hidden">
          <textarea
            name="message"
            value={message.message}
            onChange={handleChange}
            className="w-full py-2 px-4 bg-gray-200 text-black focus:outline-none focus:ring focus:border-blue-500 resize-none"
            placeholder="Share your opinion (max 500 characters)"
          />
        </div>
      </form>


      <div className='flex flex-col mt-4 gap-1'>
      <div className='flex flex-col mt-4 gap-1'>
      {
        !isLoading ? (
          currentMessages
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Reverse sorting order
            .map((message, idx) => (
              <Message key={idx} messages={messages} message={message} replies={replies} setMessages={setMessages} setReplies={setReplies} />
            ))
        ) : (
          <>moment prosím</>
        )
      }

      </div>

      </div>

      { messages.length &&
      <ReactPaginate
        previousLabel={'<<'}
        nextLabel={'>>'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={Math.ceil(messages.length / ITEMS_PER_PAGE)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={'pagination'}
        activeClassName={'active'}
        previousClassName={'pagination-previous'}
        nextClassName={'pagination-next'}
        disabledClassName={'pagination-disabled'}
      />
    }
   
    </div>
  );
}

export default Messages;
