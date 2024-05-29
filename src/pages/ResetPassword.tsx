import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useAuthContext } from "../context/authContext";
import axios from "axios";
import BASE_URL, { config } from "../config/config";
import { Flip, toast } from "react-toastify";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import { FaEye ,FaEyeSlash } from "react-icons/fa";

interface NewPassword {
  password: string;
  confirmPassword: string;
}
function ResetPassword() {
  const navigate = useNavigate();
  const { setUser } = useAuthContext();
  const [backendError, setBackendError] = useState("");
  const [newPassword, setNewPassword] = useState<NewPassword>({
    password: "",
    confirmPassword: "",
  });
  const [tokenChecked, setTokenChecked] = useState(false);
  const [showPassword,setShowPassword] = useState(false);

  const showPasswordToggle = () => {
    setShowPassword(prev => !prev)
  }

  

  const value = { test: "test" };
  useEffect(() => {
    async function checkToken() {
      try {
        const response = await axios.post(
          `${BASE_URL}/checkResetPasswordToken`,
          value,
          config
        );
    
        if (response.status === 201) {
          setTokenChecked(true);
        }
      } catch (error: any) {
        console.log(error.response.status);
        navigate("/");
      }
    }

    checkToken();
  }, [navigate]);
 
  if (!tokenChecked) {
    return <div>Loading...</div>; // Optionally, you can show a loading indicator
  }
  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);
    setNewPassword((prevPassword: NewPassword | undefined) => ({
      ...prevPassword!,
      [name]: sanitizedValue,
    }));
  };

  const onSubmitPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword.password !== newPassword.confirmPassword) {
      setBackendError("Hesla nejsou stejná");
      return;
    }

    try {
      const values = {
        password: newPassword.password,
        confirmPassword: newPassword.confirmPassword,
      };
      const response = await axios.put(
        `${BASE_URL}/resetpassword`,
        values,
        config
      );

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

   
        setBackendError("");
        navigate("/");
        setUser(response.data.user);
      }
    } catch (error: any) {
      console.error("Error submitting form:", error.response.data.error);
      setBackendError(error.response.data.error);
    }
  };
  return (
    <div className="flex  items-center flex-col pt-32 pb-32 gap-6">
      <div className="text-lg font-semibold mb-2">Zadej nové heslo</div>

      <form className="space-y-4 relative" onSubmit={onSubmitPassword}>
        <input
     type={showPassword ? "text" : "password"}
          name="password"
          placeholder="nové heslo"
          className="w-full border rounded-md p-2"
          onChange={onChangePassword}
          value={newPassword?.password ?? ""}
          maxLength={20}
          autoComplete="new-password"
        />
       <div className="absolute top-0 text-xl right-1  flex items-center pr-3"
                  onClick={()=>showPasswordToggle()}>
                {showPassword ?
                <FaEye />
                :
                <FaEyeSlash />

                }
              </div>
        <input
     type={showPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="opakuj heslo"
          className="w-full border rounded-md p-2"
          onChange={onChangePassword}
          value={newPassword?.confirmPassword ?? ""}
          maxLength={20}
          autoComplete="new-password"
        />
    <div className="absolute top-[55px] text-xl right-1  flex items-center pr-3"
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
    </div>
  );
}

export default ResetPassword;
