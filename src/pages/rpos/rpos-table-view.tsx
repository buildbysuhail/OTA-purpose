import React from "react";

// Define interfaces for our data structures
interface TableItem {
  id: string;
  number: number | string;
  status: "blank" | "running" | "printed" | "paid" | "runningKOT";
  type: "AC" | "Dining";
  isOccupied?: boolean;
  orderCount?: number;
  customerCount?: number;
}

interface SectionData {
  id: string;
  name: string;
  tables: TableItem[];
}

interface SectionProps {
  title: string;
  items: string[];
}

interface RPosTableViewProps {
  data?: {
    acSection: SectionData[];
    diningSection: SectionData[];
  };
  onTableClick?: (table: TableItem) => void;
  onRefresh?: () => void;
  onAddTable?: () => void;
}

// Default data
const defaultData: Required<RPosTableViewProps>["data"] = {
  acSection: [],
  diningSection: [],
};

const RPosTableView: React.FC<RPosTableViewProps> = ({
  data = defaultData,
  onTableClick = () => {},
  onRefresh = () => {},
  onAddTable = () => {},
}) => {
  // Function to get status color
  const getStatusColor = (status: TableItem["status"]): string => {
    const colors = {
      blank: "bg-gray-200",
      running: "bg-[#18adf2]",
      printed: "bg-[#3ea20d]",
      paid: "bg-[#faf423]",
      runningKOT: "bg-[#fc961f]",
    };
    return colors[status] || colors.blank;
  };

  // Function to render a table item
  const renderTable = (table: TableItem) => {
    return (
      <div
        key={table.id}
        onClick={() => onTableClick(table)}
        className={`
          border border-gray-300 rounded-md p-4 cursor-pointer
          hover:bg-gray-50 transition-colors duration-200
          ${table.isOccupied ? getStatusColor(table.status) : "bg-white"}
        `}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="font-medium">{table.number}</span>
          {table.orderCount !== undefined && (
            <span className="text-sm text-gray-600">
              Orders: {table.orderCount}
            </span>
          )}
          {table.customerCount !== undefined && (
            <span className="text-sm text-gray-600">
              Guests: {table.customerCount}
            </span>
          )}
        </div>
      </div>
    );
  };

  // Function to render a section with empty state
  // const renderSection = (section: SectionData) => {
  //   return (
  //     <div key={section.id} className="mb-6">
  //       {section.tables.length > 0 ? (
  //         <div className="grid grid-cols-6 gap-4">
  //           {section.tables.map(renderTable)}
  //         </div>
  //       ) : (
  //         <div className="text-gray-500 text-center py-8 bg-gray-50 rounded-md">
  //           No tables available in this section
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  const Section: React.FC<SectionProps> = ({ title, items }) => (
    <div className="mb-4">
      <h2 className="text-[#d62e2e] font-medium text-sm mb-4">{title}</h2>
      <div className="flex space-x-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="w-[6rem] h-[6rem] border-dashed border-2 border-gray-400 flex items-center justify-center bg-gray-100 rounded-md"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
  const acItems = ["A C 1"]; // Dynamic AC data
  const diningItems = ["1", "2", "3", "4", "5", "6"]; // Dynamic Dining data

  

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b-2 pb-4">
        <h1 className="text-sm font-semibold">Table View</h1>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="flex items-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <i className="ri-refresh-line mr-2"></i>
          </button>
          <button className="flex items-center px-4 py-2 bg-[#d62e2e] text-white rounded-md hover:bg-[#d62e2e]/90">
            <i className="ri-bike-line mr-2"></i>
            Delivery
          </button>
          <button className="flex items-center px-4 py-2 bg-[#d62e2e] text-white rounded-md hover:bg-[#d62e2e]/90">
            <i className="ri-shopping-bag-line mr-2"></i>
            Pick Up
          </button>
          <button
            onClick={onAddTable}
            className="flex items-center px-4 py-2 bg-[#d62e2e] text-white rounded-md hover:bg-[#d62e2e]/90"
          >
            <i className="ri-add-line mr-2"></i>
            Add Table
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-6 justify-end">
        <button className="bg-gray-500 flex items-center gap-2 px-3 py-1 text-white rounded-md hover:bg-gray-600">
          <i className="ri-arrow-left-right-line"></i>
          <span>Move KOT / Items</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
          <span>Blank Table</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#18adf2] rounded-full"></div>
          <span>Running Table</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#3ea20d] rounded-full"></div>
          <span>Printed Table</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#faf423] rounded-full"></div>
          <span>Paid Table</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#fc961f] rounded-full"></div>
          <span>Running KOT Table</span>
        </div>
      </div>

      {/* AC Section - Always shown */}
      {/* <div className="mb-8">
        <h2 className="text-[#d62e2e] font-medium text-lg mb-4">AC</h2>
        {data.acSection.map(renderSection)}
        {data.acSection.length === 0 && (
          <div className="text-gray-500 text-center py-8 bg-gray-50 rounded-md">
            No AC sections available
          </div>
        )}
      </div> */}

      {/* Dining Section - Always shown */}
      {/* <div>
        <h2 className="text-[#d62e2e] font-medium text-lg mb-4">Dining</h2>
        {data.diningSection.map(renderSection)}
        {data.diningSection.length === 0 && (
          <div className="text-gray-500 text-center py-8 bg-gray-50 rounded-md">
            No dining sections available
          </div>
        )}
      </div> */}
      
      <div className="p-0">
        <Section title="AC" items={acItems} />
        <Section title="Dining" items={diningItems} />
      </div>
    </div>
  );
};

export default RPosTableView;
