import { FC, Fragment, useEffect, useMemo, useRef, useState } from "react";
import { CheckBox, DataGrid, Toolbar } from "devextreme-react";
import {
  Column,
  Paging,
  Scrolling,
  DataGridTypes,
  ColumnFixing,
  FilterRow,
  SearchPanel,
  Item,
  Summary,
  TotalItem,
  KeyboardNavigation,
  Selection,
} from "devextreme-react/cjs/data-grid";
import { RootState } from "../../../redux/store";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { useDispatch } from "react-redux";
import _cloneDeep from "lodash/cloneDeep";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { CheckCircle2 } from "lucide-react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPDevGrid, { SummaryConfig } from "../../../components/ERPComponents/erp-dev-grid";
import { Card, CardContent, CardHeader } from "@mui/material";
import { Countries } from "../../../redux/slices/user-session/reducer";
import ERPAlert from "../../../components/ERPComponents/erp-sweet-alert";
import {
  accFormStateHandleFieldChange,
  accFormStateRowHandleFieldChange,
  accFormStateTransactionMasterHandleFieldChange,
} from "./reducer";
import VoucherType from "../../../enums/voucher-types";
import { isNullOrUndefinedOrEmpty } from "../../../utilities/Utils";
import { APIClient } from "../../../helpers/api-client";
import profile from "../../../assets/images/faces/profile-circle.512x512.png";
import { BillwiseData } from "./acc-transaction-types";
import { useNumberFormat } from "../../../utilities/hooks/use-number-format";
import { DevGridColumn } from "../../../components/types/dev-grid-column";

interface BillwiseProps {
  onSave?: (
    billwiseDetails: string,
    totalAmount: number,
    vrNumbers: string,
    fromAutoPost: boolean
  ) => void;
  onAutoPost?: (
    billwiseDetails: string,
    totalAmount: number,
    vrNumbers: string
  ) => void;
  onClose?: () => void;
  isMaximized?: boolean;
  modalHeight?: any;
  onMaximizeChange?: (maximized: boolean) => void;
}
const api = new APIClient();
const BillwiseComponent = ({
  onSave,
  onAutoPost,
  onClose,
  isMaximized,
  modalHeight,
  onMaximizeChange,
}: BillwiseProps) => {
  const dispatch = useDispatch();
  const { round } = useNumberFormat();
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [netAdjustment, setNetAdjustment] = useState(0);
  const [gridHeight, setGridHeight] = useState<{
    mobile: number;
    windows: number;
  }>({ mobile: 500, windows: 500 });

  const [store, setStore] = useState<any>(
    JSON.parse(JSON.stringify(formState.billwiseData))
  );
  const { getFormattedValue } = useNumberFormat();
  const ledgerData = useAppSelector(
    (state: RootState) => state.AccTransaction.ledgerData
  );

  const [isFromCashTender, setIsFromCashTender] = useState<boolean | undefined>(
    undefined
  );
  const [isFromAccTrans, setIsFromAccTrans] = useState<boolean | undefined>(
    undefined
  );
  const dataGridRef = useRef<any>(null);
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  useEffect(() => {
    if (isMaximized && onMaximizeChange) {
      onMaximizeChange(true);
    }
  }, [isMaximized, onMaximizeChange]);
  useEffect(() => {
   
  }, [formState.billwiseData, formState.showbillwise]);
  useEffect(() => {
    
    if (!isNullOrUndefinedOrEmpty(formState.row.billwiseDetails)) {
      generateGridFromBillwiseString(formState.row.billwiseDetails);
    } else
    {
      setStore(JSON.parse(JSON.stringify(formState.billwiseData)));
    }
  }, [formState.billwiseData, formState.showbillwise]);

  useEffect(() => {
    let wh = modalHeight;
    let gridHeightMobile = modalHeight - 50;
    let gridHeightWindows =  wh - 360;
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, [isMaximized, modalHeight]);

  useEffect(() => {
    const voucherType = formState.transaction.master.voucherType;
    if (
      voucherType == VoucherType.CashPayment ||
      voucherType == VoucherType.CashReceipt ||
      voucherType == VoucherType.BankPayment ||
      voucherType == VoucherType.BankReceipt ||
      voucherType == VoucherType.ChequePayment ||
      voucherType == VoucherType.ChequeReceipt ||
      voucherType == VoucherType.DebitNote ||
      voucherType == VoucherType.CreditNote ||
      voucherType == VoucherType.JournalVoucher ||
      voucherType == VoucherType.MultiJournal ||
      voucherType == VoucherType.OpeningBalance ||
      voucherType == VoucherType.ClosingBalance ||
      voucherType == VoucherType.CashPaymentEstimate ||
      voucherType == VoucherType.CashReceiptEstimate ||
      voucherType == VoucherType.JournalVoucherSpecial ||
      voucherType == VoucherType.TaxOnExpensePayment
    ) {
      setIsFromAccTrans(true);
    }
    else {
      closeBillwise();
    }
  }, [isMaximized, modalHeight]);
  const [loadCount, setLoadCount] = useState<number>(0);

  const handleSelectionChange = (e: any) => {
    const selectedKeys = Array.isArray(e.currentSelectedRowKeys)
      ? e.currentSelectedRowKeys.map((key: number) => ({
          key,
          isSelected: true,
        }))
      : [];

    const deselectedKeys = Array.isArray(e.currentDeselectedRowKeys)
      ? e.currentDeselectedRowKeys.map((key: number) => ({
          key,
          isSelected: false,
        }))
      : [];

    const mergedKeys = [...selectedKeys, ...deselectedKeys];
    if (mergedKeys != null && mergedKeys.length > 0) {
      let updatedStore = {
        ...store,
      };
      mergedKeys.forEach((item: any) => {
        updatedStore = store.map((storeItem: any) =>
          item.key === storeItem.slNo
            ? {
                ...storeItem,
                isSelected: item.isSelected,
                billwiseAmount: item.isSelected == true ? storeItem.balance : 0,
              }
            : storeItem
        );
      });

      setStore(updatedStore);
      setNetAdjustment(getTotalAmountToSet(updatedStore));
    }
  };

  const onRowUpdating = (e: any) => {
    const updatedRow = { ...e.oldData, ...e.newData };

    setStore((prevStore: any) =>
      prevStore.map((item: any) =>
        item.slNo === updatedRow.slNo ? updatedRow : item
      )
    );
    e.newData = updatedRow;
  };

  // Load billwise transactions
  useEffect(() => {
    let lastIndex = 0;
    const formattedData = store?.map((row: any, index: number) => {
      if (
        showAllTransactions ||
        (((formState.transaction.master.voucherType == VoucherType.OpeningBalance || formState.transaction.master.voucherType == VoucherType.MultiJournal) && row.drCr !== formState.row.drCr) 
        ||
        ((formState.transaction.master.voucherType != VoucherType.OpeningBalance && formState.transaction.master.voucherType != VoucherType.MultiJournal) && row.drCr !== formState.transaction.master.drCr)
      ) ){
        const _it = {
          ...row,
          slNo: lastIndex + 1, // Assign a serial number for matching rows
        };
        lastIndex = lastIndex + 1;
        return _it;
      } else {
        return {
          ...row,
          slNo: undefined, // Set slNo to undefined for non-matching rows
        };
      }
    });
    setNetAdjustment(getTotalAmountToSet(formattedData));
    setStore(formattedData);
  }, [showAllTransactions]);
  
  useEffect(() => {
    setNetAdjustment(getTotalAmountToSet(store));
  }, [store]);

  const generateGridFromBillwiseString = (billwiseStr: string) => {
    
    const rows = billwiseStr.split("|");
    const updatedData = [...store];

    rows.forEach((row) => {
      const [accTransactionDetailID, amount] = row.split("^");
      const rowIndex = updatedData.findIndex(
        (item) =>
          item.accTransactionDetailID.toString() === accTransactionDetailID
      );

      if (rowIndex !== -1) {
        updatedData[rowIndex].billwiseAmount = parseFloat(amount);
        updatedData[rowIndex].isSelected = parseFloat(amount) > 0;
      }
    });

    setStore(updatedData);
  };

  const getBillwiseString = (updatedBills?: BillwiseData[] | undefined) => {
    let vrNumbers = "";
    const billwiseString = (updatedBills ?? store)
      .filter((row: any) => row.billwiseAmount > 0)
      .map((row: any) => {
        if (row.billwiseAmount > 0) {
          vrNumbers += `${row.voucherNumber},`;
        }
        return `${row.accTransactionDetailID}^${row.billwiseAmount}`;
      })
      .join("|");

    return { billwiseString, vrNumbers };
  };

  const getTotalAmountAdjusted = (
    updatedBills?: BillwiseData[] | undefined
  ) => {
    return (updatedBills ?? store).reduce(
      (sum: number, item: any) => sum + (item.billwiseAmount || 0),
      0
    );
  };
  function getTotalAmountToSet(list: BillwiseData[]) {
    let total = 0;
    let totalDr = 0;
    let totalCr = 0;
    let DRCR = formState.transaction.master.drCr.toUpperCase()
    if(formState.transaction.master.voucherType == VoucherType.MultiJournal
      || formState.transaction.master.voucherType == VoucherType.OpeningBalance
    ) {
      DRCR = formState.row.drCr.toUpperCase()
    }

    try {
      
      list?.filter((row: BillwiseData) => showAllTransactions ||
      (((formState.transaction.master.voucherType == VoucherType.OpeningBalance || formState.transaction.master.voucherType == VoucherType.MultiJournal) && row.drCr !== formState.row.drCr) 
      ||
      ((formState.transaction.master.voucherType != VoucherType.OpeningBalance && formState.transaction.master.voucherType != VoucherType.MultiJournal) && row.drCr !== formState.transaction.master.drCr)
    )
  ).forEach((bill) => {
        const drCrCol = bill.drCr?.toUpperCase();
        const amountToSet = bill.billwiseAmount;

        if (drCrCol === "DR") {
          totalDr += amountToSet;
        } else {
          totalCr += amountToSet;
        }
      });
debugger;
      if (DRCR === "CR") {
        total = totalDr - totalCr;
      } else {
        total = totalCr - totalDr;
      }
    } catch (error) {
      console.error("Error calculating total amount to set:", error);
    }

    return total;
  }
  const validate = () => {
    const totalAmount = getTotalAmountToSet(store);
    for (let index = 0; index < store.length; index++) {
      const element: BillwiseData = store[index];
      if(element.balance < element.billwiseAmount) {
        ERPAlert.show({
          title: "Excess Value",
          text: "Invalid Amount assinged in Row:" + (element.slNo).toString(),
        });
        return false;
      }
    }

    if (totalAmount < 0) {
      ERPAlert.show({
        title: "failed",
        text: "Invalid Adjustment. For Debit Select Credit Transaction and viceversa. Net Adjustment Amount should be zero.",
      });
      return false;
    }

    // if ((formState.row.amount ?? 0) < totalAmount) {
    //   ERPAlert.show({
    //     title: "failed",
    //     text: "Total adjustment amount exceeds the available amount.",
    //   });

    //   return false;
    // }

    return true;
  };
  const closeBillwise = () => {
    dispatch(
      accFormStateHandleFieldChange({ fields: { showbillwise: false } })
    );

    // onClose && onClose();
  };
  const handleSave = (
    updatedBills?: BillwiseData[] | undefined,
    fromAutoPost?: boolean | false
  ) => {
    try {
      
      // if (dataGridRef.current?.instance) {
      //   dataGridRef.current.instance.saveEditData();
      // }
      updatedBills = updatedBills??store;
      if (isFromAccTrans) {
        if (!validate()) return;
        const billwiseString = getBillwiseString(updatedBills);
        const amtAdjusted = getTotalAmountToSet(updatedBills ?? []);
        dispatch(
          accFormStateRowHandleFieldChange({
            fields: {
              billwiseDetails:
                amtAdjusted > 0 ? billwiseString.billwiseString : "",
            },
          })
        );

        if (amtAdjusted < 0) {
          ERPAlert.show({
            title: "failed",
            text: "Invalid Adjustment. For Debit Select Credit Transaction and viceversa. Net Adjustment Amount should be zero.",
          });
          return;
        }

        if (Number(formState.row.amount ?? 0) < amtAdjusted) {
          dispatch(
            accFormStateRowHandleFieldChange({
              fields: {
                amount: amtAdjusted,
              },
            })
          );
        }
        dispatch(
          accFormStateTransactionMasterHandleFieldChange({
            fields: {
              remarks:
                formState.transaction.master.remarks +
                "BW:" +
                billwiseString.vrNumbers,
            },
          })
        );

        onSave &&
          onSave(
            billwiseString.billwiseString,
            (formState.row.amount ?? 0) < amtAdjusted
              ? amtAdjusted
              : formState.row.amount ?? 0,
            billwiseString.vrNumbers,
            fromAutoPost ?? false
          );
        closeBillwise();
      } else if (isFromCashTender) {
        if (!validate()) return;
      } else {
      }
    } catch (error: any) {
      ERPAlert.show({
        title: "failed",
        text: `An error occurred: ${error.message}`,
      });
    }
  };
  const handleCustomSummary = (options: any) => {
    if (options.summaryProcess === "start") {
      options.totalValue = 0; // Initialize the total value
    }

    if (options.summaryProcess === "calculate") {
      options.totalValue += options.value || 0; // Aggregate values, fallback to 0 if undefined
    }

    if (options.summaryProcess === "finalize") {
      options.totalValue = round(options.totalValue); // Apply custom rounding at the end
    }
  };
  const calculateNetAdjustment = () => {
    return store.reduce((total: any, row: any) => {
      const amt = parseFloat(row.billwiseAmount) || 0;
      return (
        total + (row.drCr === formState.transaction.master.drCr ? -amt : amt)
      );
    }, 0);
  };
  const handleRowPrepared = (e: any) => {
    if (e.rowType === "data") {
  
      // if (e.data.drCr === formState.transaction.master.drCr) {
      if(
        ((formState.transaction.master.voucherType == VoucherType.OpeningBalance || formState.transaction.master.voucherType == VoucherType.MultiJournal) && e.data.drCr !== formState.row.drCr) 
        ||
        ((formState.transaction.master.voucherType != VoucherType.OpeningBalance && formState.transaction.master.voucherType != VoucherType.MultiJournal) && e.data.drCr !== formState.transaction.master.drCr)
      ) {
        e.rowElement.classList.add("dx-row-matched-red");
        e.rowElement.style.backgroundColor = "red"; // Apply red background
      }
    }
  };
  const handleAutoPost = () => {
    let remainingAmount: number = parseFloat(
      (formState.row.amount ?? 0).toString()
    );
    let i = 0;
    const updatedBills: BillwiseData[] = JSON.parse(JSON.stringify(store));

    // First pass: Handle DR/CR transactions
    updatedBills.forEach((bill) => {});
debugger;
    // Second pass: Allocate amounts
    while (remainingAmount > 0 && i < updatedBills.length) {
      const bill = updatedBills[i];
      if (
        bill.drCr.toUpperCase() ===
        formState.transaction.master.drCr.toUpperCase()
      ) {
        const tyu = 2 * bill.balance;
        remainingAmount += tyu;
        setShowAllTransactions(true);
      }

      const billBalance = bill.balance;

      if (billBalance <= remainingAmount) {
        // Full payment
        bill.billwiseAmount = billBalance;
        bill.balanceAfter = 0;
        remainingAmount -= billBalance;
      } else {
        // Partial payment
        bill.billwiseAmount = remainingAmount;
        bill.balanceAfter = billBalance - remainingAmount;
        remainingAmount = 0;
      }
      i++;
    }
    setStore(updatedBills);
    // const totalAdjusted = updatedBills.reduce((sum, bill) => sum + (bill.billwiseAmount || 0), 0);
    const amtAdjusted = getTotalAmountToSet(updatedBills);

    // Check if the adjusted amount exceeds the original amount
    if (round(amtAdjusted) > round(remainingAmount)) {
      ERPAlert.show({
        title: "Auto Post",
        text: "Excess adjustment.",
        icon: "warning",
      });
      return false;
    }
    ERPAlert.show({
      title: "Auto Post",
      text: "Do you want to save",
      icon: "info",
      onConfirm: () => {
        handleSave(updatedBills, true);
      },
    });
  };

  useEffect(() => {
    setNetAdjustment(getTotalAmountToSet(store));
  }, [store]);
  const columns: DevGridColumn[] = [
    {
        dataField: "slNo",
        caption: "slNo",
        dataType: "number",
        allowSorting: false,
        allowSearch: true,
        allowFiltering: true,
        alignment: "left",
        width: 50,
        showInPdf: true,
    },
    {
        dataField: "voucherType",
        caption: "VoucherType",
        dataType: "string",
        allowSorting: false,
        allowSearch: true,
        allowFiltering: true,
        alignment: "left",
        width: 100,
        showInPdf: true,
    },
    {
        dataField: "voucherNumber",
        caption: "Bill No",
        dataType: "string",
        allowSorting: false,
        allowSearch: true,
        allowFiltering: true,
        alignment: "left",
        width: 150,
        showInPdf: true,
    },
    {
        dataField: "transactionDate",
        caption: "TransactionDate",
        dataType: "date",
        allowSorting: false,
        allowSearch: true,
        allowFiltering: true,
        alignment: "left",
        width: 100,
        showInPdf: true,
    },
    {
        dataField: "amount",
        caption: "Amount",
        dataType: "number",
        allowSorting: false,
        allowSearch: true,
        allowFiltering: true,
        alignment: "right",
        width: 100,
        showInPdf: true,
        customizeText: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value,false,4)}`,
    },
    {
        dataField: "adjustedAmount",
        caption: "Adjusted Amount",
        dataType: "number",
        allowSorting: false,
        allowSearch: true,
        allowFiltering: true,
        alignment: "right",
        width: 150,
        showInPdf: true,
        customizeText: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value,false,4)}`,
    },
    {
        dataField: "balance",
        caption: "Balance",
        dataType: "number",
        allowSorting: false,
        allowSearch: true,
        allowFiltering: true,
        alignment: "right",
        width: 150,
        showInPdf: true,
        customizeText: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value,false,4)}`,
    },
    {
        dataField: "billwiseAmount",
        caption: "Amount To Set",
        dataType: "number",
        allowSorting: false,
        allowSearch: true,
        allowEditing: true,
        allowFiltering: true,
        alignment: "right",
        width: 100,
        showInPdf: true,
        customizeText: (cellInfo: any) =>
          `${getFormattedValue(cellInfo.value,false,4)}`,
    },
    {
        dataField: "balanceAfter",
        caption: "Balance After",
        dataType: "number",
        allowSorting: false,
        allowSearch: true,
        allowFiltering: true,
        alignment: "right",
        width: 150,
        showInPdf: true,
        customizeText: (cellInfo: any) =>
          `${getFormattedValue((cellInfo.value??0),false,4)}`,
    },
    {
        dataField: "drCr",
        caption: "DrCr",
        dataType: "string",
        allowSorting: false,
        allowSearch: true,
        allowFiltering: true,
        alignment: "center",
        width: 150,
        showInPdf: true,
    },
    {
        dataField: "referenceNumber",
        caption: "ReferenceNumber",
        dataType: "number",
        allowSorting: false,
        allowSearch: true,
        allowFiltering: true,
        alignment: "left",
        width: 150,
        showInPdf: true,
    },
    {
        dataField: "financialYearID",
        caption: "FinancialYearID",
        dataType: "number",
        allowSorting: false,
        allowSearch: true,
        allowFiltering: true,
        alignment: "left",
        width: 130,
        showInPdf: true,
    },
    {
        dataField: "formType",
        caption: "FormType",
        dataType: "string",
        allowSorting: false,
        allowSearch: true,
        allowFiltering: true,
        alignment: "left",
        width: 100,
        showInPdf: true,
    },
    {
        dataField: "voucherPrefix",
        caption: "VoucherPrefix",
        dataType: "string",
        allowSorting: false,
        allowSearch: true,
        allowFiltering: true,
        alignment: "left",
        width: 130,
        showInPdf: true,
    },
    {
        dataField: "partyName",
        caption: "PartyName",
        dataType: "string",
        allowSorting: false,
        allowSearch: true,
        allowFiltering: true,
        alignment: "left",
        width: 150,
        showInPdf: true,
    },
    {
        dataField: "referenceDate",
        caption: "Reference Date",
        dataType: "date",
        allowSorting: false,
        allowSearch: true,
        allowFiltering: true,
        alignment: "left",
        width: 100,
        visible: false,
        showInPdf: true,
    },
    {
        dataField: "formType",
        caption: "Form Type",
        dataType: "string",
        allowSorting: false,
        allowSearch: true,
        allowFiltering: true,
        alignment: "left",
        width: 100,
        visible: false,
        showInPdf: true,
    },
];
const customizeSummaryRow = useMemo(() => {
    return (itemInfo: { value: any }) =>
      `${getFormattedValue(itemInfo.value)}`;
  }, []);

  const summaryItems: SummaryConfig[] = [
    {
      column: "amount",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "adjustedAmount",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "billwiseAmount",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "balance",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "discount",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "balanceAfter",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
  ];

  return (
    <Card
      className={`w-full ${isMaximized ? "max-w-full" : "max-w-6xl"}`}
      elevation={0}
      sx={{ p: 0, m: 0 }}
    >
      <CardContent sx={{ p: 0 }}>
        <Toolbar className="!bg-[#f6f6f6] rounded-tl-[10px] rounded-tr-[10px] !p-[1rem]">
          <Item location="before">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 dark:bg-[#f2f2f28a] bg-gray-100 rounded-md flex items-center justify-center">
                {formState.ledgerData?.partyPhoto ? (
                  <img
                    src={ledgerData?.partyPhoto || profile}
                    alt="Ledger"
                    className="w-8 h-8 object-cover rounded"
                  />
                ) : (
                  <div className="text-lg font-medium text-gray-600">
                    {formState.ledgerData?.name?.[0] || "-"}
                  </div>
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {formState.row.ledgerName}
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">
                    {ledgerData?.partyCategory}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-white " color="green" />
                </div>
              </div>
            </div>
          </Item>
          <Item location="after">
            <ERPCheckbox
              label={`Show ${
                formState.transaction.master.drCr === "Dr" ? "Debit" : "Credit"
              } Transactions also`}
              className="text-[12px] font-medium p-3"
              id={""}
              checked={showAllTransactions}
              onChange={(e) => setShowAllTransactions(!!e.target.checked)}
            />
          </Item>
          <Item location="after">
            <p className="text-[12px] font-medium p-3 mx-2">
              Amount to adjust : {formState.row.amount}
            </p>
          </Item>
        </Toolbar>

        <ERPDevGrid
          ref={dataGridRef}
          summaryItems={summaryItems}
          rowAlternationEnabled={false} 
          key={"slNo"}
          keyExpr={"slNo"}
          id="TestPopup"
          columns={columns}
          gridId="billwise_popup"
          showTotalCount={false}
          hideGridAddButton={true}
          // height={gridHeight}
          dataSource={store?.filter(
            (row: any) =>
              showAllTransactions ||
              (((formState.transaction.master.voucherType == VoucherType.OpeningBalance || formState.transaction.master.voucherType == VoucherType.MultiJournal) && row.drCr !== formState.row.drCr) 
              ||
              ((formState.transaction.master.voucherType != VoucherType.OpeningBalance && formState.transaction.master.voucherType != VoucherType.MultiJournal) && row.drCr !== formState.transaction.master.drCr)
            )
          )}
          heightToAdjustOnWindowsInModal={gridHeight.windows}
          className="custom-data-grid"
          showBorders={true}
          columnAutoWidth={true}
          showColumnLines={false}
          showRowLines={true}
          ShowGridPreferenceChooser={true}
          onEditorPreparing={(e: any) => {
            if (
              e.dataField === "billwiseAmount" &&
              e.parentType === "dataRow"
            ) {
              e.editorOptions.onValueChanged = (args: any) => {
                // Calculate the new balance amount
                if (e && e.row) {
                  const updatedRow = {
                    ...e.row.data,
                    billwiseAmount: args.value,
                  };
                  updatedRow.balanceAfter =
                    updatedRow.balance - updatedRow.billwiseAmount;

                  // Update the dataSource with the new values
                  const updatedStore = store.map((row: any) =>
                    row.slNo === updatedRow.slNo ? updatedRow : row
                  );
                  setStore(updatedStore); // Update the state
                }
              };
            }
          }}
          // onSaving={(e) => {
          //   // Commit any pending edits before saving
          //   e.component.saveEditData();
          // }}
          scrolling={{
            mode: "virtual",
            columnRenderingMode: "virtual",
            preloadEnabled: true,
            rowRenderingMode: "virtual",
          }}
          allowColumnResizing={true}
          allowColumnReordering={true}
          remoteOperations={{
            filtering: false,
            grouping: false,
            groupPaging: false,
            paging: false,
            sorting: false,
            summary: false,
          }}
          onRowPrepared={handleRowPrepared}
          onRowUpdated={handleSelectionChange}
          onSelectionChanged={handleSelectionChange}
          // onRowUpdating={onRowUpdating}
          editing={{
            allowUpdating: true,
            mode: "cell",
            allowAdding: false,
            allowDeleting: false,
          }}
          allowSelection={true}
          selectionMode={"multiple"}
          allowKeyboardNavigation={true}
        >
          
          

          {/* Add Summary for "Amount" column */}
         
        </ERPDevGrid>
        <div className="flex items-center justify-between">
          <div className="flex justify-center items-center mt-4 p-4 bg-gray-100 rounded-md max-w-60">
            <strong className="mr-3">Net Adjustment</strong>
            <span className="">{getFormattedValue(netAdjustment)}</span>
          </div>
          <div>
            <ERPButton
              title="Auto Post"
              onClick={handleAutoPost}
              className="mr-2"
            />
            <ERPButton
              title="Save"
              onClick={() => handleSave()}
              className="mr-2"
            />
            <ERPButton title="Cancel" onClick={() => closeBillwise()} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillwiseComponent;
