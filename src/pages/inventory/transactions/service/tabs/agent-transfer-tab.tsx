/**
 * Agent Transfer Tab - Agent Assignment for Service
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
import { Save, X, Plus } from "lucide-react";
import {
  updateAgentTransfer,
  setSearchParams,
} from "../service-transaction-reducer";
import {
  ServiceTransactionFormState,
  ServiceStatus,
} from "../service-transaction-types";
import { statusOptions, searchInOptions } from "../service-transaction-data";
import Urls from "../../../../../redux/urls";
import moment from "moment";

interface AgentTransferTabProps {
  onSave: () => void;
  onClear: () => void;
  onSearch: (jobNo: number, searchIn: string) => void;
  onAddAgent: () => void;
}

const AgentTransferTab: React.FC<AgentTransferTabProps> = ({
  onSave,
  onClear,
  onSearch,
  onAddAgent,
}) => {
  const { t } = useTranslation("transaction");
  const dispatch = useDispatch();
  const formState = useSelector(
    (state: RootState) => state.ServiceTransaction as ServiceTransactionFormState
  );

  const { master, agentTransfer } = formState.transaction;
  const { formElements, searchJobNo, searchIn } = formState;

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch(searchJobNo, searchIn);
    }
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
      </div>

      {/* Main Form Panel */}
      <div className="bg-gray-100 dark:bg-dark-bg-card p-4 rounded-lg max-w-xl mx-auto">
        <div className="space-y-4">
          {/* Date */}
          <div className="flex items-center">
            <label className="text-sm w-44">{t("date")}</label>
            <ERPDatePicker
              id="transferDate"
              value={
                agentTransfer.transferDate
                  ? moment(agentTransfer.transferDate).toDate()
                  : new Date()
              }
              onChange={(date) =>
                dispatch(
                  updateAgentTransfer({
                    transferDate: moment(date).toISOString(),
                  })
                )
              }
              disabled={formElements.transferDate.disabled}
            />
          </div>

          {/* Agent Name with Add Button */}
          <div className="flex items-center">
            <label className="text-sm w-44">{t("agent_name")}</label>
            <div className="flex-1 flex gap-2">
              <ERPDataCombobox
                id="agentID"
                value={agentTransfer.agentID}
                displayValue={agentTransfer.agentName}
                dataUrl={`${Urls.data_acc_ledgers}?ledgerType=6`}
                valueField="id"
                displayField="ledgerName"
                onChange={(item) =>
                  dispatch(
                    updateAgentTransfer({
                      agentID: item?.id || 0,
                      agentName: item?.ledgerName || "",
                    })
                  )
                }
                disabled={formElements.agentID.disabled}
                className="flex-1"
                placeholder={t("select_agent")}
              />
              <ERPButton
                onClick={onAddAgent}
                startIcon={<Plus size={16} />}
                variant="secondary"
                className="px-2"
              />
            </div>
          </div>

          {/* Despatched Return Date */}
          <div className="flex items-center">
            <label className="text-sm w-44">{t("despatched_return_date")}</label>
            <ERPDatePicker
              id="despatchedReturnDate"
              value={
                agentTransfer.despatchedReturnDate
                  ? moment(agentTransfer.despatchedReturnDate).toDate()
                  : new Date()
              }
              onChange={(date) =>
                dispatch(
                  updateAgentTransfer({
                    despatchedReturnDate: moment(date).toISOString(),
                  })
                )
              }
              disabled={formElements.despatchedReturnDate.disabled}
            />
          </div>

          {/* Expected Delivery Date */}
          <div className="flex items-center">
            <label className="text-sm w-44">{t("expected_delivery_date")}</label>
            <ERPDatePicker
              id="expectedDeliveryDate"
              value={
                agentTransfer.expectedDeliveryDate
                  ? moment(agentTransfer.expectedDeliveryDate).toDate()
                  : new Date()
              }
              onChange={(date) =>
                dispatch(
                  updateAgentTransfer({
                    expectedDeliveryDate: moment(date).toISOString(),
                  })
                )
              }
              disabled={formElements.expectedDeliveryDate.disabled}
            />
          </div>

          {/* Status */}
          <div className="flex items-center">
            <label className="text-sm w-44">{t("status")}</label>
            <select
              value={agentTransfer.status}
              onChange={(e) =>
                dispatch(
                  updateAgentTransfer({ status: e.target.value as ServiceStatus })
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

          {/* Agent Charge and Unit Rate */}
          <div className="flex items-center gap-4">
            <label className="text-sm w-44">{t("agent_charge")}</label>
            <ERPInput
              id="agentCharge"
              type="number"
              value={agentTransfer.agentCharge}
              onChange={(e) =>
                dispatch(
                  updateAgentTransfer({
                    agentCharge: parseFloat(e.target.value) || 0,
                  })
                )
              }
              disabled={formElements.agentCharge.disabled}
              className="w-24"
              textAlignStyle="right"
            />
            <label className="text-sm">{t("unit_rate")}</label>
            <ERPInput
              id="unitRate"
              type="number"
              value={agentTransfer.unitRate}
              onChange={(e) =>
                dispatch(
                  updateAgentTransfer({
                    unitRate: parseFloat(e.target.value) || 0,
                  })
                )
              }
              disabled={formElements.unitRate.disabled}
              className="w-24"
              textAlignStyle="right"
            />
          </div>

          {/* Consumed Qty Amount */}
          <div className="flex items-center">
            <label className="text-sm w-44">{t("consumed_qty_amt")}</label>
            <ERPInput
              id="consumedQtyAmount"
              type="number"
              value={agentTransfer.consumedQtyAmount}
              disabled
              className="w-24"
              textAlignStyle="right"
            />
            <div className="ml-4 flex items-center">
              <ERPCheckbox
                id="isWarrantyService"
                label={t("is_warranty_service")}
                checked={agentTransfer.isWarrantyService}
                onChange={(checked) =>
                  dispatch(updateAgentTransfer({ isWarrantyService: checked }))
                }
                disabled={formElements.isWarrantyService.disabled}
              />
            </div>
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

export default AgentTransferTab;
