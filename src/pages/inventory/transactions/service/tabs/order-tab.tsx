/**
 * Order Tab - Service Order Entry
 */

import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPDatePicker from "../../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { Save, X, Printer, Trash2, History } from "lucide-react";
import {
  updateMasterField,
  toggleHistory,
  setPrintOnSave,
} from "../service-transaction-reducer";
import { ServiceTransactionFormState } from "../service-transaction-types";
import Urls from "../../../../../redux/urls";
import moment from "moment";

interface OrderTabProps {
  onSave: () => void;
  onClear: () => void;
  onDelete: () => void;
  onPrint: () => void;
  onJobNoChange: (jobNo: number) => void;
  onShowHistory: (serialNo: string) => void;
}

const OrderTab: React.FC<OrderTabProps> = ({
  onSave,
  onClear,
  onDelete,
  onPrint,
  onJobNoChange,
  onShowHistory,
}) => {
  const { t } = useTranslation("transaction");
  const dispatch = useDispatch();
  const formState = useSelector(
    (state: RootState) => state.ServiceTransaction as ServiceTransactionFormState
  );
  const userSession = useSelector((state: RootState) => state.UserSession);

  const { master } = formState.transaction;
  const { formElements, isEdit, printOnSave } = formState;

  const jobNoRef = useRef<HTMLInputElement>(null);
  const customerNameRef = useRef<HTMLInputElement>(null);
  const serialNoRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = (field: string, value: any) => {
    dispatch(updateMasterField({ [field]: value }));
  };

  const handleLedgerChange = (selectedItem: any) => {
    if (selectedItem) {
      dispatch(
        updateMasterField({
          ledgerID: selectedItem.id || 0,
          customerName: selectedItem.ledgerName || "",
          address1: selectedItem.address1 || "",
          address2: selectedItem.address2 || "",
          mobile: selectedItem.mobile || "",
          phone: selectedItem.phone || "",
        })
      );
    }
  };

  const handleServiceChange = (selectedItem: any) => {
    if (selectedItem) {
      dispatch(
        updateMasterField({
          serviceID: selectedItem.id || 0,
          serviceName: selectedItem.serviceName || "",
        })
      );
    }
  };

  const handleJobNoKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const jobNo = parseInt((e.target as HTMLInputElement).value) || 0;
      if (jobNo > 0) {
        onJobNoChange(jobNo);
      }
    }
  };

  return (
    <div className="p-4">
      {/* Header Row - Job No and Date */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium w-16">{t("job_no")}.</label>
          <ERPInput
            id="jobNo"
            ref={jobNoRef}
            type="number"
            value={master.jobNo || ""}
            onChange={(e) => handleFieldChange("jobNo", parseInt(e.target.value) || 0)}
            onKeyDown={handleJobNoKeyDown}
            disabled={formElements.jobNo.disabled}
            className="w-24"
            textAlignStyle="right"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">{t("date")}</label>
          <ERPDatePicker
            id="orderDate"
            value={master.orderDate ? moment(master.orderDate).toDate() : new Date()}
            onChange={(e) =>
              handleFieldChange("orderDate", e.target.value)
            }
            disabled={formElements.orderDate.disabled}
          />
        </div>
      </div>

      {/* Main Form Panel */}
      <div className="bg-gray-100 dark:bg-dark-bg-card p-4 rounded-lg">
        {/* Cash/Bank Selection */}
        <div className="flex items-center gap-4 mb-3">
          <ERPCheckbox
            id="useCashBank"
            label={t("cash_bank")}
            checked={master.ledgerID > 0}
            onChange={(checked) => {
              if (!checked) {
                dispatch(
                  updateMasterField({
                    ledgerID: 0,
                    customerName: "",
                    address1: "",
                    address2: "",
                    mobile: "",
                    phone: "",
                  })
                );
              }
            }}
          />
          <ERPDataCombobox
            id="ledgerID"
            value={master.ledgerID}
            // displayValue={master.customerName}
            // dataUrl={`${Urls.data_acc_ledgers}?ledgerType=3`}
               field={{
            id: "ledgerID",
            required: true,
            getListUrl: Urls.data_pricectegory,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => handleFieldChange("ledgerID", data.ledgerID)}
            disabled={formElements.ledgerID.disabled || master.ledgerID === 0}
            className="flex-1"
          />
        </div>

        {/* Customer Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {/* Left Column */}
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="text-sm w-32">{t("name")}</label>
              <ERPInput
                id="customerName"
                ref={customerNameRef}
                value={master.customerName}
                onChange={(e) => handleFieldChange("customerName", e.target.value)}
                disabled={formElements.customerName.disabled}
                className="flex-1"
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm w-32">{t("address_1")}</label>
              <ERPInput
                id="address1"
                value={master.address1}
                onChange={(e) => handleFieldChange("address1", e.target.value)}
                disabled={formElements.address1.disabled}
                className="flex-1"
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm w-32">{t("address_2")}</label>
              <ERPInput
                id="address2"
                value={master.address2}
                onChange={(e) => handleFieldChange("address2", e.target.value)}
                disabled={formElements.address2.disabled}
                className="flex-1"
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm w-32">
                {t("mobile")} <span className="text-red-500">*</span>
              </label>
              <ERPInput
                id="mobile"
                value={master.mobile}
                onChange={(e) => handleFieldChange("mobile", e.target.value)}
                disabled={formElements.mobile.disabled}
                className="flex-1"
                required
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm w-32">{t("phone")}</label>
              <ERPInput
                id="phone"
                value={master.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                disabled={formElements.phone.disabled}
                className="flex-1"
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm w-32">
                {t("service")} <span className="text-red-500">*</span>
              </label>
              <ERPDataCombobox
                id="serviceID"
                value={master.serviceID}
            // displayValue={master.customerName}
            // dataUrl={`${Urls.data_acc_ledgers}?ledgerType=3`}
               field={{
            id: "ledgerID",
            required: true,
            getListUrl: Urls.data_pricectegory,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => handleFieldChange("serviceID", data.serviceID)}
                disabled={formElements.serviceID.disabled}
                className="flex-1"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="text-sm w-32">{t("product_remarks")}</label>
              <ERPInput
                id="productRemarks"
                value={master.productRemarks}
                onChange={(e) => handleFieldChange("productRemarks", e.target.value)}
                disabled={formElements.productRemarks.disabled}
                className="flex-1"
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm w-32">
                {t("serial_no")} <span className="text-red-500">*</span>
              </label>
              <div className="flex-1 flex gap-2">
                <ERPInput
                  id="serialNo"
                  ref={serialNoRef}
                  value={master.serialNo}
                  onChange={(e) => handleFieldChange("serialNo", e.target.value)}
                  disabled={formElements.serialNo.disabled}
                  className="flex-1"
                  required
                />
                <ERPButton
                  title={t("history")}
                  onClick={() => onShowHistory(master.serialNo)}
                  startIcon={<History size={16} />}
                  variant="secondary"
                  disabled={!master.serialNo}
                />
              </div>
            </div>
            <div className="flex items-center">
              <label className="text-sm w-32">{t("received_items")}</label>
              <ERPInput
                id="receivedItems"
                value={master.receivedItems}
                onChange={(e) => handleFieldChange("receivedItems", e.target.value)}
                disabled={formElements.receivedItems.disabled}
                className="flex-1"
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm w-32">
                {t("complaints")} <span className="text-red-500">*</span>
              </label>
              <ERPInput
                id="complaints"
                value={master.complaints}
                onChange={(e) => handleFieldChange("complaints", e.target.value)}
                disabled={formElements.complaints.disabled}
                className="flex-1"
                required
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm w-32">{t("expected_delivery_date")}</label>
              <ERPDatePicker
                id="expectedDeliveryDate"
                value={
                  master.expectedDeliveryDate
                    ? moment(master.expectedDeliveryDate).toDate()
                    : new Date()
                }
                onChange={(e) =>
                  handleFieldChange("expectedDeliveryDate", moment(e.target.value).toISOString())
                }
                disabled={formElements.expectedDeliveryDate.disabled}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm w-32">{t("advance_received")}</label>
              <ERPInput
                id="advanceReceived"
                type="number"
                value={master.advanceReceived}
                onChange={(e) =>
                  handleFieldChange("advanceReceived", parseFloat(e.target.value) || 0)
                }
                disabled={formElements.advanceReceived.disabled}
                className="w-24"
                textAlignStyle="right"
              />
              <label className="text-sm">{t("unit_rate")}</label>
              <ERPInput
                id="unitRate"
                type="number"
                value={master.unitRate}
                onChange={(e) =>
                  handleFieldChange("unitRate", parseFloat(e.target.value) || 0)
                }
                disabled={formElements.unitRate.disabled}
                className="w-24"
                textAlignStyle="right"
              />
            </div>
          </div>
        </div>

        {/* Warranty Checkbox */}
        <div className="flex justify-center mt-4">
          <ERPCheckbox
            id="isWarrantyService"
            label={t("is_warranty_service")}
            checked={master.isWarrantyService}
            onChange={(checked) => handleFieldChange("isWarrantyService", checked)}
            disabled={formElements.isWarrantyService.disabled}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <ERPCheckbox
          id="isEdit"
          label={t("edit")}
          checked={isEdit}
          disabled
          className="mr-2"
        />
        <ERPCheckbox
          id="printOnSave"
          label={t("print")}
          checked={printOnSave}
          onChange={(e) => dispatch(setPrintOnSave(e.target.checked))}
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
          title={t("print")}
          onClick={onPrint}
          startIcon={<Printer size={16} />}
          variant="secondary"
          disabled={formElements.btnPrint.disabled || !isEdit}
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

      {/* Hidden ID label for reference */}
      <div className="text-xs text-gray-400 mt-2">
        ID: {master.serviceTransMasterID}
      </div>
    </div>
  );
};

export default OrderTab;
