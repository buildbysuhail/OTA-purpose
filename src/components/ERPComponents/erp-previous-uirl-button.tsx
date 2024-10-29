import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ERPPreviousUrlButtonProps {
  size?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ERPPreviousUrlButton: React.FC<ERPPreviousUrlButtonProps> = ({ 
  size = "23px", 
  className = "", 
  style = {} 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <i 
      onClick={handleClick} 
      className={`ri-arrow-left-line cursor-pointer ${className}`}
      style={{ 
        fontSize: size,
        marginRight: "0.5rem",
        ...style 
      }}
    />
  );
};

export default ERPPreviousUrlButton;