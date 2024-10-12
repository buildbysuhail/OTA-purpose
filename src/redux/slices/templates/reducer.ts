import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  FooterState,
  HeaderState,
  initialTemplateState,
  ItemTableState,
  PropertiesState,
  TotalState,
} from "../../../pages/InvoiceDesigner/Designer/interfaces";
import { templateInitialState } from "../../reducers/TemplateReducer";

const templateSlice = createSlice({
  name: 'template',
  initialState: templateInitialState,
  extraReducers: (builder) => {
    
  },
  reducers: {
    setTemplate: (
      state,
      action: PayloadAction<any>
    ) => {
      state.activeTemplate = action.payload;
    },
    setTemplateId: (
      state,
      action: PayloadAction<string | number | undefined>
    ) => {
      state.activeTemplate.id = action.payload;
    },
    setTemplateThumbImage: (
      state,
      action: PayloadAction<string | undefined>
    ) => {
      state.activeTemplate.thumbImage = action.payload;
    },
    setTemplatePropertiesState: (
      state,
      action: PayloadAction<PropertiesState>
    ) => {
      state.activeTemplate.propertiesState = action.payload;
    },
    setTemplateHeaderState: (state, action: PayloadAction<HeaderState>) => {
      state.activeTemplate.headerState = action.payload;
    },
    setTemplateItemTableState: (
      state,
      action: PayloadAction<ItemTableState>
    ) => {
      state.activeTemplate.itemTableState = action.payload;
    },
    setTemplateTotalState: (state, action: PayloadAction<TotalState>) => {
      state.activeTemplate.totalState = action.payload;
    },
    setTemplateFooterState: (state, action: PayloadAction<FooterState>) => {
      state.activeTemplate.footerState = action.payload;
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
