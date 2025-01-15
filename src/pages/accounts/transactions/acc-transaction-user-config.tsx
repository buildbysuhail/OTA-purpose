import { useEffect, useState } from "react";
import { customJsonParse } from "../../../utilities/jsonConverter";
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
import { Settings } from "lucide-react";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { inputBox } from "../../../redux/slices/app/types";
import InputBoxStyling from "../../../components/ERPComponents/erp-inputboxStyle-preference";
import { hexToRgb } from "../../../components/common/switcher/switcherdata/switcherdata";
const api = new APIClient();
interface pageBgColor{
  pageBgColor:string
}
export const AccTransactionUserConfig = () => {
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputBox, setInputBox] = useState<inputBox>({
    inputStyle: "normal",
    inputSize: "md",
    checkButtonInputSize: "md",
    inputHeight: 0,
    fontSize: 14,
    fontWeight: 400,
    labelFontSize: 14,
    otherLabelFontSize: 14,
    inputBgColor: "128, 128, 128",
    borderColor: "128, 128, 128",
    selectColor: "128, 128, 128",
    fontColor: "0, 0, 0",
    labelColor: "0, 0, 0",
    borderFocus: "0, 0, 0",
    borderRadius: 4,
    adjustA: 0,
    adjustB: 0,
    adjustC: 0,
    adjustD: 0,
    marginTop: 0,
    marginBottom: 0,
    focusForeColor: "0, 0, 0",
    focusBgColor: "255, 255, 255",
  });

  const [page,setPage] = useState({
    pageBgColor:"252,252,252"
  })

  const handleInputBoxChange = (field: keyof inputBox, value: any) => {
    setInputBox((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserConfig = async () => {
      try {
        // Fetch user config from the server
        const response = await api.get(Urls.get_acc_user_config);
        const _userConfig = atob(response.data);
        const userConfig: AccUserConfig = customJsonParse(_userConfig);



        dispatch(accFormStateHandleFieldChange({ fields: { userConfig } }));
      } catch (error) {
        console.error("Error fetching user config:", error);
      }
    };

    fetchUserConfig();
  }, []);

  const postUserConfig = async () => {
    try {
      const response = await api.post(
        `${Urls.post_acc_user_config}`,
        formState.userConfig
      );
      handleResponse(response);
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

  return (
    <>
      <div
        className="group relative inline-flex flex-col items-center"
        title="Settings"
      >
        <button
          className="flex items-center bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <Settings className="w-4 h-4 text-gray-600 hover:text-gray-800 transition-colors" />
        </button>
      </div>
      <ERPModal
        isOpen={isOpen}
        title="User Config"
        width="w-full max-w-[1000px]"
        minHeight={800}
        isForm={true}
        closeModal={() => setIsOpen(false)}
        content={
          <>
            <div className="grid gird-col-3 gap-6 p-4">
              <ERPCheckbox
                id="keepNarrationForJV"
                label="Keep Narration For JV"
                data={formState.userConfig}
                checked={formState?.userConfig?.keepNarrationForJV}
                onChangeData={(e) =>
                  handleFieldChange("keepNarrationForJV", e.keepNarrationForJV)
                }
              />

              <ERPCheckbox
                id="clearDetailsAfterSaveAccounts"
                label="Clear Details After Save Accounts"
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
                label="Show Confirmation For Edit On Accounts"
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
                label="Maximize Billwise Screen Initially"
                data={formState.userConfig}
                checked={formState?.userConfig?.maximizeBillwiseScreenInitially}
                onChangeData={(e) =>
                  handleFieldChange(
                    "maximizeBillwiseScreenInitially",
                    e.maximizeBillwiseScreenInitially
                  )
                }
              />

              <ERPInput
                id="maxWidth"
                label="Max Width"
                placeholder="Max Width (e.g., 1200px)"
                type="text"
                data={formState.userConfig}
                value={formState?.userConfig?.maxWidth}
                onChangeData={(e: { maxWidth: any }) =>
                  handleFieldChange("maxWidth", e.maxWidth)
                }
              />

              <div>
                <ERPButton
                  title="Left"
                  variant={
                    formState?.userConfig?.alignment === "left"
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() => handleFieldChange("alignment", "left")}
                  className="mr-2"
                />
                <ERPButton
                  title="Center"
                  variant={
                    formState?.userConfig?.alignment === "center"
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() => handleFieldChange("alignment", "center")}
                  className="mr-2"
                />
                <ERPButton
                  title="Right"
                  variant={
                    formState?.userConfig?.alignment === "right"
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() => handleFieldChange("alignment", "right")}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center my-1">
                  <label htmlFor="pageBgColor" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold">
                    Page Background Color
                  </label>
                  <div className="ti-form-radio">
                    <div
                      className="relative theme-container h-8 w-8 rounded-full border border-solid border-gray-300 flex items-center justify-center overflow-hidden"
                      style={{
                        backgroundColor: `rgb(${page?.pageBgColor})`,
                      }}
                    >
                      <i className="ri-palette-line text-white text-lg absolute pointer-events-none"></i>
                      <input
                        type="color"
                        value={page?.pageBgColor}
                        onChange={(e) => {
                          const rgb = hexToRgb(e.target?.value);
                          if (rgb) {
                            setPage((prev) => ({
                              ...prev,
                              pageBgColor: `${rgb.r},${rgb.g},${rgb.b}`,
                            }));
                          }
                        }}
                        className="opacity-0 w-full h-full cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
            <p className="switcher-style-head ">Input Box Style:</p>
            <InputBoxStyling
            isInputBgColor
            inputBox={inputBox}
            onInputBoxChange={handleInputBoxChange}
          />
            </div>
          
            <div className="w-full p-2 flex justify-end space-x-2">
              <ERPButton
                title="Cancel"
                onClick={() => setIsOpen(false)}
                type="reset"
              ></ERPButton>
              <ERPButton
                title="Save Changes"
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
