/**
 * Service Transaction Redux Slice
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ServiceTransactionFormState,
  ServiceTransactionData,
  ServiceTransactionMaster,
  ServiceDetails,
  AgentTransfer,
  ServiceInvoice,
  ServiceSpareDetail,
  ServiceFormElements,
  FormElementState,
  ServiceHistory,
  ServiceStatus,
} from "./service-transaction-types";
import {
  initialServiceTransactionFormState,
  initialServiceTransactionData,
  initialFormElements,
} from "./service-transaction-data";
import moment from "moment";

const serviceTransactionSlice = createSlice({
  name: "serviceTransaction",
  initialState: initialServiceTransactionFormState,
  reducers: {
    // Set entire form state
    setFormState: (state, action: PayloadAction<ServiceTransactionFormState>) => {
      return action.payload;
    },

    // Reset state for new transaction
    resetState: (state, action: PayloadAction<{
      branchID: number;
      financialYearID: number;
      userID: number;
      softwareDate?: string;
    }>) => {
      const { branchID, financialYearID, userID, softwareDate } = action.payload;
      const currentDate = softwareDate
        ? moment(softwareDate, "DD/MM/YYYY").toISOString()
        : moment().toISOString();

      return {
        ...initialServiceTransactionFormState,
        transaction: {
          ...initialServiceTransactionData,
          master: {
            ...initialServiceTransactionData.master,
            branchID,
            financialYearID,
            createdUserID: userID,
            orderDate: currentDate,
            expectedDeliveryDate: currentDate,
          },
          serviceDetails: {
            ...initialServiceTransactionData.serviceDetails,
            serviceDoneDate: currentDate,
          },
          agentTransfer: {
            ...initialServiceTransactionData.agentTransfer,
            transferDate: currentDate,
            despatchedReturnDate: currentDate,
            expectedDeliveryDate: currentDate,
          },
          invoice: {
            ...initialServiceTransactionData.invoice,
            invoiceDate: currentDate,
          },
        },
      };
    },

    // Set active tab
    setActiveTab: (state, action: PayloadAction<number>) => {
      state.activeTab = action.payload;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set saving state
    setSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },

    // Set deleting state
    setDeleting: (state, action: PayloadAction<boolean>) => {
      state.isDeleting = action.payload;
    },

    // Set edit mode
    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEdit = action.payload;
    },

    // Toggle history sidebar
    toggleHistory: (state) => {
      state.showHistory = !state.showHistory;
    },

    // Set print on save
    setPrintOnSave: (state, action: PayloadAction<boolean>) => {
      state.printOnSave = action.payload;
    },

    // Load transaction data
    loadTransaction: (state, action: PayloadAction<ServiceTransactionData>) => {
      state.transaction = action.payload;
      state.isEdit = action.payload.master.serviceTransMasterID > 0;
    },

    // Update master field
    updateMasterField: (
      state,
      action: PayloadAction<Partial<ServiceTransactionMaster>>
    ) => {
      state.transaction.master = {
        ...state.transaction.master,
        ...action.payload,
      };
    },

    // Update service details
    updateServiceDetails: (
      state,
      action: PayloadAction<Partial<ServiceDetails>>
    ) => {
      state.transaction.serviceDetails = {
        ...state.transaction.serviceDetails,
        ...action.payload,
      };
    },

    // Update agent transfer
    updateAgentTransfer: (
      state,
      action: PayloadAction<Partial<AgentTransfer>>
    ) => {
      state.transaction.agentTransfer = {
        ...state.transaction.agentTransfer,
        ...action.payload,
      };
    },

    // Update invoice
    updateInvoice: (
      state,
      action: PayloadAction<Partial<ServiceInvoice>>
    ) => {
      state.transaction.invoice = {
        ...state.transaction.invoice,
        ...action.payload,
      };
      // Calculate balance
      const { total, advanceReceived, cashReceived } = state.transaction.invoice;
      state.transaction.invoice.balance = total - advanceReceived - cashReceived;
    },

    // Add spare detail
    addSpareDetail: (state, action: PayloadAction<ServiceSpareDetail>) => {
      const newSlNo = state.transaction.spareDetails.length + 1;
      state.transaction.spareDetails.push({
        ...action.payload,
        slNo: newSlNo,
      });
      // Recalculate consumed qty amount
      state.transaction.serviceDetails.consumedQtyAmount =
        state.transaction.spareDetails.reduce((sum, item) => sum + item.total, 0);
    },

    // Update spare detail
    updateSpareDetail: (
      state,
      action: PayloadAction<{ index: number; data: Partial<ServiceSpareDetail> }>
    ) => {
      const { index, data } = action.payload;
      if (state.transaction.spareDetails[index]) {
        state.transaction.spareDetails[index] = {
          ...state.transaction.spareDetails[index],
          ...data,
        };
        // Recalculate total for this item
        if (data.qty !== undefined || data.purchasePrice !== undefined) {
          const item = state.transaction.spareDetails[index];
          item.total = item.qty * item.purchasePrice;
        }
        // Recalculate consumed qty amount
        state.transaction.serviceDetails.consumedQtyAmount =
          state.transaction.spareDetails.reduce((sum, item) => sum + item.total, 0);
      }
    },

    // Remove spare detail
    removeSpareDetail: (state, action: PayloadAction<number>) => {
      state.transaction.spareDetails.splice(action.payload, 1);
      // Renumber slNo
      state.transaction.spareDetails.forEach((item, index) => {
        item.slNo = index + 1;
      });
      // Recalculate consumed qty amount
      state.transaction.serviceDetails.consumedQtyAmount =
        state.transaction.spareDetails.reduce((sum, item) => sum + item.total, 0);
    },

    // Set spare details
    setSpareDetails: (state, action: PayloadAction<ServiceSpareDetail[]>) => {
      state.transaction.spareDetails = action.payload;
      // Recalculate consumed qty amount
      state.transaction.serviceDetails.consumedQtyAmount =
        state.transaction.spareDetails.reduce((sum, item) => sum + item.total, 0);
    },

    // Set history
    setHistory: (state, action: PayloadAction<ServiceHistory[]>) => {
      state.transaction.history = action.payload;
    },

    // Update form element
    updateFormElement: (
      state,
      action: PayloadAction<{
        field: keyof ServiceFormElements;
        updates: Partial<FormElementState>;
      }>
    ) => {
      const { field, updates } = action.payload;
      state.formElements[field] = {
        ...state.formElements[field],
        ...updates,
      };
    },

    // Bulk update form elements
    updateFormElements: (
      state,
      action: PayloadAction<Partial<ServiceFormElements>>
    ) => {
      state.formElements = {
        ...state.formElements,
        ...action.payload,
      };
    },

    // Set search parameters
    setSearchParams: (
      state,
      action: PayloadAction<{ jobNo?: number; searchIn?: string }>
    ) => {
      if (action.payload.jobNo !== undefined) {
        state.searchJobNo = action.payload.jobNo;
      }
      if (action.payload.searchIn !== undefined) {
        state.searchIn = action.payload.searchIn;
      }
    },

    // Calculate invoice totals
    calculateInvoiceTotals: (state) => {
      const { serviceCharge, consumedQtyAmount, advanceReceived, cashReceived } =
        state.transaction.invoice;
      const total = serviceCharge + consumedQtyAmount;
      const balance = total - advanceReceived - cashReceived;

      state.transaction.invoice.total = total;
      state.transaction.invoice.balance = balance;
    },

    // Sync master to invoice (when loading for invoicing)
    syncMasterToInvoice: (state) => {
      const master = state.transaction.master;
      state.transaction.invoice = {
        ...state.transaction.invoice,
        serviceTransMasterID: master.serviceTransMasterID,
        advanceReceived: master.advanceReceived,
        isWarrantyService: master.isWarrantyService,
      };
    },

    // Disable form for completed/invoiced status
    disableFormForStatus: (state, action: PayloadAction<ServiceStatus>) => {
      const status = action.payload;
      const shouldDisable = status === ServiceStatus.Invoiced ||
                           status === ServiceStatus.Cancelled;

      if (shouldDisable) {
        Object.keys(state.formElements).forEach((key) => {
          const formKey = key as keyof ServiceFormElements;
          if (!['btnPrint'].includes(key)) {
            state.formElements[formKey].disabled = true;
          }
        });
      }
    },
  },
});

export const {
  setFormState,
  resetState,
  setActiveTab,
  setLoading,
  setSaving,
  setDeleting,
  setEditMode,
  toggleHistory,
  setPrintOnSave,
  loadTransaction,
  updateMasterField,
  updateServiceDetails,
  updateAgentTransfer,
  updateInvoice,
  addSpareDetail,
  updateSpareDetail,
  removeSpareDetail,
  setSpareDetails,
  setHistory,
  updateFormElement,
  updateFormElements,
  setSearchParams,
  calculateInvoiceTotals,
  syncMasterToInvoice,
  disableFormForStatus,
} = serviceTransactionSlice.actions;

export default serviceTransactionSlice.reducer;
