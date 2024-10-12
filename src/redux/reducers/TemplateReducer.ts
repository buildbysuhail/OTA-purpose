
import { TemplateState } from "../../pages/InvoiceDesigner/Designer/interfaces";
import DefaultSITemplates from "../../pages/InvoiceDesigner/DefaultTemplates/invoiceTemplates";
import { TemplateGroupTypes } from "../../pages/InvoiceDesigner/constants/TemplateCategories";
import { Actions } from "../types";
import ActionTypes from "../actions/ActionTypes";

export interface TemplateReducerState {
  activeTemplate: TemplateState;
  data?: {
    voucher_type: TemplateGroupTypes;
    content: TemplateState;
    is_default: boolean;
    is_primary: boolean;
    status?: string;
    preview?: null;

    // logo?: null;
    // background?: null;
    signature_image: string | null;
    background_image: string | null;
    background_image_header: string | null;
    background_image_footer: string | null;
  };
}

//

export const templateInitialState: TemplateReducerState = {
  activeTemplate: DefaultSITemplates[0]?.content,
};

const TemplateReducer = () => {
  return (state = templateInitialState, action: any) => {
    switch (action.type) {
      case ActionTypes.SET_ACTIVE_TEMPLATE:
        return {
          ...state,
          activeTemplate: action?.payload,
          data: { ...state?.data, ...action?.data },
        };
      default:
        return state;
    }
  };
};

export default TemplateReducer;
