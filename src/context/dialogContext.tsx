import React, { createContext, useState,  ReactNode ,useContext} from 'react';

type Dialog = boolean;

interface DialogContextProps {
  showDialog: Dialog;
  showSignUpDialog:Dialog;
  showForgottenPasswordDialog:Dialog;
  setShowDialog: React.Dispatch<React.SetStateAction<Dialog>>;
  setShowSignUpDialog: React.Dispatch<React.SetStateAction<Dialog>>;
  setShowForgottenPasswordDialog: React.Dispatch<React.SetStateAction<Dialog>>;
  handleLoginClick: () => void;
  handleCloseDialog: () => void;
  handleSignUpClick: () => void;
  handleForgottenPasswordClick: () => void;
}

export const DialogContext = createContext<DialogContextProps>({
    showDialog: false,
    showSignUpDialog:false,
    showForgottenPasswordDialog:false,
    setShowDialog: () => {},
    setShowSignUpDialog: () => {},
    setShowForgottenPasswordDialog: () => {},
    handleLoginClick: () => {},
    handleSignUpClick: () => {},
    handleCloseDialog: () => {},
    handleForgottenPasswordClick: () => {}
    
});

interface DialogProviderProps {
  children: ReactNode;
}

export const DialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
    const [showDialog, setShowDialog] = useState<Dialog>(false)
    const [showSignUpDialog, setShowSignUpDialog] = useState<Dialog>(false)
    const [showForgottenPasswordDialog, setShowForgottenPasswordDialog] = useState<Dialog>(false)
 
    const handleLoginClick = () => {
        setShowDialog(true);
      };
    
      const handleSignUpClick = () => {
        setShowSignUpDialog(true)
      }

      const handleForgottenPasswordClick = () => {
        setShowForgottenPasswordDialog(true)
      }

      const handleCloseDialog = () => {
        setShowDialog(false);
        setShowSignUpDialog(false);
        setShowForgottenPasswordDialog(false);
      };
  
      
  return (
    <DialogContext.Provider value={{ showDialog, setShowDialog ,showSignUpDialog,showForgottenPasswordDialog, setShowForgottenPasswordDialog,setShowSignUpDialog,handleLoginClick,handleSignUpClick,handleCloseDialog,handleForgottenPasswordClick}}>
      {children}
    </DialogContext.Provider>
  );
};


export function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) {
      throw new Error("useDialogContext must be used within a DialogContextProvider");
  }
  return context;
}