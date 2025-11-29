import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPDatePicker from "../../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { Save, X, Trash2, Package } from "lucide-react";
import { updateServiceDetails, updateSpareDetail, removeSpareDetail, setSearchParams, } from "../service-transaction-reducer";
import { ServiceTransactionFormState, ServiceStatus, } from "../service-transaction-types";
import { statusOptions, searchInOptions } from "../service-transaction-data";
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
  const formState = useSelector((state: RootState) => state.ServiceTransaction as ServiceTransactionFormState);
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
    { field: "pCode", header: t("p_code"), width: "100px" },
    { field: "barcode", header: t("barcode"), width: "140px" },
    { field: "product", header: t("product"), width: "auto" },
    { field: "qty", header: t("qty"), width: "100px", editable: true },
    { field: "purchasePrice", header: t("p_price"), width: "130px", align: "right" },
    { field: "total", header: t("total"), width: "130px", align: "right" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card - Job Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-end justify-between">
            <ERPInput
              id="searchJobNo"
              type="number"
              value={searchJobNo || ""}
              className="w-24"
              label={t("job_no")}
              onChange={(e) => dispatch(setSearchParams({ jobNo: parseInt(e.target.value) || 0 }))}
              onKeyDown={handleSearchKeyDown}
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

        {/* Main Service Information Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-t-xl shadow-sm border-t border-l border-r border-blue-200 dark:border-gray-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-[#2b6cb0]">{t("service_information")}</h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch gap-8">
              {/* Left Column - Service Info (Readonly) */}
              <div className="h-full">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm p-4 space-y-4 h-full border border-gray-200 dark:border-gray-600">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                    {t("service_details")}
                  </h3>

                  <div className="space-y-3">
                    <ERPInput
                      id="serviceName"
                      label={t("service")}
                      value={master.serviceName}
                      disabled
                      className="w-full"
                    />

                    <ERPInput
                      id="productRemarks"
                      label={t("product_remarks")}
                      value={master.productRemarks}
                      disabled
                      className="w-full"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <ERPInput
                        id="serialNo"
                        label={t("serial_no")}
                        value={master.serialNo}
                        disabled
                        className="w-full"
                      />

                      <ERPInput
                        id="unitRate"
                        type="number"
                        label={t("unit_rate")}
                        value={master.unitRate}
                        disabled
                        className="w-full"
                        textAlignStyle="right"
                      />
                    </div>

                    <ERPInput
                      id="receivedItems"
                      label={t("received_items")}
                      value={master.receivedItems}
                      disabled
                      className="w-full"
                    />

                    <ERPInput
                      id="complaints"
                      label={t("complaints")}
                      value={master.complaints}
                      disabled
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Service Processing */}
              <div className="h-full">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-sm p-4 space-y-4 h-full border border-blue-200 dark:border-gray-600">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                    {t("service_processing")}
                  </h3>

                  <div className="space-y-3">
                    <ERPDataCombobox
                      id="status"
                      label={t("status")}
                      value={serviceDetails.status}
                      options={statusOptions}
                      onChange={(item: any) => dispatch(updateServiceDetails({ status: item?.value as ServiceStatus }))}
                      disabled={formElements.status.disabled}
                      className="w-full"
                    />

                    <div className="flex items-end gap-2">
                      <ERPDatePicker
                        id="expectedDeliveryDate"
                        label={t("expected_delivery_date")}
                        value={master.expectedDeliveryDate ? moment(master.expectedDeliveryDate).toDate() : new Date()}
                        disabled
                      />

                      <ERPDatePicker
                        id="serviceDoneDate"
                        label={t("date")}
                        value={serviceDetails.serviceDoneDate ? moment(serviceDetails.serviceDoneDate).toDate() : new Date()}
                        disabled={formElements.serviceDoneDate.disabled}
                        onChange={(e) => {
                          let dateValue: string;
                          if (e && typeof e === 'object' && 'target' in e) {
                            dateValue = e.target.value ? moment(e.target.value).toISOString() : "";
                          } else {
                            dateValue = e ? moment(e).toISOString() : "";
                          }
                          dispatch(
                            updateServiceDetails({
                              serviceDoneDate: dateValue,
                            })
                          );
                        }}
                      />
                      <ERPCheckbox
                        id="isWarrantyService"
                        label={t("is_warranty_service")}
                        checked={master.isWarrantyService}
                        disabled
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <ERPInput
                        id="serviceCharge"
                        type="number"
                        label={t("service_charge")}
                        value={serviceDetails.serviceCharge}
                        disabled={formElements.serviceCharge.disabled}
                        className="w-full"
                        textAlignStyle="right"
                        onChange={(e) =>
                          dispatch(
                            updateServiceDetails({
                              serviceCharge: parseFloat(e.target.value) || 0,
                            })
                          )
                        }
                      />
                      <ERPInput
                        label={t("consumed_qty_amt")}
                        id="consumedQtyAmount"
                        type="number"
                        value={serviceDetails.consumedQtyAmount}
                        disabled
                        className="w-full"
                        textAlignStyle="right"
                      />
                    </div>

                    <ERPDataCombobox
                      id="warehouseID"
                      label={t("warehouse")}
                      value={serviceDetails.warehouseID}
                      disabled={formElements.warehouseID.disabled}
                      className="w-full"
                      field={{
                        getListUrl: Urls.data_warehouse,
                        valueKey: "id",
                        labelKey: "warehouseName",
                      }}
                      onChange={(item: any) =>
                        dispatch(
                          updateServiceDetails({
                            warehouseID: item?.value || 0,
                            warehouseName: item?.label || "",
                          })
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spare Parts Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-t-xl shadow-sm border-t border-l border-r border-blue-200 dark:border-gray-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package size={20} className="text-[#2b6cb0]" />
              <h2 className="text-lg font-semibold text-[#2b6cb0]">{t("spare_parts")}</h2>
            </div>
            <div className="w-72">
              <ERPInput
                id="barcodeInput"
                ref={barcodeRef}
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={handleBarcodeKeyDown}
                placeholder={t("scan_barcode")}
                className="w-full"
                noLabel={true}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-900">
                <tr>
                  {gridColumns.map((col) => (
                    <th key={col.field} className={`px-4 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-700 ${col.align === 'right' ? 'text-right' : 'text-left'}`} style={{ width: col.width }}>
                      {col.header}
                    </th>
                  ))}
                  <th className="w-16 px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-700">
                    {t("action")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {spareDetails.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                      {item.pCode}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {item.barcode}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                      {item.product}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          handleQtyChange(index, parseFloat(e.target.value) || 0)
                        }
                        className="w-full px-2 py-1 text-sm text-right bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-gray-100 font-medium">
                      {getFormattedValue(item.purchasePrice)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-gray-100 font-semibold">
                      {getFormattedValue(item.total)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleRemoveSpare(index)}
                        className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title={t("remove")}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {spareDetails.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                        <Package size={48} className="mb-3 opacity-50" />
                        <p className="text-sm font-medium">{t("no_spare_parts")}</p>
                        <p className="text-xs mt-1">{t("scan_barcode_to_add")}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pb-6">
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
            title={t("close")}
            onClick={() => window.history.back()}
            startIcon={<X size={18} />}
            variant="secondary"
            className="px-8 py-3 text-base font-medium"
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceTab;