import React, { useState,ChangeEvent, useEffect,FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/authContext';
import { UserProps } from '../types';
import axios from 'axios';
import BASE_URL from '../config/config';
import { Flip, toast } from 'react-toastify';
import DOMPurify from 'dompurify';

interface NewPassword {
  password: string;
  confirmPassword: string;
}

function Profile() {
  const [updateProfile, setUpdateProfile] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);
  const { user,setUser} = useAuthContext();
  const [backendError, setBackendError] = useState('');

  const [updateUser, setUpdateUser] = useState<UserProps>();
  const [newPassword, setNewPassword] = useState<NewPassword>({ password: '', confirmPassword: '' });


  useEffect(() => {
    user && setUpdateUser(user)
  },[user])


  const onChangeEdit = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);
    setUpdateUser((prevUser: UserProps | undefined) => ({
      ...prevUser!,
      [name]: sanitizedValue
    }));
  };
  
  
  const onSubmitEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (updateUser) {
      setUser({ ...user, ...updateUser });
  
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Set the withCredentials option to true
        };
        const response = await axios.put(`${BASE_URL}/updateprofile`, updateUser, config);
        console.log(response)
        if (response.status === 201) {
          toast.success(response.data.message, {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Flip,
          });
          setUpdateProfile(false);
        }
      } catch (error:any) {
        console.error('Error submitting form:', error.response.data.error);
        setBackendError(error.response.data.error)

      }
    }
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);
    setNewPassword((prevPassword: NewPassword | undefined) => ({
      ...prevPassword!,
      [name]: sanitizedValue
    }));
  };
  

  const onSubmitPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword.password !== newPassword.confirmPassword) {
     setBackendError('Hesla nejsou stejná') 
      return;
    } 

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Set the withCredentials option to true
      };
      const response = await axios.put(`${BASE_URL}/updatepassword`, newPassword, config);
      console.log(response)
      if (response.status === 201) {
        toast.success(response.data.message, {
          position: "top-left",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Flip,
        });
      
        setUpdatePassword(false)  
        setBackendError('')


      }
    } catch (error: any) {
      console.error('Error submitting form:', error.response.data.error);
      setBackendError(error.response.data.error)
    }

  }
  

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
            <div className="mb-2">Username: {user?.username}</div>
            <div className="mb-2">Jméno: {user?.firstName}</div>
            <div className="mb-2">Příjmění: {user?.lastName}</div>
            <div>Email: {user?.email}</div>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={onSubmitEdit}>
           <input
  type="text"
  placeholder="Username"
  name='username'
  className="w-full border rounded-md p-2"
  onChange={onChangeEdit}
  value={updateUser?.username ?? ''}
  maxLength={20}
/>
<input
  type="text"
  placeholder="First Name"
  name='firstName'
  className="w-full border rounded-md p-2"
  onChange={onChangeEdit}
  value={updateUser?.firstName ?? ''}
  maxLength={20}
/>
<input
  type="text"
  placeholder="Last Name"
  name='lastName'
  className="w-full border rounded-md p-2"
  onChange={onChangeEdit}
  value={updateUser?.lastName ?? ''}
  maxLength={20}
/>
<input
  type="text"
  placeholder="Email"
  name='email'
  className="w-full border rounded-md p-2"
  onChange={onChangeEdit}
  value={updateUser?.email ?? ''}
  maxLength={35}
/>

{backendError && <div className="text-red-800">{backendError} </div>}
            <input
              type="submit"
              value="Ulož"
              className="w-full bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 cursor-pointer"
            />
          </form>
        )}

        {!updateProfile ? (
          <button
            onClick={() => {setUpdateProfile(true);setBackendError('')}}
            className="mt-4 w-full bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 cursor-pointer"
          >
            Akutualizovat Profil
          </button>
        ) : (
          <button
            onClick={() => {setUpdateProfile(false);setBackendError('')}}
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
          <form className="space-y-4" onSubmit={onSubmitPassword}>
            <input
              type="password"
              name='password'
              placeholder="nové heslo"
              className="w-full border rounded-md p-2"
              onChange={onChangePassword}
              value={newPassword?.password ?? ''}
              maxLength={20}
            />
            <input
              type="password"
              name='confirmPassword'
              placeholder="opakuj heslo"
              className="w-full border rounded-md p-2"
              onChange={onChangePassword}
              value={newPassword?.confirmPassword ?? ''}
              maxLength={20}
            />

            {backendError && <div className="text-red-800">{backendError} </div>}
               <input
              type="submit"
              value="Ulož"
              className="w-full bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 cursor-pointer"
            />
          </form>
        )}

    {!updatePassword ? (
          <button
            onClick={() => {setUpdatePassword(true);setBackendError('')}}
            className="mt-4 w-full bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 cursor-pointer"
          >
            Změnit heslo
          </button>
        ) : (
          <button
            onClick={() => {setUpdatePassword(false);setBackendError('');setNewPassword({password:'',confirmPassword:''}) }}
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
