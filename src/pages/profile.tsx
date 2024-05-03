import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Profile() {
  const [updateProfile, setUpdateProfile] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);

  return (
    <div className="flex  items-center h-screen flex-col pt-8 gap-6">

    <Link to={`/tvojespolucesty`} className="p-6 rounded-lg shadow-md w-96 flex justify-center items-center font-extrabold bg-blue-500 text-white cursor-pointer">
        tvoje spolucesty
    </Link>

     {!updatePassword &&  
      <div className="bg-gray-100 p-6 rounded-lg shadow-md w-96">
        {!updateProfile ? (
          <div>
            <div className="text-lg font-semibold mb-2">Tvůj profil</div>
            <div className="mb-2">Username: ales78</div>
            <div className="mb-2">Jméno: Ales</div>
            <div className="mb-2">Příjmění: Kruba</div>
            <div>Email: ales@ales.cz</div>
          </div>
        ) : (
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full border rounded-md p-2"
            />
            <input
              type="text"
              placeholder="First Name"
              className="w-full border rounded-md p-2"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full border rounded-md p-2"
            />
            <input
              type="text"
              placeholder="Email"
              className="w-full border rounded-md p-2"
            />
            <input
              type="submit"
              value="Ulož"
              className="w-full bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 cursor-pointer"
            />
          </form>
        )}

        {!updateProfile ? (
          <button
            onClick={() => setUpdateProfile(true)}
            className="mt-4 w-full bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 cursor-pointer"
          >
            Akutualizovat Profil
          </button>
        ) : (
          <button
            onClick={() => setUpdateProfile(false)}
            className="mt-4 w-full bg-gray-500 text-white rounded-md p-2 hover:bg-gray-600 cursor-pointer"
          >
            Zrušit
          </button>
        )}
      </div>
        }

        {!updateProfile &&
      <div className="bg-gray-100 p-6 rounded-lg shadow-md w-96">
        {!updatePassword ? (
          <div>
            <div className="text-lg font-semibold mb-2">Heslo</div>
          </div>
        ) : (
          <form className="space-y-4">
            <input
              type="text"
              placeholder="nové heslo"
              className="w-full border rounded-md p-2"
            />
            <input
              type="text"
              placeholder="opakuj heslo"
              className="w-full border rounded-md p-2"
            />
               <input
              type="submit"
              value="Ulož"
              className="w-full bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 cursor-pointer"
            />
          </form>
        )}

    {!updatePassword ? (
          <button
            onClick={() => setUpdatePassword(true)}
            className="mt-4 w-full bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 cursor-pointer"
          >
            Změnit heslo
          </button>
        ) : (
          <button
            onClick={() => setUpdatePassword(false)}
            className="mt-4 w-full bg-gray-500 text-white rounded-md p-2 hover:bg-gray-600 cursor-pointer"
          >
            Zrušit
          </button>
        )}

        </div>
        }
    </div>
  );
}

export default Profile;
