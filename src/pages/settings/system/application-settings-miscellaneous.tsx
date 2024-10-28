import React, { Fragment, useEffect, useState } from "react";
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
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { toggleMiscellaneousSettingsPopup } from "../../../redux/slices/popup-reducer";
import ApplicationMiscellaneousSettingsPop from "./application-settings-miscellaneous-settings";

interface FormState {
  salesmanIncentive: number;
  defaultIncentiveLedger: number;
  sendSMS: boolean;
  sMSURL: string;
  maintainAllBranchWithCommonInventory: boolean;
  weighingScalePluFilePath: string;
  secondDisplayImagesPath: string;
  autoSyncSIandPI_BT: boolean;
  allowSalesDetailedEdit: boolean;
  maintainUntalliedBills: boolean;
  password: string;
}

interface systemCode {
  systemCode: string;
}

const initialState: FormState = {
  salesmanIncentive: 0,
  defaultIncentiveLedger: 0,
  sendSMS: false,
  sMSURL: "",
  maintainAllBranchWithCommonInventory: false,
  weighingScalePluFilePath: "",
  secondDisplayImagesPath: "",
  autoSyncSIandPI_BT: false,
  allowSalesDetailedEdit: false,
  maintainUntalliedBills: false,
  password: "",
};
const api = new APIClient();
const MiscellaneousSettingsForm: React.FC = () => {
  const rootState = useRootState();
  const [formState, setFormState] = useState<FormState>(initialState);
  const [formStatePrev, setFormStatePrev] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [systemCode, setSystemCode] = useState<systemCode[]>([]);
  const [loadSystemCode, setLoadSystemCode] = useState(false);
  const [isSavingSystemCode, setIsSavingSystemCode] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [addSystemCode, setAddSystemCode] = useState(false);
  const [SystemCodeAddData, setSystemCodeAddData] = useState<systemCode>({
    systemCode: "",
  });
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await api.getAsync(
        `${Urls.application_setting}miscellaneous`
      );

      setFormStatePrev(response);
      setFormState(response);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSystemCode = async () => {
    setLoadSystemCode(true);
    try {
      const response = await api.getAsync(
        `${Urls.application_setting}GetSyncSystemCode`
      );
      setSystemCode(response);
      setDataLoaded(true);
    } catch (error) {
      console.error("Error get System Code settings:", error);
    } finally {
      setLoadSystemCode(false);
    }
  };

  const postSystemCode = async () => {
    setIsSavingSystemCode(true);
    const updatedSystemCodes = [...systemCode, SystemCodeAddData];
    setSystemCodeAddData({
      systemCode: "",
    });
    setAddSystemCode(false);
    try {
      const response = await api.post(
        `${Urls.application_settings}UpdateSyncSystemCode`,
        updatedSystemCodes
      );
      handleResponse(response);
      getSystemCode();
    } catch (error) {
      console.error("Error post System Code settings:", error);
    } finally {
      setIsSavingSystemCode(false);
    }
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
          
          acc.push({
            settingsName: key,
            settingsValue: currentValue.toString(),
          });
        }
        return acc;
      }, [] as { settingsName: string; settingsValue: string }[]);
      console.log(modifiedSettings);

      const response = (await api.put(Urls.application_settings, {
        type: "miscellaneous",
        updateList: modifiedSettings,
      })) as any;
      handleResponse(response);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // const handleDecimalPointSubmit = async () => {
  //   try {
  //   const response = (await api.post(`${Urls.application_settings}/UpdateDecimalPoint`, {

  //     })) ;
  //     handleResponse(response);
  //   } catch (error) {
  //     console.error("Error saving settings:", error);
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  return (
    <Fragment>
      <div className="h-screen max-h-dvh flex flex-col  overflow-hidden">
     <form  className="space-y-6  max-h-[calc(100vh-10rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ">
        <div className="flex flex-col border p-4 w-full rounded-lg shadow-sm justify-center items-center gap-5 
        lg:flex-row lg:justify-start lg:p-8 lg:items-start lg:gap-10 xxl:justify-around xxl:p-10">
          <div className="grid grid-cols-1">
            <div className="grid grid-cols-2 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 ">
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
                  params: `ledgerID=0&ledgerType=${LedgerType.Incentive_Given}`,
                  valueKey: "id",
                  labelKey: "name",
                }}
                data={formState}
                label={t("default_incentive_ledger")}
                onChangeData={(data) =>
                  handleFieldChange(
                    "defaultIncentiveLedger",
                    data.defaultIncentiveLedger
                  )
                }
              />
              <ERPInput
                id="weighingScalePluFilePath"
                value={formState.weighingScalePluFilePath}
                data={formState}
                className="flex-grow"
                label={t("plu_path")}
                onChangeData={(data) =>
                  handleFieldChange(
                    "weighingScalePluFilePath",
                    data.weighingScalePluFilePath
                  )
                }
              />

              {/* <ERPInput
                id="secondDisplayImagesPath"
                value={formState.secondDisplayImagesPath}
                data={formState}
                label={t("second_display_images_path")}
                onChangeData={(data: any) =>
                  handleFieldChange(
                    "secondDisplayImagesPath",
                    parseFloat(data.secondDisplayImagesPath)
                  )
                }
              /> */}

              <div className="mb-2">
                <label
                  htmlFor="secondDisplayImagesPath"
                  className="block text-[12px] font-medium text-gray-700">
                  {t("second_display_images_path")}
                </label>
                <input
                  type="file"
                  id="secondDisplayImagesPath"
                  className="mt-1 w-full border border-gray-300 p-2 rounded-md"
                  onChange={(data: any) =>
                    handleFieldChange("secondDisplayImagesPath", data.secondDisplayImagesPath)
                  }
                />
              </div>
              <ERPCheckbox
                id="maintainAllBranchWithCommonInventory"
                checked={formState.maintainAllBranchWithCommonInventory}
                data={formState}
                label={t("maintain_all_branch")}
                onChangeData={(data) =>
                  handleFieldChange(
                    "maintainAllBranchWithCommonInventory",
                    data.maintainAllBranchWithCommonInventory
                  )
                }
              />
              <ERPCheckbox
                id="autoSyncSIandPI_BT"
                checked={formState.autoSyncSIandPI_BT}
                data={formState}
                label={t("auto_sync")}
                onChangeData={(data) =>
                  handleFieldChange(
                    "autoSyncSIandPI_BT",
                    data.autoSyncSIandPI_BT
                  )
                }
              />
              <ERPCheckbox
                id="maintainUntalliedBills"
                checked={formState.maintainUntalliedBills}
                data={formState}
                label={t("maintain_untallied_bills")}
                onChangeData={(data) =>
                  handleFieldChange(
                    "maintainUntalliedBills",
                    data.maintainUntalliedBills
                  )
                }
              />
              <ERPCheckbox
                id="allowSalesDetailedEdit"
                checked={formState.allowSalesDetailedEdit}
                data={formState}
                label={t("allow_sales_detailed_edit")}
                onChangeData={(data) =>
                  handleFieldChange(
                    "allowSalesDetailedEdit",
                    data.allowSalesDetailedEdit
                  )
                }
              />

              <div className="flex items-center  justify-between">
                <ERPCheckbox
                  id="sendSMS"
                  checked={formState.sendSMS}
                  data={formState}
                  label={t("send_sms")}
                  onChangeData={(data) => handleFieldChange("sendSMS", data.sendSMS)}
                />
                <ERPInput
                  id="sMSURL"
                  value={formState.sMSURL}
                  data={formState}
                  label=" "
                  disabled={!formState.sendSMS}
                  onChangeData={(data) => handleFieldChange("sMSURL", data.sMSURL)}
                />
              </div>
            </div>
            {/* <div className="flex justify-end my-4">
              <ERPButton
                title={t("set_master_branch_grid_design")}
                variant="secondary"
                onClick={() => {
                  dispatch(toggleMiscellaneousMasterBranchPopup({ isOpen: true }));
                }}
                type="submit"
              />
            </div>
            <div className="flex justify-around items-start">
              
            </div> */}
          </div>

          <div className="max-h-[300px] w-[300px] xxl:w-[250px] xxl:max-h-[350px] p-3 border border-gray-300 rounded-sm shadow-sm">

            <h6 className="text-center font-medium mb-5">
              {" "}
              {t("sync_systemCode")}
            </h6>


            <div className="h-32 xxl:h-40 overflow-y-scroll snap-x  mb-2 rounded-sm shadow-sm">

              {!dataLoaded ? (
                // Show default content before data is loaded
                <div className="my-5 xxl:my-10 ">
                  <ul className="list-none text-center text-gray-500 snap-center">
                    <li className="py-5 xxl:py-10 px-3">
                    {t("click_load_to_fetch_system_code")}
                      {/* Default message */}
                    </li>
                  </ul>
                </div>
              ) : (
                <ul className="list-none text-center snap-center">
                  {systemCode && systemCode.length > 0 ? (
                    systemCode.map((code: systemCode, index: number) => (
                      <li className="p-1 text-xs " key={index}>
                        {code.systemCode}{" "}
                      </li>
                    ))
                  ) : (
                    <li className="">{"No data available"}</li>
                  )}


                </ul>
              )}



            </div>
            <li className="flex justify-end mb-2">
              <ERPButton

                className=" w-0 h-0 p-0 bg-white "
                type="button"
                onClick={() => setAddSystemCode(!addSystemCode)}
                startIcon="ri-pencil-line"
              />
            </li>
            {addSystemCode && (

              <ERPInput
                id="newSystemCode"
                noLabel={true}
                data={SystemCodeAddData}
                value={SystemCodeAddData.systemCode}
                onChange={(e) => {
                  setSystemCodeAddData({
                    ...SystemCodeAddData,
                    systemCode: e.target.value,
                  });
                }}
                placeholder={"enter_new_system_code"}
              />

            )}
            <div className="flex  justify-end ">
              <ERPButton
                // title={t("load")}
                startIcon="ri-refresh-line"
                variant="secondary"
                className="h-6 w-8 rounded-[2px]"
                type="button"
                loading={loadSystemCode}
                disabled={loadSystemCode}
                onClick={getSystemCode}
              />
              <ERPButton
                startIcon="ri-save-line"
                className="h-6 w-8 rounded-[2px]"
                variant="primary"
                type="button"
                loading={isSavingSystemCode}
                disabled={isSavingSystemCode}
                onClick={postSystemCode}
              />
            </div>
          </div>
          {/* <div className="border border-gray-300 flex flex-col justify-around p-5">
            <h4 className="text-red font-medium text-center">
              {t("set_decimal")}
            </h4>
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
              <ERPButton
                title={t("4decimals")}
                variant="secondary"
                type="submit"
              />
              <ERPButton
                title={t("3decimals")}
                variant="secondary"
                type="submit"
              />
              <ERPButton
                title={t("2decimals")}
                variant="secondary"
                type="submit"
              />
            </div>
          </div> */}
        </div>
        {/* <div className="flex items-center justify-end my-4">
          <div className="bg-gray-100 p-4  ml-10 shadow-md">
            <h2 className="text-lg font-semibold mb-4">
              {t("synchronize_remote_database")}
            </h2>

            <div className="flex justify-center  items-center gap-4">
              <ERPButton
                title={t("settings")}
                variant="secondary"
                type="button"
                startIcon="ri-settings-5-line"
                onClick={() => {
                  dispatch(toggleMiscellaneousSettingsPopup({ isOpen: true }));
                }}
              />
              <ERPButton
                title={t("sync")}
                variant="secondary"
                type="button"
                startIcon="ri-refresh-line"
              />
            </div>
            <span className="ml-2 text-red-500">
              {t("processing...")}
            </span>
          </div>
        </div> */}
        {/* <div className="flex justify-end mt-4">
          <ERPButton
            title={t("save_settings")}
            variant="primary"
            type="submit"
            disabled={isSaving}
            loading={isSaving}
          />
        </div> */}
        </form>
      <div className="flex justify-end p-4">
      <ERPButton
        title={t("save_settings")}
        variant="primary"
        disabled={isSaving}
        loading={isSaving}
        type="button"
        onClick={()=>handleSubmit}
      />
    </div>
    </div>
      <ERPModal
        isOpen={rootState.PopupData.miscellaneousSettings.isOpen || false}
        title="Linked Server Settings"
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleMiscellaneousSettingsPopup({ isOpen: false }));
        }}
        content={<ApplicationMiscellaneousSettingsPop />}
      />
    </Fragment>
  );
};

export default MiscellaneousSettingsForm;
