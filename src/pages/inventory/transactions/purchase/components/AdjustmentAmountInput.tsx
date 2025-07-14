import React, { useState } from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { formStateMasterHandleFieldChange } from "../reducer";
import ERPModal from "../../../../../components/ERPComponents/erp-modal";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../../redux/urls";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { Pencil } from "lucide-react";
import { useDebouncedInput } from "../../../../../utilities/hooks/useDebounce";
import { LedgerType } from "../../../../../enums/ledger-types";

interface AdjustmentAmountInputProps extends VoucherElementProps {
  handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>, field: string) => void;
}
interface ValidationErrors {
  ledgerID?: string;
  amount?: string;
  debitCredit?: string;
  remarks?: string;
}

export interface InvAccTransaction {
  invTransAccountsID: number;
  invTransactionMasterID: number;
  ledgerID: number;
  debit: number;
  credit: number;
  remarks: string;
  ledgerName: string;
  amount: number;
  amountFC: number;
  isIncome: boolean;
  slNo: number;
}

export interface AmountModalTransaction {
  ledCode: string;
  ledgerName: string;
  ledgerID: number;
  amount: number;
  remarks: string;
  isIncome: boolean;
  showAllList: boolean;
  debitCredit: string;
  debitCreditId: number;
  debitCreditValue: string;
}

const AdjustmentAmountInput: React.FC<AdjustmentAmountInputProps> = ({
  formState,
  t,
  handleKeyDown,
}) => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [amountModal, setAmountModal] = useState<AmountModalTransaction>({
    ledCode: '',
    ledgerName: '',
    ledgerID: 0,
    amount: 0,
    remarks: '',
    isIncome: false,
    showAllList: false,
    debitCredit: '',
    debitCreditId: 0,
    debitCreditValue: "",
  });

  const [gridData, setGridData] = useState<InvAccTransaction[]>([]);
// Add this interface for validation errors

// Add this state for validation errors
const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

// Validation function
const validateForm = (): boolean => {
  const errors: ValidationErrors = {};

  // Validate ledgerID
  if (!amountModal.ledgerID || amountModal.ledgerID === 0) {
    errors.ledgerID = t("ledger_required");
  }

  // Validate amount
  if (!amountModal.amount || amountModal.amount <= 0) {
    errors.amount = t("amount_required_positive");
  }

  // Validate debit/credit selection
  if (!amountModal.debitCredit) {
    errors.debitCredit = t("debit_credit_required");
  }

  // Validate remarks (optional - max length check)
  if (amountModal.remarks && amountModal.remarks.length > 200) {
    errors.remarks = t("remarks_max_length");
  }

  setValidationErrors(errors);
  return Object.keys(errors).length === 0;
};

// Clear specific field error
const clearFieldError = (field: keyof ValidationErrors) => {
  if (validationErrors[field]) {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }
};
  // Only keep debouncing for Redux state updates
  const { value: adjustmentAmountValue, onChange: onAdjustmentAmountChange } = useDebouncedInput(
    formState.transaction.master.adjustmentAmount || '',
    (debouncedValue) => {
      dispatch(
        formStateMasterHandleFieldChange({
          fields: { adjustmentAmount: debouncedValue },
        })
      );
    },
    300
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setValidationErrors({})
    setAmountModal({
      ledCode: '',
      ledgerName: '',
      ledgerID: 0,
      amount: 0,
      remarks: '',
      isIncome: false,
      showAllList: false,
      debitCredit: '',
      debitCreditId: 0,
      debitCreditValue: "",
    });
  };

  const openModal = () => {
    if (formState.transactionLoading) return;
    setIsModalOpen(true);
  };

  const handleEditClick = (rowData: InvAccTransaction) => {
    const index = gridData.findIndex(item => item.slNo === rowData.slNo);
    setEditingIndex(index);
    setAmountModal({
      ledCode: '',
      ledgerName: rowData.ledgerName,
      ledgerID: rowData.ledgerID,
      amount: rowData.amount,
      remarks: rowData.remarks,
      isIncome: rowData.isIncome,
      showAllList: false,
      debitCredit: rowData.debit > 0 ? 'debit' : 'credit',
      debitCreditId: rowData.debit > 0 ? 1 : 2,
      debitCreditValue: rowData.debit > 0 ? 'Debit' : 'Credit',
    });
    setIsModalOpen(true);
  };

  const handleAmountModal = (field: keyof AmountModalTransaction, value: any) => {
    setAmountModal(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear validation error when user starts typing
  clearFieldError(field as keyof ValidationErrors);
  };
const ValidationError: React.FC<{ error?: string }> = ({ error }) => {
  if (!error) return null;
  return (
    <div className="text-red-500 text-xs mt-1">
      {error}
    </div>
  );
};
  const handleAddClick = () => {
    if (!validateForm()) {
    return; // Stop if validation fails
  }

    if (editingIndex !== null && editingIndex >= 0) {
      const updatedTransaction: InvAccTransaction = {
        ...gridData[editingIndex],
        ledgerID: amountModal.ledgerID,
        debit: amountModal.debitCredit === 'debit' ? amountModal.amount : 0,
        credit: amountModal.debitCredit === 'credit' ? amountModal.amount : 0,
        remarks: amountModal.remarks,
        ledgerName: amountModal.ledgerName,
        amount: amountModal.amount,
        isIncome: amountModal.isIncome,
      };

      setGridData(prev => {
        const newData = [...prev];
        newData[editingIndex] = updatedTransaction;
        return newData;
      });
      setEditingIndex(null);
    } else {
      const newTransaction: InvAccTransaction = {
        invTransAccountsID: 0,
        invTransactionMasterID: 0,
        ledgerID: amountModal.ledgerID,
        debit: amountModal.debitCredit === 'debit' ? amountModal.amount : 0,
        credit: amountModal.debitCredit === 'credit' ? amountModal.amount : 0,
        remarks: amountModal.remarks,
        ledgerName: amountModal.ledgerName,
        amount: amountModal.amount,
        amountFC: 0,
        isIncome: amountModal.isIncome,
        slNo: gridData.length + 1,
      };

      setGridData(prev => [...prev, newTransaction]);
setValidationErrors({})
      setAmountModal(prev => ({
        ...prev,
        ledCode: '',
        ledgerName: '',
        ledgerID: 0,
        amount: 0,
        remarks: '',
        isIncome: false,
        showAllList: false,
        debitCreditId: 0,
        debitCreditValue: ''
      }));
    }
  };

  const handleApplyClick = () => {
    if (editingIndex !== null && editingIndex >= 0) {
      const updatedTransaction: InvAccTransaction = {
        ...gridData[editingIndex],
        ledgerID: amountModal.ledgerID,
        debit: amountModal.debitCredit === 'debit' ? amountModal.amount : 0,
        credit: amountModal.debitCredit === 'credit' ? amountModal.amount : 0,
        remarks: amountModal.remarks,
        ledgerName: amountModal.ledgerName,
        amount: amountModal.amount,
        isIncome: amountModal.isIncome,
      };

      setGridData(prev => {
        const newData = [...prev];
        newData[editingIndex] = updatedTransaction;
        return newData;
      });
      setEditingIndex(null);
    } else {
      const newTransaction: InvAccTransaction = {
        invTransAccountsID: 0,
        invTransactionMasterID: 0,
        ledgerID: amountModal.ledgerID,
        debit: amountModal.debitCredit === 'debit' ? amountModal.amount : 0,
        credit: amountModal.debitCredit === 'credit' ? amountModal.amount : 0,
        remarks: amountModal.remarks,
        ledgerName: amountModal.ledgerName,
        amount: amountModal.amount,
        amountFC: 0,
        isIncome: amountModal.isIncome,
        slNo: gridData.length + 1,
      };

      setGridData(prev => [...prev, newTransaction]);

      setAmountModal({
        ledCode: '',
        ledgerName: '',
        ledgerID: 0,
        amount: 0,
        remarks: '',
        isIncome: false,
        showAllList: false,
        debitCredit: '',
        debitCreditId: 0,
        debitCreditValue: ''
      });
      closeModal();
    }
  };

  const gridColumns: DevGridColumn[] = [
    {
      dataField: "slNo",
      caption: t("si_no"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 45,
    },
    {
      dataField: "ledgerName",
      caption: t("ledger"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 400,
    },
    {
      dataField: "debit",
      caption: t("debit"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 70,
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 70,
    },
    {
      dataField: "remarks",
      caption: t("remarks"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 120,
    },
    {
      dataField: "ledgerID",
      caption: t("ledger_id"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "invTransAccountsID",
      caption: t("inv_trans_accounts_id"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "amountFC",
      caption: t("amount_fc"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "isIncome",
      caption: t("is_income"),
      dataType: "boolean",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "actions",
      caption: t("actions"),
      dataType: "string",
      allowSorting: false,
      allowSearch: false,
      allowFiltering: false,
      width: 80,
      cellRender: (params: any) => {
        return (
          <button
            onClick={() => handleEditClick(params.data)}
            className="p-1 text-[#2563EB] hover:text-[#1E40AF] hover:bg-[#EFF6FF] rounded-md transition-colors"
            title={t("edit")}
          >
            <Pencil size={16} />
          </button>
        );
      }
    },
  ];

  const totalDebit = gridData.reduce((sum, item) => sum + item.debit, 0);
  const totalCredit = gridData.reduce((sum, item) => sum + item.credit, 0);
  const totalFC = gridData.reduce((sum, item) => sum + item.amountFC, 0);

  return (
    <>
      <a
        href="#"
        type="popup"
        onClick={(e) => {
          e.preventDefault();
          openModal();
        }}
        className="text-[#3B82F6] hover:text-[#1D4ED8] cursor-pointer"
      >
        {t(formState.formElements.adjustmentAmount.label)}
      </a>
      <ERPInput
        localInputBox={formState?.userConfig?.inputBoxStyle}
        fetching={formState.transactionLoading}
        id="adjustmentAmount"
        type="number"
        className="!m-0"
        noLabel={true}
        value={adjustmentAmountValue}
        disableEnterNavigation={true}
        onKeyDown={(e) => {
          handleKeyDown && handleKeyDown(e, "adjustmentAmount");
        }}
        onChange={(e) => onAdjustmentAmountChange(e.target.value)}
        disabled={
          formState.formElements.adjustmentAmount?.disabled ||
          formState.formElements.pnlMasters?.disabled
        }
      />
      {isModalOpen && (
        <ERPModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          width={1200}
          height={610}
          title={t("add_amount_or_jv")}
          content={
            <>
              {/* Single line form layout */}
              <div className="flex items-end gap-3 mb-4 flex-wrap">
                {/* Ledger Field */}
               
                <div className="w-[150px]">
                <label className="text-xs">{t("led_code")}</label>
                  <ERPInput
                    id="ledCode"
                    noLabel={true}
                    value={amountModal.ledCode}
                    className="!max-w-[200px]"
                    onChange={(e) => handleAmountModal('ledCode', e.target.value)}
                    onKeyDown={(e) => {
                      handleKeyDown && handleKeyDown(e, "ledCode");
                    }}
                  />
                </div>
                <div className="flex-1 min-w-[250px]">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium">{t("ledger")}</label>
                    <ERPCheckbox
                      id="showAllList"
                      className="!m-0 !p-0"
                      label={t("show_all_list")}
                      checked={amountModal.showAllList}
                      onChange={(e) => handleAmountModal('showAllList', e.target.checked)}
                    />
                  </div>
                  <ERPDataCombobox
                    field={{
                      id: "ledgerID",
                      valueKey: "id",
                      labelKey: "name",
                      getListUrl: Urls.data_acc_ledgers
                    }}
                    noLabel={true}
                    id="ledgerID"
                    value={amountModal.ledgerID}
                    className={validationErrors.ledgerID ? "border-red-500" : ""}
                    onChange={(e) => {
                      handleAmountModal('ledgerID', e.value);
                      handleAmountModal('ledgerName', e.name);
                    }}
                  />
                </div>

                {/* Amount Field */}
                <div className="w-[150px]">
                  <label className="text-xs font-medium block mb-1">{t("amount")}</label>
                  <ERPInput
                    id="amount"
                    noLabel={true}
                    type="number"
                    className={`w-full ${validationErrors.amount ? "border-red-500" : ""}`}
                    value={amountModal.amount.toString()}
                    onChange={(e) => handleAmountModal('amount', parseFloat(e.target.value) || 0)}
                    onKeyDown={(e) => {
                      handleKeyDown && handleKeyDown(e, "amount");
                    }}
                  />
                </div>

                {/* Debit/Credit Field */}
                <div className="w-[120px]">
                  <label className="text-xs font-medium block mb-1">{t("debit_credit")}</label>
                  <ERPDataCombobox
                    field={{
                      id: "debitCredit",
                      valueKey: "value",
                      labelKey: "label",
                    }}
                    options={[
                      { value: "debit", label: "Debit" },
                      { value: "credit", label: "Credit" }
                    ]}
                    noLabel={true}
                    id="debitCredit"
                    className={`w-full ${validationErrors.debitCredit ? "border-red-500" : ""}`}
                    value={amountModal.debitCredit}
                    onChange={(e) => {
                      handleAmountModal('debitCredit', e.value);
                      handleAmountModal('debitCreditId', e.value);
                      handleAmountModal('debitCreditValue', e.label);
                    }}
                  />
                </div>

                {/* Remarks Field */}
                <div className="flex-1 min-w-[180px]">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium">{t("remarks")}</label>
                    <ERPCheckbox
                      id="isIncome"
                      className="!m-0 !p-0"
                      label={t("is_income")}
                      checked={amountModal.isIncome}
                      onChange={(e) => handleAmountModal('isIncome', e.target.checked)}
                    />
                  </div>
                  <ERPInput
                    id="remarks"
                    noLabel={true}
                    className={`w-full ${validationErrors.remarks ? "border-red-500" : ""}`}
                    value={amountModal.remarks}
                    onChange={(e) => handleAmountModal('remarks', e.target.value)}
                    onKeyDown={(e) => {
                      handleKeyDown && handleKeyDown(e, "remarks");
                    }}
                  />
                  <ValidationError error={validationErrors.remarks} />
                </div>

                {/* Add/Update Button */}
                <div className="w-[100px]">
                  <ERPButton
                    variant="primary"
                    title={editingIndex !== null ? t("update") : t("add")}
                    onClick={handleAddClick}
                    className="w-full"
                  />
                </div>
              </div>

              <ErpDevGrid
                columns={gridColumns}
                data={gridData}
                gridId="adjustmentAmountGrid"
                height={400}
                hideGridAddButton={true}
                columnHidingEnabled={true}
                hideDefaultExportButton={true}
                hideDefaultSearchPanel={true}
                allowSearching={false}
                allowExport={false}
                hideGridHeader={true}
                enablefilter={false}
                enableScrollButton={false}
                ShowGridPreferenceChooser={false}
                showPrintButton={false}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-4">
                 <h3 className="text-sm font-medium">{t("total_debit")}: {totalDebit}</h3>
                <h3 className="text-sm font-medium">{t("total_credit")}: {totalCredit}</h3>
                <h3 className="text-sm font-semibold">{t("total_fc")}: {totalFC}</h3>
            
                </div>
                <div className="flex items-center gap-2">
                  <ERPButton
                    title={t('close')}
                    variant="secondary"
                    onClick={closeModal}
                  />
                  <ERPButton
                    title={t('apply')}
                    variant="primary"
                    onClick={handleApplyClick}
                  />
                </div>
              </div>
            </>
          }
        />
      )}
    </>
  );
};

export default React.memo(AdjustmentAmountInput);