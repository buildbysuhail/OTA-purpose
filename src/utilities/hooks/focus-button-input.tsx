import { useState, useRef } from 'react';

const useERPState = () => {
  const [isInputFocus, setIsInputFocus] = useState(false);
  const [isComboboxFocus, setIsComboboxFocus] = useState(false);
  const [isButtonAFocus, setIsButtonAFocus] = useState(false);
  const [isButtonBFocus, setIsButtonBFocus] = useState(false);
  const [isButtonCFocus, setIsButtonCFocus] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const buttonARef = useRef<HTMLButtonElement>(null);
  const comboboxRef = useRef<HTMLSelectElement>(null);

  const handleButtonAClick = () => {
    setIsInputFocus(true);
    setIsButtonAFocus(true);
    setIsButtonBFocus(false);
    setIsComboboxFocus(false);
    setIsButtonCFocus(false);
    inputRef.current?.focus();
  };

  const handleButtonBClick = () => {
    setIsInputFocus(false);
    setIsButtonAFocus(true);
    setIsButtonBFocus(true);
    setIsComboboxFocus(false);
    setIsButtonCFocus(false);
    buttonARef.current?.focus();
  };

  const handleButtonCClick = () => {
    setIsInputFocus(false);
    setIsButtonAFocus(false);
    setIsButtonBFocus(false);
    setIsComboboxFocus(true);
    setIsButtonCFocus(true);
    comboboxRef.current?.focus();
  };

  return {
    isInputFocus,
    isButtonAFocus,
    isButtonBFocus,
    isComboboxFocus,
    isButtonCFocus,
    handleButtonAClick,
    handleButtonBClick,
    handleButtonCClick,
    inputRef,
    buttonARef,
    comboboxRef
  };
};

export default useERPState;

