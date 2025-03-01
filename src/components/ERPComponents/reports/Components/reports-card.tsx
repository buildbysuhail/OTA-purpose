import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ERPToast from "../../../../components/ERPComponents/erp-toast";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";

interface Route {
  id: number;
  title: string;
  path?: string;
  type?: string;
  action?: (args: any) => void;
}

interface ReportsCardProps {
  data: {
    columns?: number;
    children?: Route[];
    title?: string;
  };
}

const ReportsCard: React.FC<ReportsCardProps> = ({ data }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const columns = Math.max(1, data.columns || 1);
  const children = data.children || [];

  const [favorites, setFavorites] = useState<number[]>([]);

  const distributeItems = useCallback((items: Route[]): Route[][] => {
    const result: Route[][] = Array.from({ length: columns }, () => []);
    const itemsPerColumn = Math.ceil(items.length / columns);

    items.forEach((item, index) => {
      const columnIndex = Math.floor(index / itemsPerColumn);
      result[columnIndex].push(item);
    });
    return result;
  }, [columns]);

  const favoriteItems = children.filter((route) => favorites.includes(route.id));
  const distributedAllItems = distributeItems(children);

  if (!children.length) {
    return null;
  }

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
    try {
      const response = await fetch('https://api.example.com/updateFavorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({ id: routeId, isFavorite })
      });

      if (!response.ok) {
        // ERPToast.showWith("Failed to update favorite status. Please try again.", "error");
      }
    } catch (error) {
      // console.error('Error updating favorite status:', error);
      // ERPToast.showWith("Error updating favorite status. Please try again.", "error");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.example.com/getData', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY'
          }
        });

        if (response.ok) {
          const result = await response.json();
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
    <div className="flex flex-col gap-4">
      {favoriteItems.length > 0 && (
        <div className="w-auto  p-5  flex flex-grow ">
          <div className="flex flex-col">
            <div className="flex gap-2 items-center">
              <p className="dark:!text-dark-text text-sm font-medium ms-[8px] mb-[8px]">{t('Favorites')}</p>
            </div>
            <div className="flex flex-wrap gap-0 gap-x-6">
              {favoriteItems.map((route, routeIdx) => (
                <Item key={`favorite_route_${routeIdx}`} route={route} isFavorite={true} toggleFavorite={toggleFavorite} navigate={navigate} dispatch={dispatch} t={t}/>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="w-full   p-5  flex flex-grow ">
        <div className="flex flex-col">
          <div className="flex gap-2 items-center">
            <p className="dark:!text-dark-text text-sm font-medium ms-[8px] mb-[8px]">{t(data?.title)}</p>
          </div>
          <div className={`grid grid-cols-${columns} gap-6`}>
            {distributedAllItems.map((columnItems, idx) => (
              <div className="flex flex-col" key={`column_${idx}`}>
                {columnItems.map((route, routeIdx) => (
                  <Item key={`JPKNE84_${routeIdx}`} route={route} isFavorite={favorites.includes(route.id)} toggleFavorite={toggleFavorite} navigate={navigate} dispatch={dispatch} t={t} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ItemProps {
  route: Route;
  isFavorite: boolean;
  toggleFavorite: (routeId: number) => void;
  navigate: (path: string) => void;
  dispatch: (action: any) => void;
  t:any
}

const Item: React.FC<ItemProps> = ({ route, isFavorite, toggleFavorite, navigate, dispatch ,t}) => {
  return (
    <div
      className="p-[5px] border-b border-dotted border-gray-400 cursor-pointer hover:bg-gray-100 transition duration-200 flex items-center"
      onClick={() => {
        if (route?.path && route?.type === 'link') {
          navigate(route?.path);
        } else if (route?.action && route?.type === 'popup') {
          dispatch(route?.action({ isOpen: true }));
        } else {
          ERPToast.showWith("This Feature is under development. Please try later!", "warning");
        }
      }}
    >
      <span
        className="cursor-pointer mr-2"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(route.id);
        }}
      >
        {isFavorite ? (
          <svg
            className="w-[15px] h-[15px] transition-colors duration-300 fill-[#FFC107]"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="512"
            height="512"
            viewBox="0 0 511.987 511"
          >
            <g>
              <path d="M510.652 185.902a27.158 27.158 0 0 0-23.425-18.71l-147.774-13.419-58.433-136.77C276.71 6.98 266.898.494 255.996.494s-20.715 6.487-25.023 16.534l-58.434 136.746-147.797 13.418A27.208 27.208 0 0 0 1.34 185.902c-3.371 10.368-.258 21.739 7.957 28.907l111.7 97.96-32.938 145.09c-2.41 10.668 1.73 21.696 10.582 28.094 4.757 3.438 10.324 5.188 15.937 5.188 4.84 0 9.64-1.305 13.95-3.883l127.468-76.184 127.422 76.184c9.324 5.61 21.078 5.097 29.91-1.305a27.223 27.223 0 0 0 10.582-28.094l-32.937-145.09 111.699-97.94a27.224 27.224 0 0 0 7.98-28.927zm0 0" />
            </g>
          </svg>
        ) : (
          <svg
            className="w-[15px] h-[15px]  transition-colors duration-300 fill-[#cbcbcb]"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="512"
            height="512"
            viewBox="0 0 511.987 511"
          >
            <g>
              <path d="M114.594 491.14c-5.61 0-11.18-1.75-15.934-5.187a27.223 27.223 0 0 1-10.582-28.094l32.938-145.09L9.312 214.81a27.188 27.188 0 0 1-7.976-28.907 27.208 27.208 0 0 1 23.402-18.71l147.797-13.419L230.97 17.027C235.277 6.98 245.089.492 255.992.492s20.715 6.488 25.024 16.512l58.433 136.77 147.774 13.417c10.882.98 20.054 8.344 23.425 18.711 3.372 10.368.254 21.739-7.957 28.907L390.988 312.75l32.938 145.086c2.414 10.668-1.727 21.7-10.578 28.098-8.832 6.398-20.61 6.89-29.91 1.3l-127.446-76.16-127.445 76.203c-4.309 2.559-9.11 3.864-13.953 3.864zm141.398-112.874c4.844 0 9.64 1.3 13.953 3.859l120.278 71.938-31.086-136.942a27.21 27.21 0 0 1 8.62-26.516l105.473-92.5-139.543-12.671a27.18 27.18 0 0 1-22.613-16.493L255.992 39.895 200.844 168.96c-3.883 9.195-12.524 15.512-22.547 16.43L38.734 198.062l105.47 92.5c7.554 6.614 10.858 16.77 8.62 26.54l-31.062 136.937 120.277-71.914c4.309-2.559 9.11-3.86 13.953-3.86zm-84.586-221.848s0 .023-.023.043zm169.13-.063.023.043c0-.023 0-.023-.024-.043zm0 0" />
            </g>
          </svg>
        )}
      </span>
      <span className="text-xs cursor-pointer hover:italic hover:text-accent transition-all ease-in-out p-1 dark:hover:bg-dark-hover-bg hover:bg-gray-400 hover:text-black hover:rounded-[5px] dark:text-dark-text text-[#5d81ea]">
        {t(route.title)}
      </span>
    </div>
  );
};

export default ReportsCard;
