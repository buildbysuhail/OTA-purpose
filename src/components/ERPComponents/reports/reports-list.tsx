import { Fragment, useEffect, useState } from "react";
import jwtHelper from "../../../helpers/jwt_helper";
import Header from "./Components/Header";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import ReportsCard from "./Components/reports-card";
import { ReportsMenuItems } from "../../common/sidebar/sidemenu/reports-routes";

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

  return (
    <Fragment>
      <div className="bg-report">
        <div className="flex flex-col w-full h-full !bg-white">
          <div className="bg-[url('/settings_bg.png')]">
            <div className="max-w-4xl mx-auto w-full h-full">
              <Header />
            </div>
          </div>
          <div className="py-6 px-4 pb-28 max-w-4xl mx-2 w-full h-full overflow-auto scrollbar-hide">
            <div className="w-full flex flex-wrap gap-4 justify-center">
              {settingsRoutes?.map((item: any, idx: number) => {
                return <ReportsCard data={item} key={`QKLJM34${idx}`} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ReportList;
