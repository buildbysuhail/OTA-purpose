"use client";
import React, {useState,useEffect,useRef,useCallback,cloneElement,forwardRef,memo} from "react";
import { Combobox } from "@headlessui/react";
import {CheckIcon,ChevronDownIcon,XMarkIcon} from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import { FixedSizeList as List } from "react-window";
import { APIClient } from "../../helpers/api-client";
import { setFgAccordingToBgPrimary } from "../../utilities/Utils";
import { useAppSelector } from "../../utilities/hooks/useAppDispatch";
import { RootState } from "../../redux/store";
import {Autocomplete,CircularProgress,TextField,Theme,SxProps,Typography,AutocompleteValue,AutocompleteChangeReason,AutocompleteChangeDetails,Paper} from "@mui/material";
import { createPortal } from "react-dom";
import { styled } from "@mui/system";
import ERPElementValidationMessage from "./erp-element-validation-message";

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
  multiple?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  initialValue?: any;
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
  return items?.map((item: any) => ({
    label: getNestedValue(item, labelKey) || "",
    value: getNestedValue(item, valueKey) || "",
    name: getNestedValue(item, nameKey) || "",
    is_active: item?.is_active,
  }));
};

const truncateText = (
  text: string,
  inputRef: React.RefObject<HTMLInputElement>
) => {
  if (!inputRef.current || !text) return text;
  const tempSpan = document.createElement("span");
  tempSpan.style.visibility = "hidden";
  tempSpan.style.position = "absolute";
  tempSpan.style.whiteSpace = "nowrap";
  tempSpan.style.font = window.getComputedStyle(inputRef.current).font;
  document.body.appendChild(tempSpan);
  const availableWidth = inputRef.current.offsetWidth - 60;
  tempSpan.textContent = text;
  const textWidth = tempSpan.offsetWidth;

  if (textWidth > availableWidth) {
    let truncated = text;
    while (truncated.length > 0) {
      tempSpan.textContent = truncated + "...";
      if (tempSpan.offsetWidth <= availableWidth) {
        document.body.removeChild(tempSpan);
        return truncated + "...";
      }
      truncated = truncated.slice(0, -1);
    }
    document.body.removeChild(tempSpan);
    return "...";
  }
  document.body.removeChild(tempSpan);
  return text;
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
  const { items, selectedValue, handleSelect, activeIndex } = data;
  const item = items[index];
  const isSelected = selectedValue?.value === item.value;
  const isActive = activeIndex === index;
  const sizeClasses = getSizeClasses(data.customSize);

  const appState = useAppSelector(
    (state: RootState) => state.AppState?.appState
  );

  return (
    <Combobox.Option
      style={style}
      key={`${item?.value}-${index}`}
      // className={({ active }) =>
      //   `relative cursor-pointer select-none w-full rounded-sm hover:bg-gray-300 hover:text-dark hover:${setFgAccordingToBgPrimary()} ${active || isActive
      //     ? "bg-primary text-white"
      //     : item.is_active === false
      //       ? "bg-gray-200 text-gray-400"
      //       : "text-gray-900"
      //   } ${sizeClasses?.options}`
      // }
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
  );
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
  const { items, selectedValue, onSelect, activeIndex, customSize, appState } =
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
// Add a custom props comparison function (optional)

const logProps = (props: ERPDataComboboxProps, label: string) => {
  console.log(`${label} props:`, Object.keys(props));
};

const propsAreEqual = (
  prevProps: ERPDataComboboxProps,
  nextProps: ERPDataComboboxProps
) => {
  console.log(prevProps);
  console.log(nextProps);

  // Uncomment to debug
  // logProps(prevProps, 'Previous');
  // logProps(nextProps, 'Next');

  // Get all keys from both objects to ensure we don't miss any
  const allKeys = Array.from(
    new Set([...Object.keys(prevProps), ...Object.keys(nextProps)])
  );

  for (const key of allKeys) {
    const prevValue = prevProps[key as keyof ERPDataComboboxProps];
    const nextValue = nextProps[key as keyof ERPDataComboboxProps];

    // Handle function comparisons
    if (typeof prevValue === "function" && typeof nextValue === "function") {
      if (prevValue !== nextValue) {
        console.log(`Function prop ${key} changed`);
        return false;
      }
      continue;
    }

    // Handle array comparisons
    if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
      if (JSON.stringify(prevValue) !== JSON.stringify(nextValue)) {
        console.log(`Array prop ${key} changed`);
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
        console.log(`Object prop ${key} changed`);
        return false;
      }
      continue;
    }

    // Handle primitive comparisons
    if (prevValue !== nextValue) {
      console.log(
        `Primitive prop ${key} changed from ${prevValue} to ${nextValue}`
      );
      return false;
    }
  }

  return true;
};

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
    }: ERPDataComboboxProps,
    ref
  ) => {
    console.log("Re Rendered");

    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [items, setItems] = useState<Option[]>([]);
    const [loading, setLoading] = useState(false);
    const [initial, setInitial] = useState<Option | null>(initialValue);
    const [filteredItems, setFilteredItems] = useState<Option[]>([]);
    const [displayValue, setDisplayValue] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);
    const [inputValue, setInputValue] = useState("");
    const comboboxRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<List>(null);
    const componentRef = useRef<HTMLDivElement>(null);
    const appState = useAppSelector(
      (state: RootState) => state.AppState.appState
    );
    const [_customSize, setCustomSize] = useState(
      customSize ? customSize : appState?.inputBox?.inputSize
    );
    const [_useMUI, set_useMUI] = useState<boolean | undefined>(useMUI);
    const [_variant, set_variant] = useState<
      "filled" | "outlined" | "standard" | undefined
    >(variant === "normal" ? undefined : variant);
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
      setIsFocused(false);
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
      if (customSize == undefined || customSize == null) {
        setCustomSize(appState?.inputBox?.inputSize);
      }
    }, [appState?.inputBox?.inputSize]);

    useEffect(() => {
      if (appState?.inputBox?.inputStyle !== "normal" && useMUI === undefined) {
        set_useMUI(true);
      } else if (
        appState?.inputBox?.inputStyle === "normal" &&
        useMUI === undefined
      ) {
        set_useMUI(false);
      }
    }, [appState?.inputBox?.inputStyle, useMUI]);

    useEffect(() => {
      if (
        appState?.inputBox?.inputStyle !== "normal" &&
        (variant === undefined || variant === null)
      ) {
        set_variant(
          appState?.inputBox?.inputStyle as "filled" | "outlined" | "standard"
        );
      } else if (appState?.inputBox?.inputStyle === "normal") {
        set_variant(undefined);
      } else {
        set_variant(variant as "filled" | "outlined" | "standard");
      }
    }, [appState?.inputBox?.inputStyle, variant]);

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
              ? `rgb(${appState?.inputBox?.borderFocus})`
              : `rgb(${appState?.inputBox?.borderColor})`
          } `
    );
    const [bgColor, setBgColor] = useState<string>(
      appState.mode == "dark"
        ? isFocused == true
          ? "#ffffff"
          : "#ffffff1a"
        : `${isFocused ? `rgb(${appState?.inputBox?.focusBgColor})` : ``} `
    );
    useEffect(() => {
      let border, bgCol;
      if (appState?.mode === "dark") {
        border = isFocused || isHovered ? "#ffffff" : "#ffffff1a";
        bgCol = isFocused ? "#313334" : "#ffffff1a";
      } else {
        border =
          isFocused || isHovered
            ? `rgb(${appState?.inputBox?.borderFocus})`
            : `rgb(${appState?.inputBox?.borderColor})`;
        bgCol = isFocused ? `rgb(${appState?.inputBox?.focusBgColor})` : ``;
      }
      setBorderStyles(border);
      setBgColor(bgCol);
    }, [
      appState.mode,
      isFocused,
      isHovered,
      appState.inputBox?.borderColor,
      appState.inputBox?.borderFocus,
      appState.inputBox?.focusBgColor,
      appState.inputBox?.defaultBgColor,
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
      debugger;
      console.log(`freezeDataLoad${field?.freezeDataLoad}`);
      console.log(`disabledApiCall${disabledApiCall}`);
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
    ]);

    const loadData = async () => {
      setLoading(true);
      try {
        let params = "";
        console.log(`options${field?.freezeDataLoad}`);
        if (
          field?.params != undefined &&
          Object.keys(field?.params).length > 0
        ) {
          params = new URLSearchParams(field?.params).toString();
        }

        const _items =
          options ||
          (await api.getAsync(
            field?.getListUrlDynamic != undefined
              ? field.getListUrlDynamic(data)
              : field?.getListUrl ?? "",
            params
          ));
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
        // setActiveIndex(-1);
      },
      [items]
    );

    useEffect(() => {
      filterItems(query);
    }, [query, filterItems]);

    useEffect(() => {
      const fieldKey = field?.id?.replaceAll("_id", "");
      const defaultValueKey = getNestedValue(
        defaultData?.[fieldKey ?? ""],
        field?.valueKey ?? ""
      );
      const _default = items?.find(
        (option) => option.value === defaultValueKey
      );
      const _selected = items?.find(
        (option) => option.value === (value ? value : data?.[field?.id ?? ""])
      );
      const _exceptional =
        (defaultData && fieldKey === "payment_terms" && items[0]) ||
        fieldKey === "currency";
      const final =
        _selected || _default || _exceptional || initialValue || null;
      setInitial(final);

      setActiveIndex(
        final != null
          ? filteredItems.findIndex((item) => item.value === final.value)
          : -1
      );
    }, [items, data, defaultData, field, initialValue, filteredItems, value]);

    const clearSelection = (e?: React.MouseEvent) => {
      handleItemClick({ label: "", value: null, is_active: false, name: "" });
    };
    const handleItemClick = (value: Option) => {
      setInitial(value);
      setIsOpen(false);
      // setActiveIndex(-1);
      setQuery("");
      setInputValue(value.label);
      setDisplayValue("");
      setFilteredItems(items); // Reset filtered items to original list
      onChange?.(value);
      onChangeData?.(value && data ? { ...data, [id]: value?.value } : null);
      handleChange?.(field?.id ?? "", value?.value);
      handleChangeData?.(field?.id ?? "", value?.value);
      onSelectItem?.(value);
    };
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value);
      setQuery(value);
      setIsOpen(true);
      if (!value.trim()) {
        setFilteredItems(items);
      }
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

    const handleKeyDown = (event: React.KeyboardEvent<any>) => {
      debugger;
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
          // Move focus to the next input field
          if (disableEnterNavigation) {
            if (onkeydown != undefined) {
              onKeyDown ? onKeyDown(event): undefined;
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

    const sizeClasses = getSizeClasses(_customSize, appState);
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
          // borderFocusColor?:string;
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
        borderRadius: `${appState?.inputBox?.borderRadius ?? 5}px`,
        color:
          appState?.mode == "dark"
            ? "#ffffff"
            : `rgb(${appState?.inputBox?.fontColor})`,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor:
            appState?.mode == "dark"
              ? "#ffffff1a"
              : `rgb(${appState?.inputBox?.borderColor})`,
        },
        "& .MuiFilledInput-underline, &:before": {
          borderBottomColor:
            appState?.mode == "dark"
              ? "#ffffff1a"
              : `rgb(${appState?.inputBox?.borderColor})`,
        },
        "&:hover ?.MuiOutlinedInput-notchedOutline": {
          borderColor:
            appState?.mode == "dark"
              ? "#ffffff"
              : `rgb(${appState?.inputBox?.borderFocus})`,
        },
        "&:hover .MuiFilledInput-underline, &:hover:before": {
          borderBottomColor:
            appState?.mode == "dark"
              ? "#ffffff"
              : `rgb(${appState?.inputBox?.borderFocus})`,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor:
            appState?.mode == "dark"
              ? "#ffffff"
              : `rgb(${appState?.inputBox?.borderFocus})`,
        },
        "&.Mui-focused .MuiFilledInput-underline, &.Mui-focused:before, &.Mui-focused:after":
          {
            borderBottomColor:
              appState?.mode == "dark"
                ? "#ffffff"
                : `rgb(${appState?.inputBox?.borderFocus})`,
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
                    : appState?.inputBox?.labelColor
                    ? `rgb(${appState?.inputBox?.labelColor})`
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
              height: "2rem",
              fontSize: "12px",
              color:
                appState?.mode == "dark"
                  ? "#ffffff"
                  : `rgb(${appState?.inputBox?.fontColor})`,
              // padding: "0.25rem 0.75rem"
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
                    : appState?.inputBox?.labelColor
                    ? `rgb(${appState?.inputBox?.labelColor})`
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
              height: "2.5rem",
              fontSize: "14px",
              color:
                appState?.mode == "dark"
                  ? "#ffffff"
                  : `rgb(${appState?.inputBox?.fontColor})`,
              // padding: "0.5rem 1rem"
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
                    : appState?.inputBox?.labelColor
                    ? `rgb(${appState?.inputBox?.labelColor})`
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
              height: "3rem",
              fontSize: "16px",
              color:
                appState?.mode == "dark"
                  ? "#ffffff"
                  : `rgb(${appState?.inputBox?.fontColor})`,
              // label: "10px",
              // padding: "0.75rem 1.25rem"
            },
          };
        case "customize":
          return {
            mui: {
              "& .MuiInputBase-root": {
                height: `${appState?.inputBox?.inputHeight ?? 3}rem`,
                fontSize: `${appState?.inputBox?.fontSize ?? 16}px`,
                fontWeight: appState?.inputBox?.fontWeight ?? 500,
                ...commonMuiStyles,
              },
              "& .MuiInputLabel-root": {
                fontSize: `${appState?.inputBox?.labelFontSize ?? 14}px`,
                color:
                  appState?.mode === "dark"
                    ? "rgb(225,224,224)"
                    : appState?.inputBox?.labelColor
                    ? `rgb(${appState?.inputBox?.labelColor})`
                    : "rgb(84,84,84)",
                transform:
                  _variant === "filled"
                    ? `translate(${appState?.inputBox?.adjustA ?? 10}px, ${
                        appState?.inputBox?.adjustB ?? 20
                      }px) scale(1)`
                    : _variant === "standard"
                    ? `translate(${appState?.inputBox?.adjustA ?? 10}px, ${
                        appState?.inputBox?.adjustB ?? 15
                      }px) scale(1)`
                    : `translate(${appState?.inputBox?.adjustA ?? 10}px, ${
                        appState?.inputBox?.adjustB ?? 12
                      }px) scale(1)`,
              },
              "& .MuiInputLabel-shrink": {
                transform:
                  _variant === "filled"
                    ? `translate(${appState?.inputBox?.adjustC ?? 8}px, ${
                        appState?.inputBox?.adjustD ?? -1
                      }px) scale(0.88)`
                    : _variant === "standard"
                    ? `translate(${appState?.inputBox?.adjustC ?? 1}px, ${
                        appState?.inputBox?.adjustD ?? -6
                      }px) scale(0.88)`
                    : `translate(${appState?.inputBox?.adjustC ?? 15}px, ${
                        appState?.inputBox?.adjustD ?? -9
                      }px) scale(0.88)`,
              },
            } as SxProps<Theme>,
            regular: {
              height: `${appState?.inputBox?.inputHeight ?? 2.5}rem`,
              fontSize: `${appState?.inputBox?.fontSize ?? 15}px`,
              fontWeight: appState?.inputBox?.fontWeight,
              color:
                appState?.mode == "dark"
                  ? "#ffffff"
                  : `rgb(${appState?.inputBox?.fontColor})`,
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
              fontSize: "14px",
            };
          case "lg":
            return {
              fontSize: "16px",
            };
          case "customize":
            return {
              fontSize: `${appState?.inputBox?.fontSize ?? 15}px`,
            };
          default:
            return {};
        }
      };
      // handleItemSelect: (event: React.SyntheticEvent, value: Option | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<Option> | undefined) => void;
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
          className={className}
          style={{
            marginBottom: `${appState?.inputBox?.marginBottom ?? 0}px`,
            // marginTop: `${appState?.inputBox?.marginTop ?? 0}px`,
            marginTop: `${
              (appState?.inputBox?.marginTop ?? 0) - (labelInfo ? 12 : 0)
            }px`,
          }}
        >
          {/* <Autocomplete
          id={id}
          options={items}
          value={initial}
          onChange={handleItemSelect}
          getOptionLabel={(option) => option.label || ""}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          loading={loading}
          disabled={disabled}
          autoHighlight
          openOnFocus
          fullWidth
          renderInput={(params) => (
            <TextField
              {...params}
              label={!noLabel ? label || id?.replaceAll("_", " ") : undefined}
              required={required}
              variant={_variant}
              sx={sizeStyles.mui}
              onKeyDown={handleKeyDownEnter}
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
              }}
              appState={appState}
            />
          )}
          renderOption={(props, option) => (
            <li
              {...props}
              style={{
                ...getOptionSizeStyles(),
                opacity: option.is_active === false ? 0.5 : 1,
                backgroundColor:
                  option.is_active === false ? "#f5f5f5" : undefined,
              }}>
              {option.label}
            </li>
          )}
        /> */}
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
                <div className="flex justify-end items-center">
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
          className={`${className} relative ${
            labelDirection === "vertical"
              ? "flex flex-col space-y-1"
              : "flex items-center space-x-2"
          }`}
          ref={componentRef}
          style={{
            marginBottom: `${appState?.inputBox?.marginBottom ?? 0}px`,
            marginTop: `${appState?.inputBox?.marginTop ?? 0}px`,
          }}
        >
          {!noLabel && (
            <div className="flex justify-between">
              <label
                className={`capitalize block   text-left rtl:text-right ${
                  appState?.mode == "dark" ? "" : ""
                } 
          ${labelDirection === "vertical" ? "" : ""}`}
                style={{
                  fontSize: _customSize
                    ? _customSize === "sm"
                      ? "12px"
                      : _customSize === "md"
                      ? "14px"
                      : _customSize === "lg"
                      ? "16px"
                      : `${appState?.inputBox?.labelFontSize}px`
                    : `14px`,
                  color:
                    appState?.mode === "dark"
                      ? "rgb(225,224,224)"
                      : appState?.inputBox?.labelColor
                      ? `rgb(${appState?.inputBox?.labelColor})`
                      : "rgb(84,84,84)",
                  transform:
                    _customSize === "customize"
                      ? `translate(${appState?.inputBox?.adjustA ?? 10}px, ${
                          appState?.inputBox?.adjustB ?? 10
                        }px) scale(1)`
                      : ``,
                }}
              >
                {`${label || id?.replaceAll("_", " ")}  ${
                  labelDirection === "horizontal" ? ":" : ""
                }`}
                {required && <span className="text-[#ef4444]">*</span>}
              </label>
              <label
                className={`capitalize block text-right rtl:text-left ${
                  appState?.mode == "dark" ? "" : ""
                }`}
                style={{
                  fontSize: _customSize
                    ? _customSize === "sm"
                      ? "12px"
                      : _customSize === "md"
                      ? "14px"
                      : _customSize === "lg"
                      ? "16px"
                      : `${appState?.inputBox?.labelFontSize}px`
                    : `14px`,
                  color:
                    appState?.mode === "dark"
                      ? "rgb(225,224,224)"
                      : appState?.inputBox?.labelColor
                      ? `rgb(${appState?.inputBox?.labelColor})`
                      : "rgb(84,84,84)",
                  transform:
                    _customSize === "customize"
                      ? `translate(${appState?.inputBox?.adjustA ?? 10}px, ${
                          appState?.inputBox?.adjustB ?? 10
                        }px) scale(1)`
                      : ``,
                }}
              >
                {labelInfo &&
                  cloneElement(
                    labelInfo,
                    labelInfoProps ? { labelInfoProps: labelInfoProps } : {}
                  )}
              </label>
            </div>
          )}
          <Combobox as="div" className="relative">
            <div className="flex" ref={comboboxRef}>
              <Combobox.Input
                ref={ref}
                style={{
                  height,
                  fontSize,
                  fontWeight,
                  color,
                  borderColor: borderStyles,
                  outline: "none",
                  transition: "border-color 0.2s ease-in-out",
                  borderRadius: `${appState?.inputBox?.borderRadius}px`,
                  backgroundColor: bgColor,
                }}
                className={`form-control ${sizeClasses?.input} ${
                  appState.mode == "dark" ? "!bg-[#313334] " : ``
                } placeholder:capitalize`}
                displayValue={() => inputValue || initial?.label || ""}
                onChange={handleInputChange}
                onClick={(e) => {
                  e.stopPropagation();
                  !disabled && setIsOpen(!isOpen);
                }}
                onKeyDown={(e) => {
                  if (
                    !isOpen &&
                    (e.key === "ArrowDown" || e.key === "ArrowUp")
                  ) {
                    setIsOpen(true);
                  }
                  disableEnterNavigation == true
                    ? onKeyDown != undefined
                      ? onKeyDown(e)
                      : undefined
                    : handleKeyDown(e);
                }}
                onKeyUp={onKeyUp}
                placeholder={
                  t("select") + " " + (label || id?.replaceAll("_", " "))
                }
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={handleFocus}
                onBlur={handleBlur}
                autoComplete="off"
                spellCheck={false}
                autoFocus={autoFocus}
                title={initial?.label || ""}
                value={
                  isOpen ? inputValue : truncateValue(initial?.label || "")
                }
                readOnly={disabled}
                disabled={disabled}
              />
              <div
                className={`absolute inset-y-0 ltr:right-0 ${
                  appState.mode == "dark" ? "!bg-[#2d2d2d] " : ``
                } rtl:left-0 flex items-center m-[2px] pr-1`}
                style={{
                  background:
                    initial?.value !== undefined &&
                    initial?.value !== null &&
                    initial?.value !== ""
                      ? `rgb(${appState?.inputBox?.selectColor})`
                      : "#f9f9f9",
                  ...(document.documentElement.dir === "rtl"
                    ? {
                        borderTopLeftRadius: `${
                          appState?.inputBox?.borderRadius ?? 5
                        }px`,
                        borderBottomLeftRadius: `${
                          appState?.inputBox?.borderRadius ?? 5
                        }px`,
                      }
                    : {
                        borderTopRightRadius: `${
                          appState?.inputBox?.borderRadius ?? 5
                        }px`,
                        borderBottomRightRadius: `${
                          appState?.inputBox?.borderRadius ?? 5
                        }px`,
                      }),
                }}
              >
                {/* Dropdown button */}
                {enableClearOption &&
                  (initial || inputValue) &&
                  !noXMarkIcon && (
                    <button
                      type="button"
                      // onClick={(e) => {
                      //   e.stopPropagation();
                      //   clearSelection();
                      //   setIsOpen(false);
                      // }}
                      onClick={(e) => {
                        if (disabled) return;
                        clearSelection();
                        setIsOpen(false);
                      }}
                      // className="p-1 hover:bg-gray-100 rounded-full"
                      className={`p-1 ${
                        !disabled ? "hover:bg-[rgba(0,0,0,0.44)]" : ""
                      } rounded-full`}
                      aria-label="Clear selection"
                    >
                      <XMarkIcon
                        // className={`${sizeClasses?.icons} text-gray-400 hover:text-gray-500`}
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
                  // className="p-1 hover:bg-gray-100 rounded-full"
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
                  } ${
                    appState.mode == "dark" ? "!bg-[#313334] " : ``
                  } absolute  mt-1 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden rounded-md`}
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
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700 text-center animate-pulse">
                      Loading...
                    </div>
                  ) : filteredItems?.length === 0 ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      No data found
                    </div>
                  ) : (
                    <ComboboxList
                      ref={listRef}
                      items={filteredItems}
                      selectedValue={initial}
                      onSelect={handleItemClick}
                      activeIndex={activeIndex}
                      customSize={_customSize}
                      appState={appState.dir}
                    />
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
        </div>
      );
    }
  }
);

// Set displayName for better debugging
ERPDataCombobox.displayName = "ERPDataCombobox";

export default memo(ERPDataCombobox);
