import React from "react";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { formStateMasterHandleFieldChange } from "./reducer";
import { useTranslation } from "react-i18next";
import { Ellipsis } from "lucide-react";
import Urls from "../../../../redux/urls";

interface MoreOptionsModalContentProps {
  formState: any;
  dispatch: any;
  handleFieldChange: any;
  t: any;
}

const MoreOptionsModalContent: React.FC<MoreOptionsModalContentProps> = ({
  formState,
  dispatch,
  handleFieldChange,
}) => {
  const { t } = useTranslation("transaction");
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
              <div className="flex flex-wrap gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("despatch_doc_no")} :
                  </label>
                  <ERPInput
                    id="despatchDocumentNumber"
                    value={formState.despatchDocumentNumber}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    noLabel={true}
                    onChange={(e) =>
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { despatchDocumentNumber: e.target.value },
                        })
                      )
                    }
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("despatch_date")} :
                  </label>
                  <ERPDateInput
                    id="despatchDate"
                    noLabel={true}
                    value={formState.despatchDate}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    onChange={(e) =>
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { despatchDate: e.target.value },
                        })
                      )
                    }
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("driver")} :
                  </label>
                  <ERPDataCombobox
                    id="driverID"
                    noLabel={true}
                    value={formState.driverID}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    field={{
                      id: "driverID",
                      valueKey: "id",
                      labelKey: "name",
                      getListUrl: Urls.data_driver
                    }}
                    onSelectItem={(data) =>
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { driverID: data.value },
                        })
                      )
                    }
                  />
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="mb-3">
              <div className="font-bold text-sm mb-3 bg-gray-200 px-2 py-1">
                {t("order_info")}
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("order_no")} :
                  </label>
                  <div className="flex items-center flex-1">
                    <ERPInput
                      id="orderNumber"
                      noLabel={true}
                      value={formState.orderNumber}
                      className="flex-1 h-6 text-xs max-w-none sm:max-w-28"
                      onChange={(e) =>
                        dispatch(
                          formStateMasterHandleFieldChange({
                            fields: { orderNumber: e.target.value },
                          })
                        )
                      }
                    />
                    <button className="bg-gray-300 p-2 rounded-md ml-1 hover:shadow-md transition duration-300 flex-shrink-0">
                      <Ellipsis className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("order_date")} :
                  </label>
                  <ERPDateInput
                    id="orderDate"
                    noLabel={true}
                    value={formState.orderDate}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    onChange={(e) =>
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { orderDate: e.target.value },
                        })
                      )
                    }
                  />
                </div>
              </div>
            </div>

            {/* Quotation Info */}
            <div className="mb-3">
              <div className="font-bold text-xs sm:text-sm mb-2 sm:mb-3 bg-gray-200 px-2 py-1">
                {t("quotation_info")}
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("quotation_no")} :
                  </label>
                  <ERPInput
                    id="quotationNumber"
                    noLabel={true}
                    value={formState.quotationNumber}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    onChange={(e) =>
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { quotationNumber: e.target.value },
                        })
                      )
                    }
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("quotation_date")} :
                  </label>
                  <ERPDateInput
                    id="quotationDate"
                    noLabel={true}
                    value={formState.quotationDate}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    onChange={(e) =>
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { quotationDate: e.target.value },
                        })
                      )
                    }
                  />
                </div>
              </div>
            </div>

            {/* Purchase Info */}
            <div>
              <div className="font-bold text-xs sm:text-sm mb-2 sm:mb-3 bg-gray-200 px-2 py-1">
                {t("purchase_info")}
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("pi_inv_no")} :
                  </label>
                  <ERPInput
                    id="purchaseInvoiceNumber"
                    noLabel={true}
                    value={formState.purchaseInvoiceNumber}
                    className="w-full sm:w-20 h-6 text-xs"
                    onChange={(e) =>
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { purchaseInvoiceNumber: e.target.value },
                        })
                      )
                    }
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("pi_inv_date")} :
                  </label>
                  <ERPDateInput
                    id="purchaseInvoiceDate"
                    noLabel={true}
                    value={formState.purchaseInvoiceDate}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    onChange={(e) =>
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { purchaseInvoiceDate: e.target.value },
                        })
                      )
                    }
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
              <div className="flex flex-wrap gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("delivery_note_no")} :
                  </label>
                  <ERPInput
                    id="deliveryNoteNumber"
                    noLabel={true}
                    value={formState.deliveryNoteNumber}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    onChange={(e) =>
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { deliveryNoteNumber: e.target.value },
                        })
                      )
                    }
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("delivery_date")} :
                  </label>
                  <ERPDateInput
                    id="deliveryDate"
                    noLabel={true}
                    value={formState.deliveryDate}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    onChange={(e) =>
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { deliveryDate: e.target.value },
                        })
                      )
                    }
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("delivery_man")} :
                  </label>
                  <ERPDataCombobox
                    id="deliveryManID"
                    noLabel={true}
                    value={formState.deliveryManID}
                    field={{
                      id: "deliveryManID",
                      valueKey: "id",
                      labelKey: "name",
                      getListUrl:Urls.data_deliveryMan,
                    }}
                    onSelectItem={(data) =>
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { deliveryManID: data.value },
                        })
                      )
                    }
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
              <div className="flex flex-wrap gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("gate_pass_no")} :
                  </label>
                  <ERPInput
                    id="gatePassNo"
                    noLabel={true}
                    value={formState.gatePassNo}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    onChange={(e) =>
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { gatePassNo: e.target.value },
                        })
                      )
                    }
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("due_days")} :
                  </label>
                  <ERPInput
                    id="dueDays"
                    noLabel={true}
                    value={formState.dueDays}
                    className="w-full sm:w-20 h-6 text-xs sm:mr-2"
                    onChange={(e) =>
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { dueDays: e.target.value },
                        })
                      )
                    }
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("due_date")} :
                  </label>
                  <ERPDateInput
                    id="dueDate"
                    noLabel={true}
                    value={formState.dueDate}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    onChange={(e) =>
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { dueDate: e.target.value },
                        })
                      )
                    }
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("vehicle")} :
                  </label>
                  <ERPDataCombobox
                    id="vehicleID"
                    noLabel={true}
                    value={formState.vehicleID}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    field={{
                      id: "vehicleID",
                      valueKey: "id",
                      labelKey: "name",
                      // getListUrl:Urls.
                    }}
                    onSelectItem={(data) =>
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { vehicleID: data.value },
                        })
                      )
                    }
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("salesman_incentive")} :
                  </label>
                  <ERPInput
                    noLabel={true}
                    id="salesManIncentive"
                    value={formState.salesManIncentive}
                    className="w-full sm:w-20 h-6 text-xs"
                    onChange={(e) =>
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { salesManIncentive: e.target.value },
                        })
                      )
                    }
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <div className="font-bold text-xs sm:text-sm mb-2 sm:mb-3 bg-gray-200 px-2 py-1">
                {t("notes")}
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center flex-1 min-w-[200px]">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("notes_1")} :
                  </label>
                  <ERPInput
                    id="notes1"
                    noLabel={true}
                    value={formState.notes1}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    onChange={(e) =>
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { notes1: e.target.value },
                        })
                      )
                    }
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center flex-1 min-w-[200px]">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("notes_2")} :
                  </label>
                  <ERPInput
                    id="notes2"
                    noLabel={true}
                    value={formState.notes2}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    onChange={(e) =>
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { notes2: e.target.value },
                        })
                      )
                    }
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center flex-1 min-w-[200px]">
                  <label className="w-full sm:w-32 text-xs mb-1 sm:mb-0">
                    {t("sch_disc_posting_a/c")} :
                  </label>
                  <ERPDataCombobox
                    id="tableId"
                    noLabel={true}
                    value={formState.tableId}
                    className="flex-1 h-6 text-xs w-full sm:max-w-36"
                    field={{
                      id: "tableId",
                      valueKey: "id",
                      labelKey: "name",
                      getListUrl:Urls.data_acc_ledgers,
                    }}
                    onSelectItem={(data) =>
                      dispatch(
                        formStateMasterHandleFieldChange({
                          fields: { tableId: data.value },
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
    </div>
  );
};

export default MoreOptionsModalContent;
