import { useCallback, useState } from "react";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { toggleUserActionPopup } from "../../../redux/slices/popup-reducer";
import { useDispatch } from "react-redux";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import Urls from "../../../redux/urls";
import React from "react";
import { ActionType } from "../../../redux/types";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";


export interface UserActionReport {
  userID: number,
  dateFrom: string,
  dateTo: string,
  counterID: number,
  transactionType: object,
  action: object,
  isTransaction:boolean,
  isAction:boolean,
}
const UserActionReportFilter: React.FC = React.memo(() => {
  const dispatch = useDispatch();

  const { isEdit, handleClear, handleSubmit, handleFieldChange, getFieldProps, isLoading,handleClose } =
    useFormManager<UserActionReport>({
      url: Urls.userActionReport,
      onClose:useCallback(() => dispatch(toggleUserActionPopup({ isOpen: false, key: null,reload: false })), [dispatch]),
      onSuccess: useCallback(
        () => dispatch(toggleUserActionPopup({ isOpen: false, key: null,reload: false })),
        [dispatch]
      ),
      method: ActionType.POST,
      useApiClient: true,
      initialData: {
        userID: 0,
        dateFrom: new Date(),
        dateTo: new Date(),
        counterID: 0,
        transactionType: {}, // Define the structure for this object if required
        action: {}, // Define the structure for this object if required
        isTransaction: false,
        isAction: false,
      }
    });




  const { t } = useTranslation();

  return (
    <div className="w-full modal-content">
      <div className="grid grid-cols-1 sm:grid-cols-2  gap-3">

        <ERPDateInput
          {...getFieldProps("dateFrom")}
          type="date"
          id="dateFrom"
          label={t("date_from")}
          onChangeData={(data: any) => handleFieldChange("dateFrom", data)}
        />
        <ERPDateInput
          {...getFieldProps("dateTo")}
          type="date"
          id="dateTo"
          label={t("date_to")}
          onChangeData={(data: any) => handleFieldChange("dateTo", data)}
        />
          <ERPDataCombobox
          {...getFieldProps("userID")}
          field={{
            id: "userID",
            required: true,
            getListUrl: Urls.data_user_types,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("userID", data)
          }}
          label={t("user")}
        />
        <ERPDataCombobox
          {...getFieldProps("counterID")}
          field={{
            id: "counterID",
            required: true,
            getListUrl: Urls.data_counters,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("counterID", data)
          }}
          label={t("counter")}
        />
        <div className="flex justify-start gap-3">
        <ERPCheckbox
          {...getFieldProps("isTransaction")}
          label={t("transaction")}
          onChangeData={(data: any) => handleFieldChange("isTransaction", data)}
        />
        <ERPDataCombobox
          {...getFieldProps("transactionType")}
          field={{
            id: "transactionType",
            required: true,
            getListUrl: Urls.data_counters,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("transactionType", data)
          }}
         
        />
        </div>
        <div className="flex justify-start gap-3">
        <ERPCheckbox
          {...getFieldProps("isAction")}
          label={t("action")}
          onChangeData={(data: any) => handleFieldChange("isAction", data)}
        />
        <ERPDataCombobox
          {...getFieldProps("action")}
          field={{
            id: "action",
            required: true,
            getListUrl: Urls.data_counters,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("action", data)
          }}
       
        />
        </div>
      </div>
      <ERPFormButtons
        onClear={handleClear}
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
});

export default UserActionReportFilter;
