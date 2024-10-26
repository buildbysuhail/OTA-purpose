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
import { getTemplates } from "./thunk";

// Helper function to handle file-to-base64 conversion
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result?.toString();
      if (base64String) {
        resolve(base64String);
      } else {
        reject("File conversion failed");
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

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
          (template) => template.propertiesState?.template_group !== templateGroup
        );
        
        // Push the new data into the state
        debugger;
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
    setTemplateThumbImage: (state, action: PayloadAction<string | undefined>) => {
      state.activeTemplate.thumbImage = action.payload ?? "";
    },
    setTemplateBackgroundImage: (state, action: PayloadAction<string | undefined>) => {
      state.activeTemplate.background_image = action.payload ?? "";
    },
    setTemplateBackgroundImageHeader: (state, action: PayloadAction<string | undefined>) => {
      state.activeTemplate.background_image_header = action.payload ?? "";
    },
    setTemplateBackgroundImageFooter: (state, action: PayloadAction<string | undefined>) => {
      state.activeTemplate.background_image_footer = action.payload ?? "";
    },
    setTemplateSignatureImage: (state, action: PayloadAction<string | undefined>) => {
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
    setTemplateTotalState: (state, action: PayloadAction<TotalState>) => {
      state.activeTemplate.totalState = action.payload;
    },
    setTemplateFooterState: (state, action: PayloadAction<FooterState>) => {
      state.activeTemplate.footerState = action.payload;
    },
  },
});

// External handlers for file-to-Base64 conversion and dispatching
export const handleSetTemplateThumbImage = (file: File | undefined, dispatch: any) => {
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

export const handleSetTemplateBackgroundImage = (file: File | undefined, dispatch: any) => {
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

export const handleSetTemplateBackgroundImageHeader = (file: File | undefined, dispatch: any) => {
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

export const handleSetTemplateBackgroundImageFooter = (file: File | undefined, dispatch: any) => {
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

export const handleSetTemplateSignatureImage = (file: File | undefined, dispatch: any) => {
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
  setTemplateTotalState,
  setTemplateFooterState,
} = templateSlice.actions;

export default templateSlice.reducer;
