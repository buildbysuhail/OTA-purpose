import React, { useState } from 'react';
import { Edit } from 'lucide-react';

interface EditButtonProps {
  onClick: () => void;
}

export const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <button
      className={`absolute -top-0 -left-0 w-5 h-5 bg-white rounded-full 
                 flex items-center justify-center 
                 hover:bg-[#ebb0ad] focus:outline-none focus:ring-2 focus:ring-[#e0655e] focus:ring-opacity-75
                 transition-colors duration-200 ease-in-out
                 text-[#da514a] hover:text-[#ec5149]
                 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      aria-label="Edit"
    >
      <Edit size={14} />
    </button>
  );
};

