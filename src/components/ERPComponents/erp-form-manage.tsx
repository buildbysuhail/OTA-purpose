import { useCallback, useState } from "react";
import ERPButton from "../../components/ERPComponents/erp-button";
import ERPInput from "../../components/ERPComponents/erp-input";
import { ResponseModelWithValidation } from "../../base/response-model";
import { handleResponse } from "../../utilities/HandleResponse";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { APIClient } from "../../helpers/api-client";

type PrimitiveFormField = string | number | boolean | Date | null | undefined;
type ArrayFormField = PrimitiveFormField[];
type ObjectFormField = { [key: string]: FormField };
type FormField = PrimitiveFormField | ArrayFormField | ObjectFormField;
export interface fieldType {
    id: string;
    type:
      | "slider"
      | "switch"
      | "rating"
      | "image"
      | "select"
      | "list"
      | "button"
      | "checkbox"
      | "color"
      | "date"
      | "datetime-local"
      | "email"
      | "month"
      | "number"
      | "password"
      | "radio"
      | "range"
      | "reset"
      | "search"
      | "submit"
      | "tel"
      | "time"
      | "url"
      | "week"
      | "text"
      | "textarea"
      | "img-upload"
      | "file"
      | "uniqueId"
      | "ChartCode"
      | "dataList"
      | "multipleList"
      | "sales_person"
      | "payment_terms"
      | "peopleList"
      | "actionTextExpense"
      | "accountList"
      | "itemsList"
      | "barcode"
      | "tax_number"
      | "multiUnit"
      | "discountInput"
      | "accountsListWithCode"
      | "exchange_rate"
      | "accountsWithType"
      | "moreDetails"
      | "state"
      | "customFilter"
      | "ExpenseVendor"
      | "currency"
      | "customCombobox"
      | "assignOwnerDropDown";
    items?: any[];
    /**
     * @description title for field
     */
    title?: string;
    /**
     * @description label for field
     */
    label?: string;
    /**
     * @description The label to display when the switch is on.
     */
    onLabel?: string;
    /**
     * @description The label to display when the switch is off.
     */
    offLabel?: string;
    multiple?: boolean;
    row?: boolean;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    defaultValue?: any;
    placeholder?: string;
    disabled?: boolean;
    style?: string;
    value?: any;
    readOnlyValue?: any;
    getter?: string;
    noLabel?: boolean;
    showWhen?: string;
    hideWhen?: string;
    disableWhen?: string;
    isBoolean?: boolean;
    peopleType?: string;
    accountCode?: number;
    hasDueDate?: boolean;
    includeOptions?: any[];
    initialValue?: any;
    showFirstItem?: boolean;
    hintAvailable?: boolean;
    hintMessage?: string;
    isPaginated?: boolean;
    should_track_inventory?: boolean;
    module?: "all" | "sales" | "purchase";
  }
interface FormDataStructure {
  [key: string]: FormField;
}

interface Validations {
  [key: string]: string;
}

interface FormState {
  data: FormDataStructure;
  validations: Validations;
}

interface SBTableProps {
    fieldClass: string;
    fields: Array<any>;
    loading?: boolean;
    data?: any;
    defaultData?: any;
    onChangeData?: (data: any) => void;
    path?: any;
    onChangeDefaultData?: any;
    onSubmit: (data: FormDataStructure) => void;
  onCancel: () => void;
  }
  
const api = new APIClient();
export const ERPForm = ({ data, defaultData, onChangeData, onChangeDefaultData, ...props }: SBTableProps) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const onClose = useCallback(async () => {
    closeAction();
  }, []);
  const [postData, setPostData] = useState<FormState>(initialData);
  const [postDataLoading, setPostLoading] = useState<boolean>(false);

  const queryParams = new URLSearchParams(location.search);
  
  //key : used for route parm for edit or view 
  const [key, setKey] = useState<any>(queryParams.get('key'));

  const handleSubmit = useCallback(async () => {
    setPostLoading(true);
    const response: ResponseModelWithValidation<any, any> =
      key != undefined && key != null ? await api.post("",postData?.data) : await api.put("",postData?.data);
      setPostLoading(false);
    handleResponse(response, 
      () => {closeAction();},
      () => {setPostData((prevData: any) => ({
                ...prevData,
                validations: response.validations,
              }));
            });
  }, [postData?.data]);

  const handleChange = useCallback((id: string, value: FormField) => {
    try {
      setPostData(prevData => {
        const newData = { ...prevData.data };

        if (id.includes(".")) {
          const [fieldParent, fieldChild] = id.split(".");
          if (typeof newData[fieldParent] === 'object' && newData[fieldParent] !== null && !Array.isArray(newData[fieldParent])) {
            (newData[fieldParent] as { [key: string]: FormField })[fieldChild] = value;
          }
        } else {
          newData[id] = value;
        }

        return {
          ...prevData,
          data: newData
        };
      });
    } catch (error) {
      console.log(`DynamicForm, Error: `, error);
    }
  }, []);
  return (
    <div className="w-full pt-4">
     
    {/* bind dynamic form fields */}
      <div className="w-full p-2 flex justify-end">
        <ERPButton
          type="reset"
          title="Cancel"
          variant="secondary"
          onClick={onClose}
          // disabled={emailLoading}
        ></ERPButton>
        <ERPButton
          type="button"
          disabled={postDataLoading}
          variant="primary"
          onClick={handleSubmit}
          loading={postDataLoading}
          title={key != undefined && key != null ? 'Update':'Cancel'}
        ></ERPButton>
      </div>
    </div>
  );
};


