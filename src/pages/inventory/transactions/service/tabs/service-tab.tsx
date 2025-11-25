/**
 * Service Tab - Service Processing with Spare Parts
 */

import React, { useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPDatePicker from "../../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { Save, X, Trash2 } from "lucide-react";
import {
  updateMasterField,
  updateServiceDetails,
  addSpareDetail,
  updateSpareDetail,
  removeSpareDetail,
  setSearchParams,
} from "../service-transaction-reducer";
import {
  ServiceTransactionFormState,
  ServiceSpareDetail,
  ServiceStatus,
} from "../service-transaction-types";
import { statusOptions, searchInOptions, initialSpareDetail } from "../service-transaction-data";
import Urls from "../../../../../redux/urls";
import moment from "moment";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";

interface ServiceTabProps {
  onSave: () => void;
  onClear: () => void;
  onSearch: (jobNo: number, searchIn: string) => void;
}

const ServiceTab: React.FC<ServiceTabProps> = ({ onSave, onClear, onSearch }) => {
  const { t } = useTranslation("transaction");
  const dispatch = useDispatch();
  const { getFormattedValue } = useNumberFormat();
  const formState = useSelector(
    (state: RootState) => state.ServiceTransaction as ServiceTransactionFormState
  );

  const { master, serviceDetails, spareDetails } = formState.transaction;
  const { formElements, searchJobNo, searchIn } = formState;

  const [barcodeInput, setBarcodeInput] = useState("");
  const barcodeRef = useRef<HTMLInputElement>(null);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch(searchJobNo, searchIn);
    }
  };

  const handleBarcodeKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && barcodeInput.trim()) {
      // TODO: Fetch product by barcode and add to grid
      // For now, clear the input
      setBarcodeInput("");
    }
  };

  const handleRemoveSpare = (index: number) => {
    dispatch(removeSpareDetail(index));
  };

  const handleQtyChange = (index: number, qty: number) => {
    dispatch(updateSpareDetail({ index, data: { qty } }));
  };

  const gridColumns = [
    { field: "pCode", header: t("pcode"), width: 80 },
    { field: "barcode", header: t("barcode"), width: 100 },
    { field: "product", header: t("product"), width: 200 },
    { field: "qty", header: t("qty"), width: 80, editable: true },
    { field: "purchasePrice", header: t("pprice"), width: 100, align: "right" },
    { field: "total", header: t("total"), width: 100, align: "right" },
  ];

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
      </div>

      {/* Main Form Panel */}
      <div className="bg-gray-100 dark:bg-dark-bg-card p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {/* Left Column - Service Info (Readonly) */}
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="text-sm w-40">{t("service")}</label>
              <ERPInput
                id="serviceName"
                value={master.serviceName}
                disabled
                className="flex-1"
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm w-40">{t("product_remarks")}</label>
              <ERPInput
                id="productRemarks"
                value={master.productRemarks}
                disabled
                className="flex-1"
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm w-40">{t("serial_no")}</label>
              <ERPInput
                id="serialNo"
                value={master.serialNo}
                disabled
                className="flex-1"
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm w-40">{t("received_items")}</label>
              <ERPInput
                id="receivedItems"
                value={master.receivedItems}
                disabled
                className="flex-1"
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm w-40">{t("complaints")}</label>
              <ERPInput
                id="complaints"
                value={master.complaints}
                disabled
                className="flex-1"
              />
            </div>
          </div>

          {/* Right Column - Service Details */}
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="text-sm w-40">{t("status")}</label>
              <select
                value={serviceDetails.status}
                onChange={(e) =>
                  dispatch(
                    updateServiceDetails({ status: e.target.value as ServiceStatus })
                  )
                }
                disabled={formElements.status.disabled}
                className="border rounded px-2 py-1 text-sm flex-1"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label className="text-sm w-40">{t("expected_delivery_date")}</label>
              <ERPDatePicker
                id="expectedDeliveryDate"
                value={
                  master.expectedDeliveryDate
                    ? moment(master.expectedDeliveryDate).toDate()
                    : new Date()
                }
                disabled
              />
              <div className="ml-4 flex items-center">
                <ERPCheckbox
                  id="isWarrantyService"
                  label={t("is_warranty_service")}
                  checked={master.isWarrantyService}
                  disabled
                />
              </div>
            </div>
            <div className="flex items-center">
              <label className="text-sm w-40">{t("date")}</label>
              <ERPDatePicker
                id="serviceDoneDate"
                value={
                  serviceDetails.serviceDoneDate
                    ? moment(serviceDetails.serviceDoneDate).toDate()
                    : new Date()
                }
                onChange={(date) =>
                  dispatch(
                    updateServiceDetails({
                      serviceDoneDate: date.target.value,
                    })
                  )
                }
                disabled={formElements.serviceDoneDate.disabled}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm w-40">{t("service_charge")}</label>
              <ERPInput
                id="serviceCharge"
                type="number"
                value={serviceDetails.serviceCharge}
                onChange={(e) =>
                  dispatch(
                    updateServiceDetails({
                      serviceCharge: parseFloat(e.target.value) || 0,
                    })
                  )
                }
                disabled={formElements.serviceCharge.disabled}
                className="w-24"
                textAlignStyle="right"
              />
              <label className="text-sm">{t("consumed_qty_amt")}</label>
              <ERPInput
                id="consumedQtyAmount"
                type="number"
                value={serviceDetails.consumedQtyAmount}
                disabled
                className="w-24"
                textAlignStyle="right"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm w-40">{t("unit_rate")}</label>
              <ERPInput
                id="unitRate"
                type="number"
                value={master.unitRate}
                disabled
                className="w-24"
                textAlignStyle="right"
              />
              <label className="text-sm">{t("warehouse")}</label>
              <ERPDataCombobox
                id="warehouseID"
                value={serviceDetails.warehouseID}
                dataUrl={Urls.data_warehouse}
                valueField="id"
                displayField="warehouseName"
                onChange={(item) =>
                  dispatch(
                    updateServiceDetails({
                      warehouseID: item?.id || 0,
                      warehouseName: item?.warehouseName || "",
                    })
                  )
                }
                disabled={formElements.warehouseID.disabled}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Spare Parts Grid */}
        <div className="mt-4">
          <div className="mb-2">
            <ERPInput
              id="barcodeInput"
              ref={barcodeRef}
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyDown={handleBarcodeKeyDown}
              placeholder={t("scan_barcode")}
              className="w-64"
            />
          </div>
          <div className="border rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-200 dark:bg-dark-bg-header">
                <tr>
                  {gridColumns.map((col) => (
                    <th
                      key={col.field}
                      className="px-2 py-1 text-left border-r"
                      style={{ width: col.width }}
                    >
                      {col.header}
                    </th>
                  ))}
                  <th className="w-10 px-2 py-1">X</th>
                </tr>
              </thead>
              <tbody>
                {spareDetails.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50 dark:hover:bg-dark-bg-hover">
                    <td className="px-2 py-1 border-r">{item.pCode}</td>
                    <td className="px-2 py-1 border-r">{item.barcode}</td>
                    <td className="px-2 py-1 border-r">{item.product}</td>
                    <td className="px-2 py-1 border-r">
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          handleQtyChange(index, parseFloat(e.target.value) || 0)
                        }
                        className="w-full text-right bg-transparent"
                      />
                    </td>
                    <td className="px-2 py-1 border-r text-right">
                      {getFormattedValue(item.purchasePrice)}
                    </td>
                    <td className="px-2 py-1 border-r text-right">
                      {getFormattedValue(item.total)}
                    </td>
                    <td className="px-2 py-1 text-center">
                      <button
                        onClick={() => handleRemoveSpare(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {spareDetails.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-2 py-4 text-center text-gray-400">
                      {t("no_spare_parts")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3 mt-6">
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
          title={t("close")}
          onClick={() => window.history.back()}
          startIcon={<X size={16} />}
          variant="secondary"
        />
      </div>
    </div>
  );
};

export default ServiceTab;
