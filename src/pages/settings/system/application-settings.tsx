import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";

import { ApplicationSettingsIds, ApplicationSettingsTypes } from "./application-settings-categories";
import ERPSettingsFormMain from "./application-settings-main";
import ApplicationSettingsAccounts from "./application-settings-accounts";

import MiscellaneousSettingsForm from "./application-settings-miscellaneous";
import InventorySettingsForm from "./application-settings-inventory";
import ERPSettingsFormGSTTaxes from "./application-settings-GSTTaxes";
import ApplicationSettingsProduct from "./application-settings-product";
import BranchSettingsForm from "./application-settings-branch";

import PrintSettingForm from "./application-settings-print";
import BackupSettingsForm from "./application-settings-backup";
import TaxSettingsForm from "./appllication-settings-tax";
import { Countries } from "../../../redux/slices/user-session/reducer";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const ApplicationSettings = ({ }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [tempData, setTempData] = useState([]);

  const [settingsGroup, setSettingsGroup] = useState<ApplicationSettingsIds>(
    (searchParams?.get("settings_group_id") as ApplicationSettingsIds) ?? "main"
  );

  const userSession = useSelector((state: RootState) => state.UserSession);

  console.log(settingsGroup);

  useEffect(() => {
    setTempData([]);
  }, [settingsGroup]);


  return (
    <>
      <div className="flex h-screen overflow-hidden text-black dark:text-white bg-white dark:bg-body_dark ">
        {/* Sidebar */}
        <div className="md:w-[200px] lg:w-[300px] ltr:border-r rtl:border-l h-screen fixed">
          <h1 className="font-medium text-xl p-5 mb-5">Application Settings</h1>
          <div className="flex flex-col overflow-y-auto pb-24 h-full">
            {ApplicationSettingsTypes.filter(x => userSession.countryId == Countries.India ? x.settings_group_id != "tax" : x.settings_group_id != "gst").map((settings, index) => (
              <div
                key={`tt_${index}`}
                tabIndex={0}
                onClick={() => {
                  setSearchParams({ settings_group_id: settings?.settings_group_id });
                  setSettingsGroup(settings?.settings_group_id);
                }}
                className={`cursor-pointer flex px-5 p-2 first:border-t gap-2 items-center ${settingsGroup === settings?.settings_group_id ? "bg-primary" : "hover:bg-gray-50"
                  }`}
              >
                <div>
                  <h1 className="text-sm">{settings.name}</h1>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 ml-[200px] lg:ml-[300px] h-screen overflow-y-auto">
          <div className="p-6 bg-white shadow-md min-h-full">
            {settingsGroup == "main" ? (
              <ERPSettingsFormMain />
            ) : settingsGroup == "accounts" ? (
              <ApplicationSettingsAccounts />
            ) : settingsGroup == "products" ? (
              <ApplicationSettingsProduct />
            ) : settingsGroup == "miscellaneous" ? (
              <MiscellaneousSettingsForm />
            ) : settingsGroup == "inventory" ? (
              <InventorySettingsForm />
            ) : settingsGroup == "gst" ? (
              <ERPSettingsFormGSTTaxes />
            ) : settingsGroup == "branch" ? (
              <BranchSettingsForm />
            ) : settingsGroup == "print" ? (
              <PrintSettingForm />
            ) : settingsGroup == "backup" ? (
              <BackupSettingsForm />
            ) : settingsGroup == "tax" ? (
              <TaxSettingsForm />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationSettings;
