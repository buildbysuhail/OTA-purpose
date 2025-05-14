import React from "react";

interface ERPTabProps {
  tabs?: Array<string>;
  activeTab?: number;
  onClickTabAt?: (index: number) => void;
  children?: React.ReactNode;
  className?: string;
}

const ERPTab = ({ tabs, activeTab = 0, onClickTabAt, children }: ERPTabProps) => {
  const tabsContainerRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tabsContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - tabsContainerRef.current.offsetLeft);
    setScrollLeft(tabsContainerRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !tabsContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabsContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    tabsContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="flex flex-col">
      <div
        ref={tabsContainerRef}
        className={`flex overflow-x-auto no-scrollbar border text-center rounded-md ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {
          tabs?.map((tab, index) => (
            <div
              key={`tab-${index}`}
              onClick={() => onClickTabAt?.(index)}
              className={`flex-none px-6 py-3 text-md font-bold cursor-pointer whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${activeTab === index
                ? "dark:bg-dark-bg-card bg-white text-[#2563eb] shadow-xl border-b-4 border-[#2563eb]"
                : "dark:bg-dark-bg-card bg-gray-100 text-gray-600 hover:text-gray-800 hover:bg-gray-200 hover:shadow-md"
                }`}
            >
              {tab}
            </div>
          ))
        }

      </div>
      <div className="mt-4">
        {children && Array.isArray(children) && children[activeTab]}
      </div>
    </div>
  );
};

export default ERPTab;
