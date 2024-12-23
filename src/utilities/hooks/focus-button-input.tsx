import { useState } from 'react';

const useERPState = () => {
  const [isInputFocus, setIsInputFocus] = useState(false);
  const [isButtonAFocus, setIsButtonAFocus] = useState(false);
  const [isButtonBFocus, setIsButtonBFocus] = useState(false);

  const handleButtonAClick = () => {
    setIsInputFocus(true);
    setIsButtonAFocus(true);
    setIsButtonBFocus(false);
  };

  const handleButtonBClick = () => {
    setIsInputFocus(false);
    setIsButtonAFocus(true);
    setIsButtonBFocus(true);
  };

  return {
    isInputFocus,
    isButtonAFocus,
    isButtonBFocus,
    handleButtonAClick,
    handleButtonBClick
  };
};

export default useERPState;