import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { TransactionDetail, TransactionMaster, TransactionValidationsData, VoucherElementProps } from "../../purchase/transaction-types";
import {
  formStateHandleFieldChange,
  formStateLoadDataUpdate,
  formStateMasterHandleFieldChange,
} from "../reducer";
import React, { useCallback } from "react";
import Urls from "../../../../../redux/urls";
import { LedgerType } from "../../../../../enums/ledger-types";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPFormButtons from "../../../../../components/ERPComponents/erp-form-buttons";
import { useFormManager } from "../../../../../utilities/hooks/useFormManagerOptions";
import { toggleAccountGroupPopup, toggleGrnNumber,  } from "../../../../../redux/slices/popup-reducer";
import { useDispatch } from "react-redux";
import { useRootState } from "../../../../../utilities/hooks/useRootState";
import { GrnNumberData, initialGrnNumber, LoadData } from "../grn-number-types";
import { useAppSelector } from "../../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../../redux/store";

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
  ({ dispatch, t,closeModal }) => {
    

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
  onSuccess: useCallback(() => dispatch(toggleGrnNumber({ isOpen: false, key: null, reload: true })), [dispatch]),
  onClose: useCallback(() => dispatch(toggleGrnNumber({ isOpen: false, key: null, reload: false })), [dispatch]),
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

  return (
    <div className="flex items-center mb-6">
      {/* FIXED-HEIGHT LABEL */}
      <label
        className="w-24 mr-4 flex items-center justify-end h-10 text-sm font-medium"
      >
        {t("GRN No")}:
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
            dispatch(formStateLoadDataUpdate({ key: "formType", value: e.value }))
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
          placeholder={t("V Number")}
          type="number"
          className="w-[80px]"
        />
  
        <ERPButton
          title={t("Load")}
          className="h-10"           /* match the inputs’ height */
        />
      </div>
  
      <ERPFormButtons
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={closeModal}
      />
    </div>
  );
  
  
  
  }
);

export default React.memo(GrnNumber);