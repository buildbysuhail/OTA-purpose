import { useEffect, useMemo, useRef, useState } from "react";
import ERPRadio from "../../../components/ERPComponents/erp-radio";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import { useTranslation } from "react-i18next";
import { FileSpreadsheet, Printer, X } from "lucide-react";

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
  const btnSaveRef = useRef<HTMLButtonElement>(null);
  const [gridHeight, setGridHeight] = useState(200);
  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeightWindows = wh - 800;
    setGridHeight(gridHeightWindows);
  }, [window.innerHeight]);

  const goToPreviousPage = () => {
    window.history.back();
  };

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
    } finally {
      setLoading((prev) => ({ ...prev, setAllDate: false }));
    }
  };

  const handleExportToExcel = async () => {
    setLoading((prev) => ({ ...prev, exportToExcel: true }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
    } finally {
      setLoading((prev) => ({ ...prev, save: false }));
    }
  };

  const handlePrint = async () => {
    setLoading((prev) => ({ ...prev, print: true }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
    <>
      <div className="relative min-h-screen">
        <div className="flex items-center p-0 border dark:border-dark-border border-gray-300 rounded-b-sm dark:bg-dark-bg bg-[#f4f4f5] me-[1px]">
          <div className="flex items-center ms-4 text-blue-500 cursor-pointer">
            <h6 className="text-center text-lg font-bold mb-0 whitespace-nowrap overflow-hidden text-ellipsis">
              {t("bank_reconciliation")}
            </h6>
            <i className="fas fa-cog ms-1"></i>
          </div>

          <div className="flex items-center justify-end space-x-4 p-1 w-full">
            <div className="group relative inline-flex flex-col items-center" title={t("print")}>
              <button className="flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg  bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors" onClick={handlePrint}>
                <Printer className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>

            <div className="group relative inline-flex flex-col items-center" title={t("excel")}>
              <button className="flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg  bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors" onClick={handleExportToExcel}>
                <FileSpreadsheet className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>

            <div className="group relative inline-flex flex-col items-center" title={t("close")}>
              <button className="flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg  bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors" onClick={goToPreviousPage}>
                <X className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="dark:!bg-dark-bg bg-[#fafafa] p-4">
            <div className="p-4">
              <div className="flex flex-col gap-2 w-1/3">
                <div className="flex items-center justify-between gap-4">
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
                <div className="flex items-center justify-between gap-4">
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
              </div>
            </div>

            <ErpDevGrid
              columns={columns}
              gridId="grid_bank_reconciliation"
              hideGridAddButton={true}
              hideDefaultExportButton={true}
              height={gridHeight}
              reload={formState.reload}
              pageSize={40}
              className="pb-16"
            />

            <div className="fixed bottom-0 left-0 right-0 z-10 px-4 py-2 bg-white dark:bg-dark-bg border-t dark:border-dark-border shadow-lg"
              style={{ boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)", }}>
              <div className="w-full mx-auto flex items-center gap-4 justify-end">
                <ERPButton
                  ref={btnSaveRef}
                  title={t("cancel")}
                  onClick={goToPreviousPage}
                  className="w-24"
                />
                <ERPButton
                  title={t("save")}
                  onClick={handleSave}
                  variant="primary"
                  className="w-24"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BankReconciliation;
