import { useEffect, useMemo, useRef, useState } from "react";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPRadio from "../../../components/ERPComponents/erp-radio";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ErpInput from "../../../components/ERPComponents/erp-input";
import { useTranslation } from "react-i18next";
import { FileSpreadsheet, X } from "lucide-react";

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

  const btnSaveRef = useRef<HTMLButtonElement>(null);

  const goToPreviousPage = () => {
    window.history.back();
  };

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

  const handleClose = async () => {
    setLoading((prev) => ({ ...prev, close: true }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setLoading((prev) => ({ ...prev, close: false }));
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
    <div className="relative min-h-screen bg-white">
      <div className="fixed w-full left-0 z-10 top-[60px]">
        <div className="flex items-center p-0 border dark:border-dark-border border-gray-300 rounded-b-sm dark:bg-dark-bg bg-[#f4f4f5] me-[1px]">
          <div className="flex items-center ms-4 text-blue-500 cursor-pointer">
            <h6 className="text-lg font-bold mb-0 whitespace-nowrap overflow-hidden text-ellipsis ml-0 transition-all duration-300 [@media(min-width:1000px)]:ml-[231px]">
              {t("post_dated_cheques")}
            </h6>
            <i className="fas fa-cog ms-1"></i>
          </div>

          <div className="flex items-center justify-end space-x-4 p-1 w-full">
            <div
              className="group relative inline-flex flex-col items-center"
              title={t("excel")}
            >
              <button
                className="flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg  bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                onClick={handleExportToExcel}
              >
                <FileSpreadsheet className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>

            <div
              className="group relative inline-flex flex-col items-center"
              title={t("close")}
            >
              <button
                className="flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg  bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                onClick={goToPreviousPage}
              >
                <X className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="dark:!bg-dark-bg bg-[#fafafa] p-4">
          <div className="w-full">
            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
              {/* Left Section */}
              <div className="p-4">
                <div className="flex flex-col gap-4">
                  {/* Payment Type Radio Buttons */}
                  <div className="flex gap-6">
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
                  </div>

                  {/* Date and Bank Selection */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <ERPDateInput
                        id="chequeFromDate"
                        label={t("cheque_from_date")}
                        onChange={(e) =>
                          handleDateChange("chequeFromDate", e.target.value)
                        }
                        value={formState.chequeFromDate}
                        className="w-auto"
                      />
                      <ERPDateInput
                        id="chequeToDate"
                        label={t("to_date")}
                        onChange={(e) =>
                          handleDateChange("chequeToDate", e.target.value)
                        }
                        value={formState.chequeToDate}
                        className="w-auto"
                      />
                    </div>
                  </div>

                  {/* Counter ID and Bank Section */}
                  <div className="flex items-end gap-4">
                    <ERPDataCombobox
                      id="counterID"
                      noLabel
                      value={formState.selectedBankId}
                      onChange={(e) => handleBankSelection(e?.value ?? null)}
                      className="w-64"
                    />
                    <div className="flex items-center gap-4">
                      <ERPCheckbox
                        id="bankCheckbox"
                        name="bankCheckbox"
                        checked={formState.isBank}
                        onChange={(e) =>
                          handleBankCheckboxChange(e.target.checked)
                        }
                        label={t("bank")}
                      />
                      <ERPButton
                        title={t("show")}
                        onClick={handleShow}
                        variant="primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="p-4 flex flex-col gap-4">
                <h1 className="text-[14px] font-medium tracking-wider mb-4">
                  {t("set_as_bank_date")}
                </h1>
                <div className="flex flex-wrap items-center gap-4">
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
                <div>
                  <ERPButton
                    title={t("set_all_date")}
                    onClick={handleSetAllDate}
                    type="reset"
                    className="bg-amber-500 text-white font-medium"
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
              heightToAdjustOnWindows={400}
              reload={formState.reload}
              pageSize={40}
            />
          </div>

          <div
            className="fixed bottom-0 left-0 right-0 z-10 px-4 py-2 bg-white dark:bg-dark-bg border-t dark:border-dark-border shadow-lg"
            style={{
              boxShadow:
                "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <div className="w-full mx-auto flex justify-between items-center">
              {/* Left section - Radio buttons */}
              <div className="flex items-center space-x-2 ml-[14.5rem]">
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

              {/* Center section - Total input */}
              <div className="flex-1 flex justify-center ml-32">
                <ErpInput
                  id="total"
                  label={t("total")}
                  labelDirection="horizontal"
                  onChange={handleTotalChange}
                  value={formState.total}
                />
              </div>

              {/* Right section - Buttons */}
              <div className="flex items-center space-x-2">
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
    </div>
  );
};

export default PostDatedCheques;
