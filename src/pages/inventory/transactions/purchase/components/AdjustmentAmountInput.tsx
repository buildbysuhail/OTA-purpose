import React, { useState } from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { InvAccTransaction, VoucherElementProps } from "../../purchase/transaction-types";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { formStateMasterHandleFieldChange, formStateTransactionIvAccTransactionsRowsUpdate } from "../reducer";
import ERPModal from "../../../../../components/ERPComponents/erp-modal";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../../redux/urls";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ErpDevGrid, { SummaryConfig } from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { Pencil } from "lucide-react";
import { useDebouncedInput } from "../../../../../utilities/hooks/useDebounce";
import { isNullOrUndefinedOrEmpty, isNullOrUndefinedOrZero } from "../../../../../utilities/Utils";
import ERPAlert from "../../../../../components/ERPComponents/erp-sweet-alert";
import { AdjustmentAmountManager } from "./adjestAmount-manager";
import VoucherType from "../../../../../enums/voucher-types";

interface AdjustmentAmountInputProps extends VoucherElementProps {
  handleKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: string
  ) => void;
  transactionType: string
}




const AdjustmentAmountInput: React.FC<AdjustmentAmountInputProps> = ({
  formState,
  t,
  transactionType,
  handleKeyDown,
}) => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const exchangeRate = formState.transaction.master.exchangeRate || 1;
  // For testing const isFcTrans = true, const exchangeRate = 2;

  // Debounced input for adjustmentAmount (main input)
  const { value: adjustmentAmountValue, onChange: onAdjustmentAmountChange } =
    useDebouncedInput(
      formState.transaction.master.adjustmentAmount || "",
      (debouncedValue) => {
        dispatch(
          formStateMasterHandleFieldChange({
            fields: { adjustmentAmount: debouncedValue },
          })
        );
      },
      300
    );



  const openModal = () => {
    if (formState.transactionLoading) return;
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {!formState.transactionLoading && formState.formElements.pnlMasters?.disabled !== true && formState.transaction.master.voucherType === VoucherType.PurchaseInvoice && (
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
      )}
      <ERPInput
        localInputBox={formState?.userConfig?.inputBoxStyle}
        fetching={formState.transactionLoading}
        id="adjustmentAmount"
        type="number"
        className="!m-0"
        noLabel={!formState.transactionLoading && formState.formElements.pnlMasters?.disabled !== true && formState.transaction.master.voucherType === VoucherType.PurchaseInvoice}
        label={t(formState.formElements.adjustmentAmount.label)}
        readOnly
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
          height={650}  //610
          title={t("add_amount_or_jv")}
          content={
            <AdjustmentAmountManager
              transactionType={transactionType}
              formState={formState}
              t={t}
              handleKeyDown={handleKeyDown}
              closeModal={closeModal}
            />
          }
        />
      )}
    </>
  );
};

export default React.memo(AdjustmentAmountInput);
