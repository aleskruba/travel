import { useState } from 'react';
import { useDialogContext } from '../context/dialogContext';
import { useAuthContext } from '../context/authContext';
import { MdOutlineCancel } from "react-icons/md";
import { Formik ,Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BASE_URL, { config } from '../config/config';
import { Flip, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';

function SignUpDialog() {
  const { handleCloseDialog,handleLoginClick } = useDialogContext();
  const { setUser} = useAuthContext();
  const navigate = useNavigate()

  type Email = boolean;

  const [emailForm, setEmailForm] = useState<Email>(false);
  const [backendError, setBackendError] = useState('');
  const [backendErrorGoogle, setBackendErrorGoogle] = useState('');

  const validationSchema = Yup.object({ 
    email: Yup.string()
      .required('Required!')
      .email('Invalid email format')
      .max(50, 'Email must be at most 50 characters'),
    password: Yup.string()
      .required('Required')
      .min(6, 'Password must be at least 6 characters')
      .max(50, 'Password must be at most 50 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/,
        'Password must contain at least one lowercase letter, one uppercase letter, and one digit'
      ),
     
      confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Required')
  });
  
  
  const initialValues = {
    email:'',
    password:'',
    confirmPassword:''
  }

  async function handleSubmit(values: any, { resetForm }: any) {
    try {

       const response = await axios.post(`${BASE_URL}/signup`, values,config);

      if (response.status === 201) {
        toast.success(response.data.message,  {
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
        setUser(response.data.user);
        navigate('/');
        handleCloseDialog()
      }
    } catch (error: any) {
      console.error('Error submitting form:', error.response.data);
      setBackendError(error.response.data)
    } finally {

      resetForm();
    }
  }
/*   const handleGoogleLoginSuccess = async (credentialResponse:any) => {
    try {
        if (credentialResponse.credential) {
            const decoded: any = jwtDecode(credentialResponse.credential);
          console.log(decoded)
            // Send Google authentication data to backend
            const config = {
              headers: {
                'Content-Type': 'application/json',
              },
              withCredentials: true, // Set the withCredentials option to true
            };

            const values = {
              email: decoded.email,
              name: decoded.given_name,
              profilePicture: decoded.picture,

          }
     
            const response = await axios.post(`${BASE_URL}/googleauthSignUp`,values,config);
            if (response.status === 201) {
              toast.success(response.data.message,  {
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
              setUser(response.data.user);
              navigate('/');
              handleCloseDialog()
            }
   
        } else {
            console.log('Credential not found in response');
            // Handle the case where credentialResponse.credential is undefined
        }
      } catch (error: any) { 

        console.error(error.response.data.error);
        setBackendErrorGoogle('Uživatel je již zaregistrován')
      }
}; */


const signUp = useGoogleLogin({
  onSuccess: async (res) =>{
    try {
      const data = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers:{
            Authorization: `Bearer ${res.access_token}`,  
          },
         }
      )

      const values = {
        email: data.data.email,
        name: data.data.given_name,
        profilePicture: data.data.picture,

    }

      const response = await axios.post(`${BASE_URL}/googleauthSignUp`,values,config);
      if (response.status === 201) {
        toast.success(response.data.message,  {
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
      
        setUser(response.data.user);
        navigate('/');
        handleCloseDialog()
      }

    }
    catch (error: any){
      console.log(error)
      console.error(error.response.data.error);
      setBackendErrorGoogle(error.response.data.error)
    
    }
  }
   }
  
  );

  return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
        <div className='flex flex-wrap items-center  overflow-y-auto min-h-[500px] mt-20'>
        <div className="relative bg-white p-2 rounded-lg flex items-center justify-center flex-col w-[350px] min-w-[350px] h-full max-h-[400px]  md:w-[450px] md:h-[550px]">
           <div className='absolute text-2xl top-2 right-2  text-gray-500 hover:text-gray-700 cursor-pointer'><MdOutlineCancel onClick={handleCloseDialog} /></div> 
          <h1 className='mt-4 poppins-extrabold text-3xl'>Registrace</h1>
        {!emailForm ? <>
          <div className='mt-4 w-[80%] py-2  flex items-center justify-center bg-email rounded-lg cursor-pointer'
            onClick={() => {setBackendError('');setBackendErrorGoogle('');setEmailForm(true)}}
          >E-mail</div>
        {/*   <div className='mt-4 w-[80%] py-2  flex items-center justify-center bg-facebook rounded-lg cursor-pointer'>Facebook</div> */}
        {/* <div className='mt-4 w-[80%] bg-gray-200  flex items-center justify-center rounded-lg border cursor-pointer'>
          <GoogleLogin
      
                        onSuccess={handleGoogleLoginSuccess}
                        onError={() => {
                            console.log('Login Failed');
                    
                        }}
                    />
            </div> */}
          <div className='mt-4 w-[80%]  bg-gray-200 flex items-center justify-center rounded-lg cursor-pointer'>
            <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2  rounded"
                onClick={() => signUp()}
                style={{ width: '100%' }}
              >
                Zaregistrovat s Google 🚀
              </button>

              </div>
          <h5 className='pt-4'>Už máš účet? 
              <span className='text-gray-600 underline cursor-pointer'
                onClick={() => {
                  handleCloseDialog();
                  handleLoginClick();
                }}
              >Přihlásit se
              </span>  
            </h5>
            </>
            :
          <>
         
  <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
  <Form className="flex flex-col space-y-4 items-center w-[350px] ">
    <Field name="email" type="email" id="email" placeholder="Email" autoComplete="off" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
    <ErrorMessage name="email" component="div" className="text-red-500" />
    

    <Field name="password" type="password" id="password" placeholder="Heslo" autoComplete="off" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
    <ErrorMessage name="password" component="div" className="text-red-500" />
 

    <Field name="confirmPassword" type="password" id="confirmPassword" placeholder="Zopakuj heslo" autoComplete="off" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
    <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />
    {backendError && <div className="text-red-500">{backendError}</div>}

    <div className="flex space-x-4">
      <input type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition duration-300 w-[120px]" value="Registrovat" />
      <input type="button" onClick={() => {setEmailForm(false);setBackendError('')}} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md cursor-pointer hover:bg-gray-400 transition duration-300 w-[120px]" value="Zpět" />
    </div>
  </Form>
</Formik>

          
          </>}
          {backendErrorGoogle && <div className="text-red-500">{backendErrorGoogle}</div>}
          <img className='flex mt-4 h-auto  min-h-[60px] w-full' src="lide.svg" alt="lide" />
        </div>

    </div>
    </div>
  );
}

export default SignUpDialog;


/* function resetForm(arg0: { values: { email: string; password: string; confirmPassword: string; }; }) {
  throw new Error('Function not implemented.');
} */

