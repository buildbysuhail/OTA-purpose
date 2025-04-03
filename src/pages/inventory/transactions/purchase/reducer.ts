import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  TransactionFormStateInitialData,
  TransactionFormState,
  TransactionData,
  TransactionDetail,
  TransactionMaster,
  initialTransactionDetailData,
  FormElementState,
  Attachments,
  TransactionMaster3,
} from "./transaction-types";
import { clearEntryControl } from "./functions";
import ERPToast from "../../../../components/ERPComponents/erp-toast";
import { UserAction } from "../../../../helpers/user-right-helper";
import { UserModel } from "../../../../redux/slices/user-session/reducer";
import { TemplateState } from "../../../InvoiceDesigner/Designer/interfaces";
import { ApplicationSettingsType } from "../../../settings/system/application-settings-types/application-settings-types";

const InvTransactionSlice = createSlice({
  name: "invTransaction",
  initialState: TransactionFormStateInitialData,
  reducers: {
    // Set entire form state
    formStateSet: (
      state,
      action: PayloadAction<TransactionFormState>
    ) => {
      return action.payload;
    },
    // clear entire for new voucher
    clearState: (
      state,
      action: PayloadAction<{
        userSession: UserModel;
        applicationSettings: ApplicationSettingsType;
        softwareDate: string;
        defaultCostCenterID: number;
        counterwiseCashLedgerId: number;
        allowSalesCounter: number;
        voucherNo: number | undefined;
        rowOnly?: boolean | false;
      }>
    ) => {
      const {
        userSession,
        applicationSettings,
        softwareDate,
        defaultCostCenterID,
        counterwiseCashLedgerId,
        allowSalesCounter,
        voucherNo,
        rowOnly = false
      } = action.payload;
      
    },
    
    // Update a specific field in the form state
    formStateHandleFieldChange: (
      state,
      action: PayloadAction<{
        fields: { [fieldId in keyof TransactionFormState]?: any };
      }>
    ) => {
      
      const { fields } = action.payload;
      // Check if 'fields' is an object (multiple fields)
      Object.keys(fields).forEach((key) => {
        // Update the corresponding field in the state
        const fieldValue = fields[key as keyof TransactionFormState];
        const isDateField =
          (state[
            key as keyof TransactionFormState
          ] as typeof fieldValue) instanceof Date;
        // Convert Date fields to ISO strings
        (state[key as keyof TransactionFormState] as typeof fieldValue) =
          isDateField ? new Date(fieldValue).toISOString() : fieldValue;
      });
    },

 // Inside the createSlice, update the reducer
      templatesData: (
        state,
        action: PayloadAction<TemplateState>
      ) => {
        if (!state.templatesData) {
          state.templatesData = [];
        }
        
        // Only add the template if it doesn't already exist
        if (!state.templatesData.some(template => template.templateGroup === action.payload.templateGroup)) {
          state.templatesData.push(action.payload);
        }
      },
    // Update a specific field in the transaction object
    formStateTransactionUpdate: (
      state,
      action: PayloadAction<{
        key: keyof TransactionData;
        value: TransactionData[keyof TransactionData];
      }>
    ) => {
      const { key, value } = action.payload;
      (state.transaction[key] as typeof value) = value;
    },

    // Update a specific field in the master object within the transaction
    // dispatch(formStateTransactionMasterHandleFieldChange({ fields: "voucherPrefix", value: "INV123" }));
    // dispatch(formStateTransactionMasterHandleFieldChange({ fields: { voucherPrefix: "INV123", referenceNumber: "REF456" } }));

    formStateTransactionMasterHandleFieldChange: (
      state,
      action: PayloadAction<{
        fields: { [fieldId in keyof TransactionMaster]?: any };
      }>
    ) => {
      const { fields } = action.payload;

      // Check if 'fields' is an object (multiple fields)
      Object.keys(fields).forEach((key) => {
        // Update the corresponding field in the state
        const fieldValue = fields[key as keyof TransactionMaster];
        const isDateField =
          (state.transaction.master[
            key as keyof TransactionMaster
          ] as typeof fieldValue) instanceof Date;
        if (isDateField) {
        }
        // Convert Date fields to ISO strings
        (state.transaction.master[
          key as keyof TransactionMaster
        ] as typeof fieldValue) = isDateField
          ? new Date(fieldValue).toISOString()
          : fieldValue;
      });
    },

    // Add multiple rows to the transaction details
    formStateTransactionDetailsSetSlNo: (
      state,
      action: PayloadAction<{}>
    ) => {
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
    formStateTransactionDetailsRowsAdd: (
      state,
      action: PayloadAction<any[]>
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
    formStateTransactionDetailsRowAdd: (
      state,
      action: PayloadAction<{
        row: TransactionDetail;
        isForeignCurrencyEnabled: boolean;
        exchangeRate: number;
        applicationSettings: ApplicationSettingsType;
        userSession: UserModel;
      }>
    ) => {
      const data = initialTransactionDetailData;
      const serializedRow: TransactionDetail = {
        ...data,
       
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
        `${state.transaction.master.voucherType}${state.transaction.master.voucherForm}`,
        JSON.stringify(state.transaction.details)
      );
    },


    // Update a specific row in the transaction details
    formStateTransactionDetailsRowUpdate: (
      state,
      action: PayloadAction<{
        index: number;
        key: keyof TransactionDetail;
        value: TransactionDetail[keyof TransactionDetail];
      }>
    ) => {
      const { index, key, value } = action.payload;
      const row = state.transaction.details[index];
      if (row) {
        (state.transaction.details[index][key] as typeof value) = value;
      }
    },

    
    formStateClearDetails: (state) => {
      // Iterate over all rows in details
      state.transaction.details = [];
    },
    // Remove a specific row from the transaction details by index
    formStateTransactionDetailsRowRemove: (
      state,
      action: PayloadAction<{
        index: number;
        applicationSettings?: ApplicationSettingsType;
      }>
    ) => {
      const index = action.payload.index;
      if (index >= 0 && index < state.transaction.details.length) {
        state = clearEntryControl(
          state,
          action.payload.applicationSettings?.accountsSettings
            ?.defaultCostCenterID ?? 0
        );
        
        state.transaction.details.splice(index, 1);
        
        state.transaction.details = state.transaction.details.map(
          (x, index) => ({
            ...x,
            slNo: index + 1, // Reset slNo to start from 1
          })
        );

        localStorage.setItem(
          `${state.transaction.master.voucherType}${state.transaction.master.voucherForm}`,
          JSON.stringify(state.transaction.details)
        );
      }
    },

    // Remove a specific row from the transaction details by index
    formStateClearRowForNew: (state,
      action: PayloadAction<{
        index: number;
      }>
    ) => {
      const { index } = action.payload;
      state.transaction.details[index] = initialTransactionDetailData;
      
    },

    // Remove a specific row from the transaction details by index
    loadTempRows: (state) => {
      const tmp = localStorage.getItem(
        `${state.transaction.master.voucherType}${state.transaction.master.voucherForm}`
      );
      if (tmp != undefined && tmp != null && tmp != "") {
        const tmpRows = JSON.parse(tmp) as Array<TransactionDetail>;
        if (tmpRows.length > 0) {
          state.transaction.details = tmpRows;
        }
      }
    },

    // Handle changes for the "row" property in the state
    formStateMasterHandleFieldChange: (
      state,
      action: PayloadAction<{
        fields: { [fieldId in keyof TransactionMaster]?: any };
      }>
    ) => {
      const { fields } = action.payload;

      (Object.keys(fields) as (keyof TransactionMaster)[]).forEach((key) => {
        const fieldValue = fields[key];
    const isDateField =
              (state.transaction.master[
                key as keyof TransactionMaster
              ] as typeof fieldValue) instanceof Date;
        // Explicit assertion to satisfy TypeScript
        (state.transaction.master[key] as TransactionMaster[typeof key]) =
        isDateField ? new Date(fieldValue).toISOString() :fieldValue as TransactionMaster[typeof key];
      });
    },

    // Handle changes for the "row" property in the state
    formStateMaster3HandleFieldChange: (
      state,
      action: PayloadAction<{
        fields: { [fieldId in keyof TransactionMaster3]?: any };
      }>
    ) => {
      const { fields } = action.payload;

      (Object.keys(fields) as (keyof TransactionMaster3)[]).forEach((key) => {
        const fieldValue = fields[key];
    const isDateField =
              (state.transaction.master3[
                key as keyof TransactionMaster3
              ] as typeof fieldValue) instanceof Date;
        // Explicit assertion to satisfy TypeScript
        (state.transaction.master3[key] as TransactionMaster3[typeof key]) =
        isDateField ? new Date(fieldValue).toISOString() :fieldValue as TransactionMaster3[typeof key];
      });
    },

   
    // Clear the form state to initial values
    formStateReset: () => {
      return TransactionFormStateInitialData;
    },
    setUserRight: (
      state,
      action: PayloadAction<{
        userSession: UserModel;
        hasRight: (formCode: string, action: UserAction) => boolean;
      }>
    ) => {
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
            keyof TransactionFormState["formElements"],
            Partial<FormElementState>
          >
        >;
      }>
    ) => {
      const { fields } = action.payload;

      // Iterate over the keys of fields and apply updates
      Object.entries(fields).forEach(([key, updates]) => {
        if (key in state.formElements) {
          state.formElements[
            key as keyof TransactionFormState["formElements"]
          ] = {
            ...state.formElements[
              key as keyof TransactionFormState["formElements"]
            ],
            ...updates,
          };
        } else {
          console.warn(`Field ${key} does not exist in formElements.`);
        }
      });
    },
    formStateTransactionAttachmentsRowAdd: (
      state,
      action: PayloadAction<{
        row: Attachments;
      }>
    ) => {
      const data = action.payload.row;
      state.transaction.attachments.push(data);
    },
    formStateTransactionAttachmentsRowUpdate: (
      state,
      action: PayloadAction<{
        row: Attachments;
      }>
    ) => {
      const data = action.payload.row;
      const index = state.transaction.attachments.findIndex(
        (x) => x.key === data.key
      );
      if (index !== -1) {
        state.transaction.attachments[index] = data;
      }
    },
    formStateTransactionAttachmentsRowRemove: (
      state,
      action: PayloadAction<{
        index: number;
      }>
    ) => {
      const index = action.payload.index;
      if (index >= 0 && index < state.transaction.attachments.length) {
        state.transaction.attachments.splice(index, 1);
      }
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
 
});

export const {
  formStateSet,
  templatesData,
  formStateHandleFieldChange,
  formStateTransactionUpdate,
  formStateTransactionMasterHandleFieldChange,
  formStateTransactionDetailsRowAdd,
  formStateTransactionDetailsRowsAdd,
  formStateTransactionDetailsRowUpdate,
  formStateTransactionDetailsRowRemove,
  formStateReset,
  formStateClearRowForNew,
  clearState,
  enableControls,
  setUserRight,
  disableControls,
  updateFormElement,
  formStateTransactionDetailsSetSlNo,
  loadTempRows,
  formStateClearDetails,
  formStateTransactionAttachmentsRowAdd,
  formStateTransactionAttachmentsRowUpdate,
  formStateTransactionAttachmentsRowRemove,
  formStateMasterHandleFieldChange,
  formStateMaster3HandleFieldChange,
} = InvTransactionSlice.actions;
interface FormElementsState {
  formElements: {
    [key: string]: {
      [field: string]: any; // Allow flexible nested structure
    };
  };
}
export default InvTransactionSlice.reducer;
