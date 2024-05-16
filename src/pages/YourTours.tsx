import { useState } from "react";
import { useTourContext } from "../context/tourContext";
import YourTour from "../components/spolucesty/YourTour";
import { TourProps } from "../types";
import { useNavigate } from "react-router-dom";
import { BsArrowReturnLeft } from "react-icons/bs";

function YourTours() {
  const { tours } = useTourContext();
  const [isLoading] = useState(false);

  const yourTour: TourProps = tours[5];

  const navigate = useNavigate();

  return (
    <div className={`flex flex-col items-center pt-4 pb-6`}>
      <div
        onClick={() => navigate("/profile")}
        className="flex items-center text-2xl pb-6 font-semibold italic justify-center dark:text-white cursor-pointer hover:dark:text-gray-300 hover:text-gray-500"
      >
        {" "}
        <BsArrowReturnLeft />
        <span className="ml-4">ZPĚT</span>
      </div>

      {!isLoading ? <YourTour yourTour={yourTour} /> : <p>Loading...</p>}
    </div>
  );
}

export default YourTours;
