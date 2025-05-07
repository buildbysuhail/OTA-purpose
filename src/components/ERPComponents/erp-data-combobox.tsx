"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  memo,
  cloneElement,
  useMemo,
} from "react";
import { Combobox } from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import { FixedSizeList as List } from "react-window";
import { APIClient } from "../../helpers/api-client";
import {
  getApLocalData,
  setFgAccordingToBgPrimary,
} from "../../utilities/Utils";
import { useAppSelector } from "../../utilities/hooks/useAppDispatch";
import { RootState } from "../../redux/store";
import {
  Autocomplete,
  CircularProgress,
  TextField,
  Theme,
  SxProps,
  Typography,
  AutocompleteValue,
  AutocompleteChangeReason,
  AutocompleteChangeDetails,
  Paper,
} from "@mui/material";
import { createPortal, unstable_batchedUpdates } from "react-dom";
import { styled } from "@mui/system";
import ERPElementValidationMessage from "./erp-element-validation-message";
import { inputBox } from "../../redux/slices/app/types";
import { useDispatch } from "react-redux";
import { setData } from "../../redux/slices/data/reducer";
import localData from "../../enums/local-datas";
import CachedUrls from "../../redux/cached-urls";
import ERPButton from "./erp-button";
import ERPModal from "./erp-modal";

interface Option {
  value: any;
  label: string;
  is_active?: boolean;
  name?: string;
}

interface ERPDataComboboxProps {
  id: string;
  label?: string;
  options?: any[];
  excludeOptions?: any[];
  includeOptions?: any[];
  info?: string;
  defaultValue?: any;
  handleChange?: (id: string, value: any) => void;
  handleChangeData?: (id: string, value: any) => void;
  onChangeData?: (data: any) => void;
  onChange?: (value: any) => void;
  onTextChange?: (value: any) => void;
  onSelectItem?: (item?: any) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disableEnterNavigation?: boolean;
  onKeyDown?: (e: any) => void;
  onKeyUp?: (e: any) => void;
  field?: {
    id?: string;
    getListUrl?: string;
    getListUrlDynamic?: (value: any) => string;
    valueKey?: string;
    nameKey?: string;
    labelKey?: string;
    freezeDataLoad?: boolean | false;
    params?: any;
    required?: boolean;
  };
  defaultData?: any;
  data?: any;
  value?: any;
  labelDirection?: "horizontal" | "vertical";
  reload?: boolean;
  changeReload?: (action: boolean) => void;
  required?: boolean;
  className?: string;
  labelInfo?: any;
  labelInfoProps?: any;
  noLabel?: boolean;
  noXMarkIcon?: boolean;
  triggerEffect?: boolean;
  multiple?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  initialValue?: any;
  initialInputValue?: string;
  isPaginated?: boolean;
  isInModal?: boolean;
  disabledApiCall?: boolean;
  validation?: string;
  enableClearOption?: boolean;
  skip?: boolean;
  jumpTo?: string;
  jumpTarget?: string;
  customSize?: "sm" | "md" | "lg" | "customize";
  useMUI?: boolean;
  variant?: "filled" | "outlined" | "standard" | "normal";
  localInputBox?: inputBox; // Local styling preferences
  name?: any; 
  addNewOption?:boolean;
  addNewOptionCobonent?:{
    popupAction?:any;
    isOpen: boolean;
    title: string;
    width?: number;
    height?:number;
    isForm?: boolean;
    closeModal: () => void;
    content?: any;
  };
}

interface RowProps {
  data: {
    customSize: "sm" | "md" | "lg" | "customize" | undefined;
    items: Option[];
    selectedValue: Option | null;
    handleSelect: (item: Option) => void;
    activeIndex: number;
  };
  index: number;
  style: React.CSSProperties;
}

const ITEMS_PER_PAGE = 50;
const ITEM_HEIGHT = 36;
const LIST_HEIGHT = 300;
const api = new APIClient();

const getNestedValue = (item: any, path: string) => {
  const keys = path?.split(".");
  return keys?.reduce((obj, key) => obj?.[key], item);
};

const mapItemsToOptions = (
  items: any[],
  labelKey: string,
  valueKey: string,
  nameKey: string
): Option[] => {
  const itemsArray = Array.isArray(items) ? items : Object.values(items);
return itemsArray.map((item: any) => ({
  label: getNestedValue(item, labelKey) || "",
  value: getNestedValue(item, valueKey) || "",
  name: getNestedValue(item, nameKey) || "",
  is_active: item?.is_active,
}));
};

const getSizeClasses = (
  customSize?: "sm" | "md" | "lg" | "customize",
  appState?: any
) => {
  switch (customSize) {
    case "sm":
      return {
        input: "h-7 text-xs px-2",
        label: "text-[10px]",
        options: "text-xs",
        icons: "h-4 w-4",
      };
    case "lg":
      return {
        input: "h-11 text-sm px-4",
        label: "text-[14px]",
        options: "text-sm",
        icons: "h-6 w-6",
      };
    case "md":
      return {
        input: "h-9 text-xs px-3",
        label: "text-[12px]",
        options: "text-xs",
        icons: "h-5 w-5",
      };
    case "customize":
      return {
        input: "h-9 text-xs px-3",
        label: "text-[12px]",
        options: "text-xs",
        icons: "h-5 w-5",
      };
    default:
      return {
        input: "h-9 text-xs px-3",
        label: "text-[12px]",
        options: "text-xs",
        icons: "h-5 w-5",
      };
  }
};

const Row = ({
  data,
  index,
  style,
}: RowProps & { customSize?: "sm" | "md" | "lg" | "customize" }) => {
  const { items, selectedValue, handleSelect, activeIndex} = data;
  const item = items[index];
  const isSelected = selectedValue?.value === item.value;
  const isActive = activeIndex === index;
  const sizeClasses = getSizeClasses(data.customSize);
  const isAddNew = item.value === "__add_new__";
  const appState = useAppSelector(
    (state: RootState) => state.AppState?.appState
  );
  
  return (
    <Combobox.Option
      style={style}
      key={`${item?.value}-${index}`}
      className={({ active }) => {
        const hoverTextClass = "hover:text-dark"; // Explicit hover text color
        const hoverBgClass =
          appState.mode === "dark"
            ? "hover:bg-[#ffffff1f]"
            : "hover:bg-gray-300"; // Explicit hover background color
        const dynamicHoverClass = `hover:${setFgAccordingToBgPrimary()}`; // Ensure this returns a valid Tailwind class

        return `relative cursor-pointer select-none w-full rounded-sm
                ${hoverBgClass} ${hoverTextClass}
                ${
                  active || isActive
                    ? "bg-primary text-white"
                    : item.is_active === false
                    ? "bg-gray-200 text-gray-400"
                    : "text-gray-900"
                }
                ${sizeClasses?.options}`;
      }}
      value={item}
      disabled={!item.is_active}
    >
      {({ active }) => (
        <div
          className={`flex items-center px-3 py-2 ${
            isSelected ? "bg-primary" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleSelect(item);
          }}
        >
          <div className="flex-shrink-0 w-5 pe-[23px]">
            {isSelected && (
              <CheckIcon
                className={`${
                  sizeClasses?.icons
                } ${setFgAccordingToBgPrimary()}`}
                aria-hidden="true"
              />
            )}
          </div>
          <span
            className={`block truncate flex-grow ${
              isSelected ? "font-medium" : "font-normal"
            } ${isSelected ? setFgAccordingToBgPrimary() : ""}`}
          >
            {item.label}
          </span>
        </div>
      )}
    </Combobox.Option>
  )
};

const ComboboxList = React.forwardRef<
  List,
  {
    items: Option[];
    selectedValue: Option | null;
    onSelect: (item: Option) => void;
    activeIndex: number;
    customSize?: "sm" | "md" | "lg" | "customize";
  } & { appState: "rtl" | "ltr" }
>((props, ref) => {
  const { items, selectedValue, onSelect, activeIndex, customSize, appState,} =
    props;
  const itemData = {
    items,
    selectedValue,
    handleSelect: onSelect,
    activeIndex,
    customSize,

  };

  return (
    <List
      height={LIST_HEIGHT}
      itemCount={items?.length}
      itemSize={ITEM_HEIGHT}
      width="100%"
      ref={ref}
      itemData={itemData}
      className={`scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400`}
      style={{ direction: appState }}
    >
      {Row}
    </List>
  );
});

ComboboxList.displayName = "ComboboxList";
const logProps = (props: ERPDataComboboxProps, label: string) => {};

const propsAreEqual = (
  prevProps: ERPDataComboboxProps,
  nextProps: ERPDataComboboxProps
) => {
  const allKeys = Array.from(
    new Set([...Object.keys(prevProps), ...Object.keys(nextProps)])
  );

  for (const key of allKeys) {
    const prevValue = prevProps[key as keyof ERPDataComboboxProps];
    const nextValue = nextProps[key as keyof ERPDataComboboxProps];

    // Handle function comparisons
    if (typeof prevValue === "function" && typeof nextValue === "function") {
      if (prevValue !== nextValue) {
        return false;
      }
      continue;
    }

    // Handle array comparisons
    if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
      if (JSON.stringify(prevValue) !== JSON.stringify(nextValue)) {
        return false;
      }
      continue;
    }

    // Handle object comparisons
    if (
      typeof prevValue === "object" &&
      prevValue !== null &&
      typeof nextValue === "object" &&
      nextValue !== null
    ) {
      if (JSON.stringify(prevValue) !== JSON.stringify(nextValue)) {
        return false;
      }
      continue;
    }

    // Handle primitive comparisons
    if (prevValue !== nextValue) {
      return false;
    }
  }

  return true;
};

// Cache map for API requests

const ERPDataCombobox = forwardRef<HTMLInputElement, ERPDataComboboxProps>(
  (
    {
      id,
      label,
      handleChange,
      handleChangeData,
      onChange,
      onChangeData,
      onSelectItem,
      onFocus,
      onBlur,
      onKeyDown,
      onKeyUp,
      onTextChange,
      disableEnterNavigation,
      options,
      field,
      defaultData,
      data,
      value,
      noLabel,
      noXMarkIcon,
      required,
      excludeOptions,
      includeOptions,
      isInModal = true,
      multiple,
      autoFocus,
      disabled = false,
      reload = undefined,
      changeReload,
      labelDirection = "vertical",
      labelInfo,
      labelInfoProps,
      info,
      initialValue,
      initialInputValue,
      className,
      disabledApiCall = false,
      validation,
      skip,
      jumpTo,
      jumpTarget,
      enableClearOption = true,
      customSize,
      useMUI,
      variant,
      localInputBox, // Destructure localInputBox
      triggerEffect,
      addNewOption = false,
      addNewOptionCobonent

    }: ERPDataComboboxProps,
    ref
  ) => {
    const { t } = useTranslation("main");
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [items, setItems] = useState<Option[]>([]);
    const [loading, setLoading] = useState(false);
    const [initial, setInitial] = useState<Option | null>(initialValue);
    const [filteredItems, setFilteredItems] = useState<Option[]>([]);
    const [displayValue, setDisplayValue] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);
    const [inputValue, setInputValue] = useState(initialInputValue);
    const comboboxRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<List>(null);
    const componentRef = useRef<HTMLDivElement>(null);
    const appState = useAppSelector(
      (state: RootState) => state.AppState.appState
    );
    const reduxState = useAppSelector((state: RootState) => state.Data);
    const dispatch = useDispatch();
    // Use localInputBox if provided, otherwise fall back to global inputBox state
    const inputBoxState = localInputBox || appState?.inputBox;

    const [_customSize, setCustomSize] = useState(
      customSize ? customSize : inputBoxState?.inputSize
    );
    const [_useMUI, set_useMUI] = useState<boolean | undefined>(useMUI ??false);
    const [_variant, set_variant] = useState<
      "filled" | "outlined" | "standard" | undefined
    >(variant === "normal" ? undefined : variant);
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: any) => {
      setIsFocused(false);
      // setIsOpen(false);
      onBlur?.(e);
    };
    const [_reload, set_reload] = useState(reload);
    useEffect(() => {
      set_reload(reload);
    }, [reload]);
    useEffect(() => {
      const handleScroll = () => {
        if (isOpen && comboboxRef.current) {
          const rect = comboboxRef.current.getBoundingClientRect();
          const dropdown = document.querySelector(
            ".combobox-dropdown"
          ) as HTMLElement;
          if (dropdown) {
            dropdown.style.top = `${rect.bottom + window.scrollY}px`;
            dropdown.style.left = `${rect.left + window.scrollX}px`;
          }
        }
      };

      const scrollArea = document.querySelector(".content.main-index");
      scrollArea?.addEventListener("scroll", handleScroll);

      return () => {
        scrollArea?.removeEventListener("scroll", handleScroll);
      };
    }, [isOpen]);

    useEffect(() => {
      if (isOpen && initial && listRef.current) {
        const index = filteredItems.findIndex(
          (item) => item.value === initial.value
        );
        if (index !== -1) {
          // Scroll to the item after a slight delay to ensure list is rendered
          setTimeout(() => {
            listRef.current?.scrollToItem(index, "center");
            setActiveIndex(index);
          }, 10);
        }
      }
    }, [isOpen, initial, filteredItems]);

    useEffect(() => {
      if (customSize == undefined || customSize === null) {
        setCustomSize(inputBoxState?.inputSize);
      }
    }, [inputBoxState?.inputSize]);

    useEffect(() => {
      if (inputBoxState?.inputStyle !== "normal" && useMUI === undefined) {
        set_useMUI(true);
      } else if (
        inputBoxState?.inputStyle === "normal" &&
        useMUI === undefined
      ) {
        set_useMUI(false);
      }
    }, [inputBoxState?.inputStyle, useMUI]);

    useEffect(() => {
      if (
        inputBoxState?.inputStyle !== "normal" &&
        (variant === undefined || variant === null)
      ) {
        set_variant(
          inputBoxState?.inputStyle as "filled" | "outlined" | "standard"
        );
      } else if (inputBoxState?.inputStyle === "normal") {
        set_variant(undefined);
      } else {
        set_variant(variant as "filled" | "outlined" | "standard");
      }
    }, [inputBoxState?.inputStyle, variant]);

    const truncateText = (
      text: string,
      inputRef: React.RefObject<HTMLInputElement>
    ) => {
      if (!inputRef?.current || !text) return text;

      const tempSpan = document.createElement("span");
      tempSpan.style.visibility = "hidden";
      tempSpan.style.position = "absolute";
      tempSpan.style.whiteSpace = "nowrap";

      // Copy all relevant font properties
      const computedStyle = window.getComputedStyle(inputRef.current);
      tempSpan.style.font = computedStyle.font;
      tempSpan.style.fontFamily = computedStyle.fontFamily;
      tempSpan.style.fontSize = computedStyle.fontSize;
      tempSpan.style.fontWeight = computedStyle.fontWeight;
      tempSpan.style.letterSpacing = computedStyle.letterSpacing;

      document.body.appendChild(tempSpan);

      // Calculate available width considering padding and buttons
      const paddingLeft = parseInt(computedStyle?.paddingLeft) || 0;
      const paddingRight = parseInt(computedStyle?.paddingRight) || 0;
      // const buttonArea = enableClearOption ? 60 : 30; // Space for clear/dropdown buttons
      const availableWidth =
        inputRef.current.offsetWidth - paddingLeft - paddingRight;

      let truncated = text;
      tempSpan.textContent = truncated;

      // Linear truncation from end
      if (tempSpan.offsetWidth > availableWidth) {
        const ellipsis = "...";
        let maxLength = text.length - 1;

        while (maxLength > 0) {
          truncated = text.substring(0, maxLength) + ellipsis;
          tempSpan.textContent = truncated;

          if (tempSpan.offsetWidth <= availableWidth || maxLength === 1) {
            break;
          }
          maxLength--;
        }

        if (maxLength === 0) {
          truncated = ellipsis; // Edge case for very narrow inputs
        }
      }

      document.body.removeChild(tempSpan);
      return truncated;
    };

    useEffect(() => {
      if (initial?.label) {
        setDisplayValue(
          truncateText(
            initial?.label,
            (ref as React.RefObject<HTMLInputElement>) || comboboxRef
          )
        );
      } else {
        setDisplayValue("");
      }
    }, [initial]);

    const [borderStyles, setBorderStyles] = useState<string>(
      appState?.mode == "dark"
        ? isFocused == true || isHovered == true
          ? "#ffffff"
          : "#ffffff1a"
        : `${
            isFocused || isHovered
              ? `rgb(${inputBoxState?.borderFocus})`
              : `rgb(${inputBoxState?.borderColor})`
          } `
    );
    const [bgColor, setBgColor] = useState<string>(
      appState.mode == "dark"
        ? isFocused == true
          ? "#ffffff"
          : "#ffffff1a"
        : `${isFocused ? `rgb(${inputBoxState?.focusBgColor})` : ``} `
    );

    useEffect(() => {
      let border, bgCol;
      if (appState?.mode === "dark") {
        border = isFocused || isHovered ? "#ffffff" : "#ffffff1a";
        bgCol = isFocused ? "#313334" : "#ffffff1a";
      } else {
        border =
          isFocused || isHovered
            ? `rgb(${inputBoxState?.borderFocus})`
            : `rgb(${inputBoxState?.borderColor})`;
        bgCol = isFocused
          ? `rgb(${inputBoxState?.focusBgColor})`
          : inputBoxState?.inputBgColor
          ? `rgb(${inputBoxState?.inputBgColor})`
          : "";
      }
      setBorderStyles(border);
      setBgColor(bgCol);
    }, [
      appState.mode,
      isFocused,
      isHovered,
      inputBoxState?.borderColor,
      inputBoxState?.borderFocus,
      inputBoxState?.focusBgColor,
      inputBoxState?.defaultBgColor,
    ]);
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          componentRef.current &&
          !componentRef.current.contains(event.target as Node) &&
          !document
            .querySelector(".MuiAutocomplete-popper")
            ?.contains(event.target as Node) &&
          !document
            .querySelector(".combobox-dropdown")
            ?.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setActiveIndex(-1);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      if (_reload !== undefined && _reload !== true) {
        return;
      }
      if (!disabledApiCall && field?.freezeDataLoad !== true) {
        loadData();
      }
    }, [
      field?.getListUrl,
      field?.getListUrlDynamic,
      field?.params,
      field?.freezeDataLoad,
      _reload,
      disabledApiCall,
      // reduxState.costCentres,
      // reduxState.ledgers,
    ]);
    // useEffect(() => {
    //   if (value == -2) {
    //     loadData();
    //   }
    // }, [
    //   value
    // ]);
    const filterLedgers = async (
      ledgers: any[],
      queryString: string
    ): Promise<any[]> => {
      // Decrypt all names asynchronously
      const decryptedLedgers = await Promise.all(
        ledgers.map(async (x) => ({
          ...x,
          // name: await decryptAES(x.name),
        }))
      );
      if (!queryString) return decryptedLedgers;

      const queryParams = new URLSearchParams(queryString);

      // Return all ledgers if ledgerType is "All"
      if ((queryParams.get("ledgerType") as any) == 0) {
        return decryptedLedgers;
      } else {
      }

      const dsds = decryptedLedgers.filter((ledger) => {
        for (const [key, value] of queryParams.entries()) {
          if (
            key === "ledgerID" &&
            value !== " 0 " &&
            value !== "00" &&
            value !== "0" &&
            value !== "" &&
            value !== "" &&
            value !== null
          ) {
            if (ledger.id === undefined || String(ledger.id) !== value) {
              return false;
            }
          } else if (key === "ledgerType") {
            const ledgerTypes: number[] = Array.isArray(ledger.ledgerType)
              ? ledger.ledgerType
              : [];
            const valueAsNumber = Number(value);

            if (!ledgerTypes.includes(valueAsNumber)) {
              return false;
            }
          }
        }
        return true;
      });
      if (queryParams.get("ledgerID") === "00") {
        console.log(`"ledgerID") === "00"`);
        console.log(dsds);
      }
      return dsds;
    };

    const fetchData = useCallback(
      async (cacheEnabled: boolean = false) => {
        let params = "";
        if (
          field?.params != undefined &&
          Object.keys(field?.params).length > 0
        ) {
          params = new URLSearchParams(field?.params).toString();
        }
        const url = field?.getListUrlDynamic?.(data) || field?.getListUrl || "";
        if (cacheEnabled) {
          const promise = api
            .getWithCacheAsync(url, params)
            .then((_res) => {
              if (CachedUrls.some((cachedUrl) => url.includes(cachedUrl))) {
                localStorage.setItem(btoa(url), JSON.stringify(_res));
                return filterLedgers(_res, params);
              }
              return _res;
            })
            .finally(() => {
              // apiRequestCache.delete(cacheKey);
            });

          // apiRequestCache.set(cacheKey, promise);
          return promise;
        } else {
          const promise = api
            .getAsync(url, params)
            .then((_res) => {
              // 3. Update Redux After

              return _res;
            })
            .finally(() => {
              // apiRequestCache.delete(cacheKey);
            });

          // apiRequestCache.set(cacheKey, promise);
          return promise;
        }
      },
      [
        field?.params,
        field?.getListUrlDynamic,
        field?.getListUrl,
        dispatch,
        data,
      ]
    );

    const loadData = async () => {
      setLoading(true);
      try {
        let _items;

        // Check if data is available in Redux
        let _continue = true;
        let fetchWithCache = false;
        const url = field?.getListUrlDynamic?.(data) || field?.getListUrl || "";
        if (
          CachedUrls.some((cachedUrl) => url.includes(cachedUrl)) &&
          reload != true
        ) {
          fetchWithCache = true;
          const _lcl = getApLocalData(btoa(url));
          if (_lcl != null) {
            _items = await filterLedgers(_lcl, field?.params || "");
            _continue = false;
          }
        }
        if (_continue) {
          // Fetch data if not available in Redux
          if (options) {
            _items = options;
          } else {
            if (fetchWithCache) {
              _items = await fetchData(true);
            } else {
              _items = await fetchData();
            }
          }
        }
        const labelKey = field?.labelKey ?? "label";
        const valueKey = field?.valueKey ?? "value";
        const nameKey = field?.nameKey ?? "name";
        let _options = mapItemsToOptions(_items, labelKey, valueKey, nameKey);
        _options = _options?.filter(
          (option) => !excludeOptions?.includes(option.value)
        );
        _options = includeOptions ? [...includeOptions, ..._options] : _options;
        setItems(_options);
        setFilteredItems(_options);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        if (_reload === true) {
          changeReload && changeReload(false);
        }
        setLoading(false);
      }
    };

    const filterItems = useCallback(
      (searchQuery: string) => {
        if (!searchQuery.trim()) {
          setFilteredItems(items);
          return;
        }
        const words = searchQuery.toLowerCase().split(/\s+/);
        const filtered = items?.filter((item) => {
          if (!item?.label) return false;
          const itemLabel = item.label.toLowerCase();
          return words.every((word) => itemLabel.includes(word));
        });
        setFilteredItems(filtered || []);
      },
      [items]
    );
  


    useEffect(() => {
      filterItems(query);
    }, [query, filterItems]);

    const memoizedField = useMemo(() => field, [field?.id, field?.params]);
    const memoizedData = useMemo(() => data, [JSON.stringify(data)]);
    const memoizedItems = useMemo(() => items, [JSON.stringify(items)]);
    const memoizedFilteredItems = useMemo(
      () => filteredItems,
      [JSON.stringify(filteredItems)]
    );

      useEffect(() => {
        const fieldKey = field?.id?.replaceAll("_id", "");
        const defaultValueKey = getNestedValue(
          defaultData?.[fieldKey ?? ""],
          field?.valueKey ?? ""
        );
        let final: Option | null = null;
        // Handle value == -2 by selecting the first item if items are loaded
        if (value === -2 ) {
          if(items.length == 0) {
            return;
          }
          final = items[0]; // Select first item
          handleItemClick(final);
        } else {
          const _default = items?.find(
            (option) => option.value === defaultValueKey
          );
          const _selected = items?.find(
            (option) => option.value === (value ? value : data?.[field?.id ?? ""])
          );
          const _exceptional =
            (defaultData && fieldKey === "payment_terms" && items[0]) ||
            fieldKey === "currency";
          final = _selected || _default || _exceptional || initialValue || null;
        }
        if (
          (value === undefined || value === null) &&
          (data?.[field?.id ?? ""] === undefined || data?.[field?.id ?? ""] === null) &&
          value !== -2
        ) {
          setInitial(null);
          if (triggerEffect === true || value === null) {
            handleItemClick({ value: "", label: "" });
            setInputValue("");
          }
          setDisplayValue("");
        } else if (final !== initial && value !== -2) {
          setInitial(final);
          setInputValue(final?.label || "");
          setDisplayValue(final?.label ? truncateText(final.label, ref as React.RefObject<HTMLInputElement>) : "");
        }

        // Set activeIndex for keyboard navigation
        setActiveIndex(
          final != null
            ? filteredItems?.findIndex((item) => item.value === final.value)
            : -1
        );
      }, [
        memoizedItems,
        memoizedData,
        memoizedField,
        memoizedFilteredItems,
        value,
        // initial, // Added to check for changes
        // ref,
        // triggerEffect
      ]);
    const clearSelection = (e?: React.MouseEvent) => {
      handleItemClick({
        label: "",
        value: undefined,
        is_active: false,
        name: "",
      });
    };

    const handleItemClick = (value: Option ) => {
      setInitial(value);
      setIsOpen(false);
      setQuery("");
      setInputValue(value.label);
      setDisplayValue("");
      setFilteredItems(items); // Reset filtered items to original list
      onChange?.(value);
      if (onChangeData) {
        
        const updatedData = { ...data };
    
        if (value && data && id) {
          const keys = id.split(".");
          let current = updatedData;
    
          for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!current[key] || typeof current[key] !== "object") {
              current[key] = {}; // create nested object if not present
            }
            current = current[key];
          }
    
          current[keys[keys.length - 1]] = value.value;
        }
    
        onChangeData(updatedData);
      }
      // onChangeData &&
      //   onChangeData(value && data ? { ...data, [id]: value?.value } : {});
      handleChange?.(field?.id ?? "", value?.value);
      handleChangeData?.(field?.id ?? "", value?.value);
      onSelectItem?.(value);

      // Check if the selected option is the first one in the list
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value);
      setQuery(value);
      setIsOpen(true);
      if (!value.trim()) {
        setFilteredItems(items);
      }
      onTextChange && onTextChange(value)
    };

    const moveToNextInputField = (event: React.KeyboardEvent<any>) => {
      const formInputs = Array.from(
        document.querySelectorAll(
          "input:not([disabled]), select:not([disabled]), textarea:not([disabled])"
        )
      );

      const currentIndex = formInputs.indexOf(event.target as HTMLInputElement);

      // Handle jump-to logic
      const jumpToAttr = (event.target as HTMLElement).getAttribute(
        "data-jump-to"
      );
      if (jumpToAttr) {
        const jumpTargetElement = formInputs.find(
          (el) => el.getAttribute("data-jump-target") === jumpToAttr
        ) as HTMLElement;
        if (jumpTargetElement) {
          jumpTargetElement.focus();
          return;
        }
      }

      const isShiftKey = event.shiftKey;
      let nextIndex = isShiftKey ? currentIndex - 1 : currentIndex + 1;

      // Find next non-skipped input
      while (nextIndex >= 0 && nextIndex < formInputs.length) {
        const nextElement = formInputs[nextIndex] as HTMLElement;
        const skipAttr = nextElement.getAttribute("data-skip");
        if (skipAttr !== "true") {
          break;
        }
        nextIndex = isShiftKey ? nextIndex - 1 : nextIndex + 1;
      }

      // Focus next available input if found
      if (nextIndex >= 0 && nextIndex < formInputs.length) {
        (formInputs[nextIndex] as HTMLElement).focus();
      }
    };

    const handleAddNewClick = (e: React.MouseEvent) => {
      alert("Button clicked!");
      console.log("Add New button clicked"); // Debug log
      e.stopPropagation();
      e.preventDefault();
    
      if (addNewOptionCobonent?.popupAction) {
        console.log("Dispatching popup action"); // Debug log
        dispatch(addNewOptionCobonent.popupAction({ isOpen: true }));
      }
      setIsOpen(false);
    };

    // const handleAddNewClick = () => {
    //   debugger;
    //   if (addNewOptionCobonent && addNewOptionCobonent.popupAction) {
    //     dispatch(addNewOptionCobonent.popupAction({ isOpen: true, key: null, reload: false }));
    //     setIsOpen(false); // Close the dropdown
    //   }
    //   console.log("add new combo",addNewOptionCobonent);
    // };

    const handleCloseModal = (reload: boolean) => {
      if (addNewOptionCobonent) {
        addNewOptionCobonent.closeModal();
        if (reload) {
          loadData();
        }
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<any>) => {
      if (!isOpen) {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          setIsOpen(true);
          return;
        }
      }

      if (event.key === "Enter") {
        if (activeIndex >= 0 && activeIndex < filteredItems.length && isOpen) {
          event.preventDefault();
          handleItemClick(filteredItems[activeIndex]);
        } else {
          if (disableEnterNavigation) {
            if (onKeyDown != undefined) {
              onKeyDown ? onKeyDown(event) : undefined;
            }
          } else {
            moveToNextInputField(event);
          }
        }
        return;
      }

      if (filteredItems.length === 0) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setActiveIndex((prev) =>
            prev < filteredItems.length - 1 ? prev + 1 : prev
          );
          if (listRef.current) {
            listRef.current.scrollToItem(
              activeIndex + 1,
              activeIndex > filteredItems.length - 5 ? "end" : "center"
            );
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
          if (listRef.current) {
            listRef.current.scrollToItem(
              activeIndex - 1,
              activeIndex < 5 ? "start" : "center"
            );
          }
          break;
        case "Escape":
          setIsOpen(false);
          break;
        default:
          break;
      }
    };
    const sizeClasses = getSizeClasses(_customSize, inputBoxState);
    const getSizeStyles = () => {
      const styles: {
        mui: SxProps<Theme>;
        regular: {
          height: string;
          fontSize: string;
          padding: string;
          fontWeight?: number;
          color?: string;
          borderColor?: string;
        };
      } = {
        mui: {},
        regular: {
          height: "2.5rem",
          fontSize: "14px",
          padding: "0.5rem 1rem",
        },
      };
      const commonMuiStyles = {
        paddingBottom: _variant === "filled" ? "1rem" : "0",
        borderRadius: `${inputBoxState?.borderRadius ?? 5}px`,
        fontWeight: inputBoxState?.bold ? 700 : 400,
        color:
          appState?.mode == "dark"
            ? "#ffffff"
            : `rgb(${inputBoxState?.fontColor})`,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor:
            appState?.mode == "dark"
              ? "#ffffff1a"
              : `rgb(${inputBoxState?.borderColor})`,
        },
        "& .MuiFilledInput-underline, &:before": {
          borderBottomColor:
            appState?.mode == "dark"
              ? "#ffffff1a"
              : `rgb(${inputBoxState?.borderColor})`,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor:
            appState?.mode == "dark"
              ? "#ffffff"
              : `rgb(${inputBoxState?.borderFocus})`,
        },
        "&:hover .MuiFilledInput-underline, &:hover:before": {
          borderBottomColor:
            appState?.mode == "dark"
              ? "#ffffff"
              : `rgb(${inputBoxState?.borderFocus})`,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor:
            appState?.mode == "dark"
              ? "#ffffff"
              : `rgb(${inputBoxState?.borderFocus})`,
        },
        "&.Mui-focused .MuiFilledInput-underline, &.Mui-focused:before, &.Mui-focused:after":
          {
            borderBottomColor:
              appState?.mode == "dark"
                ? "#ffffff"
                : `rgb(${inputBoxState?.borderFocus})`,
          },
        margin: "0",
        "& .MuiOutlinedInput-input, & .MuiFilledInput-input, & .MuiInput-input":
          {
            padding: "0 0.75rem",
          },
      };

      switch (_customSize) {
        case "sm":
          return {
            mui: {
              "& .MuiInputBase-root": {
                height: _variant === "filled" ? "2.3rem" : "2rem",
                fontSize: "12px",
                ...commonMuiStyles,
              },
              "& .MuiInputLabel-root": {
                fontSize: "12px",
                color:
                  appState?.mode === "dark"
                    ? "rgb(225,224,224)"
                    : inputBoxState?.labelColor
                    ? `rgb(${inputBoxState?.labelColor})`
                    : "rgb(84,84,84)",
                transform:
                  _variant === "filled"
                    ? "translate(8px, 14px) scale(1)"
                    : _variant === "standard"
                    ? "translate(0, 10px) scale(1)"
                    : "translate(8px, 10px) scale(1)",
              },
              "& .MuiInputLabel-shrink": {
                transform:
                  _variant === "filled"
                    ? "translate(8px, -1px) scale(0.90)"
                    : _variant === "standard"
                    ? "translate(0, -6px) scale(0.90)"
                    : "translate(13px, -6px) scale(0.80)",
              },
            } as SxProps<Theme>,
            regular: {
              height: "1.4rem",
              fontSize: "12px",
              color:
                appState?.mode == "dark"
                  ? "#ffffff"
                  : `rgb(${inputBoxState?.fontColor})`,
            },
          };
        case "md":
          return {
            mui: {
              "& .MuiInputBase-root": {
                height: _variant === "filled" ? "2.8rem" : "2.5rem",
                fontSize: "15px",
                ...commonMuiStyles,
              },
              "& .MuiInputLabel-root": {
                fontSize: "13px",
                color:
                  appState?.mode === "dark"
                    ? "rgb(225,224,224)"
                    : inputBoxState?.labelColor
                    ? `rgb(${inputBoxState?.labelColor})`
                    : "rgb(84,84,84)",
                transform:
                  _variant === "filled"
                    ? "translate(10px, 18px) scale(1)"
                    : _variant === "standard"
                    ? "translate(0, 13px) scale(1)"
                    : "translate(10px, 13px) scale(1)",
              },
              "& .MuiInputLabel-shrink": {
                transform:
                  _variant === "filled"
                    ? "translate(8px, -1px) scale(0.90)"
                    : _variant === "standard"
                    ? "translate(0, -6px) scale(0.90)"
                    : "translate(12px, -8px) scale(0.90)",
              },
            } as SxProps<Theme>,
            regular: {
              height: "2rem",
              fontSize: "13px",
              color:
                appState?.mode == "dark"
                  ? "#ffffff"
                  : `rgb(${inputBoxState?.fontColor})`,
            },
          };
        case "lg":
          return {
            mui: {
              "& .MuiInputBase-root": {
                height: _variant === "filled" ? "3.3rem" : "3rem",
                fontSize: "16px",
                ...commonMuiStyles,
              },
              "& .MuiInputLabel-root": {
                fontSize: "14px",
                color:
                  appState?.mode === "dark"
                    ? "rgb(225,224,224)"
                    : inputBoxState?.labelColor
                    ? `rgb(${inputBoxState?.labelColor})`
                    : "rgb(84,84,84)",
                transform:
                  _variant === "filled"
                    ? "translate(10px, 21px) scale(1)"
                    : _variant === "standard"
                    ? "translate(0, 15px) scale(1)"
                    : "translate(10px, 15px) scale(1)",
              },
              "& .MuiInputLabel-shrink": {
                transform:
                  _variant === "filled"
                    ? "translate(8px, -1px) scale(0.90)"
                    : _variant === "standard"
                    ? "translate(1px,-6px) scale(0.90)"
                    : "translate(15px, -9px) scale(0.90)",
              },
            } as SxProps<Theme>,
            regular: {
              height: "2.5rem",
              fontSize: "14px",
              color:
                appState?.mode == "dark"
                  ? "#ffffff"
                  : `rgb(${inputBoxState?.fontColor})`,
            },
          };
        case "customize":
          return {
            mui: {
              "& .MuiInputBase-root": {
                height: `${inputBoxState?.inputHeight ?? 3}rem`,
                fontSize: `${inputBoxState?.fontSize ?? 16}px`,
                ...commonMuiStyles,
                fontWeight: inputBoxState?.bold
                  ? 700
                  : inputBoxState?.fontWeight ?? 500,
              },
              "& .MuiInputLabel-root": {
                fontSize: `${inputBoxState?.labelFontSize ?? 14}px`,
                color:
                  appState?.mode === "dark"
                    ? "rgb(225,224,224)"
                    : inputBoxState?.labelColor
                    ? `rgb(${inputBoxState?.labelColor})`
                    : "rgb(84,84,84)",
                transform:
                  _variant === "filled"
                    ? `translate(${inputBoxState?.adjustA ?? 10}px, ${
                        inputBoxState?.adjustB ?? 20
                      }px) scale(1)`
                    : _variant === "standard"
                    ? `translate(${inputBoxState?.adjustA ?? 10}px, ${
                        inputBoxState?.adjustB ?? 15
                      }px) scale(1)`
                    : `translate(${inputBoxState?.adjustA ?? 10}px, ${
                        inputBoxState?.adjustB ?? 12
                      }px) scale(1)`,
              },
              "& .MuiInputLabel-shrink": {
                transform:
                  _variant === "filled"
                    ? `translate(${inputBoxState?.adjustC ?? 8}px, ${
                        inputBoxState?.adjustD ?? -1
                      }px) scale(0.88)`
                    : _variant === "standard"
                    ? `translate(${inputBoxState?.adjustC ?? 1}px, ${
                        inputBoxState?.adjustD ?? -6
                      }px) scale(0.88)`
                    : `translate(${inputBoxState?.adjustC ?? 15}px, ${
                        inputBoxState?.adjustD ?? -9
                      }px) scale(0.88)`,
              },
            } as SxProps<Theme>,
            regular: {
              height: `${inputBoxState?.inputHeight ?? 2}rem`,
              fontSize: `${inputBoxState?.fontSize ?? 14}px`,
              fontWeight: inputBoxState?.fontWeight,
              color:
                appState?.mode == "dark"
                  ? "#ffffff"
                  : `rgb(${inputBoxState?.fontColor})`,
            },
          };
        default:
          return styles;
      }
    };

    function infoWithLineBreaks(text?: string) {
      if (!text) return null;
      return text.includes("/n")
        ? text.split("/n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))
        : text;
    }
    interface AutocompleteProps<
      T,
      Multiple extends boolean | undefined = undefined,
      DisableClearable extends boolean | undefined = undefined,
      FreeSolo extends boolean | undefined = undefined
    > extends Omit<
        React.ComponentProps<
          typeof Autocomplete<T, Multiple, DisableClearable, FreeSolo>
        >,
        "onChange"
      > {
      onChange?: (
        event: React.SyntheticEvent,
        value: AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>,
        reason: AutocompleteChangeReason,
        details?: AutocompleteChangeDetails<T> | undefined
      ) => void;
    }
    const StyledAutocomplete = styled(Autocomplete)`
      & .MuiAutocomplete-popper .MuiAutocomplete-listbox {
        max-height: 200px !important;
        overflow-y: auto !important;
        scrollbar-width: thin !important;
        scrollbar-color: #888 #f1f1f1;

        &::-webkit-scrollbar {
          width: 8px;
        }
        &::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #888;
          border-radius: 4px;
        }
        &::-webkit-scrollbar-thumb:hover {
          background-color: #555;
        }
      }
    `;

    const sizeStyles = getSizeStyles();

    if (_useMUI == true) {
      const getOptionSizeStyles = () => {
        switch (customSize) {
          case "sm":
            return {
              fontSize: "12px",
            };
          case "md":
            return {
              fontSize: "13px",
            };
          case "lg":
            return {
              fontSize: "14px",
            };
          case "customize":
            return {
              fontSize: `${inputBoxState?.fontSize ?? 14}px`,
            };
          default:
            return {};
        }
      };

      const handleItemSelect = (event: any, value: Option | null | any) => {
        if (value) {
          handleItemClick(value);
        }
      };

      const ScrollbarStyles = styled("div")`
        .custom-scrollbar {
          &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          &::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.3);
            border-radius: 3px;
          }
          &::-webkit-scrollbar-thumb:hover {
            background-color: rgba(0, 0, 0, 0.5);
          }
          &::-webkit-scrollbar-track {
            background-color: transparent;
          }
        }
      `;

      return (
        <div
          className={`${className}`}
          style={{
            marginBottom: `${inputBoxState?.marginBottom ?? 0}px`,
            marginTop: `${
              (inputBoxState?.marginTop ?? 0) - (labelInfo ? 12 : 0)
            }px`,
          }}
        >
          <Autocomplete
            id={id}
            options={items}
            value={initial}
            onChange={(event: any, value: any, reason: any) => {
              if (reason === "clear" && event.type === "click") {
                clearSelection();
              } else {
                handleItemSelect(event, value);
              }
            }}
            getOptionLabel={(option: any) => option.label || ""}
            isOptionEqualToValue={(option: any, value: any) =>
              option.value === value.value
            }
            loading={loading}
            disabled={disabled}
            autoHighlight
            openOnFocus
            fullWidth
            ListboxProps={{
              style: { maxHeight: "200px", scrollbarWidth: "thin" },
            }}
            PaperComponent={({ children }) => (
              <Paper
                elevation={1}
                style={{
                  backgroundColor: "white",
                  borderRadius: 4,
                  overflowY: "scroll",
                  height: "200px",
                }}
              >
                {children}
              </Paper>
            )}
            renderInput={(params) => (
              <>
                <div
                  className={`flex justify-end pb-[1px]`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {labelInfo &&
                    cloneElement(
                      labelInfo,
                      labelInfoProps ? { labelInfoProps: labelInfoProps } : {}
                    )}
                </div>
                <TextField
                  {...params}
                  label={
                    !noLabel ? label || id?.replaceAll("_", " ") : undefined
                  }
                  required={required}
                  variant={_variant}
                  sx={sizeStyles.mui}
                  onKeyDown={handleKeyDown}
                  onKeyUp={onKeyUp}
                  data-skip={skip}
                  data-jump-to={jumpTo}
                  data-jump-target={jumpTarget}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                    inputRef: ref,
                  }}
                />
              </>
            )}
            renderOption={(props, option: any) => (
              <li
                {...props}
                style={{
                  ...getOptionSizeStyles(),
                  opacity: option.is_active === false ? 0.5 : 1,
                  backgroundColor:
                    option.is_active === false ? "#f5f5f5" : undefined,
                }}
              >
                {option.label}
              </li>
            )}
          />
          <Typography className="text-[#374151] text-xs font-medium mt-1">
            {infoWithLineBreaks(info)}
          </Typography>
          {validation && (
            <div className="mt-1 text-xs text-[#ef4444]">{validation}</div>
          )}
        </div>
      );
    }

    const { height, fontSize, fontWeight, color } = sizeStyles.regular;

    const truncateValue = (text: string, maxLength: number = 23) => {
      if (!text) return text;
      return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

    if (_useMUI == undefined || _useMUI == false) {
      return (
        <div
          className={`${className} ${
            isOpen === true ? "combo-box-opened" : "combo-box-closed"
          }
            ${
              labelDirection === "vertical"
                ? "flex flex-col space-y-1"
                : "flex items-center space-x-2"
            }`}
          ref={componentRef}
          style={{
            marginBottom: `${inputBoxState?.marginBottom ?? 0}px`,
            marginTop: `${inputBoxState?.marginTop ?? 0}px`,
          }}
        >
          <div className="relative">
            {!noLabel && (
              <label
                className={`capitalize block text-left rtl:text-right dark:text-dark-label ${
                  appState?.mode == "dark" ? "" : ""
                }`}
                style={{
                  fontSize: _customSize
                    ? _customSize === "sm"
                      ? "11px"
                      : _customSize === "md"
                      ? "13px"
                      : _customSize === "lg"
                      ? "14px"
                      : `${inputBoxState?.labelFontSize}px`
                    : `14px`,
                  color:
                    appState?.mode === "dark"
                      ? "rgb(225,224,224)"
                      : inputBoxState?.labelColor
                      ? `rgb(${inputBoxState?.labelColor})`
                      : "rgb(84,84,84)",
                  transform:
                    _customSize === "customize"
                      ? `translate(${inputBoxState?.adjustA ?? 10}px, ${
                          inputBoxState?.adjustB ?? 10
                        }px) scale(1)`
                      : `translate( 1px,3px) scale(1)`,
                }}
              >
                {`${label || id?.replaceAll("_", " ")} ${
                  labelDirection === "horizontal" ? ":" : ""
                }`}
                {required && <span className="text-[#ef4444]">*</span>}
              </label>
            )}
            <div
              className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-end p-1 "
              style={{
                fontSize: _customSize
                  ? _customSize === "sm"
                    ? "11px"
                    : _customSize === "md"
                    ? "13px"
                    : _customSize === "lg"
                    ? "14px"
                    : `${inputBoxState?.labelFontSize}px`
                  : `14px`,
              }}
            >
              {labelInfo &&
                cloneElement(
                  labelInfo,
                  labelInfoProps ? { labelInfoProps: labelInfoProps } : {}
                )}
            </div>
          </div>
          <Combobox as="div" className="relative">
            <div className="flex" ref={comboboxRef}>
              <Combobox.Input
                ref={ref}
                style={{
                  height,
                  fontSize,
                  fontWeight: inputBoxState?.bold ? 700 : fontWeight,
                  color,
                  borderColor: borderStyles,
                  outline: "none",
                  transition: "border-color 0.2s ease-in-out",
                  borderRadius: `${inputBoxState?.borderRadius}px`,
                  backgroundColor: bgColor,
                  // overflow: "hidden",
                  // textOverflow: "ellipsis",
                  // whiteSpace: "nowrap",
                }}
                className={`form-control ${
                  sizeClasses?.input
                } dark:!bg-dark-bg-card overflow-hidden text-ellipsis whitespace-nowrap
                ${
                  enableClearOption &&
                  (initial || inputValue) &&
                  !noXMarkIcon &&
                  !disabled
                    ? "!pr-[60px]"
                    : "!pr-[30px]"
                } dark:!text-dark-text placeholder:capitalize ${
                  disabled ? "border-dashed" : ""
                }`}
                displayValue={() => inputValue || initial?.label || ""}
                onChange={handleInputChange}
                onClick={(e) => {
                  e.stopPropagation();
                  !disabled && !isOpen && setIsOpen(true);
                }}
                onKeyDown={(e) => {
                  handleKeyDown(e);
                }}
                onKeyUp={onKeyUp}
                placeholder={
                  t("select") + " " + (label || id?.replaceAll("_", " "))
                }
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={handleFocus}
                // onBlur={handleBlur}
                autoComplete="off"
                spellCheck={false}
                autoFocus={autoFocus}
                title={initial?.label || ""}
                value={
                  // isOpen
                  //   ? 
                  
                  truncateText(
                    inputValue || "",
                    ref as React.RefObject<HTMLInputElement>
                  )
                    // inputValue
                    // : 
                    // truncateText(
                    //     initial?.label || "",
                    //     ref as React.RefObject<HTMLInputElement>
                    //   )
                }
                readOnly={disabled}
                disabled={disabled}
              />
              <div
                className={`absolute inset-y-0 ltr:right-0 dark:!bg-dark-combo-dd rtl:left-0 flex items-center m-[2px] pr-1`}
                style={{
                  // background:
                  //   initial?.value !== undefined &&
                  //   initial?.value !== null &&
                  //   initial?.value !== ""
                  //     ? `rgb(${inputBoxState?.selectColor})`
                  //     : "#f9f9f9",
                      background: initial ? `rgb(${inputBoxState?.selectColor})` : "#f9f9f9",
                  ...(document.documentElement.dir === "rtl"
                    ? {
                        borderTopLeftRadius: `${
                          inputBoxState?.borderRadius ?? 5
                        }px`,
                        borderBottomLeftRadius: `${
                          inputBoxState?.borderRadius ?? 5
                        }px`,
                      }
                    : {
                        borderTopRightRadius: `${
                          inputBoxState?.borderRadius ?? 5
                        }px`,
                        borderBottomRightRadius: `${
                          inputBoxState?.borderRadius ?? 5
                        }px`,
                      }),
                }}
              >
                {enableClearOption &&
                  (initial) &&
                  !noXMarkIcon && (
                    <button
                      type="button"
                      onClick={(e) => {
                        if (disabled) return;
                        clearSelection();
                        setIsOpen(false);
                      }}
                      className={`p-1 ${
                        !disabled ? "hover:bg-[rgba(0,0,0,0.44)]" : ""
                      } rounded-full`}
                      aria-label="Clear selection"
                    >
                      <XMarkIcon
                        className={`${sizeClasses?.icons} text-gray-400 ${
                          !disabled ? "hover:text-gray-500" : ""
                        } transition-transform duration-200 ${
                          isOpen ? "transform rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  )}
                <Combobox.Button
                  className={`p-1 ${
                    !disabled ? "hover:bg-[rgba(0,0,0,0.44)]" : ""
                  } rounded-full`}
                  onClick={(e) => {
                    e.stopPropagation();
                    !disabled && setIsOpen(!isOpen);
                  }}
                >
                  <ChevronDownIcon
                    className={`${sizeClasses?.icons} text-gray-400 ${
                      !disabled ? "hover:text-gray-500" : ""
                    } transition-transform duration-200 ${
                      isOpen ? "transform rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </Combobox.Button>
              </div>
            </div>
            {isOpen &&
              createPortal(
                <div
                  ref={(el) => {
                    if (el) {
                      (el as any).__reactRefHandlers = { contains: () => true };
                    }
                  }}
                  className={`${
                    isInModal
                      ? "combobox-dropdown-modal combobox-dropdown "
                      : "combobox-dropdown"
                  } dark:bg-dark-bg-card absolute  mt-1 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden rounded-md`}
                  style={{
                    width: comboboxRef.current?.offsetWidth || "auto",
                    top:
                      (comboboxRef.current?.getBoundingClientRect().bottom ??
                        0) + window.scrollY,
                    left:
                      (comboboxRef.current?.getBoundingClientRect().left ?? 0) +
                      window.scrollX,
                  }}
                >
                  {loading ? (
                    <div className="relative cursor-default select-none py-2 px-4 dark:!text-dark-text text-gray-700 text-center animate-pulse">
                      {t("loading...")}
                    </div>
                  ) : filteredItems?.length === 0 ? (
                    <div className="relative cursor-default select-none py-2 px-4 dark:!text-dark-text text-gray-700">
                      {t("no_data_found")}
                    </div>
                  ) : (
                    <>
                    <ComboboxList
                      ref={listRef}
                      items={filteredItems}
                      selectedValue={initial}
                      onSelect={handleItemClick}
                      activeIndex={activeIndex}
                      customSize={_customSize}
                      appState={appState.dir}
                    />
                    {/* {addNewOption && (
                      <div className="">
                        <ERPButton
                          type="button"
                          variant="primary"
                          onClick={handleAddNewClick}
                          title={t("add_new")}
                          className="w-full text-sm"
                        />
                      </div>
                     )}  */}
                     {addNewOption && (
  <div className="p-2 border-t">
    <button
      type="button"
      onClick={handleAddNewClick}
      className="w-full bg-slate-800 text-white py-1 px-3 rounded text-sm"
    >
      {t("add_new")}
    </button>
  </div>
)}

                  </>
               
                  )}
                
      
                </div>,
                document.body // Render to body to escape parent constraints
              )}
        

          </Combobox>
          {info != undefined && info != null && info != "" && (
            <div className="text-[#374151] text-xs font-medium ">
              {infoWithLineBreaks(info)}
            </div>
          )}
          {validation != undefined &&
            validation != null &&
            validation != "" && (
              <ERPElementValidationMessage validation={validation} />
            )}
              {addNewOption &&
              addNewOptionCobonent &&
              addNewOptionCobonent.isOpen &&
              (
                <ERPModal
                  isOpen={addNewOptionCobonent.isOpen}
                  title={addNewOptionCobonent.title}
                  width={addNewOptionCobonent.width || 600}
                  height={addNewOptionCobonent.height || 350}
                  isForm={true}
                  // closeModal={handleCloseModal}
                  closeModal={() => {
                    if (addNewOptionCobonent.closeModal) {
                      addNewOptionCobonent.closeModal();
                    }
                  }}
                  content={addNewOptionCobonent.content}
                />
               
              )}
        </div>
      );
    }
  }
);

// Set displayName for better debugging
ERPDataCombobox.displayName = "ERPDataCombobox";

export default memo(ERPDataCombobox);
