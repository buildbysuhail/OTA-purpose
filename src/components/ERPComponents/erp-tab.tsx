import { useState } from "react";

interface ERPTabProps {
  tabs?: Array<string>;
  activeTab?: number;
  onClickTabAt?: (index: number) => void;
  children?: React.ReactNode;
}

const ERPTab = ({ tabs, activeTab = 0, onClickTabAt, children }: ERPTabProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex border text-center rounded-md overflow-hidden">
        {tabs?.map((tab, index) => (
          <div
            key={`tab-${index}`}
            onClick={() => onClickTabAt?.(index)}
            className={`flex-1 px-4 py-2 text-sm cursor-pointer ${activeTab === index ? "bg-gray-100 text-accent" : "text-gray-800/80 bg-gray-200"}`}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="mt-4">
        {children && Array.isArray(children) && children[activeTab]}
      </div>
    </div>
  );
};

export default ERPTab;
