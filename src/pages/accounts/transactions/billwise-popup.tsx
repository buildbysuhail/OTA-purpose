import { useEffect, useMemo, useRef, useState } from "react";
import { Toolbar } from "devextreme-react";
import { Item } from "devextreme-react/cjs/data-grid";
import { RootState } from "../../../redux/store";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { useDispatch } from "react-redux";
import _cloneDeep from "lodash/cloneDeep";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { CheckCircle2 } from "lucide-react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPDevGrid, { SummaryConfig } from "../../../components/ERPComponents/erp-dev-grid";
import { Card, CardContent } from "@mui/material";
import ERPAlert from "../../../components/ERPComponents/erp-sweet-alert";
import { accFormStateHandleFieldChange, accFormStateRowHandleFieldChange, accFormStateTransactionMasterHandleFieldChange } from "./reducer";
import VoucherType from "../../../enums/voucher-types";
import { isNullOrUndefinedOrEmpty } from "../../../utilities/Utils";
import { APIClient } from "../../../helpers/api-client";
import profile from "../../../assets/images/faces/profile-circle.512x512.png";
import { BillwiseData } from "./acc-transaction-types";
import { useNumberFormat } from "../../../utilities/hooks/use-number-format";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import { useTranslation } from "react-i18next";

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
  drCr: string;
}
const api = new APIClient();
const BillwiseComponent = ({
  onSave,
  onAutoPost,
  onClose,
  isMaximized,
  modalHeight,
  onMaximizeChange,
  drCr
}: BillwiseProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('transaction');
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
  // const [drCr, setDrCr] = useState<string>("");
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
    if (userSession.dbIdValue == "LATAJFOODS") {
      setShowAllTransactions(true);
    }

  }, []);
  useEffect(() => {

    debugger;
    if (!isNullOrUndefinedOrEmpty(formState.row.billwiseDetails)) {
      generateGridFromBillwiseString(formState.row.billwiseDetails);
    } else {
      
      let obj = JSON.parse(JSON.stringify(formState.billwiseData));
      obj = obj.map((x: BillwiseData) => ({
        ...x,
        balanceAfter: x.balance // Correctly updating balanceAfter
      }));
      
      setStore(obj);
    }
  }, [formState.billwiseData, formState.showbillwise]);

  useEffect(() => {
    let wh = modalHeight;
    let gridHeightMobile = modalHeight - 50;
    let gridHeightWindows = wh - 245;
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
        updatedStore = store.map((storeItem: any) => {
          
          const it = item.key === storeItem.slNo
            ? {
              ...storeItem,
              isSelected: item.isSelected,
              billwiseAmount: item.isSelected == true ? storeItem.balance : 0,
              balanceAfter: item.isSelected == true ? 0 : storeItem.balance,
            }
            : storeItem

          return it;

        }
        );
      });
      // updatedBills[i].balanceAfter = billBalance - remainingAmount;
      setStore(updatedStore);
      setNetAdjustment(getTotalAmountToSet(updatedStore));
      // dataGridRef?.current?.rePaint();
    }
  };


  // Load billwise transactions
  useEffect(() => {

    let lastIndex = 0;
    const formattedData = store?.map((row: any, index: number) => {
      if (
        showAllTransactions ||
        row?.drCr != drCr) {
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
debugger;
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
        updatedData[rowIndex].balanceAfter = updatedData[rowIndex].balance - (parseFloat(amount));
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
    try {

      list
        ?.filter((row: any) => showAllTransactions || row?.drCr !== drCr)
        ?.map((row: any, index: number) => ({
          ...row,
          slNo: index + 1, // Assign serial number starting from 1
        })).forEach((bill: BillwiseData) => {
          const drCrCol = bill.drCr?.toUpperCase();
          const amountToSet = bill.billwiseAmount;

          if (drCrCol.toUpperCase() === "DR") {
            totalDr += amountToSet;
          } else {
            totalCr += amountToSet;
          }
        });

      if (drCr.toUpperCase() === "CR") {
        total = totalDr - totalCr;
      } else {
        total = totalCr - totalDr;
      }
    } catch (error) {
      console.error(t("error_calculating_total_amount_to_set"), error);
    }

    return total;
  }
  const validate = () => {
    const totalAmount = getTotalAmountToSet(store);
    for (let index = 0; index < store.length; index++) {
      const element: BillwiseData = store[index];
      if (element.balance < element.billwiseAmount) {
        ERPAlert.show({
          title: t("excess_value"),
          text: t("invalid_amount_assigned_in_row") + (element.slNo).toString(),
        });
        return false;
      }
    }

    if (totalAmount < 0) {
      ERPAlert.show({
        title: t("failed"),
        text: t("invalid_adjustment"),
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
      accFormStateHandleFieldChange({ fields: { showbillwise: false, billwiseData: [] } })
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
      updatedBills = updatedBills ?? store;
      if (updatedBills?.find(x => x.billwiseAmount < 0) != undefined) {
        ERPAlert.show({
          title: t("failed"),
          text: t("invalid_adjustment_negative_value"),
        });
        return;
      }
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
            title: t("failed"),
            text: t("invalid_adjustment"),
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
        title: t("failed"),
        text: t(`an_error_occurred: ${error.message}`),
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

      console.log(`e.data.drCr ${e.data.drCr}`);
      console.log(`DrCr ${drCr}`);
      if (e.data.drCr === drCr) {


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
    // updatedBills.forEach((bill) => {});
    // Second pass: Allocate amounts
    while (remainingAmount > 0 && i < updatedBills.length) {

      if (updatedBills[i].drCr.toUpperCase() === drCr.toUpperCase()) {
        const tyu = 2 * updatedBills[i].balance;
        remainingAmount += tyu;
        setShowAllTransactions(true);
      }

      const billBalance = updatedBills[i].balance;

      if (billBalance <= remainingAmount) {
        // Full payment
        updatedBills[i].billwiseAmount = billBalance;
        updatedBills[i].balanceAfter = 0;
        remainingAmount -= billBalance;
      } else {
        // Partial payment
        updatedBills[i].billwiseAmount = remainingAmount;
        updatedBills[i].balanceAfter = billBalance - remainingAmount;
        remainingAmount = 0;
      }
      i++;
    }
    setStore(updatedBills);
    // const totalAdjusted = updatedBills.reduce((sum, bill) => sum + (bill.billwiseAmount || 0), 0);
    const amtAdjusted = getTotalAmountToSet(updatedBills);
    
    // Check if the adjusted amount exceeds the original amount
    if (round(amtAdjusted) > round(formState.row.amount ?? 0)) {
      ERPAlert.show({
        title: t("auto_post"),
        text: t("excess_adjustment"),
        icon: "warning",
      });
      return false;
    }
    ERPAlert.show({
      title: t("auto_post"),
      text: t("do_you_want_to_save"),
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
      caption: t("si_no"),
      dataType: "string",
      allowSorting: false,
      allowSearch: true,
      allowFiltering: true,
      alignment: "left",
      width: 80,
      showInPdf: true,
    },
    {
      dataField: "voucherType",
      caption: t("voucher_type"),
      dataType: "string",
      allowSorting: false,
      allowSearch: true,
      allowFiltering: true,
      alignment: "left",
      width: 80,
      showInPdf: true,
    },
    {
      dataField: "voucherNumber",
      caption: t("bill_no"),
      dataType: "string",
      allowSorting: false,
      allowSearch: true,
      allowFiltering: true,
      alignment: "left",
      showInPdf: true,
    },
    {
      dataField: "transactionDate",
      caption: t("date"),
      dataType: "date",
      allowSorting: false,
      allowSearch: true,
      allowFiltering: true,
      alignment: "left",
      format: "dd/MM/yyyy",
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "amount",
      caption: t("amount"),
      dataType: "number",
      allowSorting: false,
      allowSearch: true,
      allowFiltering: true,
      alignment: "right",
      width: 100,
      showInPdf: true,
      customizeText: (cellInfo: any) =>
        `${getFormattedValue(cellInfo.value, false, 4)}`,
    },
    {
      dataField: "adjustedAmount",
      caption: t("adjusted_amount"),
      dataType: "number",
      allowSorting: false,
      allowSearch: true,
      allowFiltering: true,
      alignment: "right",
      width: 150,
      showInPdf: true,
      customizeText: (cellInfo: any) =>
        `${getFormattedValue(cellInfo.value, false, 4)}`,
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSorting: false,
      allowSearch: true,
      allowFiltering: true,
      alignment: "right",
      width: 150,
      showInPdf: true,
      customizeText: (cellInfo: any) =>
        `${getFormattedValue(cellInfo.value, false, 4)}`,
    },
    {
      dataField: "billwiseAmount",
      caption: t("amount_to_set"),
      dataType: "number",
      allowSorting: false,
      allowSearch: true,
      allowEditing: true,
      allowFiltering: true,
      alignment: "right",
      width: 130,
      showInPdf: true,
      customizeText: (cellInfo: any) =>
        `${getFormattedValue(cellInfo.value, false, 4)}`,
    },
    {
      dataField: "balanceAfter",
      caption: t("balance_after"),
      dataType: "number",
      allowSorting: false,
      allowSearch: true,
      allowFiltering: true,
      alignment: "right",
      width: 150,
      showInPdf: true,
      customizeText: (cellInfo: any) =>
        `${getFormattedValue((cellInfo.value ?? 0), false, 4)}`,
    },
    {
      dataField: "drCr",
      caption: t("drcr"),
      dataType: "string",
      allowSorting: false,
      allowSearch: true,
      allowFiltering: true,
      alignment: "center",
      width: 150,
      showInPdf: true,
    },
    {
      dataField: "financialYearID",
      caption: t("financial_year_id"),
      dataType: "number",
      allowSorting: false,
      allowSearch: true,
      allowFiltering: true,
      alignment: "left",
      width: 130,
      showInPdf: false,
      visible: false
    },
    {
      dataField: "formType",
      caption: t("form_type"),
      dataType: "string",
      allowSorting: false,
      allowSearch: true,
      allowFiltering: true,
      alignment: "left",
      width: 100,
      showInPdf: false,
      visible: false
    },
    {
      dataField: "voucherPrefix",
      caption: t("voucher_prefix"),
      dataType: "string",
      allowSorting: false,
      allowSearch: true,
      allowFiltering: true,
      alignment: "left",
      width: 130,
      showInPdf: false,
      visible: false
    },
    {
      dataField: "partyName",
      caption: t("party_name"),
      dataType: "string",
      allowSorting: false,
      allowSearch: true,
      allowFiltering: true,
      alignment: "left",
      width: 150,
      showInPdf: false,
      visible: false
    },
    {
      dataField: "referenceNumber",
      caption: t("reference_number"),
      dataType: "number",
      allowSorting: false,
      allowSearch: true,
      allowFiltering: true,
      alignment: "left",
      width: 150,
      showInPdf: false,
      visible: false
    },
    {
      dataField: "referenceDate",
      caption: t("reference_date"),
      format: "dd/MM/yyyy",
      dataType: "date",
      allowSorting: false,
      allowSearch: true,
      allowFiltering: true,
      alignment: "left",
      visible: true,
      showInPdf: true,
    },
  ];
  const customizeSummaryRow = useMemo(() => {
    return (itemInfo: { value: any }) =>
      `${getFormattedValue(itemInfo.value)}`;
  }, []);

  const summaryItems: SummaryConfig[] = [
    {
      column: t("amount"),
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: t("adjusted_amount"),
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: t("billwise_amount"),
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: t("balance"),
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: t("discount"),
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: t("balance_after"),
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
                  {formState.ledgerData.partyName}
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
              label={`Show ${formState.transaction.master.drCr === "Dr" ? "Debit" : "Credit"
                } Transactions also`}
              className="text-[12px] font-medium p-3"
              id={""}
              checked={showAllTransactions}
              onChange={(e) => setShowAllTransactions(!!e.target.checked)}
            />
          </Item>
          <Item location="after">
            <p className="text-[12px] font-medium p-3 mx-2">
              {t("amount_to_adjust")} : {formState.row.amount}
            </p>
          </Item>
        </Toolbar>

        <ERPDevGrid
          key={`grid-${drCr}`}
          ref={dataGridRef}
          summaryItems={summaryItems}
          rowAlternationEnabled={false}
          keyExpr="slNo"
          columns={columns}
          gridId="billwise_popup"
          showTotalCount={false}
          hideGridAddButton={true}
          // height={gridHeight}
          dataSource={store
            ?.filter((row: any) => showAllTransactions || row?.drCr !== drCr)

          }
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
        <div className="flex h-12 justify-between mt-1">
          <div className="flex h-11 items-center  p-3 bg-gray-100 rounded-md max-w-60">
            <strong className="mr-3">{t("net_adjustment")}</strong>
            <span className="">{getFormattedValue(netAdjustment)}</span>
          </div>
          <div>
            <ERPButton
              title={t("auto_post")}
              onClick={handleAutoPost}
              className="mr-2"
            />
            <ERPButton
              title={t("save")}
              onClick={() => handleSave()}
              className="mr-2"
            />
            <ERPButton
              title={t("cancel")}
              onClick={() => closeBillwise()}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillwiseComponent;
