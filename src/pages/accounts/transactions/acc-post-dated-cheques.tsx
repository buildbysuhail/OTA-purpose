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
import Urls from "../../../redux/urls";
import { APIClient } from "../../../helpers/api-client";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import { Countries } from "../../../redux/slices/user-session/reducer";
import moment from "moment";
import ERPAlert from "../../../components/ERPComponents/erp-sweet-alert";
import { handleResponse } from "../../../utilities/HandleResponse";

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

const api = new APIClient();
const PostDatedCheques = () => {
  const [total, setTotal] = useState<number>();
  const [data, setData] = useState<any[]>([])
  const [key, setKey] = useState<number>(100000);
  const [prevData, setPrevData] = useState<any>();
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [formState, setFormState] = useState<FormState>({
    paymentType: "payment",
    chequeFromDate: new Date().toISOString(),
    chequeToDate: new Date().toISOString(),
    isBank: false,
    selectedBankId: null,
    bankDateType: "today",
    bankChangeType: "change",
    total: "0",
    reload: false,
  });
  const userSession = useAppSelector((state: RootState) => state.UserSession)
  const clientSession = useAppSelector((state: RootState) => state.ClientSession)
  const [loading, setLoading] = useState<LoadingState>({
    setAllDate: false,
    exportToExcel: false,
    show: false,
    save: false,
    close: false,
  });
  const { t } = useTranslation("transaction");

  const btnSaveRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setFormState((prev: any) => {
      return {
        ...prev,
        chequeFromDate: userSession.finFrom
      }
    })
  }, [])
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

      // Update the data
      const updatedTransactions = data.map((transaction: any) => {
        return {
          ...transaction,
          date:
            formState.bankDateType === "today"
              ? clientSession.softwareDate
              : transaction.chequeDate,
        };
      });
      debugger;
      console.log("123");

      setData(updatedTransactions);
    } catch (error) {
      console.log(error);
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
      let newVoucherType;
      if (userSession.countryId != Countries.India) {
        newVoucherType = formState.paymentType === 'payment' ? 'BP' : 'BR';
      } else {
        newVoucherType = formState.paymentType === 'payment' ? 'CQP' : 'CQR';
      }

      const params = new URLSearchParams({
        FromDate: moment(formState.chequeFromDate).format("DD/MMM/YYYY"),
        ToDate: moment(formState.chequeToDate).format("DD/MMM/YYYY"),
        VoucherType: newVoucherType
      }).toString();
      // Simulated API call - replace with actual fetch/axios call
      const response = await api.getAsync(
        Urls.pdc, params

      );
      const rows = response.map((row: any, index: number) => ({
        id: index,
        cleared: false,
        bounced: false,
        ledgerName: row.ledgerName,
        chequeNumber: row.chequeNumber,
        chequeDate: row.chequeDate,
        chequeBounceDate: row.chequeBounceDate,
        amount: row.amount,
        accTransMasterID: row.accTransMasterID,
        accTransactionDetailsID: row.accTransactionDetailsID,
        bankCharge: row.bankCharge,
        ...(userSession.countryId == Countries.India && {
          ledgerID: row.ledgerID,
          relatedLedgerID: row.relatedLedgerID
        })
      }));

      // Calculate grand total
      const _total = rows.reduce((sum: any, row: any) => sum + parseFloat(row.amount), 0);
      setTotal(_total);
      setData(rows);
      setPrevData(rows);
    } finally {
      setLoading((prev) => ({ ...prev, show: false }));
    }
  };

  const handleSave = async () => {
    setLoading((prev) => ({ ...prev, save: true }));
    debugger;
    try {
      // Step 1: Find modified rows (where bankDate has changed)
      const modifiedItems = data.filter((item: any) => item.date != null);

      // Step 2: Filter modified items that are also in selectedRows
      const filteredItems = modifiedItems
        .filter((item: any) =>
          selectedKeys.includes(item.accTransactionDetailID)
        ) // ✅ Fixed ID casing
        .map((it: any) => ({
          ...it,
          ledgerID: formState.selectedBankId,
          bankDate: it.bankDate
            ? moment(it.bankDate, "DD/MM/YYYY").format("YYYY-MM-DD")
            : null, // ✅ Corrected format
        }));

      if (filteredItems.length === 0) {
        ERPAlert.show({
          icon: "info",
          text: t("no_changes_detected"),
          title: "",
        });
        return;
      }

      // Step 3: Call API with only filtered modified items
      const res = await api.postAsync(Urls.bankReconciliation, filteredItems);

      handleResponse(res, () => {
        ERPAlert.show({
          icon: "success",
          text: t("changes_saved_successfully"),
          title: t("success"),
        });
      });
    } catch (error) {
      console.error("Error saving changes:", error);
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

  const handleCheckboxChange = (row: any, field: "Cleared" | "Bounced", checked: boolean) => {
    setData((prevData) => {
      const updatedData = prevData?.map((item: any) => {
        if (item.accTransactionDetailID === row.accTransactionDetailID) {
          const updatedRow = { ...item, [field]: checked };
          if (field === "Cleared" && checked) {
            updatedRow.bounced = false;
            updatedRow.cleared = true;
            updatedRow.date = formState.bankDateType === "today" ? clientSession.softwareDate : row.ChequeDate;
          } else if (field === "Bounced" && checked) {
            updatedRow.cleared = false;
            updatedRow.bounced = true;
            updatedRow.date = formState.bankDateType === "today" ? clientSession.softwareDate : row.ChequeDate;
          }
          return updatedRow;
        }
        return item;
      }) || []; // Fallback to an empty array if prevData is undefined
      return updatedData;
    });
  };
  const ValidateCheques = (data: any[]): Promise<boolean> => {
    return new Promise(async (resolve) => {
      for (let i = 0; i < data.length; i++) {
        const chequeDate = new Date(data[i].ChequeDate); // Convert ChequeDate to a Date object
        const currentDate = new Date(); // Get the current date

        if (chequeDate > currentDate) {
          // Show a confirmation dialog
          const result = await ERPAlert.show({
            icon: "question",
            title: t("cheque_date"),
            text: t("cheque_date_warning", { chequeNumber: data[i].ChequeNumber }),
            confirmButtonText: t("yes"),
            cancelButtonText: t("no"),
            onConfirm:
              () => {
                resolve(true);
                return;
              },
            onCancel:
              () => {
                resolve(false);
                return;
              }

          });
        }
      }

      // All cheques are valid
      resolve(true);
    });
  };
  const validateCheckForPDC = (data: any[], defaultBankChargeAccount: number): Promise<boolean> => {
    return new Promise(async (resolve) => {
      // Validate cheque dates
      for (let i = 0; i < data.length; i++) {
        const chequeDate = new Date(data[i].ChequeDate); // Convert ChequeDate to a Date object
        const currentDate = new Date(data[i].Date); // Convert Date to a Date object

        if (chequeDate < currentDate) {
          // Show an error message
          await ERPAlert.show({
            icon: "error",
            title: t("validation_error"),
            text: t("cheque_date_less_warning", { chequeNumber: data[i].ChequeNumber }),
            confirmButtonText: t("ok"),
            onConfirm: () => {
              resolve(false); // Return false if validation fails
              return;
            },
          });
        }
      }

      // Validate default bank charge account
      if (defaultBankChargeAccount <= 0) {
        await ERPAlert.show({
          icon: "error",
          title: t("validation_error"),
          text: t("default_bank_charge_account"),
          confirmButtonText: t("ok"),
          onConfirm: () => {
            resolve(false); // Return false if validation fails
            return;
          },
        });
      }

      // All validations passed
      resolve(true);
    });
  };
  const columns: DevGridColumn[] = useMemo(
    () => {
      const baseColumns: DevGridColumn[] = [
        {
          dataField: "cleared",
          caption: t("cleared"),
          dataType: "boolean",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          minWidth: 100,
          allowEditing: true,
          cellRender: (cellInfo: any) => (
            <input
              type="checkbox"
              checked={cellInfo.data.cleared}
              onChange={(e) => handleCheckboxChange(cellInfo.data, "Cleared", e.target.checked)}
            />
          ),
        },

        {
          dataField: "bounced",
          caption: t("bounced"),
          dataType: "boolean",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          minWidth: 100,
          allowEditing: true,
          cellRender: (cellInfo: any) => (
            <input
              type="checkbox"
              checked={cellInfo.data.bounced}
              onChange={(e) => handleCheckboxChange(cellInfo.data, "Bounced", e.target.checked)}
            />
          ),
        },

        {
          dataField: "date",
          caption: t("date"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          minWidth: 100,
        },

        {
          dataField: "ledgerName",
          caption: t("ledger_name"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          minWidth: 100,
          allowEditing: true,
        },

        {
          dataField: "relatedLedger",
          caption: t("related_ledger"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          minWidth: 100,
          allowEditing: true,
        },

        {
          dataField: "chequeNumber",
          caption: t("cheque_number"),
          dataType: "date",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          minWidth: 100,
          allowEditing: true,
        },

        {
          dataField: "chequeBounceDate",
          caption: t("bounce_date"),
          dataType: "date",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          minWidth: 100,
          allowEditing: true,
        },

        {
          dataField: "accTransactionMasterID",
          caption: t("acc_trans_master_id"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          minWidth: 100,
        },

        {
          dataField: "amount",
          caption: t("amount"),
          dataType: "date",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          minWidth: 100,
          allowEditing: true,
        },

        {
          dataField: "accTransactionDetailID",
          caption: t("acc_transaction_detail_id"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          minWidth: 100,
          allowEditing: true,
        },

        {
          dataField: "bankCharge",
          caption: t("bank_charge"),
          dataType: "date",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          minWidth: 100,
          allowEditing: true,
        },

        {
          dataField: "chequeDate",
          caption: t("cheque_date"),
          dataType: "date",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          minWidth: 100,
          allowEditing: true,
        },

        {
          dataField: "ledgerID",
          caption: t("ledger_id"),
          dataType: "date",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          minWidth: 100,
          allowEditing: true,
        },

        {
          dataField: "relatedLedgerID",
          caption: t("related_ledger_id"),
          dataType: "date",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          minWidth: 100,
          allowEditing: true,
        },

        // {
        //   dataField: "checkStatus",
        //   caption: t("check_status"),
        //   dataType: "date",
        //   allowSorting: true,
        //   allowSearch: true,
        //   allowFiltering: true,
        //   minWidth: 150,
        //   allowEditing: true,
        // },

        // {
        //   dataField: "isCleared",
        //   caption: t("is_cleared"),
        //   dataType: "date",
        //   allowSorting: true,
        //   allowSearch: true,
        //   allowFiltering: true,
        //   minWidth: 150,
        //   allowEditing: true,
        // },
      ];
      // Filter columns based on the `visible` property
      return baseColumns.filter((column) => {
        if (userSession.countryId === undefined) {
          // Handle undefined case (e.g., show all columns or hide specific columns)
          return true; // or false, depending on your logic
        } else if (userSession.countryId === Countries.India) {
          // Show all columns for India
          return true;
        } else {
          // Hide "BankCharge" for non-India
          return column.dataField !== "BankCharge";
        }
      });
    }, [t]);

  return (
    <div className="relative min-h-screen bg-white">
      <div className="fixed w-full left-0 z-10 top-[60px]">
        <div className="flex items-center p-0 border dark:border-dark-border border-gray-300 rounded-b-sm dark:bg-dark-bg bg-[#f4f4f5] me-[1px]">
          <div className="flex items-center ms-4 text-blue-500 cursor-pointer">
            <h6 className="text-lg font-bold mb-0 whitespace-nowrap overflow-hidden text-ellipsis ml-0 transition-all duration-300 [@media(min-minWidth:1000px)]:ml-[231px]">
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
                        value={new Date(formState.chequeFromDate)}
                        className="w-auto"
                      />
                      <ERPDateInput
                        id="chequeToDate"
                        label={t("to_date")}
                        onChange={(e) =>
                          handleDateChange("chequeToDate", e.target.value)
                        }
                        value={new Date(formState.chequeToDate)}
                        className="w-auto"
                      />
                    </div>
                  </div>

                  {/* Counter ID and Bank Section */}
                  <div className="flex items-end gap-4">
                    <ERPDataCombobox
                      id="BankAC"
                      label={t("bank_a/c")}
                      field={{
                        id: "BankAC",
                        required: true,
                        getListUrl: Urls.data_BankAccounts,
                        valueKey: "id",
                        labelKey: "name",
                      }}
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
              data={data}
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
              <div className="hidden md:block mr-2">
                <h6 className="font-semibold whitespace-nowrap text-[20px] ">
                  {" "}
                  <span className="!font-medium !text-gray-600">{t("total")}: </span>
                </h6>
              </div>

              {/* Right section - Buttons */}
              <div className="flex items-center space-x-2">
                <ERPButton
                  ref={btnSaveRef}
                  title={t("close")}
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
