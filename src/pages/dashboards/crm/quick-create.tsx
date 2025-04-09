import { useNavigate } from "react-router-dom";

const quickCreateItems = [
    { iconClass: "ti ti-user", label: "New Customer", path: "/customers/new" },
    { iconClass: "ti ti-file-invoice", label: "New Invoice", path: "/sales/new" },
    { iconClass: "ti ti-receipt-2", label: "New Bill", path: "/bills/new" },
    { iconClass: "ti ti-license", label: "New Expense", path: "/expenses/new" },
  ];

export default function QuickCreate() {
    const navigate = useNavigate();

    const handleClick = (path: string) => {
      navigate(path);
    };
    
  return (
    <div className="p-6 dark:bg-dark-bg bg-white rounded-lg shadow-sm max-w-3xl mx-auto border mb-2">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 border-b pb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-purple-500"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        Quick Create
      </h2>
      <div className="grid grid-cols-4 gap-3">
        {quickCreateItems.map((item, index) => (
          <button
            key={index}
            className="flex flex-col items-center p-4 dark:bg-dark-bg-card dark:hover:bg-dark-hover-black bg-gray-100 rounded-lg hover:bg-gray-300 transition-colors h-28"
            onClick={() => handleClick(item.path)}
          >
            <div className="flex-grow flex items-center justify-center">
              <i
                className={`${item.iconClass} w-6 h-6 text-gray-600 text-[23px]`}
              ></i>
            </div>
            <span className="text-xs font-medium text-gray-700 text-center mt-2">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
