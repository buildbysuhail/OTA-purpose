import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  accTransactionFormStateInitialData,
  AccTransactionFormState,
  AccTransactionData,
  AccTransactionRow,
  AccTransactionMaster,
  AccTransactionRowInitialData,
  accTransactionInitialData,
  initialFormElements,
  FormElementState,
} from "./acc-transaction-types";
import { useAccTransaction } from "./use-acc-transaction";
import { loadAccVoucher, unlockAccTransactionMaster } from "./thunk";
import VoucherType from "../../../enums/voucher-types";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import { UserModel } from "../../../redux/slices/user-session/reducer";
import { UserAction, useUserRights } from "../../../helpers/user-right-helper";
import { ApplicationSettingsType } from "../../settings/system/application-settings-types/application-settings-types";
import { calculateTotal, clearEntryControl } from "./functions";
import ERPToast from "../../../components/ERPComponents/erp-toast";

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
    // clear entire for new voucher
    clearState: (
      state,
      action: PayloadAction<{
        userSession: UserModel;
        softwareDate: string;
        defaultCostCenterID: number;
        counterwiseCashLedgerId: number;
        allowSalesCounter: number;
      }>
    ) => {
      const {
        userSession,
        softwareDate,
        defaultCostCenterID,
        counterwiseCashLedgerId,
        allowSalesCounter,
      } = action.payload;
      state.isBahamdoonPOSReceipt = false;
      (state.transaction.master.accTransMasterID = 0),
        (state.row.ledgerCode = "");
      state.transaction.attachments = [];
      state.row.ledgerId = 0;
      state.transaction.master.remarks = "";
      state.row.accTransactionDetailId = 0;
      state.previousNarration = "";
      state.row.checkStatus = "P";
      state.row.exchangeRate = 1;
      state.row.currencyId = 0;
      state.transaction.master.referenceNumber = "";
      state.row.chqDate = new Date().toISOString();
      state.row.bankDate = new Date().toISOString();
      state.transaction.master.transactionDate = softwareDate;
      state.row.narration = "";
      state.row.amount = 0.0;
      state.row.discount = 0.0;
      state.masterAccountID = 0;
      state.row.costCentreId = defaultCostCenterID;
      state.transaction.details = [];
      state.isEdit = false;
      state.isRowEdit = false;
      state.printOnSave = true;
      state.transaction.master.isLocked = false;

      if (counterwiseCashLedgerId > 0 && allowSalesCounter) {
        if (
          state.transaction.master.voucherType == "CP" ||
          state.transaction.master.voucherType == "CR"
        ) {
          state.masterAccountID = counterwiseCashLedgerId;
        }
      }
      state.transaction.master.employeeId =
        userSession.employeeId > 0 ? userSession.employeeId : 0;
      state.transaction.master.costCentreId =
        state.userConfig.presetCostenterId > 0
          ? state.userConfig.presetCostenterId
          : 0;
      {
        if (userSession.employeeId > 0)
          state.transaction.master.employeeId = userSession.employeeId;
      }
      if (state.userConfig.presetCostenterId > 0) {
        state.row.costCentreId = state.userConfig.presetCostenterId;
        state.formElements.costCentreId.disabled = true;
      } else {
        if (userSession.dbIdValue == "SAMAPLASTICS") {
          state.row.costCentreId = 0;
        }
      }
    },
    // Update a specific field in the form state
    accFormStateHandleFieldChange: (
      state,
      action: PayloadAction<{
        fields: { [fieldId in keyof AccTransactionFormState]?: any };
      }>
    ) => {
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
        if (isDateField) {
          console.log(`dateField: ${fieldValue}`);
        }
        // Convert Date fields to ISO strings
        (state.transaction.master[
          key as keyof AccTransactionMaster
        ] as typeof fieldValue) = isDateField
          ? new Date(fieldValue).toISOString()
          : fieldValue;
      });
    },

    // Add multiple rows to the transaction details
    accFormStateTransactionDetailsSetSlNo: (
      state,
      action: PayloadAction<{}>
    ) => {
      debugger;
      if (state.transaction.details) {
        state.transaction.details = state.transaction.details.map(
          (x, index) => ({
            ...x,
            slNo: index + 1, // Reset slNo to start from 1
          })
        );
      }
    },
    // Add multiple rows to the transaction details
    accFormStateTransactionDetailsRowsAdd: (
      state,
      action: PayloadAction<AccTransactionRow[]>
    ) => {
      // const serializedRows = action.payload.map((row) => ({
      //   ...row,
      //   chqDate: new Date(row.chqDate).toISOString(),
      //   bankDate: new Date(row.bankDate).toISOString(),
      //   amount: state.f
      // }));
      // state.transaction.details.push(...serializedRows);
    },

    // Add single row to the transaction details
    accFormStateTransactionDetailsRowAdd: (
      state,
      action: PayloadAction<{
        row: AccTransactionRow;
        isForeignCurrencyEnabled: boolean;
        exchangeRate: number;
        applicationSettings: ApplicationSettingsType;
        userSession: UserModel;
      }>
    ) => {
      const data = action.payload.row;
      const amount =
        action.payload.isForeignCurrencyEnabled && data.amount
          ? data.amount * action.payload.exchangeRate
          : data.amount;
      const serializedRow: AccTransactionRow = {
        ...data,
        chqDate: data.chqDate ? new Date(data.chqDate).toISOString() : "",
        bankDate: data.bankDate ? new Date(data.bankDate).toISOString() : "",
        amount: amount,
        amountFC: data.amount,
        drCr: state.row.drCr,
        debit: state.row.drCr == "Dr" ? state.row.amount : 0,
        credit: state.row.drCr == "Cr" ? state.row.amount : 0,
      };
      if (state.isRowEdit === true) {
        const index = state.transaction.details.findIndex(
          (x) => x.slNo === data.slNo
        );
        if (index !== -1) {
          state.transaction.details[index] = serializedRow; // Update existing row
        } else {
          ERPToast.show(
            `Row with slNo ${data.slNo} not found. Cannot edit row.`
          );
        }
      } else {
        state.transaction.details.push(serializedRow);
      }
      state.transaction.details = state.transaction.details.map((x, index) => ({
        ...x,
        slNo: index + 1, // Reset slNo to start from 1
      }));

      state = clearEntryControl(
        state,
        action.payload.applicationSettings.accountsSettings?.defaultCostCenterID
      );

      localStorage.setItem(
        `${state.transaction.master.voucherType}${state.transaction.master.formType}`,
        JSON.stringify(state.transaction.details)
      );
      state.row.billwiseDetails = "";
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
      action: PayloadAction<{
        index: number;
        applicationSettings?: ApplicationSettingsType;
      }>
    ) => {
      debugger;
      const index = action.payload.index;
      if (index >= 0 && index < state.transaction.details.length) {
        state.transaction.master.totalAmount = calculateTotal(state);
        state = clearEntryControl(
          state,
          action.payload.applicationSettings?.accountsSettings
            ?.defaultCostCenterID ?? 0
        );
        state.previousNarration = "";
        state.transaction.details.splice(index, 1);
        state.transaction.details = state.transaction.details.map(
          (x, index) => ({
            ...x,
            slNo: index + 1, // Reset slNo to start from 1
          })
        );

        localStorage.setItem(
          `${state.transaction.master.voucherType}${state.transaction.master.formType}`,
          JSON.stringify(state.transaction.details)
        );
      }
    },

    // Remove a specific row from the transaction details by index
    accFormStateClearRowForNew: (state) => {
      state.row = { ...AccTransactionRowInitialData };
    },

    // Remove a specific row from the transaction details by index
    loadTempRows: (state) => {
      const tmp = localStorage.getItem(
        `${state.transaction.master.voucherType}${state.transaction.master.formType}`
      );
      if (tmp != undefined && tmp != null && tmp != "") {
        const tmpRows = JSON.parse(tmp) as Array<AccTransactionRow>;
        if (tmpRows.length > 0) {
          state.transaction.details = tmpRows;
        }
      }
    },

    // Handle changes for the "row" property in the state
    accFormStateRowHandleFieldChange: (
      state,
      action: PayloadAction<{
        fields: { [fieldId in keyof AccTransactionRow]?: any };
      }>
    ) => {
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
    setUserRight: (
      state,
      action: PayloadAction<{
        userSession: UserModel;
        hasRight: (formCode: string, action: UserAction) => boolean;
      }>
    ) => {
      debugger;
      const { userSession, hasRight } = action.payload;

      const isClosed = userSession.financialYearStatus === "Closed";

      state.formElements.btnSave.disabled = !isClosed
        ? hasRight(state.formCode, UserAction.Add) &&
          (state?.transaction?.details?.length ?? 0) > 0
        : false;

      state.formElements.btnEdit.disabled = !isClosed
        ? hasRight(state.formCode, UserAction.Edit)
        : false;

      state.formElements.btnDelete.disabled = !isClosed
        ? hasRight(state.formCode, UserAction.Delete)
        : false;

      state.formElements.btnPrint.disabled = !isClosed
        ? hasRight(state.formCode, UserAction.Print)
        : false;
    },
    updateFormElement: (
      state,
      action: PayloadAction<{
        fields: Partial<
          Record<
            keyof AccTransactionFormState["formElements"],
            Partial<FormElementState>
          >
        >;
      }>
    ) => {
      debugger;
      const { fields } = action.payload;

      // Iterate over the keys of fields and apply updates
      Object.entries(fields).forEach(([key, updates]) => {
        if (key in state.formElements) {
          state.formElements[
            key as keyof AccTransactionFormState["formElements"]
          ] = {
            ...state.formElements[
              key as keyof AccTransactionFormState["formElements"]
            ],
            ...updates,
          };
        } else {
          console.warn(`Field ${key} does not exist in formElements.`);
        }
      });
    },
    enableControls: (state) => {
      state.formElements.pnlMasters.disabled = false;
      state.formElements.dxGrid.disabled = false;
    },
    disableControls: (state) => {
      state.formElements.pnlMasters.disabled = true;
      state.formElements.dxGrid.disabled = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadAccVoucher.fulfilled, (state, action) => {
      const payload = action.payload;

      if (payload) {
        state.row = { ...AccTransactionRowInitialData };
        // Handle master data
        state.transaction.master = {
          ...state.transaction.master, // Retain existing state
          ...payload.master,
          transactionDate: new Date(
            payload.master.transactionDate
          ).toISOString(),
          prevTransDate: new Date(payload.master.prevTransDate).toISOString(),
          // bankDate: new Date(payload.master.bankDate).toISOString(),
          referenceDate: new Date(payload.master.referenceDate).toISOString(),
          // dueDate: new Date(payload.master.dueDate).toISOString(),
          // checkBouncedDate: new Date(
          //   payload.master.checkBouncedDate
          // ).toISOString(),
        };

        // Handle details data

        let BillwiseAccTransDetailID = 0;
        state.transaction.details = payload.details.map((detail, index) => {
          let _LedgerID = 0;
          return {
            ...detail,

            slNo: index + 1, // Reset slNo to start from 1
            amountFC: detail.amount,
            bankDate: detail.bankDate
              ? new Date(detail.bankDate).toISOString()
              : new Date(2000, 0, 1).toISOString(),
            chqDate: detail.chqDate
              ? new Date(detail.chqDate).toISOString()
              : new Date(2000, 0, 1).toISOString(),
            checkBouncedDate: detail.checkBouncedDate
              ? new Date(detail.checkBouncedDate).toISOString()
              : new Date(2000, 0, 1).toISOString(),
          };
        });
        // Handle attachments
        state.transaction.attachments = payload.attachments || [];

        // Calculate total amount
        if (payload.details?.length > 0) {
          state.total = payload.details.reduce(
            (total: number, detail: AccTransactionRow) => {
              const amount =
                payload.master.voucherType !== VoucherType.MultiJournal
                  ? detail.amount
                  : detail.debit;
              return total + (amount || 0);
            },
            0
          );

          // Determine masterAccountID
          const firstDetail = payload.details[0];
          switch (payload.master.voucherType) {
            case "CP":
            case "BP":
            case "CN":
            case "CQP":
            case "SV":
            case "PBP":
              state.masterAccountID = firstDetail.relatedLedgerId;
              break;

            case "CR":
            case "BR":
            case "DN":
            case "CQR":
            case "PV":
            case "PBR":
              state.masterAccountID = firstDetail.ledgerId;
              break;

            case "JV":
              state.transaction.master.drCr =
                payload.master.drCr === "Dr" ? "Debit" : "Credit";
              state.masterAccountID =
                payload.master.drCr === "Dr"
                  ? firstDetail.ledgerId
                  : firstDetail.relatedLedgerId;
              break;

            default:
              break;
          }
        }

        state.transactionLoading = false;
        state.formElements.pnlMasters.disabled = true;
        state.formElements.btnSave.disabled = true;
        state.transaction.master.totalAmount = calculateTotal(state);
      }
    });

    builder.addCase(loadAccVoucher.rejected, (state) => {
      state.transactionLoading = false;
      state.transaction = accTransactionInitialData;
    });

    builder.addCase(loadAccVoucher.pending, (state) => {
      state.transactionLoading = true;
    });

    builder.addCase(unlockAccTransactionMaster.fulfilled, (state, action) => {
      if (action.payload > 0) {
        state.transaction.master.isLocked = false;
        state.unlocking = false;
      }
    });

    builder.addCase(unlockAccTransactionMaster.rejected, (state) => {
      state.unlocking = false;
    });

    builder.addCase(unlockAccTransactionMaster.pending, (state) => {
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
  clearState,
  enableControls,
  setUserRight,
  disableControls,
  updateFormElement,
  accFormStateTransactionDetailsSetSlNo,
  loadTempRows,
} = accTransactionSlice.actions;
interface FormElementsState {
  formElements: {
    [key: string]: {
      [field: string]: any; // Allow flexible nested structure
    };
  };
}
export default accTransactionSlice.reducer;
