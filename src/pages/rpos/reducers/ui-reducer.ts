import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  initialRPosUIState,
  initialRPosUIFlags,
  initialRPosUIPanels,
  initialRPosUILoading,
  initialRPosUISearch,
  initialRPosUISelection,
  initialRPosUIFormState,
} from "../type/rpos-type-data.ts/rpos-ui-data";
import {
  RPosUIState,
  RPosUIFlags,
  RPosUIPanels,
  RPosUILoading,
  RPosUISearch,
  RPosUISelection,
  RPosUIFormState,
} from "../type/rpos-ui-type";

const rPosUiSlice = createSlice({
  name: "rPosUi",
  initialState: initialRPosUIState,
  reducers: {
    // Flag actions
    setUiFlag(
      state,
      action: PayloadAction<{ key: keyof RPosUIFlags; value: boolean }>
    ) {
      const { key, value } = action.payload;
      state.flags[key] = value;
    },
    toggleUiFlag(state, action: PayloadAction<keyof RPosUIFlags>) {
      state.flags[action.payload] = !state.flags[action.payload];
    },
    resetUiFlags(state) {
      state.flags = initialRPosUIFlags;
    },

    // Panel actions
    openPanel(state, action: PayloadAction<keyof RPosUIPanels>) {
      // Close all panels first
      Object.keys(state.panels).forEach((key) => {
        state.panels[key as keyof RPosUIPanels] = false;
      });
      state.panels[action.payload] = true;
    },
    closePanel(state, action: PayloadAction<keyof RPosUIPanels>) {
      state.panels[action.payload] = false;
    },
    togglePanel(state, action: PayloadAction<keyof RPosUIPanels>) {
      state.panels[action.payload] = !state.panels[action.payload];
    },
    closeAllPanels(state) {
      state.panels = initialRPosUIPanels;
    },

    // Loading actions
    setLoading(
      state,
      action: PayloadAction<{ key: keyof RPosUILoading; value: boolean }>
    ) {
      const { key, value } = action.payload;
      state.loading[key] = value;
    },
    resetLoading(state) {
      state.loading = initialRPosUILoading;
    },

    // Search actions
    setSearchQuery(
      state,
      action: PayloadAction<{ key: keyof RPosUISearch; value: string }>
    ) {
      const { key, value } = action.payload;
      state.search[key] = value;
    },
    clearSearch(state, action: PayloadAction<keyof RPosUISearch>) {
      state.search[action.payload] = "";
    },
    clearAllSearches(state) {
      state.search = initialRPosUISearch;
    },

    // Selection actions
    setSelection(
      state,
      action: PayloadAction<{
        key: keyof RPosUISelection;
        value: number | null;
      }>
    ) {
      const { key, value } = action.payload;
      (state.selection[key] as number | null) = value;
    },
    clearSelection(state, action: PayloadAction<keyof RPosUISelection>) {
      if (action.payload === "activeItemGridRow") {
        state.selection.activeItemGridRow = 0;
      } else {
        (state.selection[action.payload] as number | null) = null;
      }
    },
    resetSelections(state) {
      state.selection = initialRPosUISelection;
    },

    // Form state actions
    setFormState(
      state,
      action: PayloadAction<{ key: keyof RPosUIFormState; value: boolean }>
    ) {
      const { key, value } = action.payload;
      state.form[key] = value;
    },
    resetFormState(state) {
      state.form = initialRPosUIFormState;
    },

    // Bulk update
    updateUiState(state, action: PayloadAction<Partial<RPosUIState>>) {
      return { ...state, ...action.payload };
    },

    // Full reset
    resetUiState() {
      return initialRPosUIState;
    },
  },
});

export const {
  // Flags
  setUiFlag,
  toggleUiFlag,
  resetUiFlags,
  // Panels
  openPanel,
  closePanel,
  togglePanel,
  closeAllPanels,
  // Loading
  setLoading,
  resetLoading,
  // Search
  setSearchQuery,
  clearSearch,
  clearAllSearches,
  // Selection
  setSelection,
  clearSelection,
  resetSelections,
  // Form
  setFormState,
  resetFormState,
  // Bulk
  updateUiState,
  resetUiState,
} = rPosUiSlice.actions;

export default rPosUiSlice.reducer;
