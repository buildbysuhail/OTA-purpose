import {
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ERPToast from "../../../../components/ERPComponents/erp-toast";
import { SettingsMenuItems } from "../../../../components/common/sidebar/sidemenu/settings";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../../redux/store";
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";

interface MenuItem {
  title: string;
  path?: string;
  children?: MenuItem[];
}

interface SearchResultBarProps {
  isOpen: boolean;
  searchResults: MenuItem[];
  selectedIndex: number;
  onItemClick: (item: MenuItem) => void;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useState<string>("");
  const [open, setIsOpen] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<MenuItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const handleNavigation = () => {
    navigate("/");
  };

  useEffect(() => {
    if (search) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [search]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearch(searchTerm);

    let AllRoutes: MenuItem[] = [];

    const extractRoutes = (menuItems: MenuItem[]) => {
      menuItems.forEach((item) => {
        if (item.children) {
          extractRoutes(item.children);
        } else if (item.path) {
          AllRoutes.push(item);
        }
      });
    };

    extractRoutes(SettingsMenuItems);

    let searchResult = AllRoutes.filter((item) =>
      item.title.toLowerCase().includes(searchTerm)
    );

    setSearchResults(searchResult);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (open) {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex((prevIndex) =>
            prevIndex < searchResults.length - 1 ? prevIndex + 1 : prevIndex
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
          break;
        case "Enter":
          event.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
            handleItemClick(searchResults[selectedIndex]);
          }
          break;
        default:
          break;
      }
    }
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.path) {
      navigate(item.path);
    } else {
      ERPToast.showWith(
        "This Feature is under development. Please try later!",
        "warning"
      );
    }
    setIsOpen(false);
    setSearch("");
  };
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // const appState = useAppSelector(
  //   (state: RootState) => state.AppState.appState
  // );
  
  return (
    <div className="py-6 px-4 flex flex-col gap-4 ">
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          <Cog6ToothIcon className="w-5 aspect-square" />
          <h3 className="text-base font-medium">Settings</h3>
        </div>
        <div
          className={`flex gap-1 items-center py-1 px-2 dark:bg-dark-bg-card dark:border-dark-border  bg-gray-50 rounded-md border cursor-pointer`}
          onClick={handleNavigation}
        >
          <p className="text-[10px]">Close</p>
          <XMarkIcon className="w-4 aspect-square stroke-red-600" />
        </div>
      </div>
      <div className="w-full relative">
      <div className="flex h-10">
        <div className={`h-full p-2 dark:bg-dark-bg-card dark:border-dark-border  bg-slate-50 border border-r-0 rounded-md rounded-r-none`}>
          <MagnifyingGlassIcon className="w-4 mt-1 aspect-square stroke-accent" />
        </div>
        <input
          ref={searchInputRef}
          className={`dark:bg-dark-bg-card dark:border-dark-border custom-input`}
          value={search}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
        />
        <style>{`
        .custom-input {
          width: 100%;
          outline: none;
          border: 1px solid #d1d5db;
          border-top-right-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          font-size: 0.75rem;
          padding: 0 0.5rem;
          transition: all 550ms ease-in-out;
        }

        .custom-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
        }
      `}</style>
        {search && (
          <XMarkIcon
            className="w-4 aspect-square stroke-red-700 absolute right-2 top-3 cursor-pointer"
            onClick={() => {
              setSearch('')
            }}
          />
        )}
      </div>
        <SearchResultBar
          isOpen={open}
          searchResults={searchResults}
          selectedIndex={selectedIndex}
          onItemClick={handleItemClick}
        />
      </div>
    </div>
  );
};

export default Header;

export const SearchResultBar: React.FC<SearchResultBarProps> = ({ isOpen, searchResults, selectedIndex, onItemClick }) => {
  const { t } = useTranslation();

  // const appState = useAppSelector(
  //   (state: RootState) => state.AppState.appState
  // );

  return (
    <div
      className={`${isOpen ? "max-h-[300px]" : "h-0"
        } absolute w-full overflow-y-auto bg-white rounded-lg shadow-lg top-12 transition-height ease-in-out delay-1000`}
    >
      <div className={`flex flex-col dark:bg-dark-bg-card `}>
        {searchResults.length > 0 ? (
          searchResults.map((item, idx) => (
            <div className={`w-full p-1 `} key={`SR_${idx}`}>
              <p
                className={`text-[13px] rounded-lg p-2 cursor-pointer ${idx === selectedIndex
                  ? "bg-primary text-white"
                  : "hover:bg-primary hover:text-white"
                  }`}
                onClick={() => onItemClick(item)}
              >
                {t(item.title as any)}
              </p>
            </div>
          ))
        ) : (
          <div className="w-full p-1">
            <p className="text-xs italic text-center p-2">No Data Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

