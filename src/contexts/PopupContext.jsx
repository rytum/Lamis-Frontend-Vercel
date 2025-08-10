import React, { createContext, useContext, useState } from 'react';

const PopupContext = createContext();

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

export const PopupProvider = ({ children }) => {
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);

  return (
    <PopupContext.Provider value={{ isProfilePopupOpen, setIsProfilePopupOpen }}>
      {children}
    </PopupContext.Provider>
  );
}; 