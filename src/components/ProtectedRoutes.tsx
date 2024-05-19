import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useDialogContext } from '../context/dialogContext';
import { useAuthContext } from '../context/authContext';


const ProtectedRoutes = () => {
  const { user } = useAuthContext();

  
  const SendToLogin = () => {
    const { handleLoginClick,handleCloseDialog } = useDialogContext();
    if (user) handleCloseDialog();

    const navigate = useNavigate();

    useEffect(() => {
      //handleLoginClick();
      navigate('/');
   //   handleCloseDialog();
    }, [handleLoginClick, navigate,user]);

    return null;
  };

  return user ? <Outlet /> : <SendToLogin />;
};

export default ProtectedRoutes;
