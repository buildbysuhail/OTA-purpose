import React, { useEffect, useState } from "react";
import jwtHelper from "../../../helpers/jwt_helper";
import { SettingsRoutes } from "./SettingsRoutes";
import Header from "./Components/Header";
import SettingsCard from "./Components/SettingsCard";

const Settings = () => {
  const [settingsRoutes, setSettingRoutes] = useState(SettingsRoutes);
  let sds = jwtHelper.getLoggedInUserRole();

  debugger;

  return (
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
  );
};

export default Settings;
