import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import {
  FooterState,
  HeaderState,
  initialTemplateState,
  ItemTableState,
  PropertiesState,
  TemplateState,
  TotalState,
} from "../../../pages/InvoiceDesigner/Designer/interfaces";
import { getTemplates } from "./thunk";
import { reducerNameFromUrl } from "../../actions/AppActions";
import Urls from "../../urls";
import { ActionType } from "../../types";

const templatesSlice = createSlice({
  name: reducerNameFromUrl(Urls.templates,ActionType.GET),
  initialState: initialTemplateState,
  extraReducers: (builder) => {
    builder.addCase(getTemplates.fulfilled, (state, action) => {
      if (action.payload) {
        state.loading = false;
        state.data = action.payload as Draft<any>;
      }
    });
    builder.addCase(getTemplates.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(getTemplates.pending, (state, action) => {
      state.loading = true;
    });
  },
  reducers: {
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
  setTemplateId,
  setTemplateThumbImage,
  setTemplatePropertiesState,
  setTemplateHeaderState,
  setTemplateItemTableState,
  setTemplateTotalState,
  setTemplateFooterState,
} = templatesSlice.actions;

export default templatesSlice.reducer;
