
import { TemplateState } from "../../pages/InvoiceDesigner/Designer/interfaces";
import DefaultSITemplates from "../../pages/InvoiceDesigner/DefaultTemplates/invoiceTemplates";
import { Actions } from "../types";
import ActionTypes from "../actions/ActionTypes";
import VoucherType from "../../enums/voucher-types";

export interface TemplateReducerState<T> { 
  activeTemplate: TemplateState<T>;
  data?: {
    voucher_type: VoucherType | string;
    content: TemplateState<T>;
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
  templates: TemplateState<T>[];
  lastActionMessage?: any
}

//

// export const templateInitialState: TemplateReducerState = {
export const templateInitialState = <T>(): TemplateReducerState<T> => ({
  activeTemplate: DefaultSITemplates[0]?.content,
  templates: [],
  lastActionMessage:null
});

// const TemplateReducer = () => {
//   return (state = templateInitialState, action: any) => {
//     switch (action.type) {
//       case ActionTypes.SET_ACTIVE_TEMPLATE:
//         return {
//           ...state,
//           activeTemplate: action?.payload,
//           data: { ...state?.data, ...action?.data },
//         };
//       default:
//         return state;
//     }
//   };
// };

// export default TemplateReducer;
