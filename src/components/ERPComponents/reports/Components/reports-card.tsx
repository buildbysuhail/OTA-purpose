import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ERPToast from "../../../../components/ERPComponents/erp-toast";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";

const ReportsCard = ({ data }: any) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const columns = Math.max(1, data.columns || 1);
  const children = data.children || [];

  // State to manage favorite items
  const [favorites, setFavorites] = useState<number[]>([]);

  const distributeItems = (items: any[]): any => {
    const result: any = Array.from({ length: columns }, () => []);
    const itemsPerColumn = Math.ceil(items.length / columns);

    items.forEach((item: any, index: any) => {
      const columnIndex = Math.floor(index / itemsPerColumn);
      result[columnIndex].push(item);
    });
    return result;
  };

  const favoriteItems = children.filter((route: any) =>
    favorites.includes(route.id)
  );

  const nonFavoriteItems = children.filter(
    (route: any) => !favorites.includes(route.id)
  );

  const distributedFavoriteItems = distributeItems(favoriteItems);
  const distributedNonFavoriteItems = distributeItems(nonFavoriteItems);

  if (!data.children || !data.children.length) {
    return null;
  }

  // Function to toggle favorite status
  const toggleFavorite = async (routeId: number) => {
    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.includes(routeId)
        ? prevFavorites.filter((id) => id !== routeId)
        : [...prevFavorites, routeId];

      // Call the API to update the favorite status
      updateFavoriteStatus(routeId, newFavorites.includes(routeId));

      return newFavorites;
    });
  };

  // Function to call the API
  const updateFavoriteStatus = async (routeId: number, isFavorite: boolean) => {
    try {
      const response = await fetch('https://api.example.com/updateFavorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY' // Add your API key here
        },
        body: JSON.stringify({
          id: routeId,
          isFavorite: isFavorite
        })
      });

      if (response.ok) {
        console.log('Favorite status updated successfully');
      } else {
        console.error('Failed to update favorite status');
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.example.com/getData', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY' // Add your API key here
          }
        });

        if (response.ok) {
          const result = await response.json();
          // Assuming the API returns the favorite IDs
          setFavorites(result.favoriteIds || []);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-auto dark:bg-dark-bg-card dark:border-dark-border bg-gray-50 rounded-lg p-5 border flex flex-grow shadow-lg">
      <div className="flex flex-col ">
        {/* <h2 className="text-lg font-bold mb-4">{t(data?.title)}</h2> */}
        <div className="flex gap-2 items-center">
          {/* <data.icon className="w-4 aspect-square stroke-gray-600" /> */}
          <p className=" dark:!text-dark-text text-sm font-medium ms-[8px] mb-[8px]">{t(data?.title)}</p>
        </div>

        {/* Render Favorites List */}
        {favoriteItems.length > 0 && (
          <div>
            <div className={`grid grid-cols-${columns} gap-6`}>
              {distributedFavoriteItems.map((columnItems: any, idx: number) => (
                <div className="flex flex-col" key={`favorite_column_${idx}`}>
                  {columnItems.map((route: any, routeIdx: number) => {
                    const isFavorite = favorites.includes(route.id);
                    return (
                      <div
                        className="
                          p-[5px]
                          border-b 
                          border-dotted
                          border-gray-400
                          last:border-b-0
                          cursor-pointer
                          hover:bg-gray-100
                          transition duration-200
                          flex
                          items-center
                        "
                        onClick={() => {
                          if (route?.path && route?.type === 'link') {
                            navigate(route?.path);
                          } else if (route?.action && route?.type === 'popup') {
                            dispatch(route?.action({ isOpen: true }));
                          } else {
                            ERPToast.showWith("This Feature is under development. Please try later!", "warning");
                          }
                        }}
                        key={`favorite_route_${routeIdx}`}
                      >
                        <span
                          className="cursor-pointer mr-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(route.id);
                          }}
                        >
                          <svg
                            className={`w-6 h-6 transition-colors duration-300 ${isFavorite ? 'fill-[#FFD700]' : 'fill-gray-300'}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.07-.65L12 2 9.07 8.59 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        </span>
                        <span className="text-xs cursor-pointer hover:italic hover:text-accent transition-all ease-in-out p-1  dark:hover:bg-dark-hover-bg hover:bg-gray-400 hover:text-black hover:rounded-[5px] dark:text-dark-text  text-[#5d81ea]">
                          {t(route?.title)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Render Non-Favorites List */}
        <div className={`grid grid-cols-${columns} gap-6`}>
          {distributedNonFavoriteItems.map((columnItems: any, idx: number) => (
            <div className="flex flex-col" key={`column_${idx}`}>
              {columnItems.map((route: any, routeIdx: number) => {
                const isFavorite = favorites.includes(route.id);
                return (
                  <div
                    className="
                      p-[5px]
                      border-b 
                      border-dotted
                      border-gray-400
                      last:border-b-0
                      cursor-pointer
                      hover:bg-gray-100
                      transition duration-200
                      flex
                      items-center
                    "
                    onClick={() => {
                      if (route?.path && route?.type === 'link') {
                        navigate(route?.path);
                      } else if (route?.action && route?.type === 'popup') {
                        dispatch(route?.action({ isOpen: true }));
                      } else {
                        ERPToast.showWith("This Feature is under development. Please try later!", "warning");
                      }
                    }}
                    // key={`route_${routeIdx}`}
                    key={`JPKNE84_${routeIdx}`}
                  >
                    <span
                      className="cursor-pointer me-[12px] ms-[2px] "
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(route.id);
                      }}
                    >
                    <svg
                      className={`${isFavorite ? 'w-6 h-6' : 'w-[20px] h-[20px]'}  transition-colors duration-300 ${isFavorite ? 'fill-[#FFD700]' : 'fill-[#f9fafb]'} stroke-black stroke-[1]`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.07-.65L12 2 9.07 8.59 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    </span>
                    <span className="text-xs cursor-pointer hover:italic hover:text-accent transition-all ease-in-out p-1  dark:hover:bg-dark-hover-bg hover:bg-gray-400 hover:text-black hover:rounded-[5px] dark:text-dark-text  text-[#5d81ea]">
                      {t(route?.title)}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsCard;
