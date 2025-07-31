import { createSlice, DeepPartial, PayloadAction } from "@reduxjs/toolkit";
import {
  FooterState,
  HeaderState,
  // initialTemplateState,
  ItemTableState,
  PropertiesState,
  TotalState,
  accTableState,
  adviceTableState,
  CustomElementType,
  TemplateState,
  ItemTableMasterState,
  TableColumn,
} from "../../../pages/InvoiceDesigner/Designer/interfaces";
import { templateInitialState } from "../../reducers/TemplateReducer";
import { getTemplates } from "./thunk";
import { convertFileToBase64 } from "../../../utilities/file-utils";

// Helper function to handle file-to-base64 conversion

const templateSlice = createSlice({
  name: "template",
  initialState: templateInitialState,
  extraReducers: (builder) => {
    // getTemplates
    builder.addCase(getTemplates?.fulfilled, (state, action) => {
      if (action.payload) {
        const { templateGroup } = action.meta.arg; // Extracting templateGroup from the action

        // Filter out any existing templates with the same templateGroup
        state.templates = state.templates.filter(
          (template: any) =>
            template.propertiesState?.template_group !== templateGroup
        );

        // Push the new data into the state

        state.templates.push(action.payload as any);
      }
    });
  },
  reducers: {
    setTemplate: (state, action: PayloadAction<any>) => {
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
      state.activeTemplate.thumbImage = action.payload ?? "";
    },
    setTemplateBackgroundImage: (
      state,
      action: PayloadAction<string | undefined>
    ) => {
      state.activeTemplate.background_image = action.payload ?? "";
    },
    setTemplateBackgroundImageHeader: (
      state,
      action: PayloadAction<string | undefined>
    ) => {
      state.activeTemplate.background_image_header = action.payload ?? "";
    },
    setTemplateBackgroundImageFooter: (
      state,
      action: PayloadAction<string | undefined>
    ) => {
      state.activeTemplate.background_image_footer = action.payload ?? "";
    },
    setTemplateSignatureImage: (
      state,
      action: PayloadAction<string | undefined>
    ) => {
      state.activeTemplate.signature_image = action.payload ?? "";
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
    setTemplateAccTableState: (state, action: PayloadAction<accTableState>) => {
      state.activeTemplate.accTableState = action.payload;
    },
    // setTemplateTableState: <T,>(state, action: PayloadAction<{key: keyof T, fields: DeepPartial<TableColumn<T>>}>) => {
    //   Object.keys in fields each _key, value
    //   find index from state.activeTemplate.tableState using key
    //   state.activeTemplate.tableState[index][_key] = value;
    // },

   setTemplateTableState: (
  state: any, 
  action: PayloadAction<{
    key: string; // Change from keyof T to string
    fields: any;  // Change from DeepPartial<TableColumn<T>> to any
    templateState?: [],
    updateAll?:boolean
  }>
) => {
  const { key, fields, templateState, updateAll } = action.payload;
  
  if(updateAll == true) {
    state.activeTemplate.tableState = templateState;
    return;
  }
  const columnIndex = state.activeTemplate.tableState.findIndex(
    (column: any) => column.field === key
  );
  
  if (columnIndex !== -1) {
    const existingColumn = state.activeTemplate.tableState[columnIndex];
    
    state.activeTemplate.tableState[columnIndex] = {
      ...existingColumn,
      ...fields
    };
  }
},
    setTemplateTableMasterState: (state, action: PayloadAction<ItemTableMasterState>) => {
      state.activeTemplate.itemTableMasterState = action.payload;
    },
    setTemplateAdviceTableState: (
      state,
      action: PayloadAction<adviceTableState>
    ) => {
      state.activeTemplate.adviceTableState = action.payload;
    },
    setTemplateTotalState: (state, action: PayloadAction<TotalState>) => {
      state.activeTemplate.totalState = action.payload;
    },
    setTemplateFooterState: (state, action: PayloadAction<FooterState>) => {
      state.activeTemplate.footerState = action.payload;
    },

    setTemplateCustomElements: (
      state,
      action: PayloadAction<{ payload: CustomElementType; field: string}>
    ) => {
      const { payload, field } = action.payload;
      const fieldPath = field.split(".");

      // Navigate to the nested object using the split field path
      let target: any = state.activeTemplate;
      for (let i = 0; i < fieldPath.length - 1; i++) {
        target = target[fieldPath[i]];
      }

      // Set the value at the final property
      target[fieldPath[fieldPath.length - 1]] = payload;
    },

  },
});

// External handlers for file-to-Base64 conversion and dispatching
export const handleSetTemplateThumbImage = (
  file: File | undefined,
  dispatch: any
) => {
  if (file) {
    convertFileToBase64(file)
      .then((base64String) => {
        dispatch(setTemplateThumbImage(base64String));
      })
      .catch(console.error);
  } else {
    dispatch(setTemplateThumbImage(undefined));
  }
};

export const handleSetTemplateBarcodeLabelBackgroundImage = (
  file: File | undefined,
  dispatch: any
) => {
  if (file) {
    convertFileToBase64(file)
      .then((base64String) => {
        return base64String;
      })
      .catch(console.error);
  } else {
    return undefined;
  }
};

export const handleSetTemplateBackgroundImage = (
  file: File | undefined,
  dispatch: any
) => {
  if (file) {
    convertFileToBase64(file)
      .then((base64String) => {
        dispatch(setTemplateBackgroundImage(base64String));
      })
      .catch(console.error);
  } else {
    dispatch(setTemplateBackgroundImage(undefined));
  }
};

export const handleSetTemplateBackgroundImageHeader = (
  file: File | undefined,
  dispatch: any
) => {
  if (file) {
    convertFileToBase64(file)
      .then((base64String) => {
        dispatch(setTemplateBackgroundImageHeader(base64String));
      })
      .catch(console.error);
  } else {
    dispatch(setTemplateBackgroundImageHeader(undefined));
  }
};

export const handleSetTemplateBackgroundImageFooter = (
  file: File | undefined,
  dispatch: any
) => {
  if (file) {
    convertFileToBase64(file)
      .then((base64String) => {
        dispatch(setTemplateBackgroundImageFooter(base64String));
      })
      .catch(console.error);
  } else {
    dispatch(setTemplateBackgroundImageFooter(undefined));
  }
};

export const handleSetTemplateSignatureImage = (
  file: File | undefined,
  dispatch: any
) => {
  if (file) {
    convertFileToBase64(file)
      .then((base64String) => {
        dispatch(setTemplateSignatureImage(base64String));
      })
      .catch(console.error);
  } else {
    dispatch(setTemplateSignatureImage(undefined));
  }
};

export const {
  setTemplate,
  setTemplateId,
  setTemplateThumbImage,
  setTemplateBackgroundImage,
  setTemplateBackgroundImageHeader,
  setTemplateBackgroundImageFooter,
  setTemplateSignatureImage,
  setTemplatePropertiesState,
  setTemplateHeaderState,
  setTemplateItemTableState,
  setTemplateAccTableState,
  setTemplateTableState,
  setTemplateAdviceTableState,
  setTemplateTotalState,
  setTemplateFooterState,
  setTemplateCustomElements,
  setTemplateTableMasterState
} = templateSlice.actions;

export default templateSlice.reducer;
