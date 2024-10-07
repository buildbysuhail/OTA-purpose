import { useTranslation } from "react-i18next";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

import { useLocation } from "react-router-dom";
import {
  getCurrentCurrencySymbol,
} from "../../utilities/Utils";
import ERPElementValidationMessage from "./erp-element-validation-message";
import {
  useAppDispatch,
} from "../../utilities/hooks/useAppDispatch";
import { APIClient } from "../../helpers/api-client";
interface ERPDataComboboxProps {
  id: string;
  label?: string;
  options?: any[];
  excludeOptions?: any[];
  includeOptions?: any[];
  value?: any;
  defaultValue?: any;
  handleChange?: (id: string, value: any) => void;
  handleChangeData?: (id: string, value: any) => void;
  onChangeData?: (data: any) => void;
  onChange?: (value: any) => void;
  onSelectItem?: (item?: any) => void;
  field?: any;
  defaultData?: any;
  data?: any;
  required?: boolean;
  className?: string;
  noLabel?: boolean;
  multiple?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  initialValue?: any;
  isPaginated?: boolean;
  disabledApiCall?: boolean;
  validation?: string;
}

export const getOptions = (data: any, keyLabel: string, keyValue: string) => {
  let getter = keyLabel?.split(".");
  if (data?.length > 0) {
    let options;
    if (getter?.length > 1) {
      options = data?.map((item: any) => ({
        label: item?.[getter[0]]?.[getter[1]],
        value: item?.[keyValue],
        is_active: item?.is_active,
      }));
    } else {
      console.log('data:' + data);
      
      options = data?.map((item: any) => ({
        label: item?.[keyLabel],
        value: item?.[keyValue],
        is_active: item?.is_active,
      }));
    }
    return options || [];
  }
};
const api = new APIClient();
export default function ERPDataCombobox({
  id,
  label,
  handleChange,
  handleChangeData,
  onChange,
  onChangeData,
  onSelectItem,
  options,
  field,
  defaultData,
  defaultValue,
  data,
  noLabel,
  required,
  excludeOptions,
  includeOptions,
  multiple,
  autoFocus,
  disabled = false,
  initialValue,
  className,
  isPaginated = false,
  disabledApiCall = false,
  validation
}: ERPDataComboboxProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const comboboxRef = useRef<any>(null);
  const currencySymbol = getCurrentCurrencySymbol();

  const [query, setQuery] = useState("");
  const [localValue, setLocalValue] = useState<any>();
  const [items, setItems] = useState<any>([]);
  const [loading, setLoading] = useState<any>([]);
  const [hasValue, setHasValue] = useState<boolean>(false);
  const [initial, setInitial] = useState<any>(initialValue);
  useEffect(() => {
    
    if (!disabledApiCall) {
      loadData();
    }
  }, []);
  const loadData = async () => {
    
    setLoading(true);
    
    let _items = options ? options : await api.getAsync(field?.getListUrl,field?.params ? field?.params: '' );

    
    let _options = getOptions(_items, field?.labelKey ?? 'label', field?.valueKey ??'value') || [];

    _options = _options?.filter(
      (option: any) => !excludeOptions?.includes(option?.value)
    );
    _options = includeOptions ? [...includeOptions, ..._options] : _options;

    const filteredPeople =
      query === ""
        ? _options
        : _options?.filter((person: any) =>
            person?.label
              ?.toLowerCase()
              ?.replace(/\s+/g, "")
              ?.includes(query?.toLowerCase()?.replace(/\s+/g, ""))
          );
          setItems(
            filteredPeople != undefined && filteredPeople != null
              ? filteredPeople
              : []
          );
          setLoading(false);
  };

  let _default = null;
  let _exceptional = null;
  let _selected = null;
  const iLabel = label || id?.replaceAll("_", " ");
  useEffect(() => {
    const iLabel = label || id?.replaceAll("_", " ");
    const fieldKey = field?.id?.replaceAll("_id", "");
    const defaultValueKey = defaultData?.[fieldKey]?.[field?.valueKey];

    let value = field?.labelKey
      ? defaultData?.[field?.id]?.[field?.labelKey]
      : defaultData?.[field?.id];
    if (data !== undefined && data?.[field?.id] !== undefined) {
      value = data?.[field?.id] === undefined ? value : localValue?.label;
    }

    _default = items?.find(
      (option: any) => option?.value === defaultValueKey
    );
    _selected = items?.find(
      (option: any) => option?.value === data?.[field?.id]
    );

    _exceptional =
      (defaultData && fieldKey === "payment_terms" && items[0]) ||
      fieldKey === "currency";
      setInitial(_selected || _default || _exceptional || initialValue || "")
  }, [items]);

  useEffect(() => {
    if (defaultData) {
      initial && initial != '' && setHasValue(true);
    }
  }, [defaultData]);

  const clearSelection = (e?: any) => {
    e?.stopPropagation();
    setQuery("");
    setHasValue(false);
    comboboxRef.current.value = "";
    handleChange && handleChange(field?.id, "");
    onChange && onChange("");
  };

  // =================== Disable field based on data =============
  const disableCombobox = () => {
    if (
      pathname?.includes("/accountant/chart_of_accounts") &&
      field?.id == "currency_id" &&
      defaultData?.has_transactions
    )
      return true;
    return disabled;
  };

  return (
    <div className="relative">
      {/* <ERPModelForm formFields={field?.formFields} show={showForm} onClose={() => setShowForm(false)} title={iLabel} /> */}
      <Combobox
      key={id}
        disabled={disableCombobox()}
        value={initial}
        onChange={(value) => {
          
          setInitial(value)
          onChange && onChange(value);
          onChangeData &&
            value &&
            data &&
            onChangeData({ ...data, [id]: value?.value });
          handleChange && handleChange(field?.id, value?.value);
          handleChangeData && handleChangeData(field?.id, value?.value);
          onSelectItem?.(
            items?.find((val: any) => val?.[field?.valueKey] == value?.value)
          );
          setHasValue(true);
        }}
      >
        <div className="relative">
          <div className={className}>
            <ComboboxButton
              type="button"
              className="w-full inset-y-0 top-[30px] right-0 flex items-center"
            >
              <div className=" relative flex flex-col w-full">
                {!noLabel && (
                  <label className="text-left rtl:text-right capitalize mb-1 block text-xs text-black">
                    {iLabel}
                    {field?.required && "*"}
                  </label>
                )}
                <ComboboxInput
                  multiple={multiple}
                  className={`w-full appearance-none rounded border border-gray-300 h-9 ${
                    disableCombobox()
                      ? "text-gray-400 "
                      : "bg-white text-gray-900"
                  }  px-3 py-2  placeholder-gray-400 focus:ring-1 text-xs focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500`}
                  displayValue={(person: any) => person?.label}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t("select") + " " + iLabel}
                  required={field?.required}
                  autoComplete="off"
                  spellCheck={false}
                  onKeyDown={(e: any) => {
                    console.log(`ERPDataCombobox,  : e `, e);
                    console.log(`ERPDataCombobox,  : e `, e.target.value);
                  }}
                  //   autoComplete={false}
                  autoFocus={autoFocus}
                  ref={comboboxRef}
                />
              </div>
              <div
                className={`flex absolute ${
                  !disabled && "bg-white/50 backdrop-blur-sm"
                }  right-2 ${
                  noLabel ? "top-[8px]" : "top-[28px]"
                } gap-2 justify-between items-center`}
              >
                {field?.hasCloseButton && hasValue && (
                  <XMarkIcon
                    className="h-5 aspect-square text-gray-400 hover:text-gray-500"
                    aria-hidden="true"
                    onClick={clearSelection}
                  />
                )}
                <div className="border-l-2 pr-1 pl-2 group bg-white">
                  <ChevronDownIcon
                    className="h-5 aspect-square text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </ComboboxButton>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <ComboboxOptions className="absolute z-50 mt-2 max-h-60 min-w-full w-fit overflow-auto rounded-md bg-white  text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {loading &&
              items?.length === 0 &&
              query !== "" ? (
                loading ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Loading...
                  </div>
                ) : (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    No data found
                  </div>
                )
              ) : items?.length === 0 ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  No data found
                </div>
              ) : (
                items?.map((person: any, index: number) => (
                  <ComboboxOption
                    key={`cb_${person?.value}-${index}`}
                    className={({ active }) =>
                      `${
                        person?.is_active == false ? "hidden" : "relative"
                      } cursor-pointer select-none py-2  pl-10 pr-4 ${
                        active ? "bg-primary text-white" : "text-gray-900"
                      }`
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {person?.label}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-accent"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </ComboboxOption>
                ))
              )}
              <div className="flex justify-center gap-5 sticky bottom-0 bg-white">
                {/* {field?.formFields?.length > 0 && (
                  <div
                    onClick={() => showForm(iLabel, field?.getListUrl, field?.formFields, undefined, field?.postUrl)}
                    className="p-2 w-full hover:bg-gray-100 text-accent text-center cursor-pointer border-t "
                  >
                    <a>Create {iLabel}</a>
                  </div>
                )} */}
              </div>
            </ComboboxOptions>
          </Transition>
        </div>
      </Combobox>
      <ERPElementValidationMessage
        validation={validation}
      ></ERPElementValidationMessage>
    </div>
  );
}
