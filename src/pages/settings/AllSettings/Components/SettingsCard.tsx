import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ERPToast from "../../../../components/ERPComponents/erp-toast";
import { useAppDispatch, useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../../redux/store";

const SettingsCard = ({ data }: any) => {
  
  let userSession = useAppSelector((state: RootState) => state.UserSession);
  const navigate = useNavigate();
  const {t}=useTranslation();
  const dispatch = useAppDispatch()
  const columns = Math.max(1, data.columns || 1);
  const [items, setItems] = useState<any>(data.children || [])
  const [distributedItems, setDistributedItems] = useState<any>([])

  const distributeItems = (): any => {
    debugger;
    let st = items;
    if (userSession.userTypeCode == "BA") {
      st = st?.filter((x: any) => x.title != 'branches');
      setItems(st);
    }
    if (userSession.userTypeCode == "CA") {
      st = st?.filter((x: any) => x.title != 'branch_info');
      setItems(st);
    }

    const result: any = Array.from({ length: columns }, () => []);
    const itemsPerColumn = Math.ceil(st.length / columns);

    st?.forEach((item: any, index: any) => {
      const columnIndex = Math.floor(index / itemsPerColumn);
      result[columnIndex]?.push(item);
    });

    return result;
  };

  useEffect(() =>{
    
    debugger;
    setDistributedItems(distributeItems());
  },[])
  return (
    <div className="w-auto bg-gray-50 rounded-lg p-5 border flex flex-grow ">
      <div className="flex flex-col gap-5">
        <div className="flex gap-2 items-center">
          {/* <data.icon className="w-4 aspect-square stroke-gray-600" /> */}
          <p className="text-sm font-medium">{t(data?.title)}</p>
        </div>
        <div className={`grid grid-cols-${data?.columns ? data?.columns : 1} gap-24`}>
        {distributedItems.map((columnItems: any, idx: number) => {
            return (
               
        <div className="flex flex-col gap-3" key={`QQEO39_${idx}`}>
          {columnItems.map((route: any, routeIdx: number) => {
                  return (
                    <p
                      className="text-xs cursor-pointer hover:italic hover:text-accent transition-all ease-in-out"
                      onClick={() => {
                        // dispatch({ type: "minimize", minimize: false });
                        route?.path && route?.type == 'link' ? navigate(route?.path) : route?.action && route?.type == 'popup' ? dispatch(route?.action({isOpen: true})) : ERPToast.showWith("This Feature is under development. Please try later!", "warning");
                      }}
                      key={`JPKNE84_${routeIdx}`}
                    >
                      {t(route?.title)}
                    </p>
                  );
                })}
              </div>
              )
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsCard;
