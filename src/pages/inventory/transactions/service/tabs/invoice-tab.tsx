/**
 * Invoice Tab - Service Invoice and Billing
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPDatePicker from "../../../../../components/ERPComponents/erp-datepicker";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { Save, X, Printer, Trash2 } from "lucide-react";
import {
  updateInvoice,
  setSearchParams,
  calculateInvoiceTotals,
  setPrintOnSave,
} from "../service-transaction-reducer";
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

const InvoiceTab: React.FC<InvoiceTabProps> = ({
  onSave,
  onClear,
  onDelete,
  onPrint,
  onSearch,
}) => {
  const { t } = useTranslation("transaction");
  const dispatch = useDispatch();
  const { getFormattedValue } = useNumberFormat();
  const formState = useSelector(
    (state: RootState) => state.ServiceTransaction as ServiceTransactionFormState
  );

  const { master, invoice } = formState.transaction;
  const { formElements, searchJobNo, searchIn, isEdit, printOnSave } = formState;

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch(searchJobNo, searchIn);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    dispatch(updateInvoice({ [field]: value }));
    dispatch(calculateInvoiceTotals());
  };

  return (
    <div className="p-4">
      {/* Header - Job No Search */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">{t("job_no")}.</label>
          <ERPInput
            id="searchJobNo"
            type="number"
            value={searchJobNo || ""}
            onChange={(e) =>
              dispatch(setSearchParams({ jobNo: parseInt(e.target.value) || 0 }))
            }
            onKeyDown={handleSearchKeyDown}
            className="w-24"
            textAlignStyle="right"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">{t("search_in")}</label>
          <select
            value={searchIn}
            onChange={(e) => dispatch(setSearchParams({ searchIn: e.target.value }))}
            className="border rounded px-2 py-1 text-sm"
          >
            {searchInOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="ml-auto">
          <ERPCheckbox
            id="isWarrantyService"
            label={t("is_warranty_service")}
            checked={invoice.isWarrantyService}
            disabled
          />
        </div>
      </div>

      {/* Main Form Panel */}
      <div className="bg-gray-100 dark:bg-dark-bg-card p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {/* Left Column - Customer Info */}
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="text-sm w-32">{t("cash_bank")}</label>
              <ERPDataCombobox
                id="accountID"
                value={invoice.accountID}
                displayValue={invoice.accountName}
                dataUrl={`${Urls.data_acc_ledgers}?ledgerType=1`}
                valueField="id"
                displayField="ledgerName"
                onChange={(item) =>
                  dispatch(
                    updateInvoice({
                      accountID: item?.id || 0,
                      accountName: item?.ledgerName || "",
                    })
                  )
                }
                disabled={formElements.accountID.disabled}
                className="flex-1"
                placeholder={t("select_account")}
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm w-32">{t("name")}</label>
              <ERPInput
                id="customerName"
                value={master.customerName}
                disabled
                className="flex-1"
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm w-32">{t("address_1")}</label>
              <ERPInput
                id="address1"
                value={master.address1}
                disabled
                className="flex-1"
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm w-32">{t("mobile")}</label>
              <ERPInput
                id="mobile"
                value={master.mobile}
                disabled
                className="flex-1"
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm w-32">{t("service")}</label>
              <ERPInput
                id="serviceName"
                value={master.serviceName}
                disabled
                className="flex-1"
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm w-32">{t("complaints")}</label>
              <ERPInput
                id="complaints"
                value={master.complaints}
                disabled
                className="flex-1"
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm w-32">{t("account")}</label>
              <ERPDataCombobox
                id="accountID2"
                value={master.ledgerID}
                displayValue={master.customerName}
                dataUrl={`${Urls.data_acc_ledgers}?ledgerType=3`}
                valueField="id"
                displayField="ledgerName"
                disabled
                className="flex-1"
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm w-32">{t("remarks")}</label>
              <ERPInput
                id="remarks"
                value={invoice.remarks}
                onChange={(e) => handleFieldChange("remarks", e.target.value)}
                disabled={formElements.remarks.disabled}
                className="flex-1"
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm w-32">{t("remarks_2")}</label>
              <ERPInput
                id="remarks2"
                value={invoice.remarks2}
                onChange={(e) => handleFieldChange("remarks2", e.target.value)}
                disabled={formElements.remarks2.disabled}
                className="flex-1"
              />
            </div>
          </div>

          {/* Right Column - Invoice Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-4">
              <label className="text-sm">{t("consumed_qty_amount")}</label>
              <ERPInput
                id="consumedQtyAmount"
                type="number"
                value={invoice.consumedQtyAmount}
                disabled
                className="w-28"
                textAlignStyle="right"
              />
              <label className="text-sm">{t("date")}</label>
              <ERPDatePicker
                id="invoiceDate"
                value={
                  invoice.invoiceDate
                    ? moment(invoice.invoiceDate).toDate()
                    : new Date()
                }
                onChange={(date) =>
                  handleFieldChange("invoiceDate", moment(date).toISOString())
                }
                disabled={formElements.invoiceDate.disabled}
              />
            </div>
            <div className="flex items-center justify-end gap-4">
              <label className="text-sm">{t("service_charge")}</label>
              <ERPInput
                id="serviceCharge"
                type="number"
                value={invoice.serviceCharge}
                onChange={(e) =>
                  handleFieldChange("serviceCharge", parseFloat(e.target.value) || 0)
                }
                disabled={formElements.serviceCharge.disabled}
                className="w-28"
                textAlignStyle="right"
              />
              <label className="text-sm">{t("closed_with")}</label>
              <select
                value={invoice.closingRemarks}
                onChange={(e) => handleFieldChange("closingRemarks", e.target.value)}
                disabled={formElements.closingRemarks.disabled}
                className="border rounded px-2 py-1 text-sm w-40"
              >
                {closingRemarksOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-end gap-4">
              <label className="text-sm font-semibold text-lg">{t("total")}</label>
              <ERPInput
                id="total"
                type="number"
                value={invoice.total}
                disabled
                className="w-28 font-bold"
                textAlignStyle="right"
              />
              <label className="text-sm">{t("advance_received")}</label>
              <ERPInput
                id="advanceReceived"
                type="number"
                value={invoice.advanceReceived}
                disabled
                className="w-28"
                textAlignStyle="right"
              />
            </div>
            <div className="flex items-center justify-end gap-4">
              <label className="text-sm">{t("cash_received")}</label>
              <ERPInput
                id="cashReceived"
                type="number"
                value={invoice.cashReceived}
                onChange={(e) =>
                  handleFieldChange("cashReceived", parseFloat(e.target.value) || 0)
                }
                disabled={formElements.cashReceived.disabled}
                className="w-28"
                textAlignStyle="right"
              />
            </div>
            <div className="flex items-center justify-end gap-4">
              <label className="text-sm font-semibold">{t("balance")}</label>
              <ERPInput
                id="balance"
                type="number"
                value={invoice.balance}
                disabled
                className="w-28 font-bold"
                textAlignStyle="right"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <ERPCheckbox
          id="printAfterSave"
          label={t("print_after_save")}
          checked={printOnSave}
          onChange={(checked) => dispatch(setPrintOnSave(checked))}
        />
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

      {/* Hidden ID */}
      <div className="text-xs text-gray-400 mt-2">
        Invoice ID: {invoice.serviceInvoiceID}
      </div>
    </div>
  );
};

export default InvoiceTab;
