import React, { useState, FormEvent} from "react";
import { useDialogContext } from "../context/dialogContext";
import { MdOutlineCancel } from "react-icons/md";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL, { config } from "../config/config";
import { Flip, toast } from "react-toastify";
import DOMPurify from "dompurify";


function ForgottenPasswordDialog() {
  const navigate = useNavigate();
  const { handleCloseDialog, handleLoginClick } = useDialogContext();
  const [backendError, setBackendError] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSend, setOtpSend] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Required!")
      .email("Invalid email format")
      .max(50, "Email must be at most 50 characters"),
  });

  const initialValues = {
    email: "",
  };



  async function handleSubmit(values: any, { resetForm }: any) {


    try {
      setIsloading(true);

      const response = await axios.post(`${BASE_URL}/sendotp`, values, config);

      if (response.status === 201) {
        setIsloading(false);
        setOtpSend(true);
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
      }
    } catch (err: any) {
      setBackendError(err.response.data.error);
      setIsloading(false);
      return;
    } finally {
      resetForm();
    }
  }

  async function onChangeOTP(event: React.ChangeEvent<HTMLInputElement>) {
    const sanitizedValue = DOMPurify.sanitize(event.target.value);
    setOtp(sanitizedValue);
  }

  async function handleSubmitOTP(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsloading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Set the withCredentials option to true
      };

      const values = { otp: otp };
      const response = await axios.post(
        `${BASE_URL}/verifyotp`,
        values,
        config
      );

      if (response.status === 201) {
        navigate("/resetpassword");
        handleCloseDialog();
      } else {
   
        handleCloseDialog();
        navigate("/");

        toast.error(response.data.message, {
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
      }
    } catch (err: any) {
      console.log(err);
      handleCloseDialog();
      navigate("/");

      toast.error(err.response.data.message, {
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
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto ">
      <div className="flex flex-wrap items-center  overflow-y-auto min-h-[500px] mt-20">
        <div className="relative bg-white p-2 rounded-lg flex items-center justify-center flex-col w-[350px] min-w-[350px] h-full max-h-[400px] md:w-[450px] md:h-[550px] ">
          <div className="absolute text-2xl top-2 right-2  text-gray-500 hover:text-gray-700 cursor-pointer">
            <MdOutlineCancel onClick={handleCloseDialog} />
          </div>
          <h1 className="mt-4 poppins-extrabold text-3xl mb-4">
            ZAPOMENUTÉ HESLO
          </h1>
          {!otpSend ? (
            <div>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {!isLoading ? (
                  <>
                    <Form className="flex flex-col space-y-4 items-center w-[350px] ">
                      <Field
                        name="email"
                        type="email"
                        id="email"
                        placeholder="zadej svůj email"
                        autoComplete="off"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                      />

                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500"
                      />
                      {backendError && (
                        <div className="text-red-500">{backendError}</div>
                      )}
                      <div className="flex justify-center mt-4">
                        <input
                          type="submit"
                          className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition duration-300 w-[120px]"
                          value="Odeslat"
                        />
                      </div>
                    </Form>
                  </>
                ) : (
                  <>
                    {" "}
                    <p>wait please</p>
                  </>
                )}
              </Formik>
            </div>
          ) : (
            <div>
              <form onSubmit={handleSubmitOTP}>
                <input
                  name="otp"
                  type="text"
                  id="otp"
                  placeholder="zadej kód"
                  autoComplete="off"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  onChange={onChangeOTP}
                />
                <div className="flex justify-center mt-4">
                  <input
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition duration-300 w-[120px]"
                    value="Odeslat kód"
                  />
                </div>
              </form>
            </div>
          )}
          <h5 className="pt-4">
            vzpomněl jsi si?
            <span
              className="text-gray-600 underline cursor-pointer"
              onClick={() => {
                handleCloseDialog();
                handleLoginClick();
              }}
            >
              {" "}
              Přihlásit se
            </span>
          </h5>
        </div>
      </div>
    </div>
  );
}

export default ForgottenPasswordDialog;
