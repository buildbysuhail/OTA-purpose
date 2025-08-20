import React, { useCallback } from "react";
import { useDebouncedInput } from "../../../../utilities/hooks/useDebounce";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { formStateMasterHandleFieldChange } from "./reducer";
import { useTranslation } from "react-i18next";
import { Ellipsis } from "lucide-react";
import Urls from "../../../../redux/urls";
import { TransactionFormState } from "./transaction-types";
import OrderNo from "./components/order-number";

interface MoreOptionsModalContentProps {
  formState: TransactionFormState;
  loadAndSetTransVoucher: any;
  dispatch: any;
  handleFieldChange: any;
  t: any;
}

const MoreOptionsModalContent: React.FC<MoreOptionsModalContentProps> = ({  formState,  dispatch,  loadAndSetTransVoucher,}) => {
  const { t } = useTranslation("transaction");
  const { value: despatchDocumentNumberValue, onChange: onDespatchDocumentNumberChange } = useDebouncedInput(
    formState.transaction.master.despatchDocumentNumber || '',
    (debouncedValue) => {
      dispatch(
        formStateMasterHandleFieldChange({
          fields: { despatchDocumentNumber: debouncedValue },
        })
      );
    },
    300
  );

  const { value: quotationNumberValue, onChange: onQuotationNumberChange } = useDebouncedInput(
    formState.transaction.master.quotationNumber || '',
    (debouncedValue) => {
      dispatch(
        formStateMasterHandleFieldChange({
          fields: { quotationNumber: debouncedValue },
        })
      );
    },
    300
  );

  const { value: purchaseInvoiceNumberValue, onChange: onPurchaseInvoiceNumberChange } = useDebouncedInput(
    formState.transaction.master.purchaseInvoiceNumber || '',
    (debouncedValue) => {
      dispatch(
        formStateMasterHandleFieldChange({
          fields: { purchaseInvoiceNumber: debouncedValue },
        })
      );
    },
    300
  );

  const { value: deliveryNoteNumberValue, onChange: onDeliveryNoteNumberChange } = useDebouncedInput(
    formState.transaction.master.deliveryNoteNumber || '',
    (debouncedValue) => {
      dispatch(
        formStateMasterHandleFieldChange({
          fields: { deliveryNoteNumber: debouncedValue },
        })
      );
    },
    300
  );

  const { value: gatePassNoValue, onChange: onGatePassNoChange } = useDebouncedInput(
    formState.transaction.master.gatePassNo || '',
    (debouncedValue) => {
      dispatch(
        formStateMasterHandleFieldChange({
          fields: { gatePassNo: debouncedValue },
        })
      );
    },
    300
  );

  const { value: dueDaysValue, onChange: onDueDaysChange } = useDebouncedInput(
    formState.transaction.master.dueDays || '',
    (debouncedValue) => {
      dispatch(
        formStateMasterHandleFieldChange({
          fields: { dueDays: debouncedValue },
        })
      );
    },
    300
  );

  const { value: salesManIncentiveValue, onChange: onSalesManIncentiveChange } = useDebouncedInput(
    formState.transaction.master.salesManIncentive || '',
    (debouncedValue) => {
      dispatch(
        formStateMasterHandleFieldChange({
          fields: { salesManIncentive: debouncedValue },
        })
      );
    },
    300
  );

  const { value: notes1Value, onChange: onNotes1Change } = useDebouncedInput(
    formState.transaction.master.notes1 || '',
    (debouncedValue) => {
      dispatch(
        formStateMasterHandleFieldChange({
          fields: { notes1: debouncedValue },
        })
      );
    },
    300
  );

  const { value: notes2Value, onChange: onNotes2Change } = useDebouncedInput(
    formState.transaction.master.notes2 || '',
    (debouncedValue) => {
      dispatch(
        formStateMasterHandleFieldChange({
          fields: { notes2: debouncedValue },
        })
      );
    },
    300
  );

  return (
    <div className="w-full modal-content">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap gap-1">
          <div className="flex-1 min-w-[300px] items-end rounded-md p-2">
            {/* Dispatch Info */}
            <div className="mb-3">
              <div className="font-bold text-sm mb-3 bg-gray-200 px-2 py-1">
                {t("despatch_info")}
              </div>
              <div className="grid grid-cols-1 gap-1">
                <ERPInput
                  id="despatchDocumentNumber"
                  label={t("despatch_doc_no")}
                  labelDirection="horizontal"
                  value={despatchDocumentNumberValue}
                  className="w-full"
                  // className="flex-1 h-6 text-xs w-full sm:max-w-36"
                  onChange={(e) => onDespatchDocumentNumberChange(e.target.value)}
                />

                <ERPDateInput
                  id="despatchDate"
                  label={t("despatch_date")}
                  labelDirection="horizontal"
                  value={formState.transaction.master.despatchDate}
                  className="w-full"
                  // className="flex-1 h-6 text-xs w-full sm:max-w-36"
                  onChange={(e) => dispatch(formStateMasterHandleFieldChange({ fields: { despatchDate: e.target.value } }))}
                />

                <ERPDataCombobox
                  id="driverID"
                  label={t("driver")}
                  labelDirection="horizontal"
                  value={formState.transaction.master.driverID}
                  className="w-full"
                  // className="flex-1 h-6 text-xs w-full sm:max-w-36"
                  field={{
                    id: "driverID",
                    valueKey: "id",
                    labelKey: "name",
                    getListUrl: Urls.data_driver
                  }}
                  onSelectItem={(data) => dispatch(formStateMasterHandleFieldChange({ fields: { driverID: data.value } }))}
                />
              </div>
            </div>

            {/* Order Info */}
            <div className="mb-3">
              <div className="font-bold text-sm mb-3 bg-gray-200 px-2 py-1">
                {t("order_info")}
              </div>
              <div className="grid grid-cols-1 gap-1">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("order_no")} :
                  </label>
                  <div className="flex items-center flex-1">
                    <OrderNo
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                      loadAndSetTransVoucher={loadAndSetTransVoucher}
                    />
                  </div>
                </div>

                <ERPDateInput
                  id="orderDate"
                  label={t("order_date")}
                  labelDirection="horizontal"
                  value={formState.transaction.master.orderDate}
                  // className="flex-1 h-6 text-xs w-full sm:max-w-36"
                  onChange={(e) => dispatch(formStateMasterHandleFieldChange({ fields: { orderDate: e.target.value } }))}
                />
              </div>
            </div>

            {/* Quotation Info */}
            <div className="mb-3">
              <div className="font-bold text-xs sm:text-sm mb-2 sm:mb-3 bg-gray-200 px-2 py-1">
                {t("quotation_info")}
              </div>
              <div className="grid grid-cols-1 gap-1">
                <ERPInput
                  id="quotationNumber"
                  label={t("quotation_no")}
                  labelDirection="horizontal"
                  value={quotationNumberValue}
                  // className="flex-1 h-6 text-xs w-full sm:max-w-36"
                  onChange={(e) => onQuotationNumberChange(e.target.value)}
                />
                <ERPDateInput
                  id="quotationDate"
                  label={t("quotation_date")}
                  labelDirection="horizontal"
                  value={formState.transaction.master.quotationDate}
                  // className="flex-1 h-6 text-xs w-full sm:max-w-36"
                  onChange={(e) => dispatch(formStateMasterHandleFieldChange({ fields: { quotationDate: e.target.value } }))}
                />
              </div>
            </div>

            {/* Purchase Info */}
            <div>
              <div className="font-bold text-xs sm:text-sm mb-2 sm:mb-3 bg-gray-200 px-2 py-1">
                {t("purchase_info")}
              </div>
              <div className="grid grid-cols-1 gap-1">
                <ERPInput
                  id="purchaseInvoiceNumber"
                  label={t("pi_inv_no")}
                  labelDirection="horizontal"
                  value={purchaseInvoiceNumberValue}
                  // className="w-full sm:w-20 h-6 text-xs"
                  onChange={(e) => onPurchaseInvoiceNumberChange(e.target.value)}
                />
                <ERPDateInput
                  id="purchaseInvoiceDate"
                  label={t("pi_inv_date")}
                  labelDirection="horizontal"
                  value={formState.transaction.master.purchaseInvoiceDate}
                  // className="flex-1 h-6 text-xs w-full sm:max-w-36"
                  onChange={(e) => dispatch(formStateMasterHandleFieldChange({ fields: { purchaseInvoiceDate: e.target.value } }))}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-[300px] rounded-md p-2">
            {/* Delivery Info */}
            <div className="mb-3">
              <div className="font-bold text-xs sm:text-sm mb-2 sm:mb-3 bg-gray-200 px-2 py-1">
                {t("delivery_info")}
              </div>
              <div className="grid grid-cols-1 gap-1">
                <ERPInput
                  id="deliveryNoteNumber"
                  label={t("delivery_note_no")}
                  labelDirection="horizontal"
                  value={deliveryNoteNumberValue}
                  // className="flex-1 h-6 text-xs w-full sm:max-w-36"
                  onChange={(e) => onDeliveryNoteNumberChange(e.target.value)}
                />
                <ERPDateInput
                  id="deliveryDate"
                  label={t("delivery_date")}
                  labelDirection="horizontal"
                  value={formState.transaction.master.deliveryDate}
                  // className="flex-1 h-6 text-xs w-full sm:max-w-36"
                  onChange={(e) => dispatch(formStateMasterHandleFieldChange({ fields: { deliveryDate: e.target.value } }))}
                />
                <ERPDataCombobox
                  id="deliveryManID"
                  label={t("delivery_man")}
                  labelDirection="horizontal"
                  value={formState.transaction.master.deliveryManID}
                  field={{
                    id: "deliveryManID",
                    valueKey: "id",
                    labelKey: "name",
                    getListUrl: Urls.data_deliveryMan,
                  }}
                  onSelectItem={(data) => dispatch(formStateMasterHandleFieldChange({ fields: { deliveryManID: data.value } }))}
                // className="flex-1 h-6 text-xs w-full sm:max-w-36"
                />
              </div>
            </div>

            {/* Other */}
            <div className="mb-3">
              <div className="font-bold text-xs sm:text-sm mb-2 sm:mb-3 bg-gray-200 px-2 py-1">
                {t("other")}
              </div>
              <div className="grid grid-cols-1 gap-1">
                <ERPInput
                  id="gatePassNo"
                  label={t("gate_pass_no")}
                  labelDirection="horizontal"
                  value={gatePassNoValue}
                  // className="flex-1 h-6 text-xs w-full sm:max-w-36"
                  onChange={(e) => onGatePassNoChange(e.target.value)}
                />
                <ERPInput
                  id="dueDays"
                  label={t("due_days")}
                  labelDirection="horizontal"
                  value={dueDaysValue}
                  // className="w-full sm:w-20 h-6 text-xs sm:mr-2"
                  onChange={(e) => onDueDaysChange(e.target.value)}
                />
                <ERPDateInput
                  id="dueDate"
                  label={t("due_date")}
                  labelDirection="horizontal"
                  value={formState.transaction.master.dueDate}
                  // className="flex-1 h-6 text-xs w-full sm:max-w-36"
                  onChange={(e) => dispatch(formStateMasterHandleFieldChange({ fields: { dueDate: e.target.value } }))}
                />
                <ERPDataCombobox
                  id="vehicleID"
                  label={t("vehicle")}
                  labelDirection="horizontal"
                  value={formState.transaction.master.vehicleID}
                  // className="flex-1 h-6 text-xs w-full sm:max-w-36"
                  field={{
                    id: "vehicleID",
                    valueKey: "id",
                    labelKey: "name",
                    // getListUrl: Urls.
                  }}
                  onSelectItem={(data) => dispatch(formStateMasterHandleFieldChange({ fields: { vehicleID: data.value } }))}
                />
                <ERPInput
                  id="salesManIncentive"
                  label={t("salesman_incentive")}
                  labelDirection="horizontal"
                  value={salesManIncentiveValue}
                  // className="w-full sm:w-20 h-6 text-xs"
                  onChange={(e) => onSalesManIncentiveChange(e.target.value)}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <div className="font-bold text-xs sm:text-sm mb-2 sm:mb-3 bg-gray-200 px-2 py-1">
                {t("notes")}
              </div>
              <div className="grid grid-cols-1 gap-1">
                <ERPInput
                  id="notes1"
                  label={t("notes_1")}
                  labelDirection="horizontal"
                  value={notes1Value}
                  // className="flex-1 h-6 text-xs w-full sm:max-w-36"
                  onChange={(e) => onNotes1Change(e.target.value)}
                />
                <ERPInput
                  id="notes2"
                  label={t("notes_2")}
                  labelDirection="horizontal"
                  value={notes2Value}
                  className="flex-1 h-6 text-xs w-full sm:max-w-36"
                  onChange={(e) => onNotes2Change(e.target.value)}
                />
                <ERPDataCombobox
                  id="tableId"
                  label={t("sch_disc_posting_a/c")}
                  labelDirection="horizontal"
                  value={formState.transaction.master.tableId}
                  // className="flex-1 h-6 text-xs w-full sm:max-w-36"
                  field={{
                    id: "tableId",
                    valueKey: "id",
                    labelKey: "name",
                    getListUrl: Urls.data_acc_ledgers,
                  }}
                  onSelectItem={(data) => dispatch(formStateMasterHandleFieldChange({ fields: { tableId: data.value } }))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default MoreOptionsModalContent;
