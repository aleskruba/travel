import React, { useState,ChangeEvent, useEffect,FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/authContext';
import { UserProps } from '../types';
import axios from 'axios';
import BASE_URL, { config } from '../config/config';
import { Flip, toast } from 'react-toastify';
import DOMPurify from 'dompurify';
import Resizer from "react-image-file-resizer";
import { FaEye ,FaEyeSlash } from "react-icons/fa";
import Modal from '../components/Modal';




interface NewPassword {
  password: string;
  confirmPassword: string;
}

function Profile() {

  const [updateProfile, setUpdateProfile] = useState(false);

  const [updatePassword, setUpdatePassword] = useState(false);
  const { user,setUser,updateUser, setUpdateUser} = useAuthContext();
  const [backendError, setBackendError] = useState('');
  const [backendImageError, setBackendImageError] = useState('');
  const [noChange, setNoChange] = useState('');
  const [newPassword, setNewPassword] = useState<NewPassword>({ password: '', confirmPassword: '' });
  const [showPassword,setShowPassword] = useState(false);

  useEffect(() => {
      setUpdateUser(user)

},[user])

  const showPasswordToggle = () => {
    setShowPassword(prev => !prev)
  }

  
  const onChangeEdit = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);
    setUpdateUser((prevUser: UserProps | null) => {
      if (!prevUser) return null; 
      return {
        ...prevUser,
        [name]: sanitizedValue
      };
    });
  };
  
  
  const onSubmitEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (updateUser?.username === user?.username && updateUser?.firstName === user?.firstName &&
        updateUser?.lastName === user?.lastName && updateUser?.email === user?.email) {
      
          setUpdateProfile(false);
          setNoChange('Neprovedena žádná změna ')
          setTimeout(() => {setNoChange('')},1000);
          return;
    }
  
    if (updateUser) {
      if(updateUser.username && (updateUser.username.trim().length < 4 || updateUser.username.trim().length > 15)) {
        setBackendError('Username musí mít 4 až 15 znaků F')
        return;
      } 
      if(updateUser.firstName && (updateUser.firstName.trim().length < 4 || updateUser.firstName.trim().length > 15)) {
        setBackendError('Jméno musí mít 4 až 15 znaků F')
        return;
      } 
      if(updateUser.lastName && (updateUser.lastName.trim().length < 4 || updateUser.lastName.trim().length > 15)) {
        setBackendError('Příjmení musí mít 4 až 15 znaků F')
      }
      if(updateUser.lastName && (updateUser.lastName.trim().length < 4 || updateUser.lastName.trim().length > 15)) {
        setBackendError('Email  musí mít 4 až 50 znaků F')
      }
      
      
   
      try {

        const response = await axios.put(`${BASE_URL}/updateprofile`, updateUser, config);
   
        if (response.status === 201) {
          setUser({ ...user, ...updateUser });
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

      const response = await axios.put(`${BASE_URL}/updatepassword`, newPassword, config);
    
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

  const resizeFile = (file:any) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });
  
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
 
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
           setUser((prevUser: UserProps | null) => ({
            ...prevUser!,
            image: event.target?.result as string
          }));
          
      };

      
      reader.readAsDataURL(selectedFile);
    
    }
    
 
    if (selectedFile) {
      // Check file size
      const maxSize = 150 * 1024; // Convert KB to bytes
      if (selectedFile.size > maxSize) {
        alert('File size exceeds the maximum limit of 150KB.');
        return;
      }
  
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert('Invalid file type. Only JPEG, JPG, or PNG images are allowed.');
        return;
      }
  
      try {
        // Resize the image
        const resizedFile = await resizeFile(selectedFile);
        if (resizedFile) {
          // Upload the resized image
          const response = await axios.put(`${BASE_URL}/uploadprofileimage`, { image: resizedFile }, config);
          user && setUser({...user,image:response.data.imageUrl})
        } else {
          setBackendImageError('Error resizing the image.')
          console.error('Error resizing the image.');
        }
      } catch (error) {
        console.error('Error resizing the image:', error);
        setBackendImageError('Error resizing the image.')
      }
    }
  };

  const [showFoto,setShowFoto] = useState(false)
 
  
  const showFotoFunction = () => {
    setShowFoto(true);
  
  };
  
  const closeModal = () => {
    setShowFoto(false);
  };
  

  return (
     <div className="flex  items-center h-full pb-4 flex-col pt-8 gap-6">
  
  <Link
  to={`/tvojeblogy`}
  className="p-6 rounded-lg shadow-md w-96 flex justify-center items-center font-extrabold bg-gradient-to-br  from-teal-600 to-indigo-600 text-white cursor-pointer hover:bg-opacity-90 hover:shadow-lg transition duration-300 ease-in-out"
>
  Tvoje Blogy
</Link>

<Link
  to={`/tvojespolucesty`}
  className="mt-4 p-6 rounded-lg shadow-md w-96 flex justify-center items-center font-extrabold bg-gradient-to-br from-green-500 to-teal-600 text-white cursor-pointer hover:bg-opacity-90 hover:shadow-lg transition duration-300 ease-in-out"
>
  Tvoje Spolucesty
</Link>

    <div className="bg-gray-100 dark:bg-gray-500 dark:text-gray-100 p-6 rounded-lg shadow-md w-96 ">
    <div className="col-span-full darK:bg-">
          <label htmlFor="photo" className="text-lg font-semibold mb-2">Foto</label>
          <div className="mt-2 flex items-center gap-x-3 w-full justify-center "  >
              <img src={user?.image ? user?.image : 'profile.png'}
                   alt="Profile" 
                   className="h-16 w-16 rounded-full object-cover text-gray-300" 
                   onClick={()=>!showFoto && setShowFoto(true)}/>
           
            <Modal show={showFoto} onClose={()=>setShowFoto(false)} imageUrl={user?.image} />
          
           
              <label htmlFor="imageInput" className="cursor-pointer">
              <span className="relative">
            <input
              type="file"
              id="imageInput"
              className="hidden"
              onChange={handleImageChange}
            />
            <span className=" bg-gray-200 dark:text-black hover:bg-gray-300 py-2 px-4 rounded-md cursor-pointer">
              Vyber novou fotku
            </span>
          </span>
        </label>


          </div>

          {backendImageError && <div className="text-red-800">{backendImageError} </div>}
        </div>

    </div>
     {!updatePassword &&  
      <div className="bg-gray-100 dark:bg-gray-500 dark:text-gray-100  p-6 rounded-lg shadow-md w-96">
          {noChange && <div className="text-red-800 text-center">{noChange} </div>}
        {!updateProfile ? (
          <div>
            <div className="text-lg font-semibold mb-2">Tvůj profil</div>
            <div className="mb-2">Username: {user?.username}</div>
            <div className="mb-2">Jméno: {user?.firstName}</div>
            <div className="mb-2">Příjmění: {user?.lastName}</div>
            <div>Email: {user?.email}</div>
          </div>
        ) : (
          <form className="space-y-4 dark:bg-gray-500 dark:text-gray-100 " onSubmit={onSubmitEdit}>
           <input
  type="text"
  placeholder="Username"
  name='username'
  className="w-full border rounded-md p-2 text-black"
  onChange={onChangeEdit}
  value={updateUser?.username ?? ''}
  maxLength={20}
/>
<input
  type="text"
  placeholder="Jméno"
  name='firstName'
  className="w-full border rounded-md p-2 text-black"
  onChange={onChangeEdit}
  value={updateUser?.firstName ?? ''}
  maxLength={20}
/>
<input
  type="text"
  placeholder="Příjmení"
  name='lastName'
  className="w-full border rounded-md p-2 text-black"
  onChange={onChangeEdit}
  value={updateUser?.lastName ?? ''}
  maxLength={20}
/>
<div style={{ position: 'relative' }}>
  <input
    type="email"
    placeholder="Email"
    name={updateUser?.googleEmail ? '' : 'email'}
    className={`w-full border rounded-md p-2 text-black ${updateUser?.googleEmail ? 'bg-gradient-to-r from-red-700 via-yellow-600 to-blue-200 text-white pointer-events-none' : ''}`}
    onChange={onChangeEdit}
    value={updateUser?.email ?? ''}
    maxLength={35}
    style={{ paddingRight: '40px' }} // Adjust padding to accommodate the image
  />
  {updateUser?.googleEmail && (
    <img
      src="google.png"
      alt="Google Logo"
      style={{
        
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '25px',
        height: '25px',
      }}
    />
  )}
</div>

{user?.googleEmail ? <span className='text-xs text-violet-700'>pokud jsi přihlášený s Googlem nemůžeš měnit email</span> :''}
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
            Aktualizovat Profil
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
      <div className="bg-gray-100 dark:bg-gray-500 dark:text-gray-100  p-6 rounded-lg shadow-md w-96">


        {!updatePassword ? (
          <div>
            <div className="text-lg font-semibold mb-2">Heslo</div>
          </div>
        ) : (
          <form className="space-y-4 relative" onSubmit={onSubmitPassword}>
                      <input type="text" name="username" style={{ display: 'none' }} aria-hidden="true" autoComplete="username" />
        <input
        type={showPassword ? "text" : "password"}
        name='password'
        placeholder="nové heslo"
        className="w-full border rounded-md p-2 text-black"
        onChange={onChangePassword}
        value={newPassword?.password ?? ''}
        maxLength={20}
        autoComplete="new-password"
          />

          <div className="absolute top-3 text-xl right-1  flex items-center pr-3"
                  onClick={()=>showPasswordToggle()}>
                {showPassword ?
                <FaEye />
                :
                <FaEyeSlash />

                }
              </div>
 

          <input
            type={showPassword ? "text" : "password"}
            name='confirmPassword'
            placeholder="opakuj heslo"
            className="w-full border rounded-md p-2 text-black "
            onChange={onChangePassword}
            value={newPassword?.confirmPassword ?? ''}
            maxLength={20}
            autoComplete="new-password"
          />
          <div className="absolute top-[72px] text-xl right-1  flex items-center pr-3"
                  onClick={()=>showPasswordToggle()}>
                {showPassword ?
                <FaEye />
                :
                <FaEyeSlash />

                }
              </div>
 

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
