import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ERPToast from "../../../../components/ERPComponents/erp-toast";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../../redux/store";
import { Countries } from "../../../../redux/slices/user-session/reducer";
import { isNullOrUndefinedOrEmpty } from "../../../../utilities/Utils";

interface SettingsCardProps {
  data: any; // Replace 'any' with a more specific type if possible
}

const SettingsCard: React.FC<SettingsCardProps> = ({ data }) => {
  let userSession = useAppSelector((state: RootState) => state.UserSession);
  let applicationSettings = useAppSelector(
    (state: RootState) => state.ApplicationSettings
  );
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const columns = Math.max(1, data.columns || 1);
  const [items, setItems] = useState<any>(data.children || []);
  const [distributedItems, setDistributedItems] = useState<any>([]);

  // const distributeItems = useMemo(() => {
  //   

  //   return result;
  // }, [userSession?.userTypeCode, userSession?.countryId, applicationSettings?.miscellaneousSettings?.maintainAllBranchWithCommonInventory]);

  useEffect(() => {
   
    if (
      !isNullOrUndefinedOrEmpty(applicationSettings?.miscellaneousSettings) &&
      !isNullOrUndefinedOrEmpty(userSession?.userTypeCode) &&
      !isNullOrUndefinedOrEmpty(userSession?.countryId)
    ) {
      console.log('useEffect');
      console.log(userSession.userTypeCode);
      console.log(userSession.countryId);
      console.log(applicationSettings?.miscellaneousSettings
        ?.maintainAllBranchWithCommonInventory
      
      );
    let st = items;
    // if (userSession.userTypeCode === "BA") {
    //   st = st?.filter((x: any) => x.title !== "branches");
    //   setItems(st);
    // }
    // if (userSession.userTypeCode === "CA") {
    //   st = st?.filter((x: any) => x.title !== "branch_info");
    //   setItems(st);
    // }

    const result: any = Array.from({ length: columns }, () => []);
    const itemsPerColumn = Math.ceil(st.length / columns);
    // console.log(st);

    st?.forEach((item: any, index: any) => {
      const columnIndex = Math.floor(index / itemsPerColumn);
      item.disabled = false;
      item.visible = true;
      // if (item.title === "refresh_all_branches") {
      //   if (
      //     userSession.userTypeCode !== "CA" &&
      //     applicationSettings?.miscellaneousSettings
      //       ?.maintainAllBranchWithCommonInventory != true
      //   ) {
      //     item.disabled = true;
      //   }
      // }

      // if (
      //   item.title === "company_profile_india" &&
      //   userSession.countryId != Countries.India
      // ) {
      //   item.visible = false;
      // }

      // if (
      //   item.title === "hide_account_ledger" &&
      //   userSession.countryId == Countries.India
      // ) {
      //   item.visible = false;
      // }
      // if (
      //   item.title === "company_profile_others" &&
      //   userSession.countryId == Countries.India
      // ) {
      //   item.visible = false;
      // }
      // if (item.title === "upi" && userSession.countryId != Countries.India) {
      //   item.visible = false;
      // }
      // if (item.title === "qr_pay" && userSession.countryId == Countries.India) {
      //   item.visible = false;
      // }
      result[columnIndex]?.push(item);
    });
    setDistributedItems(result);
  }
  }, [
    applicationSettings?.miscellaneousSettings,
    userSession?.userTypeCode,
    userSession?.countryId,
  ]);

  return (
    <div className="w-auto bg-gray-50 rounded-lg p-5 border flex flex-grow ">
      <div className="flex flex-col gap-5">
        <div className="flex gap-2 items-center">
          <p className="text-sm font-medium text-black  ">{t(data?.title)}</p>
        </div>
        <div className={`grid grid-cols-${data?.columns ? data?.columns : 1}`}>
          {distributedItems.map((columnItems: any, idx: number) => (
            <div className="flex flex-col" key={`QQEO39_${idx}`}>
              {columnItems
                ?.filter((x: any) => x.visible == true)
                ?.map((route: any, routeIdx: number) => (
                  <div key={`JPKNE84_${routeIdx}`}>
                    {route?.disabled ? (
                      <p className="text-xs cursor   transition-all ease-in-out">
                        {t(route?.title)}
                      </p>
                    ) : (
                      <p
                        className="text-xs cursor-pointer hover:text-accent transition-all ease-in-out p-1 hover:bg-gray-400 hover:rounded-[5px] text-black"
                        onClick={() => {
                          route?.path && route?.type === "link"
                            ? navigate(route?.path)
                            : route?.action && route?.type === "popup"
                            ? dispatch(route?.action({ isOpen: true }))
                            : ERPToast.showWith(
                                "This Feature is under development. Please try later!",
                                "warning"
                              );
                        }}
                      >
                        {t(route?.title)}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsCard;
