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




const ApplicationSettings = ({ }) => {

  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [tempData, setTempData] = useState([]);

  const [settingsGroup, setSettingsGroup] = useState<ApplicationSettingsIds>(
    (searchParams?.get("settings_group_id") as ApplicationSettingsIds) ?? "main"
  );

  /* ########################################################################################### */

  
  /* ########################################################################################### */

 debugger;
 console.log(settingsGroup);
 

  useEffect(() => {
    setTempData([]);
  }, [settingsGroup]);

  return (
    <>
    <div className="flex h-full overflow-hidden text-black dark:text-white bg-white dark:bg-body_dark ">
          <div className=" md:w-[200px] lg:w-[300px] ltr:border-r rtl:border-l h-full">
            <h1 className=" font-medium text-xl p-5 mb-5">ApplicationSettings</h1>
            <div className="flex flex-col overflow-auto pb-24 h-full">
              {ApplicationSettingsTypes.map((settings, index) => (
                <div
                  key={`tt_${index}`}
                  tabIndex={0}
                  onClick={() => {
                    setSearchParams({ settings_group_id: settings?.settings_group_id });
                    setSettingsGroup(settings?.settings_group_id);
                  }}
                  className={`cursor-pointer  flex px-5 p-2  first:border-t  gap-2 items-center ${searchParams?.get("settings_group") === settings?.settings_group_id ? " bg-gray-100" : "hover:bg-gray-50"
                    }`}
                >
                  <div>
                    <Link to={`${location.pathname}?settings_group_id=${settings.settings_group_id}`}></Link>
                    <h1 className=" text-sm">{settings.name}</h1>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 h-full">
            <h1>{settingsGroup}</h1>
          <div className="p-6 bg-white rounded-lg shadow-md">
          
          {/* <ApplicationSettingsAccounts/> */}
          {settingsGroup ==  "main" 
          ? <ERPSettingsFormMain/>
          : settingsGroup == "accounts"
          ? <ApplicationSettingsAccounts/>
          : settingsGroup == "products"
          ? <ApplicationSettingsProduct/>
          : settingsGroup == "miscellaneous"
          ?<MiscellaneousSettingsForm/>
          :settingsGroup == "inventory"
          ?<InventorySettingsForm/>
          :settingsGroup == "gst"
          ?<ERPSettingsFormGSTTaxes/>
          :settingsGroup == "branch"
          ?<BranchSettingsForm/>
          :null
                    }

    </div>
          </div>
        </div>
    </>
  );
};

export default ApplicationSettings;

