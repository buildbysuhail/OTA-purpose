import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";

import { toggleEmpDocuments } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";

/* ---------- Initial Data ---------- */
const initialEmpDocuments = {
  employeeID: 0,

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
};

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
  } = useFormManager<any>({
    url: Urls.emp_documents,
    useApiClient: true,
    initialData: initialEmpDocuments,
    onSuccess: useCallback(
      () => dispatch(toggleEmpDocuments({ isOpen: false, reload: true })),
      [dispatch]
    ),
    onClose: useCallback(
      () => dispatch(toggleEmpDocuments({ isOpen: false })),
      [dispatch]
    ),
  });

  /* ---------- Row Renderer ---------- */
  const Row = (
    label: string,
    no: string,
    issue: string,
    exp: string
  ) => (
    <div className="grid grid-cols-4 gap-3 items-center">
      <div className="font-medium">{label}</div>

      <ERPInput
        {...getFieldProps(no)}
        onChangeData={(d: any) => handleFieldChange(no, d[no])}
      />

      <ERPInput
        {...getFieldProps(issue)}
        type="date"
        onChangeData={(d: any) => handleFieldChange(issue, d[issue])}
      />

      <ERPInput
        {...getFieldProps(exp)}
        type="date"
        onChangeData={(d: any) => handleFieldChange(exp, d[exp])}
      />
    </div>
  );

  return (
    <div className="w-full modal-content">

      {/* Employee */}
      <div className="grid grid-cols-4 gap-3 items-center mb-4">
        <div className="font-medium">{t("employee")}</div>
        <div className="col-span-3">
          <ERPDataCombobox
                  {...getFieldProps("employeeID")}
                  label={t("employee")}
                  field={{
                    id: "employeeID",
                    getListUrl: Urls.data_employees,
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onSelectItem={(data) =>
                    handleFieldChange({ employeeID: data.value, employeeName: data.name })
                  }
                />
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-4 font-semibold border-b pb-1 mb-2">
        <div>{t("document")}</div>
        <div>{t("document_no")}</div>
        <div>{t("issue_date")}</div>
        <div>{t("expiry_date")}</div>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {Row("Pass Port", "passPortNo", "passIssueDate", "passExpDate")}
        {Row("Residence", "residensePNo", "resiIssueDate", "resiExpDate")}
        {Row("Visa", "visaNo", "visaIssueDate", "visaExpDate")}
        {Row("Driving License", "driveLicenseNo", "driveLicIssueDate", "driveLicExpDate")}
        {Row("Insurance 1", "insuranceNo", "insuranceIssueDate", "insuranceExpDate")}
        {Row("Insurance 2", "insurance2No", "insurance2IssueDate", "insurance2ExpDate")}
        {Row("Medical", "medical", "medicalIssueDate", "medicalExpDate")}
        {Row("Contract", "contractNo", "contractIssueDate", "contractExpDate")}
        {Row("Vacation Period", "vacation", "vacationIssueDate", "vacationExpDate")}
      </div>

      {/* Buttons */}
      <div className="mt-4">
        <ERPFormButtons
          onClear={handleClear}
          isEdit={isEdit}
          isLoading={isLoading}
          onCancel={handleClose}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
});

export default EmpDocumentsManage;
