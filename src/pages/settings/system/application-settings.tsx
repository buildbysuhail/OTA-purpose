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
      <div className="flex overflow-hidden text-black dark:text-white bg-white dark:bg-body_dark ">
        {/* Sidebar */}
        <div className="md:w-[200px] lg:w-[300px] ltr:border-r rtl:border-l h-screen fixed z-10 bg-[#fafafa]">
          <h1 className="font-medium text-xl p-5 mb-5">Application Settings</h1>
          <div className="flex flex-col overflow-y-auto pb-24 h-full">
            {ApplicationSettingsTypes.filter(x => userSession.countryId == Countries.India ? x.settings_group_id != "taxSettings" : x.settings_group_id != "gstSettings").map((settings, index) => (
              <button
                key={`tt_${index}`}
                className={`
                flex items-center 
                w-full 
                px-3 md:px-4 
                py-1.5 
                mt-1 md:mt-2 
                duration-200 
                border-r-4 
                text-left
                ${settingsGroup === settings?.settings_group_id
                    ? "bg-gray-300 border-primary text-primary"
                    : "border-transparent hover:bg-gray hover:border-gray-400 hover:bg-gray-400"
                  }
              `}
                tabIndex={0}
                onClick={() => {
                  setSearchParams({ settings_group_id: settings?.settings_group_id });
                  setSettingsGroup(settings?.settings_group_id);
                }}
              >
                <span className="mx-4 md:mx-2 text-sm">{settings.name}</span>
              </button>

            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 ml-[200px] lg:ml-[300px]">
          <div className="bg-[#fafafa] shadow-md overflow-hidden">
            {settingsGroup === "mainSettings" ? (
              <ERPSettingsFormMain />
            ) : settingsGroup === "accountsSettings" ? (
              <ApplicationSettingsAccounts />
            ) : settingsGroup === "productsSettings" ? (
              <ApplicationSettingsProduct />
            ) : settingsGroup === "miscellaneousSettings" ? (
              <MiscellaneousSettingsForm />
            ) : settingsGroup === "inventorySettings" ? (
              <InventorySettingsForm />
            ) : settingsGroup === "gstSettings" ? (
              <ERPSettingsFormGSTTaxes />
            ) : settingsGroup === "branchSettings" ? (
              <BranchSettingsForm />
            ) : settingsGroup === "printSettings" ? (
              <PrintSettingForm />
            ) : settingsGroup === "backUpSettings" ? (
              <BackupSettingsForm />
            ) : settingsGroup === "taxSettings" ? (
              <TaxSettingsForm />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationSettings;
