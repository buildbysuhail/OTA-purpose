import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  accTransactionFormStateInitialData,
  AccTransactionFormState,
  AccTransactionData,
  AccTransactionRow,
  AccTransactionMaster,
  AccTransactionRowInitialData,
} from "./acc-transaction-types";
import { useAccTransaction } from "./use-acc-transaction";
import { loadAccVoucher, unlockAccTransactionMaster } from "./thunk";
import VoucherType from "../../../enums/voucher-types";

const accTransactionSlice = createSlice({
  name: "accTransaction",
  initialState: accTransactionFormStateInitialData,
  reducers: {
    // Set entire form state
    accFormStateSet: (
      state,
      action: PayloadAction<AccTransactionFormState>
    ) => {
      return action.payload;
    },

    // Update a specific field in the form state
    accFormStateHandleFieldChange: (
      state,
      action: PayloadAction<{
        fields: { [fieldId in keyof AccTransactionFormState]?: any };
      }>
    ) => {
      debugger;
      const { fields } = action.payload;
      // Check if 'fields' is an object (multiple fields)
      Object.keys(fields).forEach((key) => {
        // Update the corresponding field in the state
        const fieldValue = fields[key as keyof AccTransactionFormState];
        const isDateField =
          (state[
            key as keyof AccTransactionFormState
          ] as typeof fieldValue) instanceof Date;
        // Convert Date fields to ISO strings
        (state[key as keyof AccTransactionFormState] as typeof fieldValue) =
          isDateField ? new Date(fieldValue).toISOString() : fieldValue;
      });
    },

    // Update a specific field in the transaction object
    accFormStateTransactionUpdate: (
      state,
      action: PayloadAction<{
        key: keyof AccTransactionData;
        value: AccTransactionData[keyof AccTransactionData];
      }>
    ) => {
      const { key, value } = action.payload;
      (state.transaction[key] as typeof value) = value;
    },

    // Update a specific field in the master object within the transaction
    // dispatch(accFormStateTransactionMasterHandleFieldChange({ fields: "voucherPrefix", value: "INV123" }));
    // dispatch(accFormStateTransactionMasterHandleFieldChange({ fields: { voucherPrefix: "INV123", referenceNumber: "REF456" } }));

    accFormStateTransactionMasterHandleFieldChange: (
      state,
      action: PayloadAction<{
        fields: { [fieldId in keyof AccTransactionMaster]?: any };
      }>
    ) => {
      const { fields } = action.payload;

      // Check if 'fields' is an object (multiple fields)
      Object.keys(fields).forEach((key) => {
        // Update the corresponding field in the state
        const fieldValue = fields[key as keyof AccTransactionMaster];
        const isDateField =
          (state.transaction.master[
            key as keyof AccTransactionMaster
          ] as typeof fieldValue) instanceof Date;
        // Convert Date fields to ISO strings
        (state.transaction.master[
          key as keyof AccTransactionMaster
        ] as typeof fieldValue) = isDateField
          ? new Date(fieldValue).toISOString()
          : fieldValue;
      });
    },

    // Add multiple rows to the transaction details
    accFormStateTransactionDetailsRowsAdd: (
      state,
      action: PayloadAction<AccTransactionRow[]>
    ) => {
      state.transaction.details.push(...action.payload);
    },

    // Add single row to the transaction details
    accFormStateTransactionDetailsRowAdd: (
      state,
      action: PayloadAction<AccTransactionRow>
    ) => {
      state.transaction.details.push(action.payload); // Directly push the single row
    },

    // Update a specific row in the transaction details
    accFormStateTransactionDetailsRowUpdate: (
      state,
      action: PayloadAction<{
        index: number;
        key: keyof AccTransactionRow;
        value: AccTransactionRow[keyof AccTransactionRow];
      }>
    ) => {
      const { index, key, value } = action.payload;
      const row = state.transaction.details[index];
      if (row) {
        (row[key] as typeof value) = value;
      }
    },

    // Remove a specific row from the transaction details by index
    accFormStateTransactionDetailsRowRemove: (
      state,
      action: PayloadAction<number>
    ) => {
      const index = action.payload;
      if (index >= 0 && index < state.transaction.details.length) {
        state.transaction.details.splice(index, 1);
      }
    },

    // Remove a specific row from the transaction details by index
    accFormStateClearRowForNew: (state) => {
      state.row = AccTransactionRowInitialData;
    },

    // Handle changes for the "row" property in the state
    accFormStateRowHandleFieldChange: (
      state,
      action: PayloadAction<{
        fields: { [fieldId in keyof AccTransactionRow]?: any };
      }>
    ) => {
      debugger;
      const { fields } = action.payload;

      // Use Object.entries to get key-value pairs
      Object.entries(fields).forEach(([key, fieldValue]) => {
        // Assert the key as keyof AccTransactionRow
        const isDateField =
          (state.row[
            key as keyof AccTransactionRow
          ] as typeof fieldValue) instanceof Date;

        // Update the corresponding field in the state
        (state.row[key as keyof AccTransactionRow] as typeof fieldValue) =
          isDateField ? new Date(fieldValue).toISOString() : fieldValue;
      });
    },

    // Clear the form state to initial values
    accFormStateReset: () => {
      return accTransactionFormStateInitialData;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadAccVoucher.fulfilled, (state, action) => {
      if (action.payload != null) {
        state.transaction.master = action.payload?.master;
        state.transaction.details = action.payload?.details;
        state.transaction.attachments = action.payload?.attachments;
        if (
          action.payload?.details != null &&
          action.payload?.details.length > 0
        ) {
          state.total =
            action.payload?.master.voucherType !== VoucherType.MultiJournal
              ? action.payload?.details.sum((x: any) => x.Amount)
              : action.payload?.details.sum((x: any) => x.Debit);

          //To select Cash Account in the Combo
          switch (action.payload?.master.voucherType) {
            case "CP":
            case "BP":
            case "CN":
            case "CQP":
            case "SV":
            case "PBP":
              state.masterAccountID =
                action.payload?.details[0]?.relatedLedgerId;
              break;

            case "CR":
            case "BR":
            case "DN":
            case "CQR":
            case "PV":
            case "PBR":
              state.masterAccountID = action.payload?.details[0]?.ledgerId;
              break;

            case "JV":
              if (action.payload?.master?.drCr === "Dr") {
                state.transaction.master.drCr = "Debit";
                state.masterAccountID = action.payload?.details[0]?.ledgerId;
              } else {
                state.transaction.master.drCr = "Credit";
                state.masterAccountID =
                  action.payload?.details[0]?.relatedLedgerId;
              }
              break;

            default:
              break;
          }
          let BillwiseAccTransDetailID: number = 0;
          const VOUCHERTYPE: string = "JV"; // Example voucher type
          const strDrCr: string = "Dr"; // Example drCr value
          const ds: any = {}; // Assume ds is your data source
          const txtExchangeRate: { text: string } = { text: "1" }; // Example exchange rate input

          for (let i = 0; i < action.payload?.details.length; i++) {
            const row = action.payload?.details[i].projectId;
            const _LedgerID = 0;

            // Assign common fields to state
            state.Accounts[i] = {
              SlNo: (i + 1).toString(),
              Amount: parseFloat(row["Amount"].toString()).toFixed(2),
              AmountFC: parseFloat(row["Amount"].toString()).toFixed(2),
              Debit: parseFloat(row["Debit"].toString()).toFixed(2),
              Credit: parseFloat(row["Credit"].toString()).toFixed(2),
              CostCentreID: row["CostCentreID"].toString(),
              CostCenter: row["CostCenter"].toString(),
              ProjectID: row["ProjectID"].toString(),
              ProjectName: row["ProjectName"].toString(),
              Discount: parseFloat(row["Discount"].toString()).toFixed(2),
              LedgerCode: "",
              LedgerName: "",
              LedgerID: "",
              Narration: row["Narration"].toString(),
              AccTransactionDetailsID: row["AccTransactionDetailID"].toString(),
              CheckStatus: row["CheckStatus"].toString(),
              ChqDate: new Date(row["BankDate"].toString()).toLocaleDateString(
                "en-GB"
              ),
              ChqNo: row["ChequeNumber"].toString(),
              NameOnCheque: row["NameOnCheque"].toString(),
              BankName: row["BankName"].toString(),
              Remove: "X",
            };

            // Exchange Rate adjustment
            if (parseFloat(txtExchangeRate.text) !== 1) {
              if (parseFloat(txtExchangeRate.text) === 0)
                txtExchangeRate.text = "1";
              state.Accounts[i].AmountFC = (
                parseFloat(row["Amount"].toString()) /
                parseFloat(txtExchangeRate.text)
              ).toFixed(2);
            }

            BillwiseAccTransDetailID = parseInt(
              row["AccTransactionDetailID"].toString()
            );

            // VoucherType Handling
            switch (VOUCHERTYPE) {
              case "CP":
              case "BP":
              case "CN":
              case "CQP":
              case "SV":
              case "PBP":
                state.Accounts[i].LedgerCode = row["LedgerCode"].toString();
                state.Accounts[i].LedgerName = row["Account Name"].toString();
                state.Accounts[i].LedgerID = row["LedgerID"].toString();
                break;

              case "CR":
              case "BR":
              case "DN":
              case "CQR":
              case "PV":
              case "PBR":
                state.Accounts[i].LedgerCode =
                  row["RelatedLedgerCode"].toString();
                state.Accounts[i].LedgerName = row["Particulars"].toString();
                state.Accounts[i].LedgerID = row["RelatedledgerID"].toString();
                BillwiseAccTransDetailID++;
                break;

              case "JV":
                // Handle JV case based on drCr
                if (strDrCr === "Dr") {
                  state.transaction.master.drCr = "Debit";
                  state.masterAccountID = row["LedgerID"].toString();
                } else {
                  state.transaction.master.drCr = "Credit";
                  state.masterAccountID = row["RelatedledgerID"].toString();
                }
                BillwiseAccTransDetailID++;
                break;

              case "OB":
                // Handle OB case based on Debit/Credit
                if (parseFloat(row["Debit"].toString()) > 0) {
                  state.Accounts[i].DrCr = "Debit";
                } else {
                  state.Accounts[i].DrCr = "Credit";
                }
                state.Accounts[i].LedgerCode = row["LedgerCode"].toString();
                state.Accounts[i].LedgerName = row["Account Name"].toString();
                state.Accounts[i].LedgerID = row["LedgerID"].toString();
                break;

              case "MJV":
                // Handle MJV case based on Debit/Credit
                if (parseFloat(row["Debit"].toString()) > 0) {
                  state.Accounts[i].DrCr = "Debit";
                } else {
                  state.Accounts[i].DrCr = "Credit";
                }
                state.Accounts[i].LedgerCode = row["LedgerCode"].toString();
                state.Accounts[i].LedgerName = row["Account Name"].toString();
                state.Accounts[i].LedgerID = row["LedgerID"].toString();
                break;

              default:
                // Handle any other voucher types if needed
                break;
            }

            // Billwise Details
            if (Settings.AccountsSettings.MaintainBillwiseAccount) {
              const _LedgerID = parseInt(state.Accounts[i].LedgerID);
              if (
                new PolosysERPAccountsClass.Masters.AccountLedgers().IsLedgerBillwiseApplicable(
                  _LedgerID.toString()
                )
              ) {
                state.Accounts[i].BillwiseDetails = LoadBillwiseTransactions(
                  BillwiseAccTransDetailID
                );
              }
            }
          }
        }
        state.transactionLoading = false;
      }
    });
    builder.addCase(loadAccVoucher.rejected, (state, action) => {
      state.transactionLoading = false;
    });
    builder.addCase(loadAccVoucher.pending, (state, action) => {
      state.transactionLoading = true;
    });
    /////////////////unlockAccTransactionMaster
    builder.addCase(unlockAccTransactionMaster.fulfilled, (state, action) => {
      if (action.payload > 0) {
        state.transaction.master.isLocked = false;
        state.unlocking = false;
      }
    });
    builder.addCase(unlockAccTransactionMaster.rejected, (state, action) => {
      state.unlocking = false;
    });
    builder.addCase(unlockAccTransactionMaster.pending, (state, action) => {
      state.unlocking = true;
    });
  },
});

export const {
  accFormStateSet,
  accFormStateHandleFieldChange,
  accFormStateTransactionUpdate,
  accFormStateTransactionMasterHandleFieldChange,
  accFormStateTransactionDetailsRowAdd,
  accFormStateTransactionDetailsRowsAdd,
  accFormStateTransactionDetailsRowUpdate,
  accFormStateTransactionDetailsRowRemove,
  accFormStateRowHandleFieldChange,
  accFormStateReset,
  accFormStateClearRowForNew,
} = accTransactionSlice.actions;

export default accTransactionSlice.reducer;
