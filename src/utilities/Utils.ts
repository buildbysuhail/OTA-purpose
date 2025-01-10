import dayjs from "dayjs";
import { ToWords } from "to-words";
import { useSelector } from "react-redux";
import { capitalize } from "@mui/material";
import ERPToast from "../components/ERPComponents/erp-toast";
import { thisYear } from "../utilities/ERPDateFilterData";
import { RootState } from "../redux/store";
import { AppState } from "../redux/slices/app/types";
import moment from "moment";

export function capitalizeFirstLetter(text: string) {
  return text.charAt(0)?.toUpperCase() + text.slice(1);
}

export function camelize(str: string) {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

/**
 * Capitalizes the first letter of a string and adds a space before each capital letter (except the first).
 * @param input - The input string to transform.
 * @returns A transformed string with the first letter capitalized and spaces before each subsequent capital letter.
 */
export const capitalizeAndAddSpace = (input: string): string => {
  if (!input) return '';

  // Capitalize the first letter of the string
  const capitalized = input.charAt(0).toUpperCase() + input.slice(1);

  // Add space before each subsequent capital letter (except the first)
  const result = capitalized.replace(/([A-Z])/g, ' $1').trim();

  return result;
}
export const lowercaseAndAddUnderscore = (input: string): string => {
  if (!input) return '';

  // Add underscores before each uppercase letter and convert the entire string to lowercase
  const result = input.replace(/([A-Z])/g, '_$1').toLowerCase();

  // Remove the leading underscore, if present
  const ret = result.startsWith('_') ? result.slice(1) : result;
  return ret;
};
/**
 * Removes spaces and capitalizes the first letter of each word (after the first word), converting to camelCase.
 * @param input - The input string to transform.
 * @returns A camelCase or PascalCase string with no spaces.
 */
export const removeSpacesAndCapitalize = (input: string): string => {
  if (!input) return '';

  return input
    .split(' ') // Split the string by spaces
    .map((word, index) => {
      // Capitalize first letter of each word, except the first one
      return index === 0
        ? word.toLowerCase() // Keep the first word lowercase for camelCase
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(''); // Join the words back together without spaces
}

export const Decode = (token: string) => {
  var base64Url = token?.split(".")[1];
  var base64 = base64Url?.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

export const setNestedValue = (obj: any, path: string, value: any) => {
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
export const bytesToSize = (bytes: number) => {
  const kilobyte = 1024;
  const megabyte = kilobyte * 1024;

  if (bytes < kilobyte) {
    return bytes + " B";
  } else if (bytes < megabyte) {
    return (bytes / kilobyte).toFixed(2) + " KB";
  } else {
    return (bytes / megabyte).toFixed(2) + " MB";
  }
};

export const NumberConverter = (number: number) => {
  function digits(number: number, count = 0): any {
    if (number) {
      return digits(Math.floor(number / 10), ++count);
    }
    return count;
  }
  const digitCount = digits(number);
  if (digitCount === 4) {
    return number;
  }
  //  if(digitCount === 5){
  //   let output = number/1000
  //   return `${parseFloat(output).toFixed(1)}${" "}K`
  //  }
  if (digitCount === 5) {
    let output = number / 1000;
    return `${Math.round((output + Number.EPSILON) * 100) / 100}${" "}K`;
  }
  if (digitCount === 6) {
    let output = number / 100000;
    return `${Math.round((output + Number.EPSILON) * 100) / 100}${" "}Lakhs`;
  }
  if (digitCount === 7) {
    let output = number / 100000;
    return `${Math.round((output + Number.EPSILON) * 100) / 100}${" "}Lakhs`;
  }
  //  if(digitCount === 8){
  //   let output = number/10000000
  //   return `${Math.round((output + Number.EPSILON) * 100) / 100}${" "}Cr`
  //  }
};

export const DataToForm = (data: any) => {
  let formData = new FormData();
  for (var key in data) {
    formData.append(key, data[key]);
  }
  return formData;
};

export const DataToFormArray = (data: any) => {
  let formData = new FormData();
  for (var key in data) {
    if (Array.isArray(data[key])) {
      formData.append(key, JSON.stringify(data[key]));
    } else {
      if (data[key] !== null) {
        formData.append(key, data[key]);
      }
    }
  }
  return formData;
};

// OPTION LISTER
export const getOptions = (data: any, keyLabel: string) => {
  console.log(`Utils,  : get_options_data`, data);
  let getter = keyLabel?.split(".");
  if (data?.length > 0) {
    let options;
    if (getter?.length > 1) {
      options = data?.map((item: any) => ({
        label: item?.[getter[0]]?.[getter[1]],
        value: item?.id,
      }));
    } else {
      options = data?.map((item: any) => ({
        label: item?.[keyLabel],
        value: item?.id,
      }));
    }
    return options || [];
  }
};

// OPTION LISTER WITH IS_CASH
export const getOptionsWithIsCash = (data: any, keyLabel: string, booleanKey: string, bankKey?: any) => {
  let getter = keyLabel?.split(".");
  if (data?.length > 0) {
    let options;
    if (getter?.length > 1) {
      options = data?.map((item: any) => ({
        label: item?.[getter[0]]?.[getter[1]],
        value: item?.id,
        [booleanKey]: item?.[booleanKey],
        [bankKey]: item?.[bankKey],
      }));
    } else {
      options = data?.map((item: any) => ({
        label: item?.[keyLabel],
        value: item?.id,
        [booleanKey]: item?.[booleanKey],
        [bankKey]: item?.[bankKey],
      }));
    }
    return options || [];
  }
};

export const getPriceListOptions = (data: any, keyLabel: string, booleanKey: string) => {
  let getter = keyLabel?.split(".");
  if (data?.length > 0) {
    let options;
    if (getter?.length > 1) {
      options = data?.map((item: any) => ({
        label: item?.[getter[0]]?.[getter[1]],
        value: item?.id,
        [booleanKey]: item?.[booleanKey],
      }));
    } else {
      options = data?.map((item: any) => ({
        label: item?.[keyLabel],
        value: item?.id,
        [booleanKey]: item?.[booleanKey],
      }));
    }
    return options || [];
  }
};

// SUMMER
export const summer = (data: any, value: string) => {
  let sum = 0;
  data?.map((obj: any) => {
    // sum = sum + parseInt(obj?.[value]);
    if (obj?.[value] != "") {
      sum = sum + parseFloat(obj?.[value]);
    }
    // sum = sum + parseFloat(obj?.[value]);
  });
  return sum;
};

// DATE TRIMMER
export const dateTrimmer = (data: string) => {
  let date = data && new Date(data)?.toISOString().split("T")[0];
  return date;
};

// DATE FORMATTER
export const dateFormatter = (data: string) => {
  let date = dayjs(data).format("DD-MM-YYYY");
  return date;
};

/// GET FILE TYPE BY EXTENSION
const extension = /(?:\.([^.]+))?$/;
export const getFileType = (fileName: string) => {
  const ext = extension.exec(fileName)?.[1];
  if (ext === "pdf") {
    return "pdf";
  } else if (ext === "doc" || ext === "docx") {
    return "doc";
  } else if (ext === "xls" || ext === "xlsx") {
    return "xls";
  } else if (ext === "ppt" || ext === "pptx") {
    return "ppt";
  } else if (ext === "txt") {
    return "txt";
  } else if (ext === "zip" || ext === "rar") {
    return "zip";
  } else if (ext === "png" || ext === "jpg" || ext === "jpeg") {
    return "image";
  } else {
    return "file";
  }
};

export const interchangeArrayElements = (array: any, id1: any, id2: any) => {
  const getIndex = (id: string) => array.findIndex((item: any) => item.id === id);
  const isValidIndex = (index: number) => index !== -1;

  const index1 = getIndex(id1);
  const index2 = getIndex(id2);

  if (isValidIndex(index1) && isValidIndex(index2)) {
    [array[index1], array[index2]] = [array[index2], array[index1]];
  } else {
    console.error("Invalid IDs provided");
  }

  return array;
};

export const moveArrayElement = (array: any, from: number, to: number) => {
  const newArray = [...array];
  newArray.splice(to, 0, newArray.splice(from, 1)[0]);
  return newArray;
};

// GET FILE NAME FROM URL
export const getFileName = (url: string) => {
  return url?.replace(/^.*[\\\/]/, "") || "";
};

// PRINT ACTION
export const print = () => {
  // let printContents = document.getElementById("printablediv")?.innerHTML;
  // let originalContents = document.body.innerHTML;
  // document.body.innerHTML = printContents as any;
  window.print();
  // document.body.innerHTML = originalContents;
};

// export const getFormatedAccounts = (data: any) => {
//     const
//     return formatedData;
// }

// const getFormatedAccounts = (data: Array<any>) => {
//     const formatedItems: Array<any> = [];
//     const items = data?.forEach((item) => {
//       const parent = item;
//       const childrens = data?.filter((child: any) => child?.parent_node === parent?.node_id);
//       formatedItems.push(item);
//       formatedItems.push(...childrens);
//     });
//     return formatedItems;
// };

// const getChildAccounts = (data: Array<any>, parent: any) => {
//     const formatedItems: Array<any> = [];
//     data?.forEach((item) => {
//       const childrens = data?.filter((child: any) => child?.parent_node === parent?.node_id);
//       formatedItems.push(...childrens);
//     });
//     return formatedItems;
// }

// GET TITLE FROM STRING

export const getTitleName = (string: any) => {
  let newString = string?.replaceAll("_", " ");
  let capitalized = newString
    ?.split(" ")
    ?.map((obj: any) => {
      return obj?.charAt(0).toUpperCase() + obj?.slice(1);
    })
    .join(" ");
  return capitalized;
};

// Warning Message
export const warning = () => {
  ERPToast.showWith("Sorry! This feature is not ready to use. Please try later", "warning");
};

// Get User Currency symbol
export const getCurrentCurrencySymbol = () => {
  const profileState = useSelector((state: RootState) => state.UserSession);
  return profileState.currencySymbol;
};

// Find Nearest Number
export const findNearestNumber = (target: number, num1: number, num2: number, num3?: number) => {
  let differences = [Math.abs(target - num1), Math.abs(target - num2)];
  if (num3) {
    differences = [Math.abs(target - num1), Math.abs(target - num2), Math.abs(target - num3)];
  }
  const minDifference = Math.min(...differences);
  if (minDifference === Math.abs(target - num1)) {
    return num1;
  } else if (minDifference === Math.abs(target - num2)) {
    return num2;
  } else {
    return num3;
  }
};

export const getAmountInWords = (amount: number, currency?: string) => {
  let currencyOptions;
  switch (currency) {
    case "$":
      currencyOptions = {
        name: "Dollar",
        plural: "Dollar",
        symbol: "$",
        fractionalUnit: {
          name: "Cent",
          plural: "Cents",
          symbol: "",
        },
      };
      break;
    case "KWD":
      currencyOptions = {
        name: "Kuwaiti Dinar",
        plural: "Kuwaiti Dinar",
        symbol: "KWD",
        fractionalUnit: {
          name: "Fils",
          plural: "Fils",
          symbol: "",
        },
      };
      break;
    case "QAR":
      currencyOptions = {
        name: "Qatari Rial",
        plural: "Qatari Rial",
        symbol: "$",
        fractionalUnit: {
          name: "Dirham",
          plural: "Dirham",
          symbol: "",
        },
      };
      break;
    case "OMR":
      currencyOptions = {
        name: "Rial Omani",
        plural: "Rial Omani",
        symbol: "$",
        fractionalUnit: {
          name: "Baisa",
          plural: "Baisa",
          symbol: "",
        },
      };
      break;
    case "BHD":
      currencyOptions = {
        name: "Bahraini Dinar",
        plural: "Bahraini Dinar",
        symbol: "$",
        fractionalUnit: {
          name: "Fils",
          plural: "Fils",
          symbol: "",
        },
      };
      break;
    case "AED":
      currencyOptions = {
        name: "UAE Dirham",
        plural: "UAE Dirham",
        symbol: "$",
        fractionalUnit: {
          name: "Fils",
          plural: "Fils",
          symbol: "",
        },
      };
      break;
    default:
      currencyOptions = {
        name: "Saudi riyal",
        plural: "Saudi riyal",
        symbol: "SAR",
        fractionalUnit: {
          name: "Halala",
          plural: "Halalas",
          symbol: "هللة",
        },
      };
  }

  const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: currencyOptions,
    },
  });
  const words = toWords.convert(amount);
  return words;
};

export const SetDefaultFields = (data_1?: any, data_2?: any, id?: any) => {
  const paymentModeCash = data_1?.find((item: any) => item?.is_cash === true);

  let defaultFields: any = {};
  if (id == "default_currency") {
    defaultFields = { ...defaultFields, [id]: data_1[0]?.currency?.id };
  }

  if (id == "payment_mode_id") {
    defaultFields = { ...defaultFields, [id]: paymentModeCash?.id };
  }
  if (id == "deposit_to_account") {
    defaultFields = { ...defaultFields, [id]: data_2 };
  }
  return defaultFields;
};

export const setUpDefaultEmailDatas = (params: any, profile: any, preference?: any) => {
  let isStatement = params?.get("voucher_type") == "customer_statement" || params?.get("voucher_type") == "vendor_statement";
  let data: any = {};
  if (params?.get("has_statement") == "true") {
    data = {
      ...data,
      is_include_statement: preference?.pdf_attachment ? "yes" : "no",
      date_from: params?.get("date_from"),
      date_to: params?.get("date_to"),
      statement_name: `statement_${profile?.data?.company_display_name}`,
    };
  }
  if (!isStatement) {
    data = { ...data, is_include_pdf: preference?.pdf_attachment ? "yes" : "no", voucher_pdf_name: params?.get("voucher_name") };
  }
  if (params?.get("voucher_type") == "sales_invoice") {
    let startDate = thisYear?.split("&")[0]?.split("=")[1];
    let endDate = thisYear?.split("&")[1]?.split("=")[1];
    if (startDate && endDate) {
      data = { ...data, date_from: startDate, date_to: endDate };
    }
  }
  return data;
};

export const ReduceFields = (formFields: any[], keysToRemove: string[], is_registered: boolean, hasPriceList?: boolean) => {
  ////////////////////////// Removing Fields with Keys ////////////////////////
  const filteredForms = (fields: any) => {
    return fields?.filter((field: any) => !keysToRemove?.includes(field?.id));
  };
  let updatedFormFields = formFields?.map((item: any) => {
    if (item?.fieldItems) {
      return {
        ...item,
        fieldItems: filteredForms(item?.fieldItems),
      };
    }
  });

  let fieldsWithoutPricelist = formFields?.map((item: any) => {
    if (item?.fieldItems) {
      return {
        ...item,
        fieldItems: item?.fieldItems?.filter((field: any) => field?.id != "price_list"),
      };
    }
  });

  ////////////////////////////////////////////////////////////////////////////
  let fields: any;
  if (!hasPriceList) {
    fields = fieldsWithoutPricelist;
  } else if (is_registered == false) {
    fields = updatedFormFields;
  } else {
    fields = formFields;
  }
  return fields;
};

export const getBillableCustomers = (customers: any, bilableItems: any) => {
  const billableCustomer = bilableItems?.map((item: any) => item?.customer && item?.customer?.id);
  let allBillableCustomers = customers
    ?.filter((customer: any) => {
      return billableCustomer?.includes(customer?.id);
    })
    ?.map((item: any) => {
      return { label: item?.company_display_name, value: item?.id };
    });
  return allBillableCustomers;
};

export const getItemRate = (data: any, pathName: any) => {
  let itemRate: any;
  switch (pathName) {
    case "/salesorder/to_purchaseorder":
      itemRate = parseFloat(data?.item?.default_purchase_price);
      break;
    case "/bills/to_invoice":
      itemRate = parseFloat(data?.mark_up_amount);
      break;
    default:
      itemRate = parseFloat(data?.item_rate);
      break;
  }
  return itemRate;
};

export const identifyDateFormat = (dateString: string) => {
  const formats = [
      "DD-MM-YYYY",
      "MM-DD-YYYY",
      "YYYY-MM-DD",
      "DD/MM/YYYY",
      "MM/DD/YYYY",
      "YYYY/MM/DD",
      "DD.MM.YYYY",
      "YYYY.MM.DD",
      "DD MMM YYYY",
      "MMM DD, YYYY",
      "YYYY MMM DD"
  ];

  for (const format of formats) {
      if (moment(dateString, format, true).isValid()) {
          return format;
      }
  }

  return "Unknown format";
}
export const getVoucherNameFromPath = (path: string) => {
  let voucherName: any;
  const index = path?.lastIndexOf("/");
  const lastPath = path?.substring(index + 1, path?.length);
  let isLastLetterS = lastPath?.charAt(lastPath?.length - 1);
  let indexOfS = lastPath?.lastIndexOf("s");
  if (isLastLetterS == "s" && indexOfS) {
    voucherName = lastPath?.substring(0, indexOfS);
  } else {
    voucherName = lastPath;
  }
  return getTitleName(voucherName);
};

export const isDiscountTypeTransactionLevel = (data: any, defaultData: any) => {
  if (data?.discount_type) {
    return data?.discount_type == "TRANSACTION_LEVEL" ? true : false;
  }
  if (defaultData?.discount_type) {
    return defaultData?.discount_type == "TRANSACTION_LEVEL" ? true : false;
  }
};

/**
 * Inserts  array elements at the start of source array, and returns the updated source array.
 * @param A Source array
 * @param B Array Object to insert first
 * @param a_field_key Key of the source array elements
 * @param b_field_key Key of the insert array elements
 * @returns Updated source array
 * @example
 *
 * let A = [{key:1},{key:2},{key:3},{key:4},{key:6},{key:7}]
 * let B = [{field:3},{field:7},{field:4}]
 * output = [{key:3},{key:7},{key:4},{key:1},{key:2},{key:6}]
 *
 */

export const customUnShift = (A: any[], B: any[], a_field_key: string, b_field_key: string) => {
  const resultArray = B?.map((itemB) => {
    const key = itemB?.[b_field_key];
    const foundItem = A?.find((itemA) => itemA?.[a_field_key] === key);
    return foundItem;
  }).filter(Boolean);

  A?.forEach((item) => {
    if (!B?.find((itemB) => itemB?.[b_field_key] === item?.[a_field_key])) resultArray?.push(item);
  });

  return resultArray;
};

export const isFile = (obj: any): obj is File => {
  return obj instanceof File;
};
export function isNullOrUndefinedOrEmpty(value: any): boolean {
  return value === undefined || value === null || value === '';
}
export function isNullOrUndefinedOrZero(value: any): boolean {
  return value === undefined || value === null || value === '' || value === 0;
}
export function hasValue(value: any): boolean {
  return value !== undefined && value !== null && value !== '' && value !== 0;
}
export const setFgAccordingToBgPrimary = () => {
  // Create a temporary element to determine the color of bgPrimary
  const tempElement = document.createElement('div');
  tempElement.className = 'bg-primary';
  document.body.appendChild(tempElement);
  const bgColor = window.getComputedStyle(tempElement).backgroundColor;
  document.body.removeChild(tempElement);

  // Check if the background color is close to white
  const isW = isLightColor(bgColor);
  const dfdfd= isW === true ? 'text-gray-900' : 'text-white';
  return dfdfd;
};
// Function to calculate the luminance of a color
const calculateLuminance = (r:number, g:number, b:number) => {
  const normalize = (value: any) => {
    value /= 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  };

  const rNorm = normalize(r);
  const gNorm = normalize(g);
  const bNorm = normalize(b);

  // Luminance formula
  return 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm;
};

// Function to check if a color is "light" based on luminance
const isLightColor = (bgColor: any) => {
  const rgbMatch = bgColor.match(/\d+/g);
  if (rgbMatch && rgbMatch.length >= 3) {
    const [r, g, b] = rgbMatch.map(Number);
    const luminance = calculateLuminance(r, g, b);
    return luminance > 0.5; // Threshold for "lightness"
  }
  return false;
};

export const mergeObjectsRemovingIdenticalKeys = <T extends object, U extends Record<string, any>>(
  obj1: T,
  obj2: U
): T & U => {

if(obj1 == undefined || obj2 == undefined) {
  if(obj1 == undefined && obj2 != undefined) {
    const out2 = { ...obj2 } as T & U;
    return out2;
  } 
  if(obj2 == undefined && obj1 != undefined) {
    const out1 = { ...obj1 } as T & U;
    return out1;
  } 
  if(obj2 == undefined && obj2 == undefined) {
    const out1 = { } as T & U;
    return out1;
  }
}
  // Filter out keys with identical values
  const filteredObj2 = Object.fromEntries(
    obj2 !== undefined && obj2 !== null ?Object.entries(obj2).filter(([key, value]) =>key !==undefined && key !== null && obj1[key as keyof T] !== value) :obj1 !== undefined && obj1 !== null ?Object.entries(obj1):[]
  ) as Partial<U>; // Explicitly cast as Partial<U>

  // Merge the objects and cast to T & U
  const out = { ...obj1, ...filteredObj2 } as T & U;
  return out;
};
