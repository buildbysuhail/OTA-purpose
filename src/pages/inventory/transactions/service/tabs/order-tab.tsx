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
import { updateMasterField, setPrintOnSave, } from "../service-transaction-reducer";
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

const OrderTab: React.FC<OrderTabProps> = ({ onSave, onClear, onDelete, onPrint, onJobNoChange, onShowHistory, }) => {
  const { t } = useTranslation("transaction");
  const dispatch = useDispatch();
  const formState = useSelector((state: RootState) => state.ServiceTransaction as ServiceTransactionFormState);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card - Job Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-end justify-between">
            <ERPInput
              id="jobNo"
              ref={jobNoRef}
              type="number"
              label={t("job_no")}
              value={master.jobNo || ""}
              onChange={(e) => handleFieldChange("jobNo", parseInt(e.target.value) || 0)}
              onKeyDown={handleJobNoKeyDown}
              disabled={formElements.jobNo.disabled}
              className="w-24"
              textAlignStyle="right"
            />

            <ERPDatePicker
              id="orderDate"
              label={t("date")}
              value={master.orderDate ? moment(master.orderDate).toDate() : new Date()}
              onChange={(e) => handleFieldChange("orderDate", e.target.value)}
              disabled={formElements.orderDate.disabled}
            />
          </div>
        </div>

        {/* Account Information Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="  bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-t-xl shadow-sm border-t border-l border-r border-blue-200 dark:border-gray-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-[#2b6cb0]">
              {t("account_information")}
            </h2>
          </div>

          <div className="p-6">
            <div className="flex items-end gap-4">
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
              <div className="flex-1">
                <ERPDataCombobox
                  id="ledgerID"
                  value={master.ledgerID}
                  field={{
                    id: "ledgerID",
                    required: true,
                    getListUrl: Urls.data_pricectegory,
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  noLabel={true}
                  onChangeData={(data: any) => handleFieldChange("ledgerID", data.ledgerID)}
                  disabled={formElements.ledgerID.disabled || master.ledgerID === 0}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Service Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-t-xl shadow-sm border-t border-l border-r border-blue-200 dark:border-gray-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-[#2b6cb0]">{t("customer_service_details")}</h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Left Column - Customer Info */}
              <div className="h-full">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm p-4 space-y-4 h-full border border-gray-200 dark:border-gray-600">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                    {t("customer_details")}
                  </h3>

                  <div className="space-y-3">
                    <ERPInput
                      id="customerName"
                      label={t("name")}
                      ref={customerNameRef}
                      value={master.customerName}
                      onChange={(e) => handleFieldChange("customerName", e.target.value)}
                      disabled={formElements.customerName.disabled}
                      className="w-full"
                    />

                    <ERPDataCombobox
                      id="serviceID"
                      value={master.serviceID}
                      label={t("service")}
                      field={{
                        id: "ledgerID",
                        required: true,
                        getListUrl: Urls.data_pricectegory,
                        valueKey: "id",
                        labelKey: "name",
                      }}
                      onChangeData={(data: any) => handleFieldChange("serviceID", data.serviceID)}
                      disabled={formElements.serviceID.disabled}
                      className="w-full"
                    />

                    <ERPInput
                      id="address1"
                      label={t("address_1")}
                      value={master.address1}
                      onChange={(e) => handleFieldChange("address1", e.target.value)}
                      disabled={formElements.address1.disabled}
                      className="w-full"
                    />

                    <ERPInput
                      id="address2"
                      label={t("address_2")}
                      value={master.address2}
                      onChange={(e) => handleFieldChange("address2", e.target.value)}
                      disabled={formElements.address2.disabled}
                      className="w-full"
                    />

                    <ERPInput
                      id="mobile"
                      label={t("mobile")}
                      value={master.mobile}
                      onChange={(e) => handleFieldChange("mobile", e.target.value)}
                      disabled={formElements.mobile.disabled}
                      className="w-full"
                      required
                    />

                    <ERPInput
                      id="phone"
                      label={t("phone")}
                      value={master.phone}
                      onChange={(e) => handleFieldChange("phone", e.target.value)}
                      disabled={formElements.phone.disabled}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Product & Service Info */}
              <div className="h-full">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-sm p-4 space-y-4 h-full border border-blue-200 dark:border-gray-600">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                    {t("service_details")}
                  </h3>

                  <div className="space-y-3">
                    <ERPInput
                      id="productRemarks"
                      label={t("product_remarks")}
                      value={master.productRemarks}
                      onChange={(e) => handleFieldChange("productRemarks", e.target.value)}
                      disabled={formElements.productRemarks.disabled}
                      className="w-full"
                    />

                    <div className="flex items-end gap-2">
                      <ERPInput
                        id="serialNo"
                        label={t("serial_no")}
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
                        className="h-10"
                      />
                    </div>

                    <ERPInput
                      id="receivedItems"
                      label={t("received_items")}
                      value={master.receivedItems}
                      onChange={(e) => handleFieldChange("receivedItems", e.target.value)}
                      disabled={formElements.receivedItems.disabled}
                      className="w-full"
                    />

                    <ERPInput
                      id="complaints"
                      label={t("complaints")}
                      value={master.complaints}
                      onChange={(e) => handleFieldChange("complaints", e.target.value)}
                      disabled={formElements.complaints.disabled}
                      className="w-full"
                      required
                    />

                    <div className="flex items-end gap-2">
                      <ERPDatePicker
                        id="expectedDeliveryDate"
                        label={t("expected_delivery_date")}
                        value={master.expectedDeliveryDate ? moment(master.expectedDeliveryDate).toDate() : new Date()}
                        onChange={(e) => handleFieldChange("expectedDeliveryDate", moment(e.target.value).toISOString())}
                        disabled={formElements.expectedDeliveryDate.disabled}
                      />

                      <ERPCheckbox
                        id="isWarrantyService"
                        label={t("is_warranty_service")}
                        checked={master.isWarrantyService}
                        onChange={(checked) => handleFieldChange("isWarrantyService", checked)}
                        disabled={formElements.isWarrantyService.disabled}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <ERPInput
                        id="advanceReceived"
                        type="number"
                        label={t("advance_received")}
                        value={master.advanceReceived}
                        onChange={(e) => handleFieldChange("advanceReceived", parseFloat(e.target.value) || 0)}
                        disabled={formElements.advanceReceived.disabled}
                        className="w-full"
                        textAlignStyle="right"
                      />

                      <ERPInput
                        id="unitRate"
                        type="number"
                        label={t("unit_rate")}
                        value={master.unitRate}
                        onChange={(e) => handleFieldChange("unitRate", parseFloat(e.target.value) || 0)}
                        disabled={formElements.unitRate.disabled}
                        className="w-full"
                        textAlignStyle="right"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-4">
            <ERPCheckbox
              id="isEdit"
              label={t("edit")}
              checked={isEdit}
              disabled
            />
            <ERPCheckbox
              id="printOnSave"
              label={t("print")}
              checked={printOnSave}
              onChange={(e) => dispatch(setPrintOnSave(e.target.checked))}
            />
            {/* Hidden ID label for reference */}
            <div className="flex items-center text-xs">
              <span className="inline-flex items-end px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md font-medium">
                <span className="text-gray-500 mr-2">{t("id")}</span>
                : {master.serviceTransMasterID}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 pb-6">
            <ERPButton
              title={t("save")}
              onClick={onSave}
              startIcon={<Save size={18} />}
              variant="primary"
              disabled={formElements.btnSave.disabled}
              className="px-8 py-3 text-base font-medium"
            />
            <ERPButton
              title={t("clear")}
              onClick={onClear}
              startIcon={<X size={18} />}
              variant="secondary"
              disabled={formElements.btnClear.disabled}
              className="px-8 py-3 text-base font-medium"
            />
            <ERPButton
              title={t("print")}
              onClick={onPrint}
              startIcon={<Printer size={18} />}
              variant="secondary"
              disabled={formElements.btnPrint.disabled || !isEdit}
              className="px-8 py-3 text-base font-medium"
            />
            <ERPButton
              title={t("delete")}
              onClick={onDelete}
              startIcon={<Trash2 size={18} />}
              variant="secondary"
              disabled={formElements.btnDelete.disabled || !isEdit}
              className="px-8 py-3 text-base font-medium"
            />
            <ERPButton
              title={t("close")}
              onClick={() => window.history.back()}
              startIcon={<X size={18} />}
              variant="secondary"
              className="px-8 py-3 text-base font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTab;