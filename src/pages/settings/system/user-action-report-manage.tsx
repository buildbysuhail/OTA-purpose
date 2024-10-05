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
const UserActionReport: React.FC = React.memo(() => {
  const dispatch = useDispatch();

  const { isEdit, handleSubmit, handleFieldChange, getFieldProps, isLoading } =
    useFormManager<UserActionReport>({
      url: Urls.userActionReport,
      onSuccess: useCallback(
        () => dispatch(toggleUserActionPopup({ isOpen: false, key: null })),
        [dispatch]
      ),
      method: ActionType.POST,
      useApiClient: true
    });


  const onClose = useCallback(async () => {
    dispatch(toggleUserActionPopup({ isOpen: false }));
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2  gap-3">

        <ERPDateInput
          {...getFieldProps("dateFrom")}
          type="date"
          id="dateFrom"
          label="Date From"
          onChangeData={(data: any) => handleFieldChange("dateFrom", data)}
        />
        <ERPDateInput
          {...getFieldProps("dateTo")}
          type="date"
          id="dateTo"
          label="Date To"
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
          label="User"
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
          label="Counter"
        />
        <div className="flex justify-start gap-3">
        <ERPCheckbox
          {...getFieldProps("isTransaction")}
          label="Transaction"
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
          label="Action"
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
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
});

export default UserActionReport;
