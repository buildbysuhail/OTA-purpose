import { useEffect, useState } from "react";
import { customJsonParse, modelToBase64 } from "../../../utilities/jsonConverter";
import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { accFormStateHandleFieldChange } from "./reducer";
import { handleResponse } from "../../../utilities/HandleResponse";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { AccUserConfig } from "./acc-transaction-types";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { Settings } from "lucide-react";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { inputBox } from "../../../redux/slices/app/types";
import InputBoxStyling from "../../../components/ERPComponents/erp-inputboxStyle-preference";
import { hexToRgb } from "../../../components/common/switcher/switcherdata/switcherdata";
import { useTranslation } from "react-i18next";
import ERPAlert from "../../../components/ERPComponents/erp-sweet-alert";

const api = new APIClient();
interface pageBgColor {
  pageBgColor: string;
}

export const AccTransactionUserConfig = () => {
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const { t } = useTranslation("transaction");
  const handleInputBoxChange = (field: keyof inputBox, value: any) => {
    const updatedUserConfig = {
      ...formState.userConfig,
      inputBoxStyle: {
        ...formState.userConfig?.inputBoxStyle,
        [field]: value,
      },
    };
    dispatch(
      accFormStateHandleFieldChange({
        fields: { userConfig: updatedUserConfig },
      })
    );
  };
  const dispatch = useDispatch();

  useEffect(() => { }, []);

  const postUserConfigOnOk = async (response: any) => {
    const base64 = modelToBase64(response);
    localStorage.setItem("utc", base64);
  };
  const postUserConfig = async () => {
    try {
      const response = await api.post(
        `${Urls.post_acc_user_config}`,
        formState.userConfig
      );
      handleResponse(response, () => {
        const base64 = modelToBase64(formState.userConfig);
        localStorage.setItem("utc", base64);
      });
    } catch (error) {
      console.error("Error post System Code settings:", error);
    } finally {
      setIsOpen(false);
    }
  };

  const handleFieldChange = (field: keyof AccUserConfig, value: any) => {
    const updatedUserConfig = {
      ...formState.userConfig,
      [field]: value,
    };
    dispatch(
      accFormStateHandleFieldChange({
        fields: { userConfig: updatedUserConfig },
      })
    );
  };
  const resetThemeChange = async () => {
    try {
      ERPAlert.show({
        title: t("are_you_sure_reset_now"),
        icon: "warning",
        confirmButtonText: t("reset_now"),
        cancelButtonText: t("cancel"),
        onConfirm: async (result: any) => {
          const res = await api.postAsync(Urls.reset_user_settings, {});
          handleResponse(res, () => {
            const st = atob(res.item);
            localStorage.setItem("utc", res.item);
            const _st: any = customJsonParse(st);
            dispatch(
              accFormStateHandleFieldChange({
                fields: { userConfig: _st },
              })
            );
          });
        },
      });
    } catch (error) {
      console.error("Error getInputBox data:", error);
    }
  };

  return (
    <>
      <div className="group relative inline-flex flex-col items-center" title={t("settings")}>
        <button className="flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors" onClick={() => setIsOpen(true)}>
          <Settings className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
        </button>
      </div>
      <ERPModal
        isOpen={isOpen}
        title={t("user_config")}
        width={1000}
        height={800}
        minHeight={800}
        isForm={true}
        closeModal={() => setIsOpen(false)}
        content={
          <>
            <div className="flex items-center justify-end">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">
                  {isExpanded ? t("expanded_view") : t("compact_view")}
                </span>
                <div className="relative inline-block w-14 h-8">
                  <input
                    type="checkbox"
                    id="toggle-view"
                    className="sr-only"
                    checked={isExpanded}
                    onChange={handleToggle}
                  />
                  <label
                    htmlFor="toggle-view"
                    className="block cursor-pointer bg-gray-300 rounded-full p-1 transition-colors duration-300 ease-in-out peer-checked:bg-[#3b82f6]"
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isExpanded ? "translate-x-6" : "translate-x-0"
                        }`}
                    ></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="grid gird-col-3 gap-6 p-4">
              <ERPCheckbox
                id="keepNarrationForJV"
                label={t("keep_narration_for_jv")}
                data={formState.userConfig}
                checked={formState?.userConfig?.keepNarrationForJV}
                onChangeData={(e) =>
                  handleFieldChange("keepNarrationForJV", e.keepNarrationForJV)
                }
              />

              <ERPCheckbox
                id="clearDetailsAfterSaveAccounts"
                label={t("clear_details_after_save_accounts")}
                data={formState.userConfig}
                checked={formState?.userConfig?.clearDetailsAfterSaveAccounts}
                onChangeData={(e) =>
                  handleFieldChange(
                    "clearDetailsAfterSaveAccounts",
                    e.clearDetailsAfterSaveAccounts
                  )
                }
              />

              <ERPCheckbox
                id="mnuShowConfirmationForEditOnAccounts"
                label={t("show_confirmation_for_edit_on_accounts")}
                data={formState.userConfig}
                checked={
                  formState?.userConfig?.mnuShowConfirmationForEditOnAccounts
                }
                onChangeData={(e) =>
                  handleFieldChange(
                    "mnuShowConfirmationForEditOnAccounts",
                    e.mnuShowConfirmationForEditOnAccounts
                  )
                }
              />

              <ERPCheckbox
                id="maximizeBillwiseScreenInitially"
                label={t("maximize_billwise_screen_initially")}
                data={formState.userConfig}
                checked={formState?.userConfig?.maximizeBillwiseScreenInitially}
                onChangeData={(e) =>
                  handleFieldChange(
                    "maximizeBillwiseScreenInitially",
                    e.maximizeBillwiseScreenInitially
                  )
                }
              />
              <ERPDataCombobox
                id="presetCostenterId"
                data={formState.userConfig}
                label={t("preset_cost_center")}
                field={{
                  id: "presetCostenterId",
                  getListUrl: Urls.data_costcentres,
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChangeData={(e) =>
                  handleFieldChange("presetCostenterId", e.presetCostenterId)
                }
              />
              <div className="flex items-center gap-4">
                <ERPInput
                  id="maxWidth"
                  label={t("max_width")}
                  placeholder={t("max_width_eg")}
                  type="number"
                  className="w-full"
                  data={formState.userConfig}
                  value={formState?.userConfig?.maxWidth}
                  onChangeData={(e: { maxWidth: any }) =>
                    handleFieldChange("maxWidth", e.maxWidth)
                  }
                />
                <ERPInput
                  id="gridMaxWidth"
                  label={t("grid_max_width")}
                  placeholder={t("max_width_eg")}
                  type="number"
                  className="w-full"
                  data={formState.userConfig}
                  value={formState?.userConfig?.gridMaxWidth}
                  onChangeData={(e: { gridMaxWidth: any }) =>
                    handleFieldChange("gridMaxWidth", e.gridMaxWidth)
                  }
                />
                 <ERPInput
                  id="gridHeight"
                  label={t("grid_height")}
                  placeholder={t("grid_height_eg")}
                  type="number"
                  className="w-full"
                  data={formState.userConfig}
                  value={formState?.userConfig?.gridHeight}
                  onChangeData={(e: { gridHeight: any }) =>
                    handleFieldChange("gridHeight", e.gridHeight)
                  }
                />
              </div>

        

              <div>
                <ERPButton
                  title={t("left")}
                  variant={
                    formState?.userConfig?.alignment === "left"
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() => handleFieldChange("alignment", "left")}
                  className="mr-2"
                />
                <ERPButton
                  title={t("center")}
                  variant={
                    formState?.userConfig?.alignment === "center"
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() => handleFieldChange("alignment", "center")}
                  className="mr-2"
                />
                <ERPButton
                  title={t("right")}
                  variant={
                    formState?.userConfig?.alignment === "right"
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() => handleFieldChange("alignment", "right")}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 p-4 my-2">
              <div className="flex items-center ">
                <label
                  htmlFor="outerPageBg"
                  className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold"
                >
                  {t("page_background_color")}
                </label>
                <div className="ti-form-radio">
                  <div
                    className="relative theme-container h-8 w-8 rounded-full border border-solid border-gray-300 flex items-center justify-center overflow-hidden"
                    style={{
                      backgroundColor: `rgb(${formState.userConfig?.outerPageBg})`,
                    }}
                  >
                    <i className="ri-palette-line text-white text-lg absolute pointer-events-none"></i>
                    <input
                      type="color"
                      value={formState.userConfig?.outerPageBg}
                      onChange={(e) => {
                        const rgb = hexToRgb(e.target?.value);
                        if (rgb) {
                          handleFieldChange(
                            "outerPageBg",
                            `${rgb?.r},${rgb?.g},${rgb?.b}`
                          );
                        }
                      }}
                      className="opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <label
                  htmlFor="innerPageBg"
                  className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold"
                >
                  {t("form_background_color")}
                </label>
                <div className="ti-form-radio">
                  <div
                    className="relative theme-container h-8 w-8 rounded-full border border-solid border-gray-300 flex items-center justify-center overflow-hidden"
                    style={{
                      backgroundColor: `rgb(${formState.userConfig?.innerPageBg})`,
                    }}
                  >
                    <i className="ri-palette-line text-white text-lg absolute pointer-events-none"></i>
                    <input
                      type="color"
                      value={formState.userConfig?.innerPageBg}
                      onChange={(e) => {
                        const rgb = hexToRgb(e.target?.value);
                        if (rgb) {
                          handleFieldChange(
                            "innerPageBg",
                            `${rgb?.r},${rgb?.g},${rgb?.b}`
                          );
                        }
                      }}
                      className="opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="switcher-style-head ">{t("input_box_style")}:</p>
              <InputBoxStyling
                isInputBgColor
                inputBox={formState.userConfig?.inputBoxStyle}
                onInputBoxChange={handleInputBoxChange}
              />
            </div>

            <div className="w-full p-2 flex justify-end space-x-2">
              <ERPButton
                title={t("reset")}
                onClick={resetThemeChange}
                type="reset"
              ></ERPButton>
              <ERPButton
                title={t("save_changes")}
                onClick={postUserConfig}
                variant="primary"
              ></ERPButton>
            </div>
          </>
        }
      ></ERPModal>
    </>
  );
};