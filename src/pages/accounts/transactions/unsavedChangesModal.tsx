import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStay: () => void;
  onLeave: () => void;
}

const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onClose,
  onStay,
  onLeave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="relative mb-auto w-full max-w-md bg-white rounded-lg shadow-xl p-6 transform transition-all duration-300 scale-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="bg-[#fef2f2] border-l-4 border-[#ef4444] p-4 rounded-md my-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-[#ef4444] mt-0.5 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-[#991b1b] mb-2">
                Unsaved Changes
              </h3>
              <p className="text-sm text-[#b91c1c]">
                You have unsaved changes that will be lost if you leave this page. 
                Are you sure you want to leave this page?
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onStay}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b82f6] transition-colors duration-200"
          >
            Stay on Page
          </button>
          <button
            onClick={onLeave}
            className="px-4 py-2 bg-[#ef4444] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[#dc2626] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ef4444] transition-colors duration-200"
          >
            Leave Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsavedChangesModal;