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
import { Tab, Tabs } from "@mui/material";
import ErpDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";

export const EmployeeManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = React.useState("general");
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };
  const { t } = useTranslation("hr");
  return (
    <div className="w-full">

        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab
            label={t("general")}
            value="general"
            className="dark:text-dark-text"
          />

          <Tab
            label={t("more_details")}
            value="more_details"
            className="dark:text-dark-text"
          />

          <Tab
            label={t("contact_details")}
            value="contact_details"
            className="dark:text-dark-text"
          />
        </Tabs>

        {activeTab === "general" && (
          <div className="grid xxl:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-3">
            <ERPInput
              {...getFieldProps("employeeCode")}
              label={t("employee_code")}
              placeholder={t("enter_employee_code")}
              required={true}
              readOnly={rootState.PopupData.employee.mode == "view"}
              onChangeData={(data: any) => handleFieldChange("employeeCode", data.employeeCode)}
              autoFocus={true}
              fetching={formState?.loading !== false ? true : false}
            />

            <ERPInput
              {...getFieldProps("employeeName")}
              label={t("employee_name")}
              placeholder={t("enter_employee_name")}
              required={true}
              readOnly={rootState.PopupData.employee.mode == "view"}
              onChangeData={(data: any) => handleFieldChange("employeeName", data.employeeName)}
              fetching={formState?.loading !== false ? true : false}
            />

            <ERPInput
              {...getFieldProps("shortName")}
              label={t("short_Name")}
              placeholder={t("short_Name")}
              onChangeData={(data: any) => handleFieldChange("shortName", data.shortName)}
              readOnly={rootState.PopupData.employee.mode == "view"}
              fetching={formState?.loading !== false ? true : false}
            />

            <ERPInput
              {...getFieldProps("probotion_Period")}
              type="number"
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
              {...getFieldProps("period_type")}
              label={t("period_type")}
              placeholder={t("period_type")}
              onChangeData={(data: any) => handleFieldChange("period_type", data.period_type)}
              readOnly={rootState.PopupData.employee.mode == "view"}
              fetching={formState?.loading !== false ? true : false}
            />
            <div className="flex">
              <ERPInput
              {...getFieldProps("cl")}
              type="number"
              label={t("cl")}
              placeholder={t("cl")}
              onChangeData={(data: any) => handleFieldChange("cl", data.cl)}
              readOnly={rootState.PopupData.employee.mode == "view"}
              fetching={formState?.loading !== false ? true : false}
            />

              <ERPInput
                {...getFieldProps("da")}
                type="number"
                label={t("DA/OT")}
                placeholder={t("DA/OT")}
                onChangeData={(data: any) => handleFieldChange("da", data.da)}
                readOnly={rootState.PopupData.employee.mode == "view"}
                fetching={formState?.loading !== false ? true : false}
              />
              <ERPInput
                {...getFieldProps("incentivePerc")}
                type="number"
                label={t("incentive %")}
                placeholder={t("incentive_percentage")}
                onChangeData={(data: any) => handleFieldChange("incentivePerc", data.incentivePerc)}
                readOnly={rootState.PopupData.employee.mode == "view"}
                fetching={formState?.loading !== false ? true : false}
              />
              <ERPInput
                {...getFieldProps("salesTarget")}
                type="number"
                label={t("sales_Target")}
                placeholder={t("sales_Target")}
                onChangeData={(data: any) => handleFieldChange("salesTarget", data.salesTarget)}
                readOnly={rootState.PopupData.employee.mode == "view"}
                fetching={formState?.loading !== false ? true : false}
              />
            </div>
            <ERPInput
              {...getFieldProps("designationName")}
              label={t("designation_Name")}
              placeholder={t("designation_Name")}
              onChangeData={(data: any) => handleFieldChange("designationName", data.designationName)}
              readOnly={rootState.PopupData.employee.mode == "view"}
              fetching={formState?.loading !== false ? true : false}
            />
            <ErpDataCombobox
              {...getFieldProps("gender")}
              id="gender"
              field={{
                id:"gender",
                valueKey:"id",
                labelKey:"name",
              }}
              options={[
                { id: "M", name: "Male" },
                { id: "F", name: "Female" },
              ]}
              label={t("gender")}
              onChangeData={(data: any) => handleFieldChange("gender", data.gender)}
              disabled={rootState.PopupData.employee.mode == "view"}
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
            <ERPDateInput
              {...getFieldProps("doj")}
              label={t("doj")}
              placeholder={t("doj")}
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
            <div className="flex gap-2">
              <ERPInput
                {...getFieldProps("salary")}
                type="number"
                label={t("salary_(monthly)")}
                placeholder={t("salary")}
                onChangeData={(data: any) => handleFieldChange("salary", data.salary)}
                readOnly={rootState.PopupData.employee.mode == "view"}
                fetching={formState?.loading !== false ? true : false}
              />
              <ERPInput
                {...getFieldProps("otAmount")}
                type="number"
                label={t("ot_amount")}
                placeholder={t("ot_amount")}
                onChangeData={(data: any) => handleFieldChange("otAmount", data.otAmount)}
                readOnly={rootState.PopupData.employee.mode == "view"}
                fetching={formState?.loading !== false ? true : false}
              />
            </div>
            <div className="flex gap-2">
              <ERPInput
                {...getFieldProps("totalWorkingHrs")}
                type="number"
                label={t("total")}
                placeholder={t("total_working_hours")}
                onChangeData={(data: any) => handleFieldChange("totalWorkingHrs", data.totalWorkingHrs)}
                readOnly={rootState.PopupData.employee.mode == "view"}
                fetching={formState?.loading !== false ? true : false}
              />
              <ERPInput
                {...getFieldProps("pf")}
                type="number"
                label={t("pf")}
                placeholder={t("pf")}
                onChangeData={(data: any) => handleFieldChange("pf", data.pf)}
                readOnly={rootState.PopupData.employee.mode == "view"}
                fetching={formState?.loading !== false ? true : false}
              />
            </div>
            <ERPInput
              {...getFieldProps("notes")}
              label={t("notes")}
              placeholder={t("notes")}
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
        )}
        {activeTab === "more_details" && (
          <div className="grid xxl:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-3">
            <ERPInput
              {...getFieldProps("qualification")}
              label={t("qualification")}
              placeholder={t("qualification")}
              onChangeData={(data: any) => handleFieldChange("qualification", data.qualification)}
              readOnly={rootState.PopupData.employee.mode == "view"}
              fetching={formState?.loading !== false ? true : false}
            />
            <ERPDateInput
              {...getFieldProps("dob")}
              label={t("dob")}
              placeholder={t("dob")}
              onChangeData={(data: any) => handleFieldChange("dob", data.dob)}
              readOnly={rootState.PopupData.employee.mode == "view"}
              fetching={formState?.loading !== false ? true : false}
            />
            <div className="flex">
              <ErpDataCombobox
              {...getFieldProps("bloodGroup")}
              id="bloodGroup"
              field={{
                id:"bloodGroup",
                valueKey:"id",
                labelKey:"name",
              }}
              options={[
                { id: "A+", name: "A+" },
                { id: "B+", name: "B+" },
                { id: "AB+", name: "AB+" },
                { id: "O+", name: "O+" },
                { id: "A-", name: "A-" },
                { id: "B-", name: "B-" },
                { id: "AB-", name: "AB-" },
                { id: "O-", name: "O-" },
              ]}
              label={t("blood_Group")}
              onChangeData={(data: any) => handleFieldChange("bloodGroup", data.bloodGroup)}
              disabled={rootState.PopupData.employee.mode == "view"}
              fetching={formState?.loading !== false ? true : false}
            />
            </div>
            
            <ERPInput
              {...getFieldProps("nationality")}
              label={t("nationality")}
              placeholder={t("nationality")}
              onChangeData={(data: any) => handleFieldChange("nationality", data.nationality)}
              readOnly={rootState.PopupData.employee.mode == "view"}
              fetching={formState?.loading !== false ? true : false}  
            />
            
            <ERPInput
              {...getFieldProps("passportNo")}
              label={t("passport_No")}
              placeholder={t("passport_No")}
              onChangeData={(data: any) => handleFieldChange("passportNo", data.passportNo)}
              readOnly={rootState.PopupData.employee.mode == "view"}
              fetching={formState?.loading !== false ? true : false}
            />
            <ERPInput
              {...getFieldProps("visaDetails")}
              label={t("visa_Details")}
              placeholder={t("visa_Details")}
              onChangeData={(data: any) => handleFieldChange("visaDetails", data.visaDetails)}
              readOnly={rootState.PopupData.employee.mode == "view"}
              fetching={formState?.loading !== false ? true : false}
            />
            <ERPDateInput
              {...getFieldProps("passportExpDate")}
              label={t("passport_Exp_Date")}
              placeholder={t("passport_Exp_Date")}
              onChangeData={(data: any) => handleFieldChange("passportExpDate", data.passportExpDate)}
              readOnly={rootState.PopupData.employee.mode == "view"}
              fetching={formState?.loading !== false ? true : false}
            />
            
            <ERPDateInput
              {...getFieldProps("visaExpDate")}
              label={t("visa_Exp_Date")}
              placeholder={t("visa_Exp_Date")}
              onChangeData={(data: any) => handleFieldChange("visaExpDate", data.visaExpDate)}
              readOnly={rootState.PopupData.employee.mode == "view"}  
              fetching={formState?.loading !== false ? true : false}
            />
            <div className="flex gap-8">
              <ERPCheckbox
              {...getFieldProps("isResigned")}
              label={t("is_Resigned")}
              onChangeData={(data: any) => handleFieldChange("isResigned", data.isResigned)}
              readOnly={rootState.PopupData.employee.mode == "view"}
              fetching={formState?.loading !== false ? true : false}
            />
            <ERPCheckbox
              {...getFieldProps("isActive")}
              label={t("is_Active")}
              onChangeData={(data: any) => handleFieldChange("isActive", data.isActive)}
              readOnly={rootState.PopupData.employee.mode == "view"}
              fetching={formState?.loading !== false ? true : false}
            />
           </div>          
            
            <ERPDateInput
              {...getFieldProps("resignDate")}
              label={t("resign_Date")}
              placeholder={t("resign_Date")}
              onChangeData={(data: any) => handleFieldChange("resignDate", data.resignDate)}
              readOnly={rootState.PopupData.employee.mode == "view"}
              fetching={formState?.loading !== false ? true : false}
            />
          </div>

        )}
        {activeTab === "contact_details" && (
        <div className="w-full px-4">
  <div className="max-w-4xl">
    <div className="grid xxl:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-3">
            <ERPInput
              {...getFieldProps("address1")}
              label={t("address1")}
              placeholder={t("address1")}
              onChangeData={(data: any) => handleFieldChange("address1", data.address1)}
              readOnly={rootState.PopupData.employee.mode == "view"}
              fetching={formState?.loading !== false ? true : false}
            />
            <ERPInput
              {...getFieldProps("address2")}
              label={t("address2")}
              placeholder={t("address2")}
              onChangeData={(data: any) => handleFieldChange("address2", data.address2)}
              readOnly={rootState.PopupData.employee.mode == "view"}
              fetching={formState?.loading !== false ? true : false}
            />
            <ERPInput
              {...getFieldProps("address3")}
              label={t("address3")}
              placeholder={t("address3")}
              onChangeData={(data: any) => handleFieldChange("address3", data.address3)}
              readOnly={rootState.PopupData.employee.mode == "view"}
              fetching={formState?.loading !== false ? true : false}
            />
            <ERPInput
              {...getFieldProps("stateName")}
              label={t("state_Name")}
              placeholder={t("state_Name")}
              onChangeData={(data: any) => handleFieldChange("stateName", data.stateName)}
              readOnly={rootState.PopupData.employee.mode == "view"}
              fetching={formState?.loading !== false ? true : false}
            />
          <ERPInput
            {...getFieldProps("pin")}
            label={t("pin")}
            placeholder={t("pin")}
            onChangeData={(data: any) => handleFieldChange("pin", data.pin)}
            readOnly={rootState.PopupData.employee.mode == "view"}
            fetching={formState?.loading !== false ? true : false}
          />
          <ERPInput
            {...getFieldProps("phone")}
            label={t("phone")}
            placeholder={t("phone")}
            onChangeData={(data: any) => handleFieldChange("phone", data.phone)}
            readOnly={rootState.PopupData.employee.mode == "view"}
            fetching={formState?.loading !== false ? true : false}
          />
          <ERPInput
            {...getFieldProps("email")}
            label={t("email")}
            placeholder={t("email")}
            onChangeData={(data: any) => handleFieldChange("email", data.email)}
            readOnly={rootState.PopupData.employee.mode == "view"}
            fetching={formState?.loading !== false ? true : false}
          />
          </div>
        </div>
        </div>
        )}  
          
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
