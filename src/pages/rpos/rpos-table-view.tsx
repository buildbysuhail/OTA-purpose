import { t } from "i18next";
import React from "react";
import { Link } from "react-router-dom";

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
  // onRefresh = () => {},
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

  const handleRefresh = () => {
    window.location.reload();
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

  const Section: React.FC<SectionProps> = ({ title, items }) => (
    <div className="mb-4">
      <h2 className="text-[#d62e2e] font-medium text-sm mb-4">{title}</h2>
      <div className="flex space-x-2 !rtl:ml-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="w-[6rem] h-[6rem] border-dashed border-2 border-gray-400 flex items-center justify-center bg-gray-100 rounded-md rtl:ml-2"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
  // Dynamic
  const acItems = ["A C 1"];
  const diningItems = ["1", "2", "3", "4", "5", "6"];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b-2 pb-4">
        <h1 className="text-sm font-semibold">{t("table_view")}</h1>
        <div className="flex gap-2">
          <button
            // onClick={onRefresh}
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <i className="ri-refresh-line mr-2 rtl:ml-2"></i>
          </button>
          <button className="flex items-center px-4 py-2 bg-[#d62e2e] text-white rounded-md hover:bg-[#d62e2e]/90 ">
            <i className="ri-bike-line mr-2 rtl:ml-2"></i>
            {t("delivery")}
          </button>
          <button className="flex items-center px-4 py-2 bg-[#d62e2e] text-white rounded-md hover:bg-[#d62e2e]/90 ">
            <i className="ri-shopping-bag-line mr-2 rtl:ml-2"></i>
            {t("pick_up")}
          </button>
          <button
            onClick={onAddTable}
            className="flex items-center px-4 py-2 bg-[#d62e2e] text-white rounded-md hover:bg-[#d62e2e]/90 "
          >
            <i className="ri-add-line mr-2 rtl:ml-2"></i>
            {t("add_table")}
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-6 justify-end">
        <button className="bg-gray-500 flex items-center gap-2 px-3 py-1 text-white rounded-md hover:bg-gray-600">
          <i className="ri-arrow-left-right-line"></i>
          <span>{t("move_kot_items")}</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
          <span>{t("blank_table")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#18adf2] rounded-full"></div>
          <span>{t("running_table")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#3ea20d] rounded-full"></div>
          <span>{t("printed_table")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#faf423] rounded-full"></div>
          <span>{t("paid_table")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#fc961f] rounded-full"></div>
          <span>{t("running_kot_table")}</span>
        </div>
      </div>

      <div className="p-0">
        <Link to="/rpos">
          <Section title={t("ac")} items={acItems} />
        </Link>
        <Link to="/rpos">
          <Section title={t("dining")} items={diningItems} />
        </Link>
      </div>
    </div>
  );
};

export default RPosTableView;
