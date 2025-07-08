import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateLoadDataUpdate } from "../reducer";
import React, { useCallback } from "react";
import Urls from "../../../../../redux/urls";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPFormButtons from "../../../../../components/ERPComponents/erp-form-buttons";
import { toggleGrnNumber } from "../../../../../redux/slices/popup-reducer";
import { useRootState } from "../../../../../utilities/hooks/useRootState";
import { GrnNumberData, initialGrnNumber } from "../grn-number-types";
import { useAppSelector } from "../../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../../redux/store";
import { useDebouncedInput } from "../../../../../utilities/hooks/useDebounce";
import { useFormManager } from "../../../../../utilities/hooks/useFormManagerOptions";

interface GrnNumberProps extends VoucherElementProps {
  handleLoadByRefNo: () => Promise<void>;
  handleFieldChange: (key: string, value: any) => void;
  closeModal: () => void;
}

// interface LoadDataUpdatePayload {
//   key: keyof LoadData;
//   value: any[] | TransactionMaster | TransactionValidationsData | TransactionDetail[] | string | undefined; // Added string
// }
  

const GrnNumber = React.forwardRef<HTMLInputElement, GrnNumberProps>(
  (props, ref) => {
    

    const goToPreviousPage = () => {
      window.history.back();
    };
    // const dispatch = useDispatch();
    const rootState = useRootState();
    const formState = useAppSelector((state: RootState) => ({
      ...state.AccTransaction,
      loadData: {
        formType: "",
        vPrefix: "",
        vNumber: "",
      },
    }));

    const {
      isEdit,
      handleSubmit,
      handleFieldChange,
      getFieldProps,
      handleClear,
      handleClose,
      isLoading,
  // formState,
    } = useFormManager<GrnNumberData>({
  url: Urls.account_group, // Change this if needed
      onSuccess: useCallback(() => props.dispatch(toggleGrnNumber({ isOpen: false, key: null, reload: true })), [props.dispatch]),
      onClose: useCallback(() => props.dispatch(toggleGrnNumber({ isOpen: false, key: null, reload: false })), [props.dispatch]),
  key: rootState.PopupData.accountGroup.key, // Consider renaming if not account group
      useApiClient: true,
      initialData: initialGrnNumber,
    });

  // const handleLoadClick = async () => {
  //   try {
  //     const response = await apiClient.post("/api/load-data", {
  //       formType: formState?.loadData?.formType,
  //       vPrefix: formState?.loadData?.vPrefix,
  //       vNumber: formState?.loadData?.vNumber,
  //     });
  //     console.log("API Response:", response.data);
  //     // Handle the response data as needed
  //   } catch (error) {
  //     console.error("API Error:", error);
  //     // Handle the error as needed
  //   }
  // };


    const { value: vNumberValue, onChange: onVNumberChange } = useDebouncedInput(
      formState?.loadData?.vNumber || '',
      (debouncedValue) => {
        props.dispatch(
          formStateLoadDataUpdate({
            key: "vNumber",
            value: debouncedValue,
          })
        );
      },
      300
    );

    return (
      <div className="flex items-center mb-6">
        {/* FIXED-HEIGHT LABEL */}
        <label
          className="w-24 mr-4 flex items-center justify-end h-10 text-sm font-medium"
        >
          {props.t("GRN No")}:
        </label>

        {/* INPUT ROW */}
        <div className="flex items-center gap-3 flex-wrap flex-1">
          <ERPDataCombobox
            localInputBox={formState?.userConfig?.inputBoxStyle}
            enableClearOption={false}
            id="FormType"
            className="min-w-[160px]"
          /** remove its own “label” rendering and just use placeholder **/
            label=""
          // placeholder={t("Form_Type")}
            data={formState?.loadData}
            onSelectItem={(e) =>
              props.dispatch(formStateLoadDataUpdate({ key: "formType", value: e.value }))
            }
            value={formState?.loadData?.formType}
            field={{ id: "FormType", valueKey: "id", labelKey: "name", getListUrl: Urls.data_employees }}
          />

          <ERPDataCombobox
            localInputBox={formState?.userConfig?.inputBoxStyle}
            enableClearOption={false}
            id="Vprefix"
            className="min-w-[120px]"
            label=""
          // placeholder={t("Vprefix")}
            data={formState.transaction.master}
            onSelectItem={() => {}}
            field={{ id: "Vprefix", valueKey: "id", labelKey: "name", getListUrl: Urls.data_employees }}
          />

          <ERPInput
            disableEnterNavigation={true}
            id="VNumber"
            localInputBox={formState?.userConfig?.inputBoxStyle}
            min={1}
          label=""                   /* turn off its internal label */
            placeholder={props.t("V Number")}
            type="number"
            className="w-[80px]"
            value={vNumberValue}
            onChange={(e) => onVNumberChange(e.target.value)}
            ref={ref}
          />

          <ERPButton
            title={props.t("Load")}
          className="h-10"           /* match the inputs’ height */
          />
        </div>

        <ERPFormButtons
          isEdit={isEdit}
          isLoading={isLoading}
          onCancel={props.closeModal}
        />
      </div>
    );
  }
);

export default React.memo(GrnNumber);