import { useState } from "react";

interface AccDropdownProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title: string;
  content: React.ReactNode;
}

const AccDropdownPanel = ({ isOpen, setIsOpen, title, content }: AccDropdownProps) => {
  return (
    <>
      {isOpen && (
        // <div className="absolute top-full left-0 w-auto bg-white shadow-lg rounded-md mt-1 z-50">
        <div className="absolute top-full w-fit bg-white shadow-lg rounded-md mt-1 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h6 className="font-semibold text-gray-800">{title}</h6>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="ri-close-line text-[25px]"></i>
            </button>
          </div>

          {/* Content */}
          <div className="p-4">{content}</div>
        </div>
      )}
    </>
  );
};

export default AccDropdownPanel;
