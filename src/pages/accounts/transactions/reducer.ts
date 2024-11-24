import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  accTransactionFormStateInitialData,
  AccTransactionFormState,
  AccTransactionData,
  AccTransactionRow,
  AccTransactionMaster,
} from "./acc-transaction-types";

const accTransactionSlice = createSlice({
  name: "accTransaction",
  initialState: accTransactionFormStateInitialData,
  reducers: {
    // Set entire form state
    accFormStateSet: (state, action: PayloadAction<AccTransactionFormState>) => {
      return action.payload;
    },

    // Update a specific field in the form state
    accFormStateHandleFieldChange: (
      state,
      action: PayloadAction<{ fields: { [fieldId: string]: any } | string; value?: any }>
    ) => {
      debugger
      const { fields, value } = action.payload;
      // Check if 'fields' is an object (multiple fields)
      if (typeof fields === 'object' && !Array.isArray(fields)) {
        // If it's an object, loop through each field and update them
        Object.keys(fields).forEach((key) => {
          // Update the corresponding field in the state
          const fieldValue = fields[key];
          const isDateField = (state[key as keyof AccTransactionFormState] as typeof fieldValue) instanceof Date;
          // Convert Date fields to ISO strings
          (state[key as keyof AccTransactionFormState] as typeof fieldValue) = isDateField
            ? new Date(fieldValue).toISOString()
            : fieldValue;
        });
      } else if (typeof fields === 'string' && value !== undefined) {
        // If it's a single field, update it with the provided value
        const isDateField = (state[value as keyof AccTransactionFormState] as typeof value) instanceof Date;
        // Convert Date fields to ISO strings
        (state[fields as keyof AccTransactionFormState] as typeof value) = isDateField
          ? new Date(value).toISOString()
          : value;
      }
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
      action: PayloadAction<{ fields: { [fieldId: string]: any } | string; value?: any }>
    ) => {
      const { fields, value } = action.payload;

      // Check if 'fields' is an object (multiple fields)
      if (typeof fields === 'object' && !Array.isArray(fields)) {
        // If it's an object, loop through each field and update them
        Object.keys(fields).forEach((key) => {
          // Update the corresponding field in the state
          const fieldValue = fields[key];
          const isDateField = (state.transaction.master[key as keyof AccTransactionMaster] as typeof fieldValue) instanceof Date;
          // Convert Date fields to ISO strings
          (state.transaction.master[key as keyof AccTransactionMaster] as typeof fieldValue) = isDateField
            ? new Date(fieldValue).toISOString()
            : fieldValue;
        });
      } else if (typeof fields === 'string' && value !== undefined) {
        const isDateField = (state.transaction.master[fields as keyof AccTransactionMaster] as typeof value) instanceof Date;
        (state.transaction.master[fields as keyof AccTransactionMaster] as typeof value) = isDateField
          ? new Date(value).toISOString()
          : value;
      }
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

    // Handle changes for the "row" property in the state
    accFormStateRowHandleFieldChange: (
      state,
      action: PayloadAction<{ fields: { [fieldId: string]: any } | string; value?: any }>
    ) => {
      debugger;
      const { fields, value } = action.payload;
      // Check if 'fields' is an object (multiple fields)
      if (typeof fields === 'object' && !Array.isArray(fields)) {
        // If it's an object, loop through each field and update them
        Object.keys(fields).forEach((key) => {
          // Update the corresponding field in the state
          const fieldValue = fields[key];
          const isDateField = (state.row[key as keyof AccTransactionRow] as typeof fieldValue) instanceof Date;
          (state.row[key as keyof AccTransactionRow] as typeof fieldValue) = isDateField
          ? new Date(fieldValue).toISOString()
          : fieldValue;
        });
      } else if (typeof fields === 'string' && value !== undefined) {
        // If it's a single field, update it with the provided value
        const isDateField = (state.row[fields as keyof AccTransactionRow] as typeof value) instanceof Date;
        (state.row[fields as keyof AccTransactionRow] as typeof value) = isDateField
        ? new Date(value).toISOString()
        : value;;
      }
    },

    // Clear the form state to initial values
    accFormStateReset: () => {
      return accTransactionFormStateInitialData;
    },
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
} = accTransactionSlice.actions;

export default accTransactionSlice.reducer;
