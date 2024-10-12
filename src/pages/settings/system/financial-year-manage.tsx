import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toggleFinancialYearPopup } from "../../../redux/slices/popup-reducer";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import Urls from "../../../redux/urls";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../utilities/hooks/useRootState";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";

// Updated StatusSelector component
const StatusSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const { t } = useTranslation();

  const statusOptions = [
    { value: 'Active', label: t('active') },
    { value: 'Inactive', label: t('inactive') },
    { value: 'Progress', label: t('progress') },
  ];

  return (
    <ERPDataCombobox
      label={t('status')}
      value={value}
      onChange={(newValue) => onChange(newValue as string)}
      options={statusOptions}
      required id={"fStatus"}    />
  );
};

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

export const initialFinancialYearData = {
  data: {
    dateFrom: "",
    dateTo: "",
    remarks: "",
    openingStockValue: 0,
    fStatus: 'Active',
    visibleOnStartUp: false,
    id: undefined,
    createdUser: undefined,
    createdDate: undefined,
    modifiedUser: undefined,
    modifiedDate: undefined,
  },
  validations: {
    dateFrom: "",
    dateTo: "",
    remarks: "",
    openingStockValue: "",
    fStatus: "",
    visibleOnStartUp: "",
    id: "",
    createdUser: "",
    createdDate: "",
    modifiedUser: "",
    modifiedDate: "",
  },
};

export const FinancialYearManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading,
  } = useFormManager<FinancialYearData>({
    url: Urls.FinancialYear,
    onSuccess: useCallback(() => dispatch(toggleFinancialYearPopup({ isOpen: false, key: null, reload: true })), [dispatch]),
    key: rootState.PopupData.financialYear.key,
    useApiClient: true,
    initialData: initialFinancialYearData
  });

  const onClose = useCallback(() => {
    dispatch(toggleFinancialYearPopup({ isOpen: false, key: null }));
  }, [dispatch]);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPDateInput
          {...getFieldProps("dateFrom")}
          label={t("from")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("dateFrom", data)}
        />
        <ERPDateInput
          {...getFieldProps("dateTo")}
          label={t("to")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("dateTo", data)}
        />
        <ERPInput
          {...getFieldProps("remarks")}
          label={t("remarks")}
          placeholder={t("enter_remarks")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("remarks", data)}
        />
        <ERPInput
          {...getFieldProps("openingStockValue")}
          label={t("prev_period_stock_value")}
          placeholder="0.00"
          type="number"
          required={false}
          onChangeData={(data: any) => handleFieldChange("openingStockValue", data)}
        />
        <StatusSelector
          value={getFieldProps("fStatus").value}
          onChange={(data) => handleFieldChange("fStatus", data)}
        />
        <ERPCheckbox
          {...getFieldProps('visibleOnStartUp')}
          label={t("visible_on_startUp")}
          onChangeData={(data: any) => handleFieldChange('visibleOnStartUp', data)}
        />
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

export default FinancialYearManage;