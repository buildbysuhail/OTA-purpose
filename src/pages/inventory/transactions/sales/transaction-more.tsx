import React from "react";
import { useDebouncedInput } from "../../../../utilities/hooks/useDebounce";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { useTranslation } from "react-i18next";
import Urls from "../../../../redux/urls";
import OrderNo from "./components/order-number";
import { LoadAndSetTransVoucherFn } from "./use-transaction";
import { formStateHandleFieldChangeKeysOnly, formStateMasterHandleFieldChange } from "../reducer";
import { TransactionFormState } from "../transaction-types";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

interface MoreOptionsModalContentProps {
  formState: TransactionFormState;
  loadAndSetTransVoucher: LoadAndSetTransVoucherFn
  dispatch: any;
  handleFieldChange: any;
  t: any;
  transactionType: any;
}

const MoreOptionsModalContent: React.FC<MoreOptionsModalContentProps> = ({ formState, dispatch, loadAndSetTransVoucher, transactionType }) => {
  const { t } = useTranslation("transaction");
  const clientSession = useSelector((state: RootState) => state.ClientSession);
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

  return (
    <div className="w-full modal-content">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap gap-1">
          <div className="flex-1 min-w-[300px] rounded-md p-2">
            {/* Dispatch Info */}
            <div className="mb-3">
              <div className="font-bold text-sm mb-3 bg-gray-200 px-2 py-1">
                {t("despatch_info")}
              </div>
              <div className="flex flex-wrap gap-2 px-2">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("despatch_doc_no")} :
                  </label>
                  <ERPInput
                    id="despatchDocumentNumber"
                    value={despatchDocumentNumberValue}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    noLabel={true}
                    onChange={(e) => onDespatchDocumentNumberChange(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("despatch_date")} :
                  </label>
                  <ERPDateInput
                    id="despatchDate"
                    noLabel={true}
                    value={formState.transaction.master.despatchDate}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    onChange={(e) => dispatch(formStateMasterHandleFieldChange({ fields: { despatchDate: e.target.value } }))}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("driver")} :
                  </label>
                  <ERPDataCombobox
                    id="driverID"
                    noLabel={true}
                    value={formState.transaction.master.driverID || -2}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    field={{
                      id: "driverID",
                      valueKey: "employeeID",
                      labelKey: "employeeName",
                      getListUrl: Urls.data_driver
                    }}
                    onSelectItem={(data) => dispatch(formStateMasterHandleFieldChange({ fields: { driverID: data.value } }))}
                  />
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="mb-3">
              <div className="font-bold text-sm mb-3 bg-gray-200 px-2 py-1">
                {t("order_info")}
              </div>
              <div className="flex flex-wrap gap-2 px-2">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("order_no")} :
                  </label>
                  <div className="flex items-center flex-1">
                    <OrderNo
                      type="number"
                      formState={formState}
                      dispatch={dispatch}
                      t={t}
                      loadAndSetTransVoucher={loadAndSetTransVoucher}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("order_date")} :
                  </label>
                  <ERPDateInput
                    id="orderDate"
                    noLabel={true}
                    value={formState.transaction.master.orderDate}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    onChange={(e) => dispatch(formStateMasterHandleFieldChange({ fields: { orderDate: e.target.value } }))}
                  />
                </div>
              </div>
            </div>

            {/* Quotation Info */}
            <div className="mb-3">
              <div className="font-bold text-xs sm:text-sm mb-2 sm:mb-3 bg-gray-200 px-2 py-1">
                {t("quotation_info")}
              </div>
              <div className="flex flex-wrap gap-2 px-2">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("quotation_no")} :
                  </label>
                  <ERPInput
                    type="number"
                    id="quotationNumber"
                    noLabel={true}
                    value={quotationNumberValue}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    onChange={(e) => onQuotationNumberChange(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("quotation_date")} :
                  </label>
                  <ERPDateInput
                    id="quotationDate"
                    noLabel={true}
                    value={formState.transaction.master.quotationDate}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    onChange={(e) => dispatch(formStateMasterHandleFieldChange({ fields: { quotationDate: e.target.value } }))}
                  />
                </div>
              </div>
            </div>

            {/* Purchase Info */}
            <div>
              <div className="font-bold text-xs sm:text-sm mb-2 sm:mb-3 bg-gray-200 px-2 py-1">
                {t("purchase_info")}
              </div>
              <div className="flex flex-wrap gap-2 px-2">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("pi_inv_no")} :
                  </label>
                  <ERPInput
                    type="number"
                    id="purchaseInvoiceNumber"
                    noLabel={true}
                    value={purchaseInvoiceNumberValue}
                    className="w-full sm:w-20 h-6 text-xs"
                    onChange={(e) => onPurchaseInvoiceNumberChange(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("pi_inv_date")} :
                  </label>
                  <ERPDateInput
                    id="purchaseInvoiceDate"
                    noLabel={true}
                    value={formState.transaction.master.purchaseInvoiceDate}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    onChange={(e) => dispatch(formStateMasterHandleFieldChange({ fields: { purchaseInvoiceDate: e.target.value } }))}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-[300px] rounded-md p-2">
            {/* Delivery Info */}
            <div className="mb-3">
              <div className="font-bold text-xs sm:text-sm mb-2 sm:mb-3 bg-gray-200 px-2 py-1">
                {t("delivery_info")}
              </div>
              <div className="flex flex-wrap gap-2 px-2">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("delivery_note_no")} :
                  </label>
                  <ERPInput
                    id="deliveryNoteNumber"
                    noLabel={true}
                    value={deliveryNoteNumberValue}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    onChange={(e) => onDeliveryNoteNumberChange(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("delivery_date")} :
                  </label>
                  <ERPDateInput
                    id="deliveryDate"
                    noLabel={true}
                    value={formState.transaction.master.deliveryDate}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    onChange={(e) => dispatch(formStateMasterHandleFieldChange({ fields: { deliveryDate: e.target.value } }))}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("delivery_man")} :
                  </label>
                  <ERPDataCombobox
                    id="deliveryManID"
                    noLabel={true}
                    value={formState.transaction.master.deliveryManID || -2}
                    field={{
                      id: "id",
                      valueKey: "employeeID",
                      labelKey: "employeeName",
                      getListUrl: Urls.data_deliveryMan,
                    }}
                    onSelectItem={(data) => dispatch(formStateMasterHandleFieldChange({ fields: { deliveryManID: data.value } }))}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                  />
                </div>
              </div>
            </div>

            {/* Other */}
            <div className="mb-3">
              <div className="font-bold text-xs sm:text-sm mb-2 sm:mb-3 bg-gray-200 px-2 py-1">
                {t("other")}
              </div>
              <div className="flex flex-wrap gap-2 px-2">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("gate_pass_no")} :
                  </label>
                  <ERPInput
                    id="gatePassNo"
                    noLabel={true}
                    value={gatePassNoValue}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    onChange={(e) => onGatePassNoChange(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("due_days")} :
                  </label>
                  <ERPInput
                    id="dueDays"
                    noLabel={true}
                    value={dueDaysValue}
                    className="w-full sm:w-20 h-6 text-xs sm:mr-2"
                    onChange={(e) => onDueDaysChange(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("due_date")} :
                  </label>
                  <ERPDateInput
                    id="dueDate"
                    noLabel={true}
                    value={formState.transaction.master.dueDate}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    onChange={(e) => dispatch(formStateMasterHandleFieldChange({ fields: { dueDate: e.target.value } }))}
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("vehicle")} :
                  </label>
                  <ERPDataCombobox
                    id="vehicleID"
                    noLabel={true}
                    value={formState.transaction.master.vehicleID || -2}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    field={{
                      id: "vehicleID",
                      valueKey: "id",
                      labelKey: "name",
                      getListUrl: `${Urls.inv_transaction_base}${transactionType}/Data/Vehicles`
                    }}
                    onSelectItem={(data) => dispatch(formStateMasterHandleFieldChange({ fields: { vehicleID: data.value } }))}
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("salesman_incentive")} :
                  </label>
                  <ERPInput
                    noLabel={true}
                    type="number"
                    id="salesManIncentive"
                    value={salesManIncentiveValue}
                    className="w-full sm:w-20 h-6 text-xs"
                    onChange={(e) => onSalesManIncentiveChange(e.target.value)}
                  />
                </div>
                {formState.transaction.master.voucherType == "PI" &&
                  <div className="flex flex-col sm:flex-row sm:items-center flex-1 min-w-[200px]">
                    <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                      {t("sch_disc_posting_a/c")} :
                    </label>
                    <ERPDataCombobox
                      id="tableId"
                      noLabel={true}
                      value={formState.transaction.master.tableId || -2}
                      className="flex-1 h-6 text-xs w-full sm:max-w-36"
                      field={{
                        id: "tableID",
                        valueKey: "id",
                        labelKey: "name",
                        getListUrl: Urls.data_acc_ledgers,
                      }}
                      onSelectItem={(data) => dispatch(formStateMasterHandleFieldChange({ fields: { tableId: data.value } }))}
                    />
                  </div>
                }
              </div>
            </div>
          </div>
          {clientSession.isAppGlobal && (
            <div className="flex-1 min-w-[300px] rounded-md p-2">
              <div className="font-bold text-xs sm:text-sm mb-2 bg-gray-200 px-2 py-1">
                {t("shipping_details")}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 px-2">

                {/* Legal Name */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs">{t("legal_name")} :</label>
                  <ERPInput
                    id="shipLegalName"
                    noLabel
                    value={formState.transaction.master.master3.shipLegalName}
                    className="flex-1 h-6 text-xs"
                    onChange={(e) =>
                      dispatch(
                        formStateHandleFieldChangeKeysOnly({
                          fields: {
                            transaction: {
                              master: {
                                master3: { shipLegalName: e.target.value }
                              }
                            }
                          }
                        })
                      )
                    }
                  />
                </div>

                {/* Address 1 */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs">{t("address_1")} :</label>
                  <ERPInput
                    id="shipAddress1"
                    noLabel
                    value={formState.transaction.master.master3.shipAddress1}
                    className="flex-1 h-6 text-xs"
                    onChange={(e) =>
                      dispatch(
                        formStateHandleFieldChangeKeysOnly({
                          fields: {
                            transaction: {
                              master: {
                                master3: { shipAddress1: e.target.value }
                              }
                            }
                          }
                        })
                      )
                    }
                  />
                </div>

                {/* Trade Name */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs">{t("trade_name")} :</label>
                  <ERPInput
                    id="shipTradeName"
                    noLabel
                    value={formState.transaction.master.master3.shipTradeName}
                    className="flex-1 h-6 text-xs"
                    onChange={(e) =>
                      dispatch(
                        formStateHandleFieldChangeKeysOnly({
                          fields: {
                            transaction: {
                              master: {
                                master3: { shipTradeName: e.target.value }
                              }
                            }
                          }
                        })
                      )
                    }
                  />
                </div>

                {/* Address 2 */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs">{t("address_2")} :</label>
                  <ERPInput
                    id="shipAddress2"
                    noLabel
                    value={formState.transaction.master.master3.shipAddress2}
                    className="flex-1 h-6 text-xs"
                    onChange={(e) =>
                      dispatch(
                        formStateHandleFieldChangeKeysOnly({
                          fields: {
                            transaction: {
                              master: {
                                master3: { shipAddress2: e.target.value }
                              }
                            }
                          }
                        })
                      )
                    }
                  />
                </div>

                {/* GSTIN */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs">{t("gstin")} :</label>
                  <ERPInput
                    id="shipGstIn"
                    noLabel
                    value={formState.transaction.master.master3.shipGstIn}
                    className="flex-1 h-6 text-xs"
                    onChange={(e) =>
                      dispatch(
                        formStateHandleFieldChangeKeysOnly({
                          fields: {
                            transaction: {
                              master: {
                                master3: { shipGstIn: e.target.value }
                              }
                            }
                          }
                        })
                      )
                    }
                  />
                </div>

                {/* Location */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs">{t("location")} :</label>
                  <ERPInput
                    id="shipLocation"
                    noLabel
                    value={formState.transaction.master.master3.shipLocation}
                    className="flex-1 h-6 text-xs"
                    onChange={(e) =>
                      dispatch(
                        formStateHandleFieldChangeKeysOnly({
                          fields: {
                            transaction: {
                              master: {
                                master3: { shipLocation: e.target.value }
                              }
                            }
                          }
                        })
                      )
                    }
                  />
                </div>

                {/* Pin Code */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs">{t("pin_code")} :</label>
                  <ERPInput
                    id="shipPinCode"
                    noLabel
                    type="number"
                    value={formState.transaction.master.master3.shipPinCode}
                    className="flex-1 h-6 text-xs"
                    onChange={(e) =>
                      dispatch(
                        formStateHandleFieldChangeKeysOnly({
                          fields: {
                            transaction: {
                              master: {
                                master3: { shipPinCode: Number(e.target.value) }
                              }
                            }
                          }
                        })
                      )
                    }
                  />
                </div>

                {/* State Code */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs">{t("state_code")} :</label>
                  <ERPInput
                    id="shipStateCode"
                    noLabel
                    type="number"
                    value={formState.transaction.master.master3.shipStateCode}
                    className="flex-1 h-6 text-xs"
                    onChange={(e) =>
                      dispatch(
                        formStateHandleFieldChangeKeysOnly({
                          fields: {
                            transaction: {
                              master: {
                                master3: { shipStateCode: Number(e.target.value) }
                              }
                            }
                          }
                        })
                      )
                    }
                  />
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoreOptionsModalContent;
