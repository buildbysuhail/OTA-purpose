import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { getAction, postAction } from "../../../redux/slices/app-thunks";
import Urls from "../../../redux/urls";
import { handleResponse } from "../../../utilities/HandleResponse";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { LedgerType } from "../../../enums/ledger-types";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import { APIClient } from "../../../helpers/api-client";
import { useTranslation } from "react-i18next";
import { t } from "i18next";


interface FormState {
  salesmanIncentive: number;
  defaultIncentiveLedger: number;
  sendSMS: boolean;
  smsURL: string;
  maintainAllBranchWithCommonInventory: boolean;
  weighingScalePluFilePath: string;
  secondDisplayImagesPath: string;
  autoSyncSIandPI_BT: boolean;
  allowSalesDetailedEdit: boolean;
  maintainUntalliedBills: boolean;
  password: string;
}
const api = new APIClient();
const MiscellaneousSettingsForm: React.FC = () => {
  const initialState: FormState = {
    salesmanIncentive: 0,
    defaultIncentiveLedger: 0,
    sendSMS: false,
    smsURL: "",
    maintainAllBranchWithCommonInventory: false,
    weighingScalePluFilePath: "",
    secondDisplayImagesPath: "",
    autoSyncSIandPI_BT: false,
    allowSalesDetailedEdit: false,
    maintainUntalliedBills: false,
    password: "",
  };

  const [formState, setFormState] = useState<FormState>(initialState);
  const [formStatePrev, setFormStatePrev] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const dispatch = useAppDispatch();
  //   useEffect(() => {
  //     loadSettings();
  //   }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        getAction({ apiUrl:`${Urls.application_setting}miscellaneous` }) as any
      ).unwrap();

      setFormStatePrev(response);
      setFormState(response);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
    const { t } = useTranslation();
  };

  const handleFieldChange = (settingName: any, value: any) => {
    setFormState((prevSettings = {} as FormState) => ({
      ...prevSettings,
      [settingName]: value ?? "",
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const modifiedSettings = Object.keys(formState).reduce((acc, key) => {
        const currentValue = formState?.[key as keyof FormState];
        const prevValue = formStatePrev[key as keyof FormState];
       
        if (currentValue !== prevValue) {
          debugger;
          acc.push({
            settingsName: key,
            settingsValue: currentValue.toString()
          });
        }
        return acc;
      }, [] as { settingsName: string; settingsValue: string }[]);
      console.log(modifiedSettings);
      
      const response = await api.put(Urls.application_settings,{type: 'miscellaneous', updateList:  modifiedSettings}) as  any
      debugger;
      if(response!=undefined && response!=null && response.isOk==true)
        {
          ERPToast.showWith(response?.message, "success");
        }
        else{
          ERPToast.showWith(response?.message,"warning")
        }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };
  // const handleSubmit = async () => {
  //   const modifiedSettings = Object.keys(formState).reduce((acc, key) => {
  //     const currentValue = formState[key as keyof FormState];
  //     const prevValue = formStatePrev[key as keyof FormState];

  //     if (currentValue !== prevValue) {
  //       acc.push({
  //         settingsName: key,
  //         settingsValue: currentValue.toString(),
  //       });
  //     }
  //     return acc;
  //   }, [] as { settingsName: string; settingsValue: string }[]);
  //   const response: any = (await postAction({
  //     apiUrl: Urls.application_setting,
  //     data: modifiedSettings,
  //   })) as any;
  //   handleResponse(response);
  //   console.log(modifiedSettings);
  //   // You can send this list to your API or handle it as needed
  // };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 justify-start gap-5">
        <div className="grid grid-cols-1">
          <div className="grid grid-cols-2 justify-start gap-4">
            <ERPCheckbox
              id="maintainAllBranchWithCommonInventory"
              checked={formState.maintainAllBranchWithCommonInventory}
              data={formState}
              label={t("minimum_shift_duration")}
              onChangeData={(data) =>
                handleFieldChange("maintainAllBranchWithCommonInventory", data.maintainAllBranchWithCommonInventory)
              }
            />
            <ERPCheckbox
              id="autoSyncSIandPI_BT"
              checked={formState.autoSyncSIandPI_BT}
              data={formState}
              label={t("auto_sync")}
              onChangeData={(data) =>
                handleFieldChange("autoSyncSIandPI_BT", data.autoSyncSIandPI_BT)
              }
            />
            <ERPCheckbox
              id="maintainUntalliedBills"
              checked={formState.maintainUntalliedBills}
              data={formState}
              label={t("maintain_untallied_bills")}
              onChangeData={(data) =>
                handleFieldChange("maintainUntalliedBills", data.maintainUntalliedBills)
              }
            />
            <ERPCheckbox
              id="allowSalesDetailedEdit"
              checked={formState.allowSalesDetailedEdit}
              data={formState}
              label={t("allow_sales_detailed_edit")}
              onChangeData={(data) =>
                handleFieldChange("allowSalesDetailedEdit", data.allowSalesDetailedEdit)
              }
            />
            <ERPInput
              id="salesmanIncentive"
              value={formState.salesmanIncentive}
              data={formState}
              type="number"
              label={t("salesman_incentive")}
              onChangeData={(data) =>
                handleFieldChange("salesmanIncentive", data.salesmanIncentive)
              }
            />
            <ERPDataCombobox
              id="defaultIncentiveLedger"
              value={formState.defaultIncentiveLedger}
              field={{
                id: "defaultIncentiveLedger",
                required: true,
                getListUrl: Urls.data_acc_ledgers,
                params:`ledgerID=0&ledgerType=${LedgerType.Incentive_Given}`,
                valueKey: "id",
                labelKey: "name",
              }}
              data={formState}
              label={t("default_incentive_ledger")}
              onChangeData={(data) =>
              handleFieldChange("defaultIncentiveLedger", data)
              }
            />
            <ERPInput
              id="weighingScalePluFilePath"
              value={formState.weighingScalePluFilePath}
              data={formState}
              className="flex-grow"
              label={t("plu_path")}
              onChangeData={(data) =>
                handleFieldChange("weighingScalePluFilePath", data.weighingScalePluFilePath)
              }
            />

            <ERPInput
              id="secondDisplayImagesPath"
              value={formState.secondDisplayImagesPath}
              data={formState}
           
              label={t("second_display_images_path")}
              onChangeData={(data) =>
                handleFieldChange("secondDisplayImagesPath", data.secondDisplayImagesPath)
              }
            />
          </div>
          <div className="flex justify-end my-4">
            <ERPButton
              title={t("set_master_branch_grid_design")}
              variant="secondary"
              type="submit"
            />
          </div>
          <div className="flex justify-around items-start">
          <ERPCheckbox
              id="sendSMS"
              checked={formState.sendSMS}
              data={formState}
              label={t("send_sms")}
              onChangeData={(data) =>
                handleFieldChange("sendSMS", data.sendSMS)
              }
            />
          <ERPInput
              id="smsURL"
              value={formState.smsURL}
              data={formState}
              label={t("url")}
              onChangeData={(data) =>
                handleFieldChange("smsURL", data.smsURL)
              }
            />
          </div>
          <div className="flex gap-5 items-center">
            <div className="overflow-x-auto basis-[80%] scroll snap-x">
              <table className="table-auto border-collapse w-full">
                <thead>
                  <tr>
                    <th className="border border-black px-4 py-2">
                      {t("sync_systemCode")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-4 py-2 bg-gray-200"></td>
                  </tr>
                  <tr>
                    <td className="border border-black px-4 py-2 bg-gray-400"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex flex-col items-end">
              <ERPButton title={t("load")} variant="secondary" type="submit" />
              <ERPButton title={t("save")} variant="secondary" type="submit" />
            </div>
          </div>
        </div>
        <div className="border border-gray-300 flex flex-col justify-around p-5">
          <h4 className="text-red font-medium text-center">{t("set_decimal")}</h4>
          <div className=" flex justify-center items-center ">
            <ERPInput
              id="password"
              value={formState.password}
              data={formState}
              label={t("password")}
              onChangeData={(data) =>
                handleFieldChange("password", data.password)
              }
            />
          </div>
          <div className="flex flex-col justify-center  items-center gap-4">
            <ERPButton title={t("4decimals")} variant="secondary" type="submit" />
            <ERPButton title={t("3decimals")} variant="secondary" type="submit" />
            <ERPButton title={t("2decimals")} variant="secondary" type="submit" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end my-4">
        <div className="bg-gray-100 p-4  ml-10 shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            {t("synchronize_remote_database")}
          </h2>
         
          <div className="flex justify-center  items-center gap-4">
            <ERPButton title={t("settings")} variant="secondary" type="submit" startIcon="ri-settings-5-line"/>
            <ERPButton title={t("sync")} variant="secondary" type="submit" startIcon="ri-refresh-line"/>
            
          </div>
            <span className="ml-2 text-red-500">
              {t("processing...")}
            </span>
        
        </div>
        
      </div>
      <div className="flex justify-end">
          <ERPButton
            title={t("save_settings")}
            variant="primary"
            type="submit"
          />
        </div>
    </form>
  );
};

export default MiscellaneousSettingsForm;
