import { Cog6ToothIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SettingsRoutes } from "../SettingsRoutes";
import SBToast from "../../../../components/SBComponets/SBToast";
import { reducerNameFromUrl } from "../../../../redux/actions/AppActions";
import Urls from "../../../../redux/actions/Urls";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useState<any>(null);
  const [open, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any>();
  const [routes, setRoutes] = useState(SettingsRoutes);

  const userProfileReducerName = reducerNameFromUrl(Urls.user_profile, "GET");
  const profileData = useSelector((state: any) => state?.[userProfileReducerName])?.data;
  const hasPermissionForOpeningBalance = profileData?.permissions?.hasOwnProperty("opening_balance");
  const hasPermissionForReportingTags = profileData?.permissions?.hasOwnProperty("reporting_tags");
  const hasPermissionForProfile = profileData?.permissions?.hasOwnProperty("update_org_profile");
  const hasPermissionForUsers = profileData?.permissions?.hasOwnProperty("manage_users");
  const hasPermissionForPreferences = profileData?.permissions?.hasOwnProperty("preferences");
  const hasPermissionForAccountantPreferences = profileData?.permissions?.hasOwnProperty("accountant_preferences");
  const hasPermissionForTax = profileData?.permissions?.hasOwnProperty("tax");
  console.log(`Header,  : profile_data_value`, hasPermissionForUsers);

  useEffect(() => {
    if (search) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [search]);

  const handleSearch = (event: any) => {
    let AllRoutes: any[] = [];
    routes?.forEach((item: any) => {
      item?.items?.forEach((routes: any) => {
        AllRoutes?.push(routes?.routes);
      });
    });
    let searchResult: any = AllRoutes?.flat()?.filter((item: any) => item?.title?.toLowerCase()?.includes(event?.target?.value?.toLowerCase()));

    setSearchResults(searchResult);
  };

  // =============== Removing Search Options Based on Permissions =================
  useEffect(() => {
    if (!hasPermissionForOpeningBalance) {
      let updatedRoutes = SettingsRoutes?.map((item: any) => {
        let items = item?.items?.map((data: any) => {
          let routes = data?.routes?.filter((item: any) => item?.path != "/settings/opening_balance");
          return { routes };
        });
        return { ...item, items };
      });
      setRoutes(updatedRoutes);
    }
    if (!hasPermissionForReportingTags) {
      let updatedRoutes = SettingsRoutes?.map((item: any) => {
        let items = item?.items?.map((data: any) => {
          let routes = data?.routes?.filter((item: any) => item?.path != "/settings/reporting_tags");
          return { routes };
        });
        return { ...item, items };
      });
      setRoutes(updatedRoutes);
    }
    if (!hasPermissionForProfile) {
      let updatedRoutes = SettingsRoutes?.map((item: any) => {
        let items = item?.items?.map((data: any) => {
          let routes = data?.routes?.filter((item: any) => item?.path != "/settings/organization");
          return { routes };
        });
        return { ...item, items };
      });
      setRoutes(updatedRoutes);
    }
    if (!hasPermissionForUsers) {
      let updatedRoutes = SettingsRoutes?.map((item: any) => {
        let items = item?.items?.map((data: any) => {
          let routes = data?.routes?.filter((item: any) => item?.path != "/settings/users" && item?.path != "/settings/roles" && item?.path != "");
          return { routes };
        });
        return { ...item, items };
      });
      setRoutes(updatedRoutes);
    }
    if (!hasPermissionForPreferences) {
      let updatedRoutes = SettingsRoutes?.map((item: any) => {
        let items = item?.items?.map((data: any) => {
          let routes = data?.routes?.filter(
            (item: any) =>
              item?.path != "/settings/preferences/items" &&
              item?.path != "/settings/preferences/invoices" &&
              item?.path != "/settings/preferences/bills"
          );
          return { routes };
        });
        return { ...item, items };
      });
      setRoutes(updatedRoutes);
    }
    if (!hasPermissionForPreferences && !hasPermissionForAccountantPreferences) {
      let updatedRoutes = SettingsRoutes?.map((item: any) => {
        let items = item?.items?.map((data: any) => {
          let routes = data?.routes?.filter(
            (item: any) =>
              item?.path != "/settings/preferences/items" &&
              item?.path != "/settings/preferences/invoices" &&
              item?.path != "/settings/preferences/bills" &&
              item?.path != "/settings/preferences/general"
          );
          return { routes };
        });
        return { ...item, items };
      });
      setRoutes(updatedRoutes);
    }
    if (!hasPermissionForTax) {
      let updatedRoutes = SettingsRoutes?.map((item: any) => {
        let items = item?.items?.map((data: any) => {
          let routes = data?.routes?.filter((item: any) => item?.path != "/settings/taxes/tax_settings");
          return { routes };
        });
        return { ...item, items };
      });
      setRoutes(updatedRoutes);
    }
  }, [profileData]);

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
                    item?.path ? navigate(item?.path) : SBToast.showWith("This Feature is under development. Please try later!", "warning");
                  }}
                >
                  {item?.title}
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
