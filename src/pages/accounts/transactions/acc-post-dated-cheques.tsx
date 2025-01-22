import { useMemo, useState } from "react";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPRadio from "../../../components/ERPComponents/erp-radio";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ErpInput from "../../../components/ERPComponents/erp-input";
import { useTranslation } from "react-i18next";

interface FormState {
  paymentType: "payment" | "receipt";
  chequeFromDate: string;
  chequeToDate: string;
  isBank: boolean;
  selectedBankId: string | null;
  bankDateType: "today" | "cheque";
  bankChangeType: "change" | "commission";
  total: string;
  reload: boolean;
}

interface LoadingState {
  setAllDate: boolean;
  exportToExcel: boolean;
  show: boolean;
  save: boolean;
  close: boolean;
}

const PostDatedCheques = () => {
  const [formState, setFormState] = useState<FormState>({
    paymentType: "payment",
    chequeFromDate: "",
    chequeToDate: "",
    isBank: false,
    selectedBankId: null,
    bankDateType: "today",
    bankChangeType: "change",
    total: "0",
    reload: false,
  });

  const [loading, setLoading] = useState<LoadingState>({
    setAllDate: false,
    exportToExcel: false,
    show: false,
    save: false,
    close: false,
  });
  const { t } = useTranslation("transaction");
  const handlePaymentTypeChange = (type: "payment" | "receipt") => {
    setFormState((prev) => ({ ...prev, paymentType: type }));
  };

  const handleDateChange = (
    field: "chequeFromDate" | "chequeToDate",
    value: string
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleBankCheckboxChange = (checked: boolean) => {
    setFormState((prev) => ({ ...prev, isBank: checked }));
  };

  const handleBankSelection = (value: string | null) => {
    setFormState((prev) => ({ ...prev, selectedBankId: value }));
  };

  const handleBankDateTypeChange = (type: "today" | "cheque") => {
    setFormState((prev) => ({ ...prev, bankDateType: type }));
  };

  const handleBankChangeTypeChange = (type: "change" | "commission") => {
    setFormState((prev) => ({ ...prev, bankChangeType: type }));
  };

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, total: e.target.value }));
  };

  const handleSetAllDate = async () => {
    setLoading((prev) => ({ ...prev, setAllDate: true }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Setting all dates");
    } finally {
      setLoading((prev) => ({ ...prev, setAllDate: false }));
    }
  };

  const handleExportToExcel = async () => {
    setLoading((prev) => ({ ...prev, exportToExcel: true }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Exporting to Excel");
    } finally {
      setLoading((prev) => ({ ...prev, exportToExcel: false }));
    }
  };

  const handleShow = async () => {
    setLoading((prev) => ({ ...prev, show: true }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFormState((prev) => ({ ...prev, reload: !prev.reload }));
    } finally {
      setLoading((prev) => ({ ...prev, show: false }));
    }
  };

  const handleSave = async () => {
    setLoading((prev) => ({ ...prev, save: true }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Saving data", formState);
    } finally {
      setLoading((prev) => ({ ...prev, save: false }));
    }
  };

  const handleClose = async () => {
    setLoading((prev) => ({ ...prev, close: true }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Closing form");
    } finally {
      setLoading((prev) => ({ ...prev, close: false }));
    }
  };

  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "AccTransactionMasterID",
        caption: t("acc_transaction_master_id"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 200,
      },
      {
        dataField: "AccTransactionDetailID",
        caption: t("acc_transaction_detail_id"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 200,
        allowEditing: true,
      },
      {
        dataField: "LedgerName",
        caption: t("ledger_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 200,
        allowEditing: true,
      },
      {
        dataField: "RelatedLedger",
        caption: t("related_ledger"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        allowEditing: true,
      },
      {
        dataField: "ChequeNumber",
        caption: t("cheque_number"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        allowEditing: true,
      },
      {
        dataField: "CheckStatus",
        caption: t("check_status"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        allowEditing: true,
      },
      {
        dataField: "ChequeDate",
        caption: t("cheque_date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        allowEditing: true,
      },
      {
        dataField: "ChequeBounceDate",
        caption: t("cheque_bounce_date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        allowEditing: true,
      },
      {
        dataField: "Amount",
        caption: t("amount"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        allowEditing: true,
      },
      {
        dataField: "IsCleared",
        caption: t("is_cleared"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        allowEditing: true,
      },
      {
        dataField: "LedgerID",
        caption: t("ledger_id"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        allowEditing: true,
      },
      {
        dataField: "RelatedLedgerID",
        caption: t("related_ledger_id"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        allowEditing: true,
      },
      {
        dataField: "BankCharge",
        caption: t("bank_charge"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        allowEditing: true,
      },
    ],
    []
  );

  return (
    <div className="space-y-6 p-4">
      <h1 className="box-title !text-xl !font-medium">{t("post_dated_cheques")}</h1>
      <div className="dark:!bg-dark-bg bg-[#fafafa] p-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="border rounded-sm shadow-sm p-4 my-3 basis-1/2">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-4 gap-4 items-center">
                <ERPRadio
                  id="payment"
                  name="paymentType"
                  checked={formState.paymentType === "payment"}
                  onChange={() => handlePaymentTypeChange("payment")}
                  label={t("payment")}
                />
                <ERPRadio
                  id="receipt"
                  name="paymentType"
                  checked={formState.paymentType === "receipt"}
                  onChange={() => handlePaymentTypeChange("receipt")}
                  label={t("receipt")}
                />
                <ERPButton
                  title={t("set_all_date")}
                  onClick={handleSetAllDate}
                  type="reset"
                  loading={loading.setAllDate}
                />
                <ERPButton
                  title={t("to_excel")}
                  onClick={handleExportToExcel}
                  startIcon="ri-file-excel-2-line"
                  variant="primary"
                  loading={loading.exportToExcel}
                />
              </div>
              <div className="flex items-center gap-4">
                <ERPDateInput
                  id="chequeFromDate"
                  label={t("cheque_from_date")}
                  onChange={(e) =>
                    handleDateChange("chequeFromDate", e.target.value)
                  }
                  value={formState.chequeFromDate}
                />
                <ERPDateInput
                  id="chequeToDate"
                  label={t("to_date")}
                  onChange={(e) =>
                    handleDateChange("chequeToDate", e.target.value)
                  }
                  value={formState.chequeToDate}
                />
              </div>

              <div className="flex items-center justify-start space-x-4">
                <ERPCheckbox
                  id="bankCheckbox"
                  name="bankCheckbox"
                  checked={formState.isBank}
                  onChange={(e) => handleBankCheckboxChange(e.target.checked)}
                  label={t("bank")}
                />
                <ERPDataCombobox
                  className="min-w-[259px]"
                  id="counterID"
                  noLabel
                  value={formState.selectedBankId}
                  onChange={(e) => handleBankSelection(e?.value ?? null)}
                />
              </div>
            </div>
          </div>

          <div className="border rounded-sm shadow-sm p-4 my-3 basis-1/2 py-11">
            <h1 className="box-title !text-xl !font-medium text-center">
             {t("set_as_bank_date")}
            </h1>
            <div className="grid grid-cols-1 gap-5 my-3">
              <div className="flex items-center justify-center space-x-10">
                <ERPRadio
                  id="todayDate"
                  name="bankDateType"
                  checked={formState.bankDateType === "today"}
                  onChange={() => handleBankDateTypeChange("today")}
                  label={t("today's_date")}
                />
                <ERPRadio
                  id="chequeDate"
                  name="bankDateType"
                  checked={formState.bankDateType === "cheque"}
                  onChange={() => handleBankDateTypeChange("cheque")}
                  label={t("cheque_date")}
                />
              </div>

              <div className="flex items-center justify-center space-x-5">
                <ERPButton
                  title={t("show")}
                  onClick={handleShow}
                  startIcon="ri-slideshow-2-line"
                  variant="secondary"
                  loading={loading.show}
                />
                <ERPButton
                  title={t("save")}
                  onClick={handleSave}
                  startIcon="ri-save-line"
                  variant="primary"
                  loading={loading.save}
                />
                <ERPButton
                  title={t("close")}
                  onClick={handleClose}
                  startIcon="ri-file-close-line"
                  variant="secondary"
                  loading={loading.close}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <ErpDevGrid
            columns={columns}
            gridId="grid_post-dated_cheques"
            hideGridAddButton={true}
            hideDefaultExportButton={true}
            heightToAdjustOnWindows={500}
            reload={formState.reload}
            pageSize={40}
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-10 border border-dotted border-gray-400 rounded-sm py-4 px-2">
            <ERPRadio
              id="bankChange"
              name="bankChangeType"
              checked={formState.bankChangeType === "change"}
              onChange={() => handleBankChangeTypeChange("change")}
              label={t("bank_change")}
            />
            <ERPRadio
              id="bankCommission"
              name="bankChangeType"
              checked={formState.bankChangeType === "commission"}
              onChange={() => handleBankChangeTypeChange("commission")}
              label={t("bank_commission")}
            />
          </div>

          <ErpInput
            id="total"
            label={t("total")}
            labelDirection="horizontal"
            onChange={handleTotalChange}
            value={formState.total}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDatedCheques;
