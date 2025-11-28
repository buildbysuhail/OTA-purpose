import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { Save, X, Printer, Trash2, Search } from "lucide-react";
import { updateInvoice, setSearchParams, calculateInvoiceTotals, setPrintOnSave, } from "../service-transaction-reducer";
import { ServiceTransactionFormState } from "../service-transaction-types";
import { searchInOptions, closingRemarksOptions } from "../service-transaction-data";
import Urls from "../../../../../redux/urls";
import moment from "moment";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";

interface InvoiceTabProps {
  onSave: () => void;
  onClear: () => void;
  onDelete: () => void;
  onPrint: () => void;
  onSearch: (jobNo: number, searchIn: string) => void;
}

const InvoiceTab: React.FC<InvoiceTabProps> = ({ onSave, onClear, onDelete, onPrint, onSearch, }) => {
  const { t } = useTranslation("transaction");
  const dispatch = useDispatch();
  const { getFormattedValue } = useNumberFormat();
  const formState = useSelector((state: RootState) => state.ServiceTransaction as ServiceTransactionFormState);
  const { master, invoice } = formState.transaction;
  const { formElements, searchJobNo, searchIn, isEdit, printOnSave } = formState;

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(searchJobNo, searchIn);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    dispatch(updateInvoice({ [field]: value }));
    dispatch(calculateInvoiceTotals());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center justify-between">
                <ERPInput
                  id="searchJobNo"
                  type="number"
                  label={t("job_no")}
                  value={searchJobNo || ""}
                  onChange={(e) => dispatch(setSearchParams({ jobNo: parseInt(e.target.value) || 0 }))}
                  onKeyDown={handleSearchKeyDown}
                  className="w-32"
                  textAlignStyle="right"
                />
                <ERPDataCombobox
                  id="searchIn"
                  value={searchIn}
                  label={t("search_in")}
                  options={searchInOptions}
                  onChange={(item: any) => dispatch(setSearchParams({ searchIn: item?.value }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Customer Information - 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-3 border-b border-slate-200 dark:border-gray-700">
                Customer Information
              </h3>
              <div className="space-y-4">
                <ERPDataCombobox
                  id="accountID"
                  label={t("cash_bank")}
                  value={invoice.accountID}
                  field={{
                    getListUrl: `${Urls.data_acc_ledgers}?ledgerType=1`,
                    valueKey: "id",
                    labelKey: "ledgerName",
                  }}
                  onChange={(item: any) =>
                    dispatch(
                      updateInvoice({
                        accountID: item?.value || 0,
                        accountName: item?.label || "",
                      })
                    )
                  }
                  disabled={formElements.accountID.disabled}
                />
                <ERPInput
                  id="customerName"
                  label={t("name")}
                  value={master.customerName}
                  disabled
                />
                <ERPInput
                  id="address1"
                  label={t("address_1")}
                  value={master.address1}
                  disabled
                />
                <div className="grid grid-cols-2 gap-4">
                  <ERPInput
                    id="mobile"
                    label={t("mobile")}
                    value={master.mobile}
                    disabled
                  />
                  <ERPInput
                    id="serviceName"
                    label={t("service")}
                    value={master.serviceName}
                    disabled
                  />
                </div>
                <ERPInput
                  id="complaints"
                  label={t("complaints")}
                  value={master.complaints}
                  disabled
                />
                <ERPDataCombobox
                  id="accountID2"
                  label={t("account")}
                  value={master.ledgerID}
                  field={{
                    getListUrl: `${Urls.data_acc_ledgers}?ledgerType=3`,
                    valueKey: "id",
                    labelKey: "ledgerName",
                  }}
                  disabled
                />
                <ERPInput
                  id="remarks"
                  label={t("remarks")}
                  value={invoice.remarks}
                  onChange={(e) => handleFieldChange("remarks", e.target.value)}
                  disabled={formElements.remarks.disabled}
                />
                <ERPInput
                  id="remarks2"
                  label={t("remarks_2")}
                  value={invoice.remarks2}
                  onChange={(e) => handleFieldChange("remarks2", e.target.value)}
                  disabled={formElements.remarks2.disabled}
                />
              </div>
            </div>
          </div>

          {/* Invoice Summary - 1 column */}
          <div className="space-y-6">
            {/* Invoice Details Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-3 border-b border-slate-200 dark:border-gray-700">
                Invoice Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <ERPInput
                    id="invoiceDate"
                    label={t("date")}
                    type="date"
                    value={
                      invoice.invoiceDate
                        ? moment(invoice.invoiceDate).format("YYYY-MM-DD")
                        : moment(new Date()).format("YYYY-MM-DD")
                    }
                    onChange={(e) =>
                      handleFieldChange("invoiceDate", e.target.value)
                    }
                    disabled={formElements.invoiceDate.disabled}
                  />
                  <ERPCheckbox
                    id="isWarrantyService"
                    label={t("is_warranty_service")}
                    checked={invoice.isWarrantyService || false}
                    disabled
                  />
                </div>
                <ERPDataCombobox
                  id="closingRemarks"
                  label={t("closed_with")}
                  value={invoice.closingRemarks}
                  options={closingRemarksOptions}
                  onChange={(item: any) => handleFieldChange("closingRemarks", item?.value)}
                  disabled={formElements.closingRemarks.disabled}
                />
              </div>
            </div>

            {/* Financial Summary Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-sm border border-blue-200 dark:border-gray-600 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-3 border-b border-blue-200 dark:border-gray-600">
                Financial Summary
              </h3>
              <div className="space-y-3">
                <ERPInput
                  id="consumedQtyAmount"
                  label={t("consumed_qty_amount")}
                  type="number"
                  value={invoice.consumedQtyAmount}
                  disabled
                  textAlignStyle="right"
                />
                <ERPInput
                  id="serviceCharge"
                  label={t("service_charge")}
                  type="number"
                  value={invoice.serviceCharge}
                  onChange={(e) =>
                    handleFieldChange("serviceCharge", parseFloat(e.target.value) || 0)
                  }
                  disabled={formElements.serviceCharge.disabled}
                  textAlignStyle="right"
                />
                <div className="pt-2 border-t border-blue-200 dark:border-gray-600">
                  <ERPInput
                    id="total"
                    type="number"
                    label={t("total")}
                    value={invoice.total}
                    disabled
                    className="font-bold"
                    textAlignStyle="right"
                  />
                </div>
                <ERPInput
                  id="advanceReceived"
                  type="number"
                  label={t("advance_received")}
                  value={invoice.advanceReceived}
                  disabled
                  textAlignStyle="right"
                />
                <ERPInput
                  id="cashReceived"
                  type="number"
                  label={t("cash_received")}
                  value={invoice.cashReceived}
                  onChange={(e) =>
                    handleFieldChange("cashReceived", parseFloat(e.target.value) || 0)
                  }
                  disabled={formElements.cashReceived.disabled}
                  textAlignStyle="right"
                />
                <div className="pt-2 border-t border-blue-200 dark:border-gray-600">
                  <ERPInput
                    id="balance"
                    type="number"
                    label={t("balance")}
                    value={invoice.balance}
                    disabled
                    className="font-bold text-lg"
                    textAlignStyle="right"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ERPCheckbox
                id="printAfterSave"
                label={t("print_after_save")}
                checked={printOnSave || false}
                onChange={(e) => dispatch(setPrintOnSave(e.target.checked))}
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                ID: {invoice.serviceInvoiceID}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ERPButton
                title={t("print")}
                onClick={onPrint}
                startIcon={<Printer size={16} />}
                variant="secondary"
                disabled={formElements.btnPrint.disabled || !isEdit}
              />
              <ERPButton
                title={t("save")}
                onClick={onSave}
                startIcon={<Save size={16} />}
                variant="primary"
                disabled={formElements.btnSave.disabled}
              />
              <ERPButton
                title={t("clear")}
                onClick={onClear}
                startIcon={<X size={16} />}
                variant="secondary"
                disabled={formElements.btnClear.disabled}
              />
              <ERPButton
                title={t("delete")}
                onClick={onDelete}
                startIcon={<Trash2 size={16} />}
                variant="secondary"
                disabled={formElements.btnDelete.disabled || !isEdit}
              />
              <ERPButton
                title={t("close")}
                onClick={() => window.history.back()}
                startIcon={<X size={16} />}
                variant="secondary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTab;