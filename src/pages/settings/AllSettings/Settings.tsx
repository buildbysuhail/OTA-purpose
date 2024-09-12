// import React, { useEffect, useState } from "react";
// import Header from "./Components/Header";
// import { SettingsRoutes } from "./SettingsRoutes";
// import SettingsCard from "./Components/SettingsCard";
// import { useSelector } from "react-redux";
// import jwtHelper from "../../../helpers/jwt_helper";

const Settings = () => {
  // const [settingsRoutes, setSettingRoutes] = useState(SettingsRoutes);
  // let sds = jwtHelper.getLoggedInUserRole();

  // // ================ Disabling Routes Based on Permissions ===============
  //   // Removing Email Section
  //   if (!hasPermissionForEmail && hasPermissionForEmail != undefined) {
  //     let updatedRoutes = SettingsRoutes?.filter((item: any) => {
  //       return item?.header != "Reminders & Email Notification";
  //     });
  //     setSettingRoutes(updatedRoutes);
  //   }
  // }, [permissions]);

  // useEffect(() => {
  //   // Removing Reporting Tags Option
  //   let updatedRoutes = SettingsRoutes?.map((item: any) => {
  //     let routes = item?.items?.map((obj: any) => {
  //       let routes = obj?.routes?.filter((value: any) => {
  //         if (!hasPermissionForOpeningBalance) {
  //           return value?.path != "/settings/opening_balance";
  //         } else {
  //           return value;
  //         }
  //       });
  //       return { routes };
  //     });
  //     return { ...item, items: routes };
  //   });
  //   setSettingRoutes(updatedRoutes);
  // }, [hasPermissionForOpeningBalance]);

  // useEffect(() => {
  //   // Removing Profile Option
  //   let updatedRoutes = SettingsRoutes?.map((item: any) => {
  //     let routes = item?.items?.map((obj: any) => {
  //       let routes = obj?.routes?.filter((value: any) => {
  //         if (!hasPermissionToUpdateProfile) {
  //           return value?.path != "/settings/organization";
  //         } else {
  //           return value;
  //         }
  //       });
  //       return { routes };
  //     });
  //     return { ...item, items: routes };
  //   });
  //   setSettingRoutes(updatedRoutes);
  // }, [hasPermissionToUpdateProfile]);

  // useEffect(() => {
  //   // Removing Preferences
  //   let updatedRoutes = SettingsRoutes?.map((item: any) => {
  //     let routes = item?.items?.map((obj: any) => {
  //       let routes = obj?.routes?.filter((value: any) => {
  //         if (!hasPermissionForPreferences) {
  //           return (
  //             value?.path != "/settings/preferences/items" &&
  //             value?.path != "/settings/preferences/invoices" &&
  //             value?.path != "/settings/preferences/bills"
  //           );
  //         } else {
  //           return value;
  //         }
  //       });
  //       return { routes };
  //     });
  //     return { ...item, items: routes };
  //   });
  //   setSettingRoutes(updatedRoutes);
  // }, [hasPermissionForPreferences]);

  // useEffect(() => {
  //   // Removing Tax Option
  //   let updatedRoutes = SettingsRoutes?.map((item: any) => {
  //     let routes = item?.items?.map((obj: any) => {
  //       let routes = obj?.routes?.filter((value: any) => {
  //         if (!hasPermissionForTax) {
  //           return value?.path != "/settings/taxes/tax_settings";
  //         } else {
  //           return value;
  //         }
  //       });
  //       return { routes };
  //     });
  //     return { ...item, items: routes };
  //   });
  //   setSettingRoutes(updatedRoutes);
  // }, [hasPermissionForTax]);

  // return (
  //   <div className="flex flex-col w-full h-full">
  //     <div className="bg-[url('/settings_bg.png')]">
  //       <div className="max-w-4xl mx-auto w-full h-full">
  //         <Header />
  //       </div>
  //     </div>
  //     <div className="py-6 px-4 max-w-4xl mx-auto w-full h-full overflow-auto scrollbar-hide">
  //       <div className="w-full flex flex-wrap gap-4 justify-center">
  //         {settingsRoutes?.map((item: any, idx: number) => {
  //           return <SettingsCard data={item} key={`QKLJM34${idx}`} />;
  //         })}
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default Settings;
