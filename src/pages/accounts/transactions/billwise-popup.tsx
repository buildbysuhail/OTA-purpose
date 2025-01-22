import { FC, Fragment, useEffect, useRef, useState } from "react";
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
  const [gridHeight, setGridHeight] = useState<number>(500);
  const [store, setStore] = useState<any>(
    JSON.parse(JSON.stringify(formState.billwiseData))
  );
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
    let wh = modalHeight;
    let gridHeightWindows =isMaximized? wh - 300 : wh - 350;
    setGridHeight(gridHeightWindows);
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
    // else if( voucherType == VoucherType.SalesReturn || voucherType == VoucherType.PurchaseReturn ||
    //   voucherType == VoucherType.ServiceReturn || voucherType == VoucherType.SalesDiscount)
    // {
    //   setIsFromAccTrans(true);
    // }
    // // else if(CashCounterTender)
    // // {
    // // }
    else {
      closeBillwise();
    }
  }, [isMaximized, modalHeight]);
  const [loadCount, setLoadCount] = useState<number>(0);
  useEffect(() => {
    const clonedData = JSON.parse(JSON.stringify(formState.billwiseData));

    setStore(clonedData);
  }, []);

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
                billwiseAmount: item.isSelected == true ? storeItem.amount : 0,
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
        row.drCr !== formState.transaction.master.drCr
      ) {
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
    if (!isNullOrUndefinedOrEmpty(formState.row.billwiseDetails)) {
      generateGridFromBillwiseString(formState.row.billwiseDetails);
    }
  }, []);
  useEffect(() => {
    setNetAdjustment(getTotalAmountToSet(store));
  }, [store]);
  // useEffect(() => {
  //   const loadBillwiseTransactions = async () => {
  //
  //     try {
  //       // Replace with your actual API call
  //       const response = await api.getAsync(`/billwise/transactions?ledgerID=${formState.row.ledgerID}&drCr=${formState.transaction.master.drCr}&accTransactionDetailId=${formState.row.accTransactionDetailId}`);
  //       const data = response;

  //       let lastIndex = 0;
  //       const formattedData = data?.map((row: any, index: number) => {
  //         if (showAllTransactions || row.drCr !== formState.transaction.master.drCr) {
  //           const _it = {
  //             ...row,
  //             slNo: lastIndex + 1,
  //             isSelected: false,
  //             billwiseAmount: 0,
  //           };
  //           lastIndex = lastIndex + 1;
  //           return _it;
  //         } else {
  //           return {
  //             ...row,
  //             slNo: undefined,
  //             isSelected: false,
  //             billwiseAmount: 0,
  //           };
  //         }
  //       });

  //       setStore(formattedData);

  //       if (isNullOrUndefinedOrEmpty(formState.row.billwiseDetails)) {
  //         generateGridFromBillwiseString(formState.row.billwiseDetails);
  //       }
  //     } catch (error) {
  //       console.error("Error loading billwise transactions:", error);
  //     }
  //   };

  //   loadBillwiseTransactions();
  // }, []);

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
    const billwiseString = (updatedBills??store)
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

  // const handleSave = () => {
  //   const { billwiseString, vrNumbers } = getBillwiseString();
  //   const totalAdjusted = calculateNetAdjustment();

  //   if (totalAdjusted > amount) {
  //     alert('Adjustment amount cannot exceed the transaction amount');
  //     return;
  //   }

  //   onSave(billwiseString, totalAdjusted, vrNumbers);
  // };
  const getTotalAmountAdjusted = (updatedBills?: BillwiseData[] | undefined) => {
    return (updatedBills??store).reduce(
      (sum: number, item: any) => sum + (item.billwiseAmount || 0),
      0
    );
  };
  function getTotalAmountToSet(list: BillwiseData[]) {
    
    let total = 0;
    let totalDr = 0;
    let totalCr = 0;

    try {
      list.forEach((bill) => {
        const drCrCol = bill.drCr?.toUpperCase();
        const amountToSet = bill.billwiseAmount;

        if (drCrCol === "DR") {
          totalDr += amountToSet;
        } else {
          totalCr += amountToSet;
        }
      });

      if (formState.transaction.master.drCr.toUpperCase() === "CR") {
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

    if (totalAmount < 0) {
      ERPAlert.show({
        title: "failed",
        text: "Invalid Adjustment. For Debit Select Credit Transaction and viceversa. Net Adjustment Amount should be zero.",
      });
      return false;
    }

    if ((formState.row.amount ?? 0) < totalAmount) {
      ERPAlert.show({
        title: "failed",
        text: "Total adjustment amount exceeds the available amount.",
      });

      return false;
    }

    return true;
  };
  const closeBillwise = () => {
    dispatch(
      accFormStateHandleFieldChange({ fields: { showbillwise: false } })
    );

    // onClose && onClose();
  };
  const handleSave = (updatedBills?: BillwiseData[] | undefined, fromAutoPost?: boolean | false) => {
    try {
      debugger;
      // if (dataGridRef.current?.instance) {
      //   dataGridRef.current.instance.saveEditData();
      // }

      if (isFromAccTrans) {
        if (!validate()) return;
        const billwiseString = getBillwiseString(updatedBills);
        const amtAdjusted = getTotalAmountToSet(updatedBills??[]);
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
            fromAutoPost??false
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
      console.log("Custom summary started for column:", options.name);
      options.totalValue = 0; // Initialize the total value
    }

    if (options.summaryProcess === "calculate") {
      console.log(
        "Processing value:",
        options.value,
        "for column:",
        options.name
      );
      options.totalValue += options.value || 0; // Aggregate values, fallback to 0 if undefined
    }

    if (options.summaryProcess === "finalize") {
      console.log(
        "Finalizing summary for column:",
        options.name,
        "with total value:",
        options.totalValue
      );
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
    const DRCR = "YourCondition"; // Replace with your DRCR condition
    const VisibleRow = true; // Replace with your visibility condition

    if (e.rowType === "data") {
      if (e.data.DrCrCol === DRCR) {
        e.rowElement.style.backgroundColor = "red"; // Apply red background
        e.rowElement.style.display = VisibleRow ? "" : "none"; // Set row visibility
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
        bill.balance = 0;
        remainingAmount -= billBalance;
      } else {
        // Partial payment
        bill.billwiseAmount = remainingAmount;
        bill.balance = billBalance - remainingAmount;
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

  return (
    <Card
      className={`w-full ${isMaximized ? "max-w-full" : "max-w-6xl"}`}
      elevation={0}
      sx={{ p: 0 ,m:0}}
    >
      <CardContent sx={{ p: 0 }}>
        <Toolbar className="!bg-[#f6f6f6] rounded-tl-[10px] rounded-tr-[10px] !p-[1rem]">
          <Item location="before">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
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

        <DataGrid
          ref={dataGridRef}
          key={"slNo"}
          keyExpr={"slNo"}
          id="TestPopup"
          // height={gridHeight}
          dataSource={store?.filter(
            (row: any) =>
              showAllTransactions ||
              row.drCr !== formState.transaction.master.drCr
          )}
          height={gridHeight}
          className="custom-data-grid"
          showBorders={true}
          columnAutoWidth={true}
          showColumnLines={false}
          showRowLines={true}
          onEditorPreparing={(e) => {
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
                  updatedRow.balance =
                    updatedRow.amount - updatedRow.billwiseAmount;

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
        >
          <KeyboardNavigation
            editOnKeyPress={true}
            enterKeyAction={"startEdit"}
            enterKeyDirection={"column"}
          />
          <Selection
            mode="multiple"
            selectAllMode={"allPages"}
            showCheckBoxesMode={"always"}
          />
          <FilterRow visible={true} />
          <SearchPanel visible={false} />
          <ColumnFixing enabled={true} />
          <Scrolling mode="standard" />
          <Paging enabled={false} />
          {/* <LoadPanel visible={true} /> */}

          <Column
            dataField="slNo"
            caption="slNo"
            dataType="number"
            allowFiltering={true}
            allowSearch={true}
            allowEditing={false}
            width={50}
          />

          {/* <Column
                    dataField="isSelected"
                    caption="Select"
                    dataType="boolean"
                    width={70}
                    allowFiltering={false}
                    allowSearch={false}
                    allowEditing={true}
                    cellRender={(cellData: any) => (
                      <CheckBox
                        value={cellData.value}
                        onValueChanged={(e) => {
                          handleCheckboxChange(e.value, cellData.data);
                        }}
                      />
                    )}
                  /> */}

          <Column
            dataField="voucherType"
            caption="VoucherType"
            dataType="string"
            allowFiltering={true}
            allowSearch={true}
            allowEditing={false}
            width={100}
          />

          <Column
            dataField="voucherNumber"
            caption="TransactionDate"
            dataType="string"
            allowFiltering={true}
            allowSearch={true}
            allowEditing={false}
            width={150}
          />

          <Column
            dataField="transactionDate"
            caption="TransactionDate"
            dataType="date"
            allowFiltering={true}
            allowSearch={true}
            allowEditing={false}
            width={100}
          />

          <Column
            dataField="amount"
            caption="Amount"
            dataType="number"
            allowFiltering={true}
            allowSearch={true}
            allowEditing={false}
            width={100}
          />

          <Column
            dataField="adjustedAmount"
            caption="Adjusted Amount"
            dataType="number"
            allowFiltering={true}
            allowSearch={true}
            allowEditing={false}
            width={150}
          />

          <Column
            dataField="billwiseAmount"
            caption="Amount To Set"
            dataType="number"
            allowFiltering={true}
            allowSearch={true}
            allowEditing={true}
            width={100}
          />
          <Column
            dataField="balance"
            caption="Balance After"
            dataType="number"
            allowFiltering={true}
            allowSearch={true}
            allowEditing={false}
            width={150}
          />
          <Column
            dataField="referenceNumber"
            caption="ReferenceNumber"
            dataType="number"
            allowFiltering={true}
            allowSearch={true}
            allowEditing={false}
            width={150}
          />

          <Column
            dataField="financialYearID"
            caption="FinancialYearID"
            dataType="number"
            allowFiltering={true}
            allowSearch={true}
            allowEditing={false}
            width={130}
          />

          <Column
            dataField="formType"
            caption="FormType"
            dataType="string"
            allowFiltering={true}
            allowSearch={true}
            allowEditing={false}
          />

          <Column
            dataField="voucherPrefix"
            caption="VoucherPrefix"
            dataType="string"
            allowFiltering={true}
            allowSearch={true}
            allowEditing={false}
            width={130}
          />

          <Column
            dataField="partyName"
            caption="PartyName"
            dataType="string"
            allowFiltering={true}
            allowSearch={true}
            allowEditing={false}
            width={150}
            visible={false}
          />

          <Column
            dataField="referenceDate"
            caption="Reference Date"
            dataType="date"
            allowFiltering={true}
            allowSearch={true}
            allowEditing={false}
            width={100}
            visible={false}
          />

          <Column
            dataField="FormType"
            caption="Form Type"
            dataType="string"
            allowFiltering={true}
            allowSearch={true}
            allowEditing={false}
            width={100}
            visible={false}
          />

          <Column
            dataField="balance"
            caption="Balance After"
            dataType="string"
            allowFiltering={true}
            allowSearch={true}
            allowEditing={false}
            width={150}
            visible={false}
          />

          <Column
            dataField="drCr"
            caption="DrCr"
            dataType="string"
            allowFiltering={true}
            allowSearch={true}
            allowEditing={false}
            width={150}
            visible={false}
          />

          {/* Add Summary for "Amount" column */}
          <Summary calculateCustomSummary={handleCustomSummary}>
            <TotalItem
              column="amount"
              summaryType="custom"
              displayFormat="{0}"
              customizeText={(e) =>
                `${round(parseFloat((e.value || "0") as string))}`
              } // Handle undefined gracefully
            />
            <TotalItem
              column="adjustedAmount"
              summaryType="custom"
              displayFormat="{0}"
              customizeText={(e) =>
                `${round(parseFloat((e.value || "0") as string))}`
              }
            />
            <TotalItem
              column="billwiseAmount"
              summaryType="custom"
              displayFormat="{0}"
              customizeText={(e) =>
                `${round(parseFloat((e.value || "0") as string))}`
              }
            />
            <TotalItem
              column="balance"
              summaryType="custom"
              displayFormat="{0}"
              customizeText={(e) =>
                `${round(parseFloat((e.value || "0") as string))}`
              }
            />
          </Summary>
        </DataGrid>
        <div className="flex items-center justify-between">
          <div className="flex justify-center items-center mt-4 p-4 bg-gray-100 rounded-md max-w-60">
            <strong className="mr-3">Net Adjustment</strong>
            <span className="">{netAdjustment}</span>
          </div>
          <div>
            <ERPButton
              title="Auto Post"
              onClick={handleAutoPost}
              className="mr-2"
            />
            <ERPButton title="Save" onClick={() => handleSave()} className="mr-2" />
            <ERPButton title="Cancel" onClick={() => closeBillwise()} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillwiseComponent;
