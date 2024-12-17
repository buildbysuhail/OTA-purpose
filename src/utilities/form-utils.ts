import { FormField } from "./form-types";
import { lowercaseAndAddUnderscore } from "./Utils";

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export const getFieldPropsGlobal = (fieldId: string, data: any,type?: string, min?: number): FormField => {
  
  const _value = getNestedValue(data?.data ? data?.data : data, fieldId);
  let value;
  if (_value === undefined || _value === null || _value === "") {
    value = undefined;
  } else if (_value === 0) {
    value = 0;
  } else if (Number.isNaN(_value)) {
    value = _value;
  } else {
    value = _value || "";
  }
  if(type == "int" && value != undefined && value != undefined && !Number.isNaN(value)) {
    debugger;
    const str = value.toString();
    if(str.includes('.'))
    {
      value = parseInt((value as string).replace('.',''));
    }
  }
  // if(type == "decimal" && value != undefined && value != undefined && !Number.isNaN(value)) {
  //   debugger;
  //   const str = value.toString();
    
  // }
  const validation = getNestedValue(data?.validations, fieldId);
  const checked =
    getNestedValue(data?.data ? data?.data : data, fieldId) || false;
  const ret = {
    id: fieldId,
    data: data?.data ? data?.data : data,
    value,
    validation,
    checked,
  };
  console.log(`ret`);
  console.log(ret);
  
  
  return ret;
};

const setNestedValueGlobal = (obj: any, path: string, value: any): any => {
  const keys = path.split(".");
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
  const fieldUpdates =
    typeof fields === "string" ? { [fields]: value } : fields;

  // Update the nested fields for all provided fieldIds
  return Object.entries(fieldUpdates).reduce(
    (acc, [fieldId, val]) => setNestedValueGlobal(acc, fieldId, val),
    formState?.data ? formState?.data : formState
  );
};
export const getFieldPropsAdvGlob = (
  fieldId: string,
  data: any,
  handleFieldChange: (fieldId: string, value: any) => void,
  t: any,
  options?: { onChangeData?: (data: any) => void; label?: string }
): FormField => {
  const __data = data?.data ? data?.data : data;
  const _value = getNestedValue(__data, fieldId);
  const value =
    _value == undefined || _value == null || _value == ""
      ? ""
      : _value == 0
      ? "0"
      : _value || "";
  const validation = getNestedValue(data?.validations, fieldId);
  const checked =
    getNestedValue(data?.data ? data?.data : data, fieldId) || false;
  const _label =
    options?.label ||
    t(
      lowercaseAndAddUnderscore(
        fieldId?.split(".").pop()?.replace(/_/g, " ") || ""
      )
    );

  return {
    id: fieldId,
    data: data?.data ? data?.data : data,
    value,
    validation,
    checked,
    onChangeData: options?.onChangeData
      ? (event: any) => options.onChangeData?.(event.target.value)
      : (eventData: any) => {
          const nestedValue = getNestedValue(eventData, fieldId);
          console.log("fieldId:", fieldId);
          console.log("eventData:", eventData);
          console.log("nestedValue:", nestedValue);
          handleFieldChange(fieldId, nestedValue);
        },
    label: _label,
  };
};
