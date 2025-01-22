import { useMemo, useState } from "react";
import ERPRadio from "../../../components/ERPComponents/erp-radio";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import { useTranslation } from "react-i18next";

interface FormState {
  showReconciled: boolean;
  selectedBankId: string | null;
  bankDateType: "today" | "cheque";
  reload: boolean;
}

interface LoadingState {
  setAllDate: boolean;
  exportToExcel: boolean;
  show: boolean;
  save: boolean;
  print: boolean;
}

const BankReconciliation = () => {
  const dispatch = useAppDispatch();
  const rootState = useRootState();

  const [formState, setFormState] = useState<FormState>({
    showReconciled: false,
    selectedBankId: null,
    bankDateType: "today",
    reload: false,
  });

  const [loading, setLoading] = useState<LoadingState>({
    setAllDate: false,
    exportToExcel: false,
    show: false,
    save: false,
    print: false,
  });

  const { t } = useTranslation("transaction");

  const handleReconciledChange = (checked: boolean) => {
    setFormState((prev) => ({ ...prev, showReconciled: checked }));
  };

  const handleBankSelection = (value: string | null) => {
    setFormState((prev) => ({ ...prev, selectedBankId: value }));
  };

  const handleBankDateTypeChange = (type: "today" | "cheque") => {
    setFormState((prev) => ({ ...prev, bankDateType: type }));
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
      console.log("Saving changes");
    } finally {
      setLoading((prev) => ({ ...prev, save: false }));
    }
  };

  const handlePrint = async () => {
    setLoading((prev) => ({ ...prev, print: true }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Printing document");
    } finally {
      setLoading((prev) => ({ ...prev, print: false }));
    }
  };

  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "TransactionDate",
        caption: t("transaction_date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 200,
      },
      {
        dataField: "VoucherType",
        caption: t("voucher_type"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 200,
        allowEditing: true,
      },
      {
        dataField: "VoucherNumber",
        caption: t("voucher_number"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 200,
        allowEditing: true,
      },
      {
        dataField: "Particulars",
        caption: t("particulars"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        allowEditing: true,
      },
      {
        dataField: "Debit",
        caption: t("debit"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        allowEditing: true,
      },
      {
        dataField: "Credit",
        caption: t("credit"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        allowEditing: true,
      },
      {
        dataField: "Narration",
        caption: t("narration"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        allowEditing: true,
      },
      {
        dataField: "VoucherPrefix",
        caption: t("voucher_prefix"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        allowEditing: true,
      },
      {
        dataField: "ReferenceNumber",
        caption: t("reference_number"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        allowEditing: true,
      },
      {
        dataField: "ReferenceDate",
        caption: t("reference_date"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        allowEditing: true,
      },
      {
        dataField: "AccTransactionDetailID",
        caption: t("acc_transaction_detail_id"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        allowEditing: true,
      },
      {
        dataField: "BankDate",
        caption: t("bank_date"),
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
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        allowEditing: true,
      },
      {
        dataField: "CheckStatus",
        caption: t("check_status"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        allowEditing: true,
      },
      {
        dataField: "ChequeDate",
        caption: t("cheque_date"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        allowEditing: true,
      },
      {
        dataField: "LedgerID",
        caption: t("ledger_id"),
        dataType: "string",
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
      <h1 className="box-title !text-xl !font-medium">
        {t("bank_reconciliation")}
      </h1>
      <div className="dark:!bg-dark-bg bg-[#fafafa] p-4">
        <div className="border rounded-sm shadow-sm p-4">
          <div className="w-1/3">
            <div className="flex items-center justify-between">
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
              <ERPButton
                title={t("set_all_date")}
                onClick={handleSetAllDate}
                type="reset"
                loading={loading.setAllDate}
              />
            </div>

            <div className="flex items-center justify-between space-x-4 my-2">
              <ERPCheckbox
                id="showReconciled"
                name="showReconciled"
                checked={formState.showReconciled}
                onChange={(e) => handleReconciledChange(e.target.checked)}
                label={t("show_reconciled")}
              />
              <ERPButton
                title={t("show")}
                onClick={handleShow}
                startIcon="ri-slideshow-2-line"
                variant="secondary"
                loading={loading.show}
              />
              <ERPDataCombobox
                id="BankAC"
                noLabel
                value={formState.selectedBankId}
                onChange={(e) => handleBankSelection(e?.value ?? null)}
              />
            </div>

            <div className="flex items-center gap-4">
              <ERPButton
                title={t("save")}
                onClick={handleSave}
                startIcon="ri-save-line"
                variant="primary"
                loading={loading.save}
              />
              <ERPButton
                title={t("print")}
                onClick={handlePrint}
                startIcon="ri-printer-line"
                variant="secondary"
                loading={loading.print}
              />
              <ERPButton
                title={t("to_excel")}
                onClick={handleExportToExcel}
                startIcon="ri-file-excel-2-line"
                variant="primary"
                loading={loading.exportToExcel}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <ErpDevGrid
            columns={columns}
            gridId="grid_bank_reconciliation"
            hideGridAddButton={true}
            hideDefaultExportButton={true}
            heightToAdjustOnWindows={1000}
            reload={formState.reload}
            pageSize={40}
          />
        </div>
      </div>
    </div>
  );
};

export default BankReconciliation;
