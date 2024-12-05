import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";

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
import { RootState } from "../../../redux/store";
import { Countries } from "../../../redux/slices/user-session/reducer";
import { ApplicationSettingsInitialState } from "../../../redux/slices/app/application-settings-types";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
interface SearchCount {
  [key: string]: number;
}
const ApplicationSettingsNew: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [settingsGroup, setSettingsGroup] = useState<ApplicationSettingsIds>(
    (searchParams.get("settings_group_id") as ApplicationSettingsIds) ?? "mainSettings"
  );
  // const [searchTerm, setSearchTerm] = useState('');
  // const searchInputRef = useRef<HTMLInputElement>(null);
  const userSession = useSelector((state: RootState) => state.UserSession);
  const applicationSettings = useAppSelector((state: RootState) => state.ApplicationSettings);

  // useEffect(() => {
  //   searchInputRef.current?.focus();
  // }, []);

  // const counts = useMemo(() => {
  //   const result: SearchCount = {};

  //   (Object.keys(applicationSettings) as Array<keyof ApplicationSettingsType>).forEach((sectionKey) => {
  //     debugger;
  //     const section = applicationSettings[sectionKey];
  
  //     // Ensure section is defined and is an object
  //     if (section && typeof section === "object") {
  //       // Count properties in the section that match the search term
  //       const count = Object.values(section).filter((prop) =>
  //         prop.text.toLowerCase().includes(searchTerm.toLowerCase())
  //       ).length;
  
  //       result[sectionKey] = count;
  //     }
  //   });

  // return result;
     
  // }, [searchTerm])

  const handleSettingsGroupChange = (newSettingsGroup: ApplicationSettingsIds) => {
    setSettingsGroup(newSettingsGroup);
    setSearchParams({ settings_group_id: newSettingsGroup });
  };

  const renderSettingsForm = () => {
    switch (settingsGroup) {
      case "mainSettings": return <ERPSettingsFormMain />;
      case "accountsSettings": return <ApplicationSettingsAccounts />;
      case "productsSettings": return <ApplicationSettingsProduct />;
      case "miscellaneousSettings": return <MiscellaneousSettingsForm />;
      case "inventorySettings": return <InventorySettingsForm />;
      case "gstSettings": return <ERPSettingsFormGSTTaxes />;
      case "branchSettings": return <BranchSettingsForm />;
      case "printerSettings": return <PrintSettingForm />;
      case "backUpSettings": return <BackupSettingsForm />;
      case "taxSettings": return <TaxSettingsForm />;
      default: return null;
    }
  };

  return (
    <div className="flex overflow-hidden text-black dark:text-white bg-white dark:bg-body_dark">
      {/* Sidebar */}
      <div className="md:w-[200px] lg:w-[300px] ltr:border-r rtl:border-l h-screen fixed z-10 bg-[#fafafa]">
        <h1 className="font-medium text-xl p-5 mb-5">Application Settings new</h1>
        {/* <div className="w-full relative px-4">
          <div className="flex h-10">
            <div className="h-full p-2 bg-slate-50 border border-r-0 rounded-md rounded-r-none">
              <MagnifyingGlassIcon className="w-4 mt-1 aspect-square stroke-accent" />
            </div>
            <input
              ref={searchInputRef}
              className="w-full outline-none border rounded-r-md text-xs px-2 focus:border-accent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search settings..."
            />
            {searchTerm && (
              <XMarkIcon
                className="w-4 aspect-square stroke-red-700 absolute right-6 top-3 cursor-pointer"
                onClick={() => setSearchTerm("")}
              />
            )}
          </div>
        </div> */}
        <div className="flex flex-col overflow-y-auto pb-24 h-full mt-4">
          {ApplicationSettingsTypes.filter(x => 
            userSession.countryId === Countries.India ? x.settings_group_id !== "taxSettings" : x.settings_group_id !== "gstSettings"
          ).map((settings) => (
            <button
              key={settings.settings_group_id}
              className={`
                relative flex items-center 
                w-full px-3 md:px-4 py-1.5 mt-1 md:mt-2 
                duration-200 border-r-4 text-left
                ${settingsGroup === settings.settings_group_id
                  ? "bg-gray-300 border-primary text-primary"
                  : "border-transparent hover:bg-gray-200 hover:border-gray-400"
                }
              `}
              onClick={() => handleSettingsGroupChange(settings.settings_group_id)}
            >
              <span className="mx-4 md:mx-2 text-sm">{settings.name}</span>
              {/* <span className="absolute right-4">{counts[settings.settings_group_id] || 0}</span> */}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 ml-[200px] lg:ml-[300px]">
        <div className="bg-[#fafafa] shadow-md overflow-hidden">
          {renderSettingsForm()}
        </div>
      </div>
    </div>
  );
};

export default ApplicationSettingsNew;