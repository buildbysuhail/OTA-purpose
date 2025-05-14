import { Fragment, useEffect, useState, useRef } from "react";
import jwtHelper from "../../../helpers/jwt_helper";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import ReportsCard from "./Components/reports-card";
import { ReportsMenuItems } from "../../common/sidebar/sidemenu/reports-routes";
import { useNavigate } from "react-router-dom";
import {
  Cog6ToothIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { SettingsMenuItems } from "../../common/sidebar/sidemenu/settings";
import ERPToast from "../erp-toast";
import { ChartLine } from "lucide-react";
import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";
import { customJsonParse } from "../../../utilities/jsonConverter";

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
const api = new APIClient();
const ReportList = () => {
  const { t } = useTranslation();
  const rootState = useRootState();
  const dispatch = useAppDispatch();
  const [settingsRoutes, setSettingRoutes] = useState(ReportsMenuItems);
  let sds = jwtHelper.getLoggedInUserRole();
  const preloadComponents = () => {};

  useEffect(() => {
    // Preload the components after the initial render
    preloadComponents();
  }, []);

  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<
    any
  >([]);
  const findFavoritesInChildren = (routes: any, favorites: any) => {
    let favoriteItems: { id: number; title: string; children?: any[] }[] = [];

    routes.forEach((route: any) => {
      if (Array.isArray(favorites) && favorites?.includes(route.id)) {
        favoriteItems?.push(route);
      }

      if (route.children) {
        const childFavorites = findFavoritesInChildren(
          route.children,
          favorites
        );
        favoriteItems = favoriteItems?.concat(childFavorites);
      }
    });

    return favoriteItems;
  };
  const toggleFavorite = async (routeId: number) => {
    setFavorites((prevFavorites) => {
      debugger
      const newFavorites = prevFavorites?.includes(routeId)
        ? prevFavorites?.filter((id) => id !== routeId)
        : [...prevFavorites, routeId];
  
      // Call updateFavoriteStatus *after* state is updated
      updateFavoriteStatus(newFavorites);
      return newFavorites;
    });
  };
  
  const updateFavoriteStatus = async (data: any) => {
    try {
      await api.postAsync(Urls.update_favorite_reports,  {favIds: Array.isArray(data) ? data.join(',') : ''});
    } catch (error) {
      console.error("Failed to update favorite status", error);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        debugger
        const jsonString = await api.getAsync(Urls.get_favorite_reports);
        debugger
        const userConfig: number[] = (jsonString ?? "")
  .split(",")
  .map((s: any) => Number(s.trim()))
  .filter((n: any) => !isNaN(n));
        setFavorites(userConfig);
      } catch (error) {
        console.error("Failed to fetch product config", error);
      }
    };
  
    fetchData();
  }, []);
  useEffect(() => {
    const favoriteItems = findFavoritesInChildren(settingsRoutes, favorites);
    setFavoriteItems(favoriteItems);
  }, [favorites]);

  const navigate = useNavigate();
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
      ERPToast.showWith(t("feature_under_development_message"), t("warning"));
    }
    setIsOpen(false);
    setSearch("");
  };

  const searchInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  return (
    <Fragment>
      <div className="min-h-screen dark:bg-dark-bg bg-white">
        {/* Header */}
        <div className="px-6 py-4 border-b dark:bg-dark-bg dark:border-dark-border  border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-1">
            <ChartLine className="w-5 aspect-square" />
            <h3 className="text-base dark:!text-dark-text font-medium">
              {t("Reports")}
            </h3>
          </div>

          <div
            className="flex gap-1 items-center py-1 px-2 dark:bg-dark-bg-card dark:border-dark-border bg-gray-50 rounded-md border cursor-pointer"
            onClick={handleNavigation}
          >
            <p className="text-[10px] dark:!text-dark-text">{t("Close")}</p>
            <XMarkIcon className="w-4 aspect-square stroke-red-600" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 flex justify-center">
          <div className="w-full max-w-lg relative">
            <div className="flex h-10">
              <div
                className={`h-full p-2 dark:bg-dark-bg-card dark:border-dark-border bg-slate-50 border border-r-0 rounded-md rounded-r-none`}
              >
                <MagnifyingGlassIcon className="w-4 mt-1 aspect-square stroke-accent" />
              </div>
              <input
                ref={searchInputRef}
                className={`dark:bg-dark-bg-card dark:border-dark-border custom-input`}
                value={search}
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
              />

              <style>
                {`
                  .custom-input {
                    width: 100%;
                    outline: none;
                    border: 1px solid #d1d5db;
                    border-top-right-radius: 0.375rem;
                    border-bottom-right-radius: 0.375rem;
                    font-size: 0.75rem;
                    padding: 0 0.5rem;
                    // transition: all 550ms ease-in-out;
                  }

                  .custom-input:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
                  }
                `}
              </style>

              {search && (
                <XMarkIcon
                  className="w-4 aspect-square stroke-red-700 absolute right-2 top-3 cursor-pointer"
                  onClick={() => {
                    setSearch("");
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

        {/* My Favorites Section */}
        <div className="px-6 py-4 border-b dark:border-dark-border border-gray-100">
          <div className="flex items-center mb-4">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <h2 className="ml-2 text-base font-medium dark:text-dark-label text-gray-900">
              My Favorites
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3">
            {favoriteItems?.length > 0 &&
              favoriteItems?.map((favoriteItem: any) => (
                <div
                  key={`${favoriteItem.id}-${favoriteItem.id}`}
                  className="flex items-center min-w-0"
                >
                  <svg
                    className="w-[15px] h-[15px] mr-2 transition-colors duration-300 fill-[#FFC107]"
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="512"
                    height="511.987"
                    viewBox="0 0 511.987 511"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(favoriteItem.id);
                    }}
                  >
                    <g>
                      <path d="M510.652 185.902a27.158 27.158 0 0 0-23.425-18.71l-147.774-13.419-58.433-136.77C276.71 6.98 266.898.494 255.996.494s-20.715 6.487-25.023 16.534l-58.434 136.746-147.797 13.418A27.208 27.208 0 0 0 1.34 185.902c-3.371 10.368-.258 21.739 7.957 28.907l111.7 97.96-32.938 145.09c-2.41 10.668 1.73 21.696 10.582 28.094 4.757 3.438 10.324 5.188 15.937 5.188 4.84 0 9.64-1.305 13.95-3.883l127.468-76.184 127.422 76.184c9.324 5.61 21.078 5.097 29.91-1.305a27.223 27.223 0 0 0 10.582-28.094l-32.937-145.09 111.699-97.94a27.224 27.224 0 0 0 7.98-28.927zm0 0" />
                    </g>
                  </svg>

                  <span
                   onClick={() => {
                    if (favoriteItem?.path && favoriteItem?.type === "link") {
                      navigate(favoriteItem?.path);
                    } else if (favoriteItem?.action && favoriteItem?.type === "popup") {
                      dispatch(favoriteItem?.action({ isOpen: true }));
                    } else {
                      ERPToast.showWith(
                        t("feature_under_development_message"),
                        t("warning")
                      );
                    }
                  }}
                    className="text-sm text-[#4B8BF4] truncate cursor-pointer"
                    title={t(favoriteItem.title)}
                  >
                    {t(favoriteItem.title)}
                  </span>
                </div>
              ))}
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {settingsRoutes?.map((item: any, idx: number) => {
              return (
                <ReportsCard
                  favorites={favorites||[]}
                  toggleFavorite={toggleFavorite}
                  data={item}
                  key={`QKLJM34${idx}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ReportList;

export const SearchResultBar: React.FC<SearchResultBarProps> = ({
  isOpen,
  searchResults,
  selectedIndex,
  onItemClick,
}) => {
  const { t } = useTranslation("main");

  return (
    <div
      className={`${
        isOpen ? "max-h-[300px]" : "h-0"
      } absolute w-full overflow-y-auto bg-white rounded-lg shadow-lg top-12 transition-height ease-in-out delay-1000`}
    >
      <div className={`flex flex-col dark:bg-dark-bg-card `}>
        {searchResults.length > 0 ? (
          searchResults.map((item, idx) => (
            <div className={`w-full p-1 `} key={`SR_${idx}`}>
              <p
                className={`text-[13px] rounded-lg p-2 cursor-pointer ${
                  idx === selectedIndex
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
            <p className="text-xs italic text-center p-2">
              {t("no_data_found")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
