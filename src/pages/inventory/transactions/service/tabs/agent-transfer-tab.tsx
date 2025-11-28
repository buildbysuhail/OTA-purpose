import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { Save, X, Plus } from "lucide-react";
import { updateAgentTransfer, setSearchParams, } from "../service-transaction-reducer";
import { ServiceTransactionFormState, ServiceStatus, } from "../service-transaction-types";
import { searchInOptions } from "../service-transaction-data";
import Urls from "../../../../../redux/urls";
import moment from "moment";
import ERPDateInput from "../../../../../components/ERPComponents/erp-date-input";

interface AgentTransferTabProps {
  onSave: () => void;
  onClear: () => void;
  onSearch: (jobNo: number, searchIn: string) => void;
  onAddAgent: () => void;
}

const AgentTransferTab: React.FC<AgentTransferTabProps> = ({ onSave, onClear, onSearch, onAddAgent, }) => {
  const { t } = useTranslation("transaction");
  const dispatch = useDispatch();
  const formState = useSelector((state: RootState) => state.ServiceTransaction as ServiceTransactionFormState);
  const { master, agentTransfer } = formState.transaction;
  const { formElements, searchJobNo, searchIn } = formState;
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(searchJobNo, searchIn);
    }
  };

  const statusOptions = [
    { value: ServiceStatus.Pending, label: t("pending") },
    { value: ServiceStatus.Completed, label: t("completed") },
    { value: ServiceStatus.Cancelled, label: t("cancelled") },
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

        {/* Main Agent Transfer Information Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">{t("agent_transfer_details")}</h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                    {t("transfer_information")}
                  </h3>

                  <div className="space-y-3">
                    <ERPDateInput
                      id="transferDate"
                      label={t("date")}
                      value={agentTransfer.transferDate ? moment(agentTransfer.transferDate).toDate() : new Date()}
                      disabled={formElements.transferDate.disabled}
                      onChange={(e) =>
                        dispatch(
                          updateAgentTransfer({
                            transferDate: e.target.value ? moment(e.target.value).toISOString() : "",
                          })
                        )
                      }
                    />

                    <div className="flex items-end gap-2">
                      <ERPDataCombobox
                        id="agentID"
                        label={t("agent_name")}
                        value={agentTransfer.agentID}
                        disabled={formElements.agentID.disabled}
                        field={{
                          getListUrl: `${Urls.data_acc_ledgers}?ledgerType=6`,
                          valueKey: "id",
                          labelKey: "ledgerName",
                        }}
                        onChange={(item: any) =>
                          dispatch(
                            updateAgentTransfer({
                              agentID: item?.value || 0,
                              agentName: item?.label || "",
                            })
                          )
                        }
                        className="flex-1"
                      />
                      <button onClick={onAddAgent} className="w-10 h-10 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-colors">
                        <Plus size={18} />
                      </button>
                    </div>

                    <ERPDateInput
                      id="despatchedReturnDate"
                      label={t("despatched_return_date")}
                      value={agentTransfer.despatchedReturnDate ? moment(agentTransfer.despatchedReturnDate).toDate() : new Date()}
                      disabled={formElements.despatchedReturnDate.disabled}
                      onChange={(e) =>
                        dispatch(
                          updateAgentTransfer({
                            despatchedReturnDate: e.target.value
                              ? moment(e.target.value).toISOString()
                              : "",
                          })
                        )
                      }
                    />

                    <ERPDateInput
                      id="expectedDeliveryDate"
                      label={t("expected_delivery_date")}
                      value={agentTransfer.expectedDeliveryDate ? moment(agentTransfer.expectedDeliveryDate).toDate() : new Date()}
                      disabled={formElements.expectedDeliveryDate.disabled}
                      onChange={(e) =>
                        dispatch(
                          updateAgentTransfer({
                            expectedDeliveryDate: e.target.value
                              ? moment(e.target.value).toISOString()
                              : "",
                          })
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Processing Details */}
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                    {t("processing_details")}
                  </h3>

                  <div className="space-y-3">
                    <ERPDataCombobox
                      id="agentTransferStatus"
                      label={t("status")}
                      value={agentTransfer.status}
                      options={statusOptions}
                      disabled={formElements.status.disabled}
                      className="w-full"
                      onChange={(item: any) =>
                        dispatch(
                          updateAgentTransfer({
                            status: item?.value as ServiceStatus,
                          })
                        )
                      }
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <ERPInput
                        id="agentCharge"
                        label={t("agent_charge")}
                        type="number"
                        value={agentTransfer.agentCharge}
                        disabled={formElements.agentCharge.disabled}
                        className="w-full"
                        textAlignStyle="right"
                        onChange={(e) =>
                          dispatch(
                            updateAgentTransfer({
                              agentCharge: parseFloat(e.target.value) || 0,
                            })
                          )
                        }
                      />
                      <ERPInput
                        id="unitRate"
                        label={t("unit_rate")}
                        type="number"
                        value={agentTransfer.unitRate}
                        disabled={formElements.unitRate.disabled}
                        className="w-full"
                        textAlignStyle="right"
                        onChange={(e) =>
                          dispatch(
                            updateAgentTransfer({
                              unitRate: parseFloat(e.target.value) || 0,
                            })
                          )
                        }
                      />
                    </div>

                    <div className="flex items-end gap-2">
                      <ERPInput
                        id="consumedQtyAmount"
                        label={t("consumed_qty_amt")}
                        type="number"
                        value={agentTransfer.consumedQtyAmount}
                        disabled
                        className="flex-1"
                        textAlignStyle="right"
                      />
                      <ERPCheckbox
                        id="isWarrantyService"
                        label={t("is_warranty_service")}
                        checked={!!agentTransfer.isWarrantyService}
                        disabled={formElements.isWarrantyService.disabled}
                        onChange={(e) =>
                          dispatch(
                            updateAgentTransfer({
                              isWarrantyService: e.target.checked,
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

export default AgentTransferTab;