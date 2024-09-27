import React, { Fragment, useEffect, useState } from "react";
import jwtHelper from "../../../helpers/jwt_helper";
// import { SettingsRoutes } from "./SettingsRoutes";
import Header from "./Components/Header";
import SettingsCard from "./Components/SettingsCard";
import { SettingsMenuItems } from "../../../components/common/sidebar/sidemenu/settings";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { toggleUserTypePopup } from "../../../redux/slices/popup-reducer";
import { UserTypeManage } from "../userManagement/user-type-manage";

const Settings = () => {
  
  const rootState = useRootState();
  const dispatch = useAppDispatch();
  const [settingsRoutes, setSettingRoutes] = useState(SettingsMenuItems);
  let sds = jwtHelper.getLoggedInUserRole();

  

  return (
    <Fragment>
    <div className="flex flex-col w-full h-full">
      <div className="bg-[url('/settings_bg.png')]">
        <div className="max-w-4xl mx-auto w-full h-full">
          <Header />
        </div>
      </div>
      <div className="py-6 px-4 max-w-4xl mx-auto w-full h-full overflow-auto scrollbar-hide">
        <div className="w-full flex flex-wrap gap-4 justify-center">
          {settingsRoutes?.map((item: any, idx: number) => {
            return <SettingsCard data={item} key={`QKLJM34${idx}`} />;
          })}
        </div>
      </div>
    </div>

<ERPModal
isOpen={rootState.PopupData.userType}
title={"Add New UserType"}
isForm={true}
closeModal={() => {
  dispatch(toggleUserTypePopup(false))
}}
content={<UserTypeManage/>}
/>
</Fragment>
  );
};

export default Settings;
