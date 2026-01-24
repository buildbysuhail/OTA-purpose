import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { useTranslation } from "react-i18next";
import { toggleEmployee } from "../../../../redux/slices/popup-reducer";
import { Employee, initialEmployee } from "./Employee-types";

export const EmployeeManage: React.FC = React.memo(() => {
    const rootState = useRootState();
    const dispatch = useDispatch();
    const {
        isEdit,
        handleClear,
        handleSubmit,
        handleFieldChange,
        getFieldProps,
        formState,
        isLoading,
        handleClose
    } = useFormManager<Employee>({
        url: Urls.employee,
        onSuccess: useCallback(() => dispatch(toggleEmployee({ isOpen: false, key: null, reload: true })), [dispatch]),
        onClose: useCallback(() => dispatch(toggleEmployee({ isOpen: false, key: null, reload: false })), [dispatch]),
        key: rootState.PopupData.employee.key,
        useApiClient: true,
        initialData: initialEmployee,
    });
    const { t } = useTranslation("hr");
    return (
        <div className="w-full modal-content">
            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-3">
        <ERPInput
          {...getFieldProps("employeeCode")}
          label={t("code")}
          placeholder={t("enter_code")}
          required={true}
          readOnly={rootState.PopupData.employee.mode == "view"}
          onChangeData={(data: any) => handleFieldChange("employeeCode", data.employeeCode)}
          autoFocus={true}
          fetching={formState?.loading !== false ? true : false}
        />

        <ERPInput
          {...getFieldProps("employeeName")}
          label={t("name")}
          placeholder={t("enter_name")}
          required={true}
          readOnly={rootState.PopupData.employee.mode == "view"}
          onChangeData={(data: any) => handleFieldChange("employeeName", data.employeeName)}
          fetching={formState?.loading !== false ? true : false}         
        />

        <ERPInput
          {...getFieldProps("shortName")}
          label={t("short_Name")}
          placeholder={t("enter_short_name")}
          onChangeData={(data: any) => handleFieldChange("shortName", data.shortName)}
          readOnly={rootState.PopupData.employee.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />

        <ERPInput
          {...getFieldProps("probotion_Period")}
          label={t("probotion_Period")}
          placeholder={t("probotion_Period")}
          onChangeData={(data: any) => handleFieldChange("probotionPeriod", data.probotionPeriod)}
          readOnly={rootState.PopupData.employee.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />
        <ERPInput
          {...getFieldProps("mobile")}
          label={t("mobile")}
          placeholder={t("mobile")}
          onChangeData={(data: any) => handleFieldChange("mobile", data.mobile)}
          readOnly={rootState.PopupData.employee.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />
        <ERPInput
          {...getFieldProps("probotion_Period")}
          label={t("probotion_Period")}
          placeholder={t("probotion_Period")}
          onChangeData={(data: any) => handleFieldChange("probotionPeriod", data.probotionPeriod)}
          readOnly={rootState.PopupData.employee.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />
        <ERPInput
          {...getFieldProps("cl")}
          label={t("no_of_cl")}
          placeholder={t("no_of_cl")}
          onChangeData={(data: any) => handleFieldChange("cl", data.cl)}
          readOnly={rootState.PopupData.employee.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />
        <ERPInput
          {...getFieldProps("da")}
          label={t("DA/OT")}
          placeholder={t("DA/OT")}
          onChangeData={(data: any) => handleFieldChange("da", data.da)}
          readOnly={rootState.PopupData.employee.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />
        <ERPInput
          {...getFieldProps("incentivePerc")}
          label={t("incentive %")}
          placeholder={t("incentive_percentage")}
          onChangeData={(data: any) => handleFieldChange("incentivePerc", data.incentivePerc)}
          readOnly={rootState.PopupData.employee.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />
        <ERPInput
          {...getFieldProps("designationName")}
          label={t("designation_Name")}
          placeholder={t("designation_Name")}
          onChangeData={(data: any) => handleFieldChange("designationName", data.designationName)}
          readOnly={rootState.PopupData.employee.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />
        <ERPInput
          {...getFieldProps("accLedgerID")}
          label={t("accLedger_ID")}
          placeholder={t("accLedger_ID")}
          onChangeData={(data: any) => handleFieldChange("accLedgerID", data.accLedgerID)}
          readOnly={rootState.PopupData.employee.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />
        <ERPInput
          {...getFieldProps("gender")}
          label={t("gender")}
          placeholder={t("gender")}
          onChangeData={(data: any) => handleFieldChange("gender", data.gender)}
          readOnly={rootState.PopupData.employee.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />
        <ERPInput
          {...getFieldProps("doj")}
          label={t("date_of_joining")}
          placeholder={t("date_of_joining")}
          onChangeData={(data: any) => handleFieldChange("doj", data.doj)}
          readOnly={rootState.PopupData.employee.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />
        
        <ERPInput
          {...getFieldProps("remarks")}
          label={t("Remarks/ACC#")}
          placeholder={t("remarks")}
          onChangeData={(data: any) => handleFieldChange("remarks", data.remarks)}
          readOnly={rootState.PopupData.employee.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />
          <ERPInput
          {...getFieldProps("notes")}
          label={t("Remarks/ACC#")}
          placeholder={t("remarks")}
          onChangeData={(data: any) => handleFieldChange("notes", data.notes)}
          readOnly={rootState.PopupData.employee.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />
        <ERPInput
          {...getFieldProps("costCentre")}
          label={t("cost_Centre")}
          placeholder={t("cost_Centre")}
          onChangeData={(data: any) => handleFieldChange("costCentre", data.costCentre)}
          readOnly={rootState.PopupData.employee.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />
      </div>
            <ERPFormButtons
                    onClear={rootState.PopupData.employee.mode == "view" ? undefined : formState?.loading !== false ? undefined : handleClear}
                    isEdit={isEdit}
                    isLoading={isLoading}
                    onCancel={handleClose}
                    onSubmit={rootState.PopupData.employee.mode == "view" ? undefined : formState?.loading !== false ? undefined : handleSubmit}
                  />
                </div>
    );
});
