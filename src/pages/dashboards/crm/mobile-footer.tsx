import { useState } from "react";

export default function MobileFooter() {
  const [activeLink, setActiveLink] = useState<string | null>(null);

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  // const getLinkClass = (link: string) =>
  //   activeLink === link ? "text-[#2B3E65]" : "text-gray hover:text-[#2B3E65]";

  // const getLinkClass = (link: string) =>
  //   activeLink === link
  //     ? "text-[#2B3E65]"
  //     : "text-gray-500 hover:text-[#2B3E65]";

  // const getLinkClass = (link: string) =>
  //   activeLink === link
  //     ? "text-[#2B3E65] bg-gray-200 rounded-full p-2 transition duration-300"
  //     : "text-gray-500 hover:text-[#2B3E65] hover:bg-gray-200 rounded-full p-2 transition duration-300";

  const getLinkClass = (link: string) =>
    activeLink === link
      ? "bg-gray-200 rounded-full p-2 transition duration-300"
      : "hover:bg-gray-200 rounded-full p-2 transition duration-300";

  const getIconAndLabelClass = (link: string) =>
    activeLink === link
      ? "text-[#2B3E65]" // Blue when active
      : "text-gray-500 hover:text-[#2B3E65]"; // Gray by default, blue on hover


  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <nav className="flex justify-around items-center h-16">
        <a
          href="/"
          onClick={() => handleLinkClick("/")}
          className={`flex flex-col items-center ${getLinkClass("/")}`}
        >
          <i className={`ti ti-home w-6 h-6 text-[23px] ${getIconAndLabelClass("/")}`}></i>
          <span className={`text-xs mt-1 ${getIconAndLabelClass("/")}`}>HOME</span>
        </a>
        <a
          href="/dashboard"
          onClick={() => handleLinkClick("/dashboard")}
          className={`flex flex-col items-center ${getLinkClass("/dashboard")}`}
        >
          <i className={`ti ti-chart-bar w-6 h-6 text-[23px] ${getIconAndLabelClass("/dashboard")}`}></i>
          <span className={`text-xs mt-1 ${getIconAndLabelClass("/dashboard")}`}>DASHBOARD</span>
        </a>
        <a href="/items" 
         onClick={() => handleLinkClick("/items")}
         className={`flex flex-col items-center ${getLinkClass("/items")}`}
        >
          <i className={`ti ti-package w-6 h-6 text-[23px] ${getIconAndLabelClass("/items")}`}></i>
          <span className={`text-xs mt-1 ${getIconAndLabelClass("/items")}`}>ITEMS</span>
        </a>
        <a href="/menu" 
         onClick={() => handleLinkClick("/menu")}
         className={`flex flex-col items-center ${getLinkClass("/items")}`}
        >
          <i className={`ti ti-menu-2 w-6 h-6 text-[23px] ${getIconAndLabelClass("/menu")}`}></i>
          <span className={`text-xs mt-1 ${getIconAndLabelClass("/menu")}`}>MENU</span>
        </a>
        {/* <button className="flex flex-col items-center text-gray-600">
          <i className="ti ti-menu-2  w-6 h-6 text-[23px]"></i>
          <span className="text-xs mt-1">MENU</span>
        </button> */}
      </nav>
    </footer>
  );
}
