
import React, { useEffect, useRef, useState } from "react"
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../../redux/urls";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ErpDevGrid, { SummaryConfig } from "../../../../../components/ERPComponents/erp-dev-grid";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { Pencil,Trash2 } from "lucide-react";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { InvAccTransaction, TransactionFormState, VoucherElementProps } from "../../transaction-types";
import { isNullOrUndefinedOrEmpty, isNullOrUndefinedOrZero } from "../../../../../utilities/Utils";

import ERPAlert from "../../../../../components/ERPComponents/erp-sweet-alert";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { formStateMasterHandleFieldChange, formStateTransactionIvAccTransactionsRowsUpdate } from "../../reducer";
import { LedgerType } from "../../../../../enums/ledger-types";
// Memoize ErpDevGrid to prevent unnecessary re-renders
const MemoizedErpDevGrid = React.memo(ErpDevGrid, (prevProps, nextProps) => {
  // Only re-render if the 'data' prop changes
  return prevProps.data === nextProps.data;
});
interface AdjustmentAmountInputProps  {
    formState: TransactionFormState;
    t: any;
    handleKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: string
    ) => void;
    closeModal: () => void;
     isMaximized?: boolean;
    modalHeight?: any
    ,transactionType: string;
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
export const AdjustmentAmountManager=({formState,transactionType,t,handleKeyDown,closeModal,modalHeight, isMaximized}:AdjustmentAmountInputProps)=>{
      const dispatch = useAppDispatch();
      const ledCodeInputRef = useRef<HTMLInputElement>(null);
      const [editingIndex, setEditingIndex] = useState<number | null>(null);
      const [amountModal, setAmountModal] = useState<AmountModalTransaction>({
        ledCode: "",
        ledgerName: "",
        ledgerID: -2,
        amount: 0,
        remarks: "",
        isIncome: false,
        showAllList: true,
        debitCredit: "debit",
        amountFc: 0, //CP
      });
    const [gridHeight, setGridHeight] = useState<{ mobile: number; windows: number; }>({ mobile: 500, windows: 400 });
      const [gridData, setGridData] = useState<InvAccTransaction[]>(formState.transaction.invAccTransactions);
       const isFcTrans = formState.transaction.master.voucherForm.toUpperCase() == "IMPORT";
       const exchangeRate = formState.transaction.master.exchangeRate || 1;
      // Total amount of debit and credit values
  const total_Debit = gridData.reduce((sum, item) => sum + Number(item.debit), 0);
  const total_Credit = gridData.reduce((sum, item) => sum + Number(item.credit), 0);
  // Total credit value based on Is Income
  const totalCredit = gridData.reduce((sum, item) => {
    const value = item.isIncome ? sum-Number(item.credit) : sum+Number(item.credit);
    return value;
  },0)
  // Total amountFc value, now it set as totalCredit value based on income
  // const totalFC = gridData.reduce((sum, item) => sum + item.amountFC, 0);
  const totalFc = totalCredit;

    useEffect(() => {
      let gridHeightMobile = modalHeight - 50;
      let gridHeightWindows = modalHeight - 250;
      setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
    }, [isMaximized, modalHeight]);

    useEffect(() => {
        setTimeout(() => {  
          if (ledCodeInputRef.current) {
            ledCodeInputRef.current.focus();
          }
        }, 500);
    }, []);
    
const handleAmountModal = (
    field: keyof AmountModalTransaction,
    value: any
  ) => {
    setAmountModal((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
// Common function to reset state and close modal
  const resetAndCloseModal = () => {
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
    closeModal();
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
  };
  // Function for deleting an item
  const handleDeleteClick = (rowData: InvAccTransaction,deleteRowIndex: number) => {
      setGridData(prev =>
        prev
        .filter(item => item.slNo !== rowData.slNo)
        .map((item,index)=>({
          ...item,
          slNo: index+1,
        }))
      );
  }

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
    gridData.map((x: InvAccTransaction, index: number) => {
      return {
        ...x,
        slNo: index+1

      }})
    dispatch(formStateTransactionIvAccTransactionsRowsUpdate(gridData))
    dispatch(formStateMasterHandleFieldChange({fields: {
      adjustmentAmount: totalCredit
    }}))
    resetAndCloseModal();
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
          <div className="flex flex-row gap-2">
          <button
            onClick={() => handleEditClick(params.data,rowIndex)}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            title={t("edit")}
          >
            <Pencil size={16} />
          </button>
          <button
          onClick={()=>handleDeleteClick(params.data,rowIndex)}
           className="p-1 text-blue-600 hover:text-white hover:bg-red rounded-xl"
            title={t("delete")}
            >
              <Trash2 size={16} />
              </button>
          </div>
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

    return(
           <>
              <div className="flex items-end gap-2">
                <div>
                  <label className="text-xs">{t("led_code")}</label>
                  <ERPInput
                    id="ledCode"
                    noLabel={true}
                    ref={ledCodeInputRef}
                    value={amountModal.ledCode}
                    autoFocus={true}
                    className="!max-w-[200px]"
                    onChange={(e) =>  handleAmountModal("ledCode", e.target.value)}
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
                      getListUrl: `${Urls.inv_transaction_base}${transactionType}/Data/AccLedgers/?ledgerType=${amountModal.showAllList? LedgerType.All: LedgerType.Liabilities_Expenses}`,
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


                {/* // foreignCurrency input filed */}
                {isFcTrans 
                 ? <div>
                  <label className="text-xs">{t("fc_amount")}</label>
                  <ERPInput
                    id="amountFc"
                    noLabel={true}
                    type="number"
                    className="max-w-[210px]"
                    value={amountModal.amountFc}
                    onChange={(e) => { 
                                       const amountFcValue = Number(e.target.value);
                                       handleAmountModal("amountFc", amountFcValue)
                                       handleAmountModal("amount",amountFcValue*exchangeRate)
                    }}
                    onKeyDown={(e) => {
                      handleKeyDown && handleKeyDown(e, "amountFc");
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
                    value={amountModal.amount}
                    onChange={(e) =>  handleAmountModal("amount", e.target.value)}
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
                    value={amountModal.remarks}
                    onChange={(e) => handleAmountModal("remarks", e.target.value)}
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

              <MemoizedErpDevGrid
                columns={gridColumns}
                data={gridData}
                gridId="adjustmentAmountGrid"
                heightToAdjustOnWindowsInModal={gridHeight.windows}
                hideGridAddButton={true}
                columnHidingEnabled={true}
                hideDefaultExportButton={true}
                hideDefaultSearchPanel={true}
                allowSearching={false}
                allowExport={false}
                hideGridHeader={true}
                enablefilter={false}
                reload={false}
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
                <div className="flex flex-row gap-8 py-2 px-3 bg-gray-100 rounded-md">
                <div className="text-right">
                <div className="text-sm text-gray-600">{t("total_credit")}</div>
                <div className={isFcTrans?"text-lg font-bold text-red":"text-lg font-bold text-green"}>
                  {totalCredit}
                </div>
              </div>
              {isFcTrans ?
              <div className="text-right">
                <div className="text-sm text-gray-600">{t("total_fc")}</div>
                <div className="text-lg font-bold text-green">
                  {totalFc}
                </div>
              </div>
              :""}
              </div>

                <div className="flex items-center gap-2 px-2 py-2">
                  <ERPButton
                    title={t("close")}
                    variant="secondary"
                    onClick={resetAndCloseModal}
                  />
                  <ERPButton
                    title={t("apply")}
                    variant="primary"
                    onClick={handleApplyClick}
                  />
                </div>
              </div>
            </>
    )
}


