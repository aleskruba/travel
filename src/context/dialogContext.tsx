import React, { createContext, useState,  ReactNode ,useContext} from 'react';


type Dialog = boolean;

interface DialogContextProps {
  showDialog: Dialog;
  showSignUpDialog:Dialog;
  setShowDialog: React.Dispatch<React.SetStateAction<Dialog>>;
  setShowSignUpDialog: React.Dispatch<React.SetStateAction<Dialog>>;
  handleLoginClick: () => void;
  handleCloseDialog: () => void;
  handleSignUpClick: () => void;
}

export const DialogContext = createContext<DialogContextProps>({
    showDialog: false,
    showSignUpDialog:false,
    setShowDialog: () => {},
    setShowSignUpDialog: () => {},
    handleLoginClick: () => {},
    handleSignUpClick: () => {},
    handleCloseDialog: () => {},
    
});

interface DialogProviderProps {
  children: ReactNode;
}

export const DialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
    const [showDialog, setShowDialog] = useState<Dialog>(false)
    const [showSignUpDialog, setShowSignUpDialog] = useState<Dialog>(false)

    const handleLoginClick = () => {
        setShowDialog(true);
      };
    
      const handleSignUpClick = () => {
        setShowSignUpDialog(true)
      }

      const handleCloseDialog = () => {
        setShowDialog(false);
        setShowSignUpDialog(false);
      };
  
      
  return (
    <DialogContext.Provider value={{ showDialog, setShowDialog ,showSignUpDialog, setShowSignUpDialog,handleLoginClick,handleSignUpClick,handleCloseDialog}}>
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