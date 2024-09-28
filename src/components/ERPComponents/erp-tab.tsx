import { useState } from "react";

interface ERPTabProps {
  tabs?: Array<string>;
  activeTab?: number;
  onClickTabAt?: (index: number) => void;
}

const ERPTab = ({ tabs, activeTab, onClickTabAt }: ERPTabProps) => {
  return (
    <div className="flex border text-center rounded-md overflow-hidden">
      {tabs?.map((tab, index) => (
        <div
          key={`tab-${index}`}
          onClick={() => onClickTabAt?.(index)}
          className={`flex-1  px-4 py-2 text-sm cursor-pointer ${activeTab === index ? "bg-gray-100 text-accent" : "text-gray-800/80 bg-gray-200"}`}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};

export default ERPTab;
