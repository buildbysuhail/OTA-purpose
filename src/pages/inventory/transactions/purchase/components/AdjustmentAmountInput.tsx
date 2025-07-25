import React, {  useState } from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { formStateMasterHandleFieldChange } from "../reducer";
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

interface AdjustmentAmountInputProps extends VoucherElementProps {
  handleKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: string
  ) => void;
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
  // selected:number;
  amount: number;
  remarks: string;
  isIncome: boolean;
  showAllList: boolean;
  debitCredit: string;
  amountFc: number;
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
    ledCode: "",
    ledgerName: "",
    ledgerID: -2,
    amount: 0,
    remarks: "",
    isIncome: false,
    showAllList: false,
    debitCredit: "debit",
    amountFc: 0, //CP
  });

  const [gridData, setGridData] = useState<InvAccTransaction[]>([]);
  const isFcTrans = formState.transaction.master.voucherForm.toUpperCase() == "IMPORT";
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

  // Debounced input for ledCode
  const { value: ledCodeValue, onChange: onLedCodeChange } = useDebouncedInput(
    amountModal.ledCode,
    (debouncedValue) => {
      handleAmountModal("ledCode", debouncedValue);
    },
    300
  );

  // Debounced input for fcamount
  const { value: fcAmountValue, onChange: onFcAmountChange } = useDebouncedInput(
    amountModal.amountFc.toString(),
    (debouncedValue) => {
      const parsedFcAmount = parseFloat(debouncedValue) || 0;
      const calculatedAmount = isFcTrans ? parsedFcAmount * exchangeRate : parsedFcAmount;
      handleAmountModal("amountFc", parsedFcAmount);
      handleAmountModal("amount", calculatedAmount);
    },
    300
  );

  // Debounced input for amount
  const { value: amountValue, onChange: onAmountChange } = useDebouncedInput(
    amountModal.amount.toString(),
    (debouncedValue) => {
      const parsedValue = parseFloat(debouncedValue) || 0;
      handleAmountModal("amount", parsedValue);
    },
    300
  );

  // Debounced input for remarks
  const { value: remarksValue, onChange: onRemarksChange } = useDebouncedInput(
    amountModal.remarks,
    (debouncedValue) => {
      handleAmountModal("remarks", debouncedValue);
    },
    300
  );
   
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setAmountModal({
      ledCode: "",
      ledgerName: "",
      ledgerID: -2,
      amount: 0,
      remarks: "",
      isIncome: false,
      showAllList: false,
      debitCredit: "debit",
      amountFc: 0,
    });
    // setGridData([]) 
  };

  const openModal = () => {
    if (formState.transactionLoading) return;
    setIsModalOpen(true);
  };

  const handleEditClick = (rowData: InvAccTransaction,rowIndex: number) => {
    setEditingIndex(rowIndex);
    setAmountModal({
      ledCode: "",
      ledgerName: rowData.ledgerName,
      ledgerID: rowData.ledgerID,
      amount: rowData.amount,
      remarks: rowData.remarks,
      isIncome: rowData.isIncome,
      showAllList: false,
      debitCredit: rowData.debit > 0 ? "debit" : "credit",
      amountFc: rowData.amountFC || 0,
    });
    setIsModalOpen(true);
  };

  const handleAmountModal = (
    field: keyof AmountModalTransaction,
    value: any
  ) => {
    setAmountModal((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddClick = () => {
    if (
      isNullOrUndefinedOrEmpty(amountModal.ledgerID) ||
      isNullOrUndefinedOrZero(amountModal.amount)
    ) {
      ERPAlert.show({
        icon: "warning",
        text: t("invalid_zero_amount"),
        title: "",
      });
      return;
    }
    if (editingIndex !== null && editingIndex >= 0) {
      const updatedTransaction: InvAccTransaction = {
        ...gridData[editingIndex],
        ledgerID: amountModal.ledgerID,
        debit: amountModal.debitCredit === "debit" ? amountModal.amount : 0,
        credit: amountModal.debitCredit === "credit" ? amountModal.amount : 0,
        remarks: amountModal.remarks,
        ledgerName: amountModal.ledgerName,
        amount: amountModal.amount,
        isIncome: amountModal.isIncome,
        amountFC: amountModal.amountFc,
      };

      setGridData((prev) => {
        const newData = [...prev];
        newData[editingIndex] = updatedTransaction;

        return newData;
      });
      setEditingIndex(null);
      // closeModal();
    } else {
      console.log("New Item Added")
      const newTransaction: InvAccTransaction = {
        invTransAccountsID: 0,
        invTransactionMasterID: 0,
        ledgerID: amountModal.ledgerID,
        debit: amountModal.debitCredit === "debit" ? amountModal.amount : 0,
        credit: amountModal.debitCredit === "credit" ? amountModal.amount : 0,
        remarks: amountModal.remarks,
        ledgerName: amountModal.ledgerName,
        amount: amountModal.amount,
        // amountFC: 0,
        isIncome: amountModal.isIncome,
        slNo: gridData.length + 1,
        amountFC: amountModal.amountFc,
      };
      console.log(gridData.length+1)

      setGridData((prev) => {
        const final = [...prev, newTransaction];
        return final;
      });
      // closeModal();

      setAmountModal({
        ledCode: "",
        ledgerName: "",
        ledgerID: -2,
        amount: 0,
        remarks: "",
        isIncome: false,
        showAllList: false,
        debitCredit: "debit",
        amountFc:0,
      });
      setEditingIndex(null); 
      // closeModal();
    }
  };
  const handleApplyClick = () => {
    if (total_Debit !== total_Credit) {
      ERPAlert.show({
        icon: "warning",
        text: t("total_debit_and_credit"),
        title: "",
      });
      return;
    }
    closeModal();
  };

  const gridColumns: DevGridColumn[] = [
    {
      dataField: "slNo",
      caption: t("SiNo"),
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
      cellRender: (params: any,) => {
        const rowIndex = params.rowIndex;
        return (
          <button
            onClick={() => handleEditClick(params.data,rowIndex)}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            title={t("edit")}
          >
            <Pencil size={16} />
          </button>
        );
      },
    },
  ];

  const summaryItems: SummaryConfig[] = [
    {
      column: "debit",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: (itemInfo) => itemInfo.value
    },
    {
      column: "credit",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: (itemInfo) => itemInfo.value
    }
  ];
  // Total amount of debit and credit values
  const total_Debit = gridData.reduce((sum, item) => sum + item.debit, 0);
  const total_Credit = gridData.reduce((sum, item) => sum + item.credit, 0);
  // Total credit value based on Is Income
  const totalCredit = gridData.reduce((sum, item) => {
    const value = item.isIncome ? sum-item.credit : sum+item.credit;
    return value;
  },0)
  // Total amountFc value, now it set as totalCredit value based on income
  // const totalFC = gridData.reduce((sum, item) => sum + item.amountFC, 0);
  const totalFc = totalCredit;

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
          height={634}  //610
          title={t("add_amount_or_jv")}
          content={
            <>
              <div className="flex items-end gap-2">
                <div>
                  <label className="text-xs">{t("led_code")}</label>
                  <ERPInput
                    id="ledCode"
                    noLabel={true}
                    value={ledCodeValue}
                    autoFocus={true}
                    className="!max-w-[200px]"
                    onChange={(e) => onLedCodeChange(e.target.value)}
                    onKeyDown={(e) => {
                      handleKeyDown && handleKeyDown(e, "ledCode");
                    }}
                  />
                </div>

                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <label className="text-xs">{t("ledger")}</label>
                    <ERPCheckbox
                      id="showAllList"
                      className="!m-0 !p-0"
                      label={t("show_all_list")}
                      checked={amountModal.showAllList}
                      onChange={(e) =>
                        handleAmountModal("showAllList", e.target.checked)
                      }
                    />
                  </div>
                  <ERPDataCombobox
                    field={{
                      id: "ledgerID",
                      valueKey: "id",
                      labelKey: "name",
                      getListUrl: Urls.data_acc_ledgers,
                    }}
                    noLabel={true}
                    enableClearOption={false}
                    id="ledgerID"
                    value={amountModal.ledgerID}
                    onChange={(e) => {
                      handleAmountModal("ledgerID", e.value);
                      handleAmountModal("ledgerName", e.name);
                    }}
                  />
                </div>

                {/* <div>
                <label className="text-xs">{t("amount")}</label>
                {amountModal.selected}
                <ERPInput
                  id="amount"
                  noLabel={true}
                  type="number"
                  className="max-w-[210px]"
                  value={amountModal.amount}
                  onChange={(e) => {
                    setAmountModal(prev => ({
                      ...prev,
                      amount: parseFloat(e.target.value) || 0, // or Number(e.target.value)
                      selected: e.target.
                    }));
                  }}
                  onKeyDown={(e) => {
                    handleKeyDown && handleKeyDown(e, "amount");
                  }}
                />
              </div> */}

                {/* // foreignCurrency input filed */}
                {isFcTrans 
                 ? <div>
                  <label className="text-xs">{t("fc_amount")}</label>
                  <ERPInput
                    id="fcamount"
                    noLabel={true}
                    type="number"
                    className="max-w-[210px]"
                    value={fcAmountValue}
                    onChange={(e) => onFcAmountChange(e.target.value)}
                    onKeyDown={(e) => {
                      handleKeyDown && handleKeyDown(e, "fcamount");
                    }}
                  />
                </div> :""}
                {/* end  */}

                <div>
                  <label className="text-xs">{t("amount")}</label>
                  <ERPInput
                    id="amount"
                    noLabel={true}
                    type="number"
                    className="max-w-[210px]"
                    value={amountValue}
                    onChange={(e) => onAmountChange(e.target.value)}
                    onKeyDown={(e) => {
                      handleKeyDown && handleKeyDown(e, "amount");
                    }}
                  />
                </div>

                <div>
                  <label className="text-xs">{t("debit_credit")}</label>
                  <ERPDataCombobox
                    field={{
                      id: "debitCredit",
                      valueKey: "value",
                      labelKey: "label",
                    }}
                    options={[
                      { value: "debit", label: "Debit" },
                      { value: "credit", label: "Credit" },
                    ]}
                    noLabel={true}
                    id="debitCredit"
                    className="w-[120px]"
                    enableClearOption={false}
                    value={amountModal.debitCredit}
                    onChange={(e) => {
                      handleAmountModal("debitCredit", e.value);
                    }}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs">{t("remarks")}</label>
                    <ERPCheckbox
                      id="isIncome"
                      label={t("is_income")}
                      checked={amountModal.isIncome}
                      onChange={(e) =>
                        handleAmountModal("isIncome", e.target.checked)
                      }
                    />
                  </div>
                  <ERPInput
                    id="remarks"
                    noLabel={true}
                    className="w-[120px]"
                    value={remarksValue}
                    onChange={(e) => onRemarksChange(e.target.value)}
                    onKeyDown={(e) => {
                      handleKeyDown && handleKeyDown(e, "remarks");
                    }}
                  />
                </div>

                <ERPButton
                  variant="primary"
                  title={editingIndex !== null ? t("update") : t("add")}
                  onClick={handleAddClick}
                />
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
                showTotalCount={false}
                summaryItems={summaryItems}
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                  summary: false,
                }}
              />
              <div className="flex flex-col items-end mt-2">
                <div className="flex flex-row gap-8 p-2 bg-gray-100 rounded-md">
                <div className="text-right">
                <div className="text-sm text-gray-600">{t("total_credit")}</div>
                <div className="text-lg font-bold text-red">
                  {totalCredit}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">{t("total_fc")}</div>
                <div className="text-lg font-bold text-green">
                  {totalFc}
                </div>
              </div>
              </div>

                <div className="flex items-center gap-2 px-2 py-2">
                  <ERPButton
                    title={t("close")}
                    variant="secondary"
                    onClick={closeModal}
                  />
                  <ERPButton
                    title={t("apply")}
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
