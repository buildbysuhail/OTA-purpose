import React from 'react';
import { useNavigate } from 'react-router-dom';

const ERPPreviousUrlButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <i onClick={handleClick} className="ri-arrow-left-line mr-2 cursor-pointer " style={{ fontSize: "23px" }}></i>
  );
};

export default ERPPreviousUrlButton;