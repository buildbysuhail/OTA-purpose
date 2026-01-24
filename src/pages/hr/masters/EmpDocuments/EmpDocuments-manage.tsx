import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";

import { toggleEmpDocuments } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";

/* ================= INITIAL DATA ================= */

export const initialEmployeeDocuments = {
  data: {
    employeeID: 0,
    branchID: 0,

    passPortNo: "",
    passIssueDate: "",
    passExpDate: "",

    residensePNo: "",
    resiIssueDate: "",
    resiExpDate: "",

    visaNo: "",
    visaIssueDate: "",
    visaExpDate: "",

    driveLicenseNo: "",
    driveLicIssueDate: "",
    driveLicExpDate: "",

    insuranceNo: "",
    insuranceIssueDate: "",
    insuranceExpDate: "",

    insurance2No: "",
    insurance2IssueDate: "",
    insurance2ExpDate: "",

    medical: "",
    medicalIssueDate: "",
    medicalExpDate: "",

    contractNo: "",
    contractIssueDate: "",
    contractExpDate: "",

    vacation: "",
    vacationIssueDate: "",
    vacationExpDate: "",
  },
  validations: {},
};

export interface EmpDocumentsData {
  employeeID: number;
  branchID: number;

  passPortNo: string;
  passIssueDate: string;
  passExpDate: string;

  residensePNo: string;
  resiIssueDate: string;
  resiExpDate: string;

  visaNo: string;
  visaIssueDate: string;
  visaExpDate: string;

  driveLicenseNo: string;
  driveLicIssueDate: string;
  driveLicExpDate: string;

  insuranceNo: string;
  insuranceIssueDate: string;
  insuranceExpDate: string;

  insurance2No: string;
  insurance2IssueDate: string;
  insurance2ExpDate: string;

  medical: string;
  medicalIssueDate: string;
  medicalExpDate: string;

  contractNo: string;
  contractIssueDate: string;
  contractExpDate: string;

  vacation: string;
  vacationIssueDate: string;
  vacationExpDate: string;
}

/* ================= COMPONENT ================= */

const EmpDocumentsManage: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const rootState = useRootState();
  const { t } = useTranslation("hr");

  const {
    isEdit,
    handleSubmit,
    handleClear,
    handleFieldChange,
    getFieldProps,
    isLoading,
    handleClose,
  } = useFormManager<EmpDocumentsData>({
    url: Urls.emp_documents,
    initialData: initialEmployeeDocuments,
    useApiClient: true,
    key: rootState.PopupData.EmpDocuments?.key,
    onSuccess: useCallback(
      () => dispatch(toggleEmpDocuments({ isOpen: false, reload: true })),
      [dispatch]
    ),
    onClose: useCallback(
      () => dispatch(toggleEmpDocuments({ isOpen: false, reload: false })),
      [dispatch]
    ),
  });

  const DocRow = (
    label: string,
    noField: keyof EmpDocumentsData,
    issueField: keyof EmpDocumentsData,
    expField: keyof EmpDocumentsData
  ) => (
    <div className="grid grid-cols-4 gap-2 items-center">
      <div className="font-medium">{label}</div>

      <ERPInput
        {...getFieldProps(noField)}
        disabled={rootState.PopupData.EmpDocuments?.mode === "view"}
        onChangeData={(d: any) => handleFieldChange(noField, d[noField])}
      />

      <ERPInput
        {...getFieldProps(issueField)}
        type="date"
        disabled={rootState.PopupData.EmpDocuments?.mode === "view"}
        onChangeData={(d: any) => handleFieldChange(issueField, d[issueField])}
      />

      <ERPInput
        {...getFieldProps(expField)}
        type="date"
        disabled={rootState.PopupData.EmpDocuments?.mode === "view"}
        onChangeData={(d: any) => handleFieldChange(expField, d[expField])}
      />
    </div>
  );

  return (
    <div className="w-full modal-content">
      <h2 className="text-center text-lg font-bold mb-4">
        {t("document_details")}
      </h2>

      <div className="mb-4 grid grid-cols-4 items-center gap-2">
        <label className="font-medium">{t("employee")}</label>
        <div className="col-span-3">
          <ERPDataCombobox
            {...getFieldProps("employeeID")}
            field={{
              id: "employeeID",
              required: true,
              getListUrl: Urls.employee,
              valueKey: "employeeID",
              labelKey: "employeeName",
            }}
            disabled={rootState.PopupData.EmpDocuments?.mode === "view"}
            onChangeData={(d: any) =>
              handleFieldChange("employeeID", d.employeeID)
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-4 font-semibold border-b pb-1 mb-2">
        <div>{t("document")}</div>
        <div>{t("document_no")}</div>
        <div>{t("issue_date")}</div>
        <div>{t("expiry_date")}</div>
      </div>

      <div className="space-y-2">
        {DocRow(t("Pass Port"), "passPortNo", "passIssueDate", "passExpDate")}
        {DocRow(t("Residence"), "residensePNo", "resiIssueDate", "resiExpDate")}
        {DocRow(t("Visa"), "visaNo", "visaIssueDate", "visaExpDate")}
        {DocRow(t("Driving License"), "driveLicenseNo", "driveLicIssueDate", "driveLicExpDate")}
        {DocRow(t("Insurance 1"), "insuranceNo", "insuranceIssueDate", "insuranceExpDate")}
        {DocRow(t("Insurance 2"), "insurance2No", "insurance2IssueDate", "insurance2ExpDate")}
        {DocRow(t("Medical"), "medical", "medicalIssueDate", "medicalExpDate")}
        {DocRow(t("Contract"), "contractNo", "contractIssueDate", "contractExpDate")}
        {DocRow(t("Vacation"), "vacation", "vacationIssueDate", "vacationExpDate")}
      </div>

      <ERPFormButtons
        onClear={handleClear}
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={handleClose}
        onSubmit={
          rootState.PopupData.EmpDocuments?.mode === "view"
            ? undefined
            : handleSubmit
        }
      />
    </div>
  );
});

export default EmpDocumentsManage;
