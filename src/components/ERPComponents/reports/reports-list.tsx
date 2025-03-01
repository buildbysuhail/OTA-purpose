import { Fragment, useEffect, useState } from "react";
import jwtHelper from "../../../helpers/jwt_helper";
import Header from "./Components/Header";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import ReportsCard from "./Components/reports-card";
import { ReportsMenuItems } from "../../common/sidebar/sidemenu/reports-routes";
import { Star } from "lucide-react";

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
    { id: number; title: string; children?: any[] }[]
  >([]);
  const findFavoritesInChildren = (routes: any, favorites: any) => {
    let favoriteItems: { id: number; title: string; children?: any[] }[] = [];

    routes.forEach((route: any) => {
      if (favorites.includes(route.id)) {
        favoriteItems.push(route);
      }

      if (route.children) {
        const childFavorites = findFavoritesInChildren(
          route.children,
          favorites
        );
        favoriteItems = favoriteItems.concat(childFavorites);
      }
    });

    return favoriteItems;
  };
  const toggleFavorite = async (routeId: number) => {
    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.includes(routeId)
        ? prevFavorites.filter((id) => id !== routeId)
        : [...prevFavorites, routeId];

      updateFavoriteStatus(routeId, newFavorites.includes(routeId));
      return newFavorites;
    });
  };
  const updateFavoriteStatus = async (routeId: number, isFavorite: boolean) => {
    // try {
    //   const response = await fetch('https://api.example.com/updateFavorite', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': 'Bearer YOUR_API_KEY'
    //     },
    //     body: JSON.stringify({ id: routeId, isFavorite })
    //   });
    //   if (!response.ok) {
    //     // ERPToast.showWith("Failed to update favorite status. Please try again.", "error");
    //   }
    // } catch (error) {
    //   // console.error('Error updating favorite status:', error);
    //   // ERPToast.showWith("Error updating favorite status. Please try again.", "error");
    // }
  };
  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch('https://api.example.com/getData', {
    //       method: 'GET',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer YOUR_API_KEY'
    //       }
    //     });
    //     if (response.ok) {
    //       const result = await response.json();
    //       setFavorites(result.favoriteIds || []);
    //     } else {
    //       console.error('Failed to fetch data');
    //     }
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //   }
    // };
    // fetchData();
  }, []);
  useEffect(() => {
    const favoriteItems = findFavoritesInChildren(settingsRoutes, favorites);
    setFavoriteItems(favoriteItems);
  }, [favorites]);
  return (
    <Fragment>
      <div className="min-h-screen bg-white">

          {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium text-gray-900">Reports</h1>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search Reports"
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* My Favorites Section */}
      <div className="px-6 py-4 border-b border-gray-100">
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
              <h2 className="ml-2 text-base font-medium text-gray-900">
                My Favorites
              </h2>
            </div>

            <div className="grid grid-cols-4 gap-x-6 gap-y-3">
              {favoriteItems.length > 0 &&
                favoriteItems.map((favoriteItem) => (
                  <div
                    key={`${favoriteItem.id}-${favoriteItem.id}`}
                    className="flex items-center"
                  >
                    <Star
                      className="w-4 h-4 text-yellow-400 mr-2"
                      fill="currentColor"
                    />
                    <span className="text-sm text-[#4B8BF4]">
                      {t(favoriteItem.title)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
      <div className="px-6 py-4">
        <div className="grid grid-cols-4 gap-6">
         
          {settingsRoutes?.map((item: any, idx: number) => {
            return (
              <ReportsCard
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                data={item}
                key={`QKLJM34${idx}`}
              />
            );
          })}
        </div>
      </div></div>
    </Fragment>
  );
};

export default ReportList;
