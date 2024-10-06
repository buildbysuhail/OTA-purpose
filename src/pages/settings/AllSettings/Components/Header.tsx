import { Cog6ToothIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useNavigation } from "react-router-dom";
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../redux/store";
import ERPToast from "../../../../components/ERPComponents/erp-toast";
import { SettingsMenuItems } from "../../../../components/common/sidebar/sidemenu/settings";
import { useTranslation } from "react-i18next";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useState<any>(null);
  const [open, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any>();
  const [routes, setRoutes] = useState(SettingsMenuItems);


  useEffect(() => {
    if (search) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [search]);

  const handleSearch = (event: any) => {
    const searchTerm = event?.target?.value?.toLowerCase();
    let AllRoutes: any[] = [];
  
    // Recursively extract all routes from children, regardless of depth
    const extractRoutes = (menuItems: any[]) => {
      menuItems?.forEach((item) => {
        if (item?.children) {
          extractRoutes(item?.children); // Recurse deeper into children if present
        } else if (item?.path) {
          AllRoutes.push(item); // Push route items into AllRoutes array
        }
      });
    };
  
    // Start the recursive extraction
    extractRoutes(SettingsMenuItems);
  
    // Perform the search filtering
    let searchResult = AllRoutes?.filter((item: any) =>
      item?.title?.toLowerCase()?.includes(searchTerm)
    );
  
    // Set the filtered search results
    setSearchResults(searchResult);
  };


  return (
    <div className="py-6 px-4 flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          <Cog6ToothIcon className="w-5 aspect-square" />
          <h3 className="text-base font-medium">Settings</h3>
        </div>
        <div
          className="flex gap-1 items-center py-1 px-2 bg-gray-50 rounded-md border cursor-pointer"
          onClick={() => {
            dispatch({ type: "minimize", minimize: false });
            setTimeout(() => {
              navigate(-1);
            }, 500);
          }}
        >
          <p className="text-[10px]">Close</p>
          <XMarkIcon className="w-4 aspect-square stroke-red-600" />
        </div>
      </div>
      <div className="w-full relative">
        <div className="flex">
          <div className="h-full p-2 bg-slate-50 border border-r-0 rounded-md rounded-r-none">
            <MagnifyingGlassIcon className="w-4 aspect-square stroke-accent" />
          </div>
          <input
            className="w-full outline-none border rounded-r-md text-xs px-2 focus:border-accent relative"
            value={search}
            onChange={(e: any) => {
              debugger;
              if (e?.target?.value) {
                setSearch(e?.target?.value);
                handleSearch(e);
              } else {
                setSearch(null);
              }
            }}
          />
          {search && (
            <XMarkIcon
              className="w-4 aspect-square stroke-red-700 absolute right-2 top-2"
              onClick={() => {
                setSearch("");
              }}
            />
          )}
        </div>
        <SearchResultBar isOpen={open} searchResults={searchResults} />
      </div>
    </div>
  );
};

export default Header;

const SearchResultBar = ({ isOpen, searchResults }: any) => {
  const{t} = useTranslation();
  const navigate = useNavigate();
  return (
    <div
      className={`${
        isOpen ? "max-h-[300px]" : "h-0"
      } absolute w-full overflow-y-auto  bg-white rounded-lg shadow-lg top-12 transition-height ease-in-out delay-1000`}
    >
      <div className="flex flex-col">
        {searchResults?.length > 0 ? (
          searchResults?.map((item: any, idx: number) => {
            return (
              <div className="w-full p-1" key={`SR_${idx}`}>
                <p
                  className="text-[13px] hover:bg-accent hover:text-white rounded-lg p-2 cursor-pointer"
                  onClick={() => {
                    item?.path ? navigate(item?.path) : ERPToast.showWith("This Feature is under development. Please try later!", "warning");
                  }}
                >
                  { t(item?.title)}
                </p>
              </div>
            );
          })
        ) : (
          <div className="w-full p-1">
            <p className="text-xs italic text-center p-2">No Data Found</p>
          </div>
        )}
      </div>
    </div>
  );
};
