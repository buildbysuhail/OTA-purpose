import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toggleFinancialYearPopup } from "../../../redux/slices/popup-reducer";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import Urls from "../../../redux/urls";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../utilities/hooks/useRootState";

export interface FinancialYearData {
  dateFrom: string;
  dateTo: string;
  remarks: string;
  openingStockValue: number;
  fStatus: 'Active' | 'Inactive' | 'Progress';
  visibleOnStartUp: boolean;
  id?: number;
  createdUser?: string;
  createdDate?: string;
  modifiedUser?: string;
  modifiedDate?: string;
}

export const FinancialYearManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading,
    formState
  } = useFormManager<FinancialYearData>({
    url: Urls.FinancialYear,
    onSuccess: useCallback(() => dispatch(toggleFinancialYearPopup({ isOpen: false, key: null })), [dispatch]),
    key: rootState.PopupData.financialYear.key
  });

  const onClose = useCallback(() => {
    dispatch(toggleFinancialYearPopup({ isOpen: false, key: null }));
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPDateInput
          {...getFieldProps("dateFrom")}
          label="From"
          required={true}
          onChangeData={(data: any) => handleFieldChange("dateFrom", data)}
        />
        <ERPDateInput
          {...getFieldProps("dateTo")}
          label="To"
          required={true}
          onChangeData={(data: any) => handleFieldChange("dateTo", data)}
        />
        <ERPInput
          {...getFieldProps("remarks")}
          label="Remarks"
          placeholder="Enter Remarks"
          required={false}
          onChangeData={(data: any) => handleFieldChange("remarks", data)}
        />
        <ERPInput
          {...getFieldProps("openingStockValue")}
          label="Prev Period Stock Value"
          placeholder="0.00"
          type="number"
          required={false}
          onChangeData={(data: any) => handleFieldChange("openingStockValue", data)}
        />

        <div className="w-full">
          <label htmlFor="fStatus" className="block text-xs text-gray-700">
            Status*
          </label>
          <select
            className="block w-full px-3 py-1 bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            {...getFieldProps("fStatus")}
            onChange={(e) => handleFieldChange("fStatus", e.target.value)}
          >
            <option value="" disabled>Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Progress">Progress</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            className="ti-form-checkbox"
            {...getFieldProps("visibleOnStartUp")}
            onChange={(e) => handleFieldChange("visibleOnStartUp", e.target.checked)}
          />
          <label
            htmlFor={getFieldProps("visibleOnStartUp").id}
            className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold"
          >
            Visible On StartUp
          </label>
        </div>
      </div>
      <ERPFormButtons
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
});