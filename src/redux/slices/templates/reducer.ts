import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  FooterState,
  HeaderState,
  initialTemplateState,
  ItemTableState,
  PropertiesState,
  TotalState,
} from "../../../pages/InvoiceDesigner/Designer/interfaces";

const templateSlice = createSlice({
  name: 'template',
  initialState: initialTemplateState,
  extraReducers: (builder) => {
    
  },
  reducers: {
    setTemplate: (
      state,
      action: PayloadAction<any>
    ) => {
      state = action.payload;
    },
    setTemplateId: (
      state,
      action: PayloadAction<string | number | undefined>
    ) => {
      state.data.id = action.payload;
    },
    setTemplateThumbImage: (
      state,
      action: PayloadAction<string | undefined>
    ) => {
      state.data.thumbImage = action.payload;
    },
    setTemplatePropertiesState: (
      state,
      action: PayloadAction<PropertiesState>
    ) => {
      state.data.propertiesState = action.payload;
    },
    setTemplateHeaderState: (state, action: PayloadAction<HeaderState>) => {
      state.data.headerState = action.payload;
    },
    setTemplateItemTableState: (
      state,
      action: PayloadAction<ItemTableState>
    ) => {
      state.data.itemTableState = action.payload;
    },
    setTemplateTotalState: (state, action: PayloadAction<TotalState>) => {
      state.data.totalState = action.payload;
    },
    setTemplateFooterState: (state, action: PayloadAction<FooterState>) => {
      state.data.footerState = action.payload;
    },
  },
});

export const {
  setTemplate,
  setTemplateId,
  setTemplateThumbImage,
  setTemplatePropertiesState,
  setTemplateHeaderState,
  setTemplateItemTableState,
  setTemplateTotalState,
  setTemplateFooterState,
} = templateSlice.actions;

export default templateSlice.reducer;
