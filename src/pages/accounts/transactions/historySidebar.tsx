import React from "react";
import ERPResizableSidebar from "../../../components/ERPComponents/erp-resizable-sidebar";

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  return (
    <ERPResizableSidebar isOpen={isOpen} setIsOpen={onClose} minWidth={400}>
      <div className="py-6 bg-gray-50 h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 px-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Transaction History
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Transaction Date */}
          <div className="bg-white p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Transaction Date
            </label>
            <p className="text-gray-800 font-semibold">
              {data?.transactionDate}
            </p>
          </div>
        </div>
      </div>
    </ERPResizableSidebar>
  );
};

export default HistorySidebar;
