import { reduxManager } from "../redux/dynamic-store-manager-pro";
import { FormField } from "./form-types";

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const getFieldPropsGlobal =
  (fieldId: string, data: any): FormField => {
    return getFieldPropsGlobalAdv(fieldId, data)
  };

export const getFieldPropsGlobalAdv =
  (fieldId: string, data: any, useApiClient?: boolean ,formState?: any, setLocalFormState?: any,onChangeData?: any, label?: string, rName?: string): FormField => {

    const _value = getNestedValue(data?.data ? data?.data : data, fieldId);
    const value = _value == undefined || _value == null || _value == "" ? "" : _value == 0 ? '0' : _value || "";
    const validation = getNestedValue(data?.validations, fieldId);
    const checked = getNestedValue(data?.data ? data?.data : data, fieldId) || false;
    if ((onChangeData != undefined || label != undefined) && useApiClient != undefined) {
      if (onChangeData != undefined && label != undefined ) { 
        return {
          id: fieldId,
          data: data?.data ? data?.data : data,
          value,
          onChangeData: (data: any) => onChangeData,
          label,
          validation,
          checked,
        };
      }
      if (onChangeData != undefined) {
        return {
          id: fieldId,
          data: data?.data ? data?.data : data,
          value,

          onChangeData: (data: any) => onChangeData,
          validation,
          checked,
        };
      }
      if (label != undefined) {
        return {
          id: fieldId,
          data: data?.data ? data?.data : data,
          value,
          onChangeData: (data: any) => handleFieldChangeGlobalAdv({fields: fieldId,  value:_value, formState: formState, rName:rName,setLocalFormState: setLocalFormState,useApiClient: useApiClient}),
          label,
          validation,
          checked,
        };
      }
    }
    else {
      return {
        id: fieldId,
        data: data?.data ? data?.data : data,
        value,
        validation,
        checked,
      };
    }
  };

const setNestedValueGlobal = (obj: any, path: string, value: any): any => {
  const keys = path.split('.');
  const lastKey = keys.pop() as string;
  const deepClone = { ...obj }; // Create a shallow clone of the object
  let nestedObj = deepClone;

  keys.forEach((key) => {
    nestedObj[key] = nestedObj[key] ? { ...nestedObj[key] } : {};
    nestedObj = nestedObj[key];
  });

  nestedObj[lastKey] = value;

  return deepClone;
};

// Reusable function to handle field changes
export const handleFieldChangeGlobal = ({
  fields,
  value,
  formState,
}: {
  fields: { [fieldId: string]: any } | string;
  value?: any;
  formState: any;
}) => {
  // Convert single field updates to multi-field format
  const fieldUpdates = typeof fields === 'string' ? { [fields]: value } : fields;

  // Update the nested fields for all provided fieldIds
  return Object.entries(fieldUpdates).reduce(
    (acc, [fieldId, val]) => setNestedValueGlobal(acc, fieldId, val),
    formState?.data ? formState?.data : formState
  );
};
// Reusable function to handle field changes
export const handleFieldChangeGlobalAdv = ({
  fields,
  value,
  formState,
  setLocalFormState,
  useApiClient,
  rName
}: {
  fields: { [fieldId: string]: any } | string;
  value?: any;
  formState: any;
  setLocalFormState?: any;
  useApiClient?: any;
  rName?: any;
}) => {
  // Convert single field updates to multi-field format
  const updatedData = handleFieldChangeGlobal({fields: fields, value: value, formState})
  
  if (useApiClient) {
    setLocalFormState((prevState: any) => ({
      ...prevState,
      data: updatedData,
      validations: { ...prevState?.validations },
    }));
  } else {
    reduxManager.setState(rName, {
      data: updatedData,
      validations: { ... formState?.validations },
      loading: false,
      error: null,
    });
  }
};