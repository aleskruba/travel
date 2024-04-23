import { useState } from 'react';
import { useDialogContext } from '../context/dialogContext';
import { MdOutlineCancel } from "react-icons/md";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function LoginDialog() {
    const { handleCloseDialog,handleSignUpClick } = useDialogContext();

    type Email = boolean;

    const [emailForm, setEmailForm] = useState<Email>(false);
    const [backendError, setBackendError] = useState('');

    const validationSchema = Yup.object({
      email: Yup.string()
        .required('Required!')
        .email('Invalid email format')
        .max(50, 'Email must be at most 50 characters'),
      password: Yup.string()
        .required('Required')
        .min(6, 'Password must be at least 6 characters')
        .max(50, 'Password must be at most 50 characters'),
    });
    
    const initialValues = {
      email: '',
      password: '',
    };

    const onSubmit = async (values:any) => {

    }
  return (

      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
        <div className='flex flex-wrap items-center  overflow-y-auto min-h-[500px] bg-red-500'>
        <div className="relative bg-white p-2 rounded-lg flex items-center justify-center flex-col w-[350px] min-w-[350px] h-full max-h-[400px] md:w-[450px] md:h-[550px] ">
           <div className='absolute text-2xl top-2 right-2  text-gray-500 hover:text-gray-700 cursor-pointer'><MdOutlineCancel onClick={handleCloseDialog} /></div> 
          <h1 className='mt-4 poppins-extrabold text-3xl'>Příhlášení</h1>
        {!emailForm ? <>
          <div className='mt-4 w-[80%] py-2  flex items-center justify-center bg-email rounded-lg cursor-pointer'
            onClick={() => setEmailForm(true)}
          >E-mail</div>
          <div className='mt-4 w-[80%] py-2  flex items-center justify-center bg-facebook rounded-lg cursor-pointer'>Facebook</div>
          <div className='mt-4 w-[80%] py-2  flex items-center justify-center bg-red-500 rounded-lg cursor-pointer'>Google</div>
          <h5>Ještě nemáš účet? 
              <span className='text-gray-600 underline cursor-pointer'
                onClick={() => {
                  handleCloseDialog();
                  handleSignUpClick();
                }}
              >Zaregistrovat se
              </span>  
            </h5>
            </>
            :
          <>
     <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      <Form className="flex flex-col space-y-4 items-center w-[350px] ">
        <Field name="email" type="email" id="email" placeholder="Email" autoComplete="off" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
        <ErrorMessage name="email" component="div" className="text-red-500" />

        <Field name="password" type="password" id="password" placeholder="Heslo" autoComplete="off" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
        <ErrorMessage name="password" component="div" className="text-red-500" />

        <div className="flex space-x-4">
          <input type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition duration-300 w-[120px]" value="Přihlásit" />
          <input type="button" onClick={() => setEmailForm(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md cursor-pointer hover:bg-gray-400 transition duration-300 w-[120px]" value="Zpět" />
        </div>
      </Form>
    </Formik>

          
          </>}
          <img className='flex mt-4 h-auto  min-h-[60px] w-full' src="lide.svg" alt="lide" />
        </div>

    </div>
    </div>
  );
}

export default LoginDialog;