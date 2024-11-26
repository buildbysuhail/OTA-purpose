"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import { FixedSizeList as List } from "react-window";
import { APIClient } from "../../helpers/api-client";
import { setFgAccordingToBgPrimary } from "../../utilities/Utils";
import { useAppSelector } from "../../utilities/hooks/useAppDispatch";
import { RootState } from "../../redux/store";
import {
  Autocomplete,
  CircularProgress,
  TextField,
  Theme,
  SxProps,
} from "@mui/material";

interface Option {
  value: string;
  label: string;
  is_active?: boolean;
}

interface ERPDataComboboxProps {
  id: string;
  label?: string;
  options?: any[];
  excludeOptions?: any[];
  includeOptions?: any[];
  info?:string;
  defaultValue?: any;
  handleChange?: (id: string, value: any) => void;
  handleChangeData?: (id: string, value: any) => void;
  onChangeData?: (data: any) => void;
  onChange?: (value: any) => void;
  onSelectItem?: (item?: any) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  field?: any;
  defaultData?: any;
  data?: any;
  value?: any;
  labelDirection?:"horizontal"|"vertical";
  reload?: boolean;
  required?: boolean;
  className?: string;
  noLabel?: boolean;
  noXMarkIcon?: boolean;
  multiple?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  initialValue?: any;
  isPaginated?: boolean;
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
  valueKey: string
): Option[] => {
  return items?.map((item: any) => ({
    label: getNestedValue(item, labelKey) || "",
    value: getNestedValue(item, valueKey) || "",
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

const getSizeClasses = (customSize?: "sm" | "md" | "lg" | "customize", appState?: any) => {
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

  return (
    <Combobox.Option
      style={style}
      key={`${item?.value}-${index}`}
      className={({ active }) =>
        `relative cursor-pointer select-none w-full rounded-sm hover:bg-primary hover:${setFgAccordingToBgPrimary()} ${active || isActive
          ? "bg-primary text-white"
          : item.is_active === false
            ? "bg-gray-200 text-gray-400"
            : "text-gray-900"
        } ${sizeClasses?.options}`
      }
      value={item}
      disabled={!item.is_active}>
      {({ active }) => (
        <div
          className={`flex items-center px-3 py-2 ${isSelected ? "bg-primary" : ""
            }`}
          onClick={() => handleSelect(item)}>
          <div className="flex-shrink-0 w-5">
            {isSelected && (
              <CheckIcon
                className={`${sizeClasses?.icons
                  } ${setFgAccordingToBgPrimary()}`}
                aria-hidden="true" />
            )}
          </div>
          <span
            className={`block truncate flex-grow ${isSelected ? "font-medium" : "font-normal"
              } ${isSelected ? setFgAccordingToBgPrimary() : ""}`}>
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
  }>
  ((props, ref) => {
    const { items, selectedValue, onSelect, activeIndex, customSize } = props;
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
        className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        {Row}
      </List>
    );
  });

ComboboxList.displayName = "ComboboxList";

export default function ERPDataCombobox({
  id,
  label,
  handleChange,
  handleChangeData,
  onChange,
  onChangeData,
  onSelectItem,
  onFocus,
  onBlur,
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
  multiple,
  autoFocus,
  disabled = false,
  reload = false,
  labelDirection="vertical",
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
  variant ,
}: ERPDataComboboxProps) {
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
  const comboboxRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<List>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const appState = useAppSelector((state: RootState) => state.AppState.appState);
  const [_customSize, setCustomSize] = useState(customSize ? customSize : appState.inputBox.inputSize);
  const [_useMUI, set_useMUI] = useState<boolean | undefined>(useMUI);
  const [_variant, set_variant] = useState<"filled" | "outlined" | "standard" | undefined>(variant === "normal" ? undefined : variant);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => { setIsFocused(false); };

  useEffect(() => {
    if (customSize == undefined || customSize == null) {
      setCustomSize(appState.inputBox.inputSize);
    }
  }, [appState.inputBox.inputSize]);

  useEffect(() => {
    if (appState.inputBox.inputStyle !== "normal" && useMUI === undefined) {
      set_useMUI(true);
    } else if (appState.inputBox.inputStyle === "normal" && useMUI === undefined) {
      set_useMUI(false);
    }
  }, [appState.inputBox.inputStyle, useMUI]);

  useEffect(() => {
    if (appState.inputBox.inputStyle !== "normal" && (variant === undefined || variant === null)) {
      set_variant(appState.inputBox.inputStyle as "filled" | "outlined" | "standard");
    } else if (appState.inputBox.inputStyle === "normal") {
      set_variant(undefined);
    } else {
      set_variant(variant as "filled" | "outlined" | "standard");
    }
  }, [appState.inputBox.inputStyle, variant]);

  useEffect(() => {
    if (initial?.label) {
      setDisplayValue(truncateText(initial.label, comboboxRef));
    } else {
      setDisplayValue("");
    }
  }, [initial]);

  const [borderStyles, setBorderStyles] = useState<string>(appState.mode == 'dark' ? (isFocused == true || isHovered == true ? '#ffffff' : '#ffffff1a') : `${isFocused || isHovered ? `rgb(${appState.inputBox.borderFocus})` : `rgb(${appState.inputBox.borderColor})`} `);
  useEffect(() => {
    let style;
    if (appState.mode === 'dark') {
      if (isFocused || isHovered) {
        style = '#ffffff';
        console.log('Dark mode, focused or hovered: ', style);
      } else {
        style = '#ffffff1a';
        console.log('Dark mode, not focused or hovered: ', style);
      }
    } else {
      if (isFocused || isHovered) {
        style = `rgb(${appState.inputBox.borderFocus})`;
        console.log('Light mode, focused or hovered: ', style);
      } else {
        style = `rgb(${appState.inputBox.borderColor})`;
        console.log('Light mode, not focused or hovered: ', style);
      }
    }
    setBorderStyles(style);
  }, [appState.mode, isFocused, isHovered, appState.inputBox.borderColor, appState.inputBox.borderFocus])
  // useEffect(() => {
  //   debugger
  //   if (isOpen == true) {
  //     setActiveIndex(initial != null ? filteredItems.findIndex(item => item.value === initial.value): -1);
  //     if (listRef.current) {
  //       listRef.current.scrollToItem(
  //         activeIndex + 1,
  //         activeIndex > filteredItems.length - 5 ? "end" : "center"
  //       );
  //     }
  //   }
  // }, [isOpen, listRef.current]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        // setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    console.log(`freezeDataLoad${field?.freezeDataLoad}`);
    console.log(`disabledApiCall${disabledApiCall}`);
    if (!disabledApiCall && field?.freezeDataLoad !== true) {
      loadData();
    }
  }, [field?.getListUrl, field?.freezeDataLoad, reload, disabledApiCall]);

  const loadData = async () => {
    setLoading(true);
    try {
      debugger;
      console.log(`options${field?.freezeDataLoad}`);
      const _items =
        options || (await api.getAsync(field?.getListUrl, field?.params || ""));
      const labelKey = field?.labelKey ?? "label";
      const valueKey = field?.valueKey ?? "value";
      let _options = mapItemsToOptions(_items, labelKey, valueKey);
      _options = _options?.filter(
        (option) => !excludeOptions?.includes(option.value)
      );
      _options = includeOptions ? [...includeOptions, ..._options] : _options;
      setItems(_options);
      setFilteredItems(_options);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
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
      defaultData?.[fieldKey],
      field?.valueKey
    );
    const _default = items?.find((option) => option.value === defaultValueKey);
    const _selected = items?.find(
      (option) => option.value === (value ? value : data?.[field?.id])
    );
    const _exceptional =
      (defaultData && fieldKey === "payment_terms" && items[0]) ||
      fieldKey === "currency";
    const final = _selected || _default || _exceptional || initialValue || null;
    setInitial(final);

    setActiveIndex(
      final != null
        ? filteredItems.findIndex((item) => item.value === final.value)
        : -1
    );
  }, [items, data, defaultData, field, initialValue, filteredItems, value]);

  const clearSelection = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setQuery("");
    setInputValue("");
    setInitial(null);
    setActiveIndex(-1);
    setFilteredItems(items);
    if (comboboxRef.current) comboboxRef.current.value = "";
    handleChange?.(field?.id, null);
    onChange?.(null);
    onChangeData?.({ ...data, [id]: null });
    handleChangeData?.(field?.id, null);
    onSelectItem?.(null);
  };

  const handleItemClick = (value: Option) => {
    setInitial(value);
    setIsOpen(false);
    // setActiveIndex(-1);
    setQuery("");
    setInputValue(value.label);
    setDisplayValue(truncateText(value.label, comboboxRef));
    setFilteredItems(items); // Reset filtered items to original list

    onChange?.(value);
    onChangeData?.(value && data ? { ...data, [id]: value?.value } : null);
    handleChange?.(field?.id, value?.value);
    handleChangeData?.(field?.id, value?.value);
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

  const handleKeyDownEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const formInputs = Array.from(
        document.querySelectorAll(
          'input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
        )
      );

      const currentIndex = formInputs.indexOf(e.target as HTMLInputElement);

      // Handle jump-to logic
      const jumpToAttr = (e.target as HTMLElement).getAttribute('data-jump-to');
      if (jumpToAttr) {
        const jumpTargetElement = formInputs.find(
          (el) => el.getAttribute('data-jump-target') === jumpToAttr
        ) as HTMLElement;
        if (jumpTargetElement) {
          jumpTargetElement.focus();
          return;
        }
      }

      const isShiftKey = e.shiftKey;
      let nextIndex = isShiftKey ? currentIndex - 1 : currentIndex + 1;

      // Find next non-skipped input
      while (nextIndex >= 0 && nextIndex < formInputs.length) {
        const nextElement = formInputs[nextIndex] as HTMLElement;
        const skipAttr = nextElement.getAttribute('data-skip');
        if (skipAttr !== 'true') {
          break;
        }
        nextIndex = isShiftKey ? nextIndex - 1 : nextIndex + 1;
      }

      // Focus next available input if found
      if (nextIndex >= 0 && nextIndex < formInputs.length) {
        (formInputs[nextIndex] as HTMLElement).focus();
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
        handleKeyDownEnter(event);
      } else {
        handleKeyDownEnter(event);
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

      case "Enter":
        event.preventDefault();
        if (activeIndex >= 0 && activeIndex < filteredItems.length) {
          handleItemClick(filteredItems[activeIndex]);
        }
        break;

      case "Escape":
        setIsOpen(false);
        // setActiveIndex(-1);
        break;

      default:
        break;
    }
  };

  const sizeClasses = getSizeClasses(_customSize,appState);

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
      paddingBottom: _variant === "filled"? "1rem":"0",
      color: appState.mode == 'dark' ?'#ffffff':`rgb(${appState.inputBox.fontColor})`,
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: appState.mode == 'dark' ? '#ffffff1a' : `rgb(${appState.inputBox.borderColor})`,
      },
      "& .MuiFilledInput-underline, &:before": {
        borderBottomColor: appState.mode == 'dark' ? '#ffffff1a' : `rgb(${appState.inputBox.borderColor})`,
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: appState.mode == 'dark' ? '#ffffff' : `rgb(${appState.inputBox.borderFocus})`,
      },
      "&:hover .MuiFilledInput-underline, &:hover:before": {
        borderBottomColor: appState.mode == 'dark' ? '#ffffff' : `rgb(${appState.inputBox.borderFocus})`,
      },

      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: appState.mode == 'dark' ? '#ffffff' : `rgb(${appState.inputBox.borderFocus})`,
      },
      "&.Mui-focused .MuiFilledInput-underline, &.Mui-focused:before, &.Mui-focused:after":
      {
        borderBottomColor: appState.mode == 'dark' ? '#ffffff' : `rgb(${appState.inputBox.borderFocus})`,
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
              height:  _variant === "filled"?"2.3rem": "2rem",
              fontSize: "12px",
              lineHeight: "2rem",
              ...commonMuiStyles,
            },
            "& .MuiInputLabel-root": {
              fontSize: "12px",
              color: appState.mode == 'dark' ? '#ffffff' : `#2c2c2c`,
              transform:
                _variant === "filled"
                  ? "translate(8px, 9px) scale(1)"
                  : _variant === "standard"
                    ? "translate(0, 10px) scale(0.8)"
                    : "translate(8px, 10px) scale(0.8)",
            },
            "& .MuiInputLabel-shrink": {
              transform:
                _variant === "filled"
                  ?  "translate(8px, -15px) scale(0.90)"
                  : _variant === "standard"
                    ? "translate(0, -6px) scale(0.75)"
                    : "translate(16px, -6px) scale(0.75)",
            },
          } as SxProps<Theme>,
          regular: {
            height: "2rem",
            fontSize: "12px",
            color: appState.mode == 'dark' ? '#ffffff' : `rgb(${appState.inputBox.fontColor})`
            // padding: "0.25rem 0.75rem"
          },
        };
      case "md":
        return {
          mui: {
            "& .MuiInputBase-root": {
              height: "2.5rem",
              fontSize: "15px",
              ...commonMuiStyles,
            },
            "& .MuiInputLabel-root": {
              color: appState.mode == 'dark' ? '#ffffff' : `#2c2c2c`,
              fontSize: "12px",
              transform:
                _variant === "filled"
                  ? "translate(10px, 13px) scale(1)"
                  : _variant === "standard"
                    ? "translate(0, 13px) scale(0.9)"
                    : "translate(10px, 13px) scale(0.9)",
            },
            "& .MuiInputLabel-shrink": {
              transform:
                _variant === "filled"
                  ? "translate(8px, -15px) scale(0.90)"
                  : _variant === "standard"
                    ? "translate(0, -6px) scale(0.90)"
                    : "translate(15px, -7px) scale(0.90)",
            },
          } as SxProps<Theme>,
          regular: {
            height: "2.5rem",
            fontSize: "14px",
            color: appState.mode == 'dark' ? '#ffffff' : `rgb(${appState.inputBox.fontColor})`
            // padding: "0.5rem 1rem"
          },
        };
      case "lg":
        return {
          mui: {
            "& .MuiInputBase-root": {  
              height: "3rem",
              fontSize: "16px",
              ...commonMuiStyles,
            },
            "& .MuiInputLabel-root": {
              color: appState.mode == 'dark' ? '#ffffff' : `#2c2c2c`,
              fontSize: "14px",
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
                  ? "translate(8px, -15px) scale(0.90)"
                  : _variant === "standard"
                    ? "translate(1px,-6px) scale(0.88)"
                    : "translate(16px, -7px) scale(0.88)",
            },
          } as SxProps<Theme>,
          regular: {
            height: "3rem",
            fontSize: "16px",
            color: appState.mode == 'dark' ? '#ffffff' : `rgb(${appState.inputBox.fontColor})`
            // label: "10px",
            // padding: "0.75rem 1.25rem"
          },
        };
      case "customize":
        return {
          mui: {
            "& .MuiInputBase-root": {
              height: `${appState.inputBox.inputHeight ?? 3}rem`,
              fontSize: `${appState.inputBox.fontSize ?? 16}px`,
              fontWeight: appState.inputBox.fontWeight ?? 500,
              ...commonMuiStyles,
            },
            "& .MuiInputLabel-root": {
              color: appState.mode == 'dark' ? '#ffffff' : `#2c2c2c`,
              fontSize: `${appState.inputBox.labelFontSize ?? 14}px`,
              transform:
                _variant === "filled"
                  ? `translate(${appState?.inputBox?.adjustA ?? 10}px, ${appState?.inputBox?.adjustB ?? 20}px) scale(1)`
                  : _variant === "standard"
                    ?`translate(${appState?.inputBox?.adjustA ?? 10}px, ${appState?.inputBox?.adjustB ?? 10}px) scale(1)`
                    : `translate(${appState?.inputBox?.adjustA ?? 10}px, ${appState?.inputBox?.adjustB ?? 15}px) scale(1)`,
            },
            "& .MuiInputLabel-shrink": {
              transform:
                _variant === "filled"
                  ? `translate(${appState?.inputBox?.adjustC ?? 8}px, ${appState?.inputBox?.adjustD ?? -1}px) scale(0.88)`
                  : _variant === "standard"
                    ? `translate(${appState?.inputBox?.adjustC ?? 1}px, ${appState?.inputBox?.adjustD ?? -6}px) scale(0.88)`
                    : `translate(${appState?.inputBox?.adjustC ?? 15}px, ${appState?.inputBox?.adjustD ?? -9}px) scale(0.88)`,
            },
          } as SxProps<Theme>,
          regular: {
            height: `${appState.inputBox.inputHeight ?? 2.5}rem`,
            fontSize: `${appState.inputBox.fontSize ?? 15}px`,
            fontWeight: appState.inputBox.fontWeight,
            color: appState.mode == 'dark' ? '#ffffff' : `rgb(${appState.inputBox.fontColor})`

          },
        };
      default:
        return styles;
    }
  };
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
            fontSize: `${appState.inputBox.fontSize ?? 15}px`,
          };
        default:
          return {};
      }
    };

    const handleItemSelect = (event: any, value: Option | null) => {
      if (value) {
        handleItemClick(value);
      }
    };
    return (
      <div className={className}>
        <Autocomplete
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
        />
         <Typography
            className="text-[#374151] text-xs font-medium mt-1">
          {infoWithLineBreaks(info)}
          </Typography>
        {validation && (
          <div className="mt-1 text-xs text-[#ef4444]">{validation}</div>
        )}
      </div>
    );
  };
  const { height, fontSize, fontWeight, color, } = sizeStyles.regular;

if (_useMUI == undefined || _useMUI == false){      
  return (
    <div className="relative" ref={componentRef}>
      {!noLabel && (
        <label
          htmlFor={id}
          // className={`block ${sizeClasses?.label} font-medium text-gray-700`}
          className={`capitalize block  text-gray-700  ${appState.mode == 'dark' ? 'form-label':""}  ${sizeClasses?.label}`}
          style={{
              fontSize: _customSize
                ? _customSize === "sm"
                  ? "12px"
                  : _customSize === "md"
                  ? "14px"
                  :  _customSize === "lg"
                  ?"16px": `${appState.inputBox.labelFontSize}px`
                : `14px`,
                transform: _customSize ==="customize" ?`translate(${appState?.inputBox?.adjustA ?? 10}px, ${
                  appState?.inputBox?.adjustB ?? 10 }px) scale(1)`:``,
            }}
        >
         
          {label || id?.replaceAll("_", " ")}
          {required && <span className="text-[#ef4444]"> *</span>}
        </label>
      )}
      <Combobox
        onKeyDown={handleKeyDownEnter}
        data-skip={skip}
        disabled={disabled}
        value={initial}
        // onChange={handleItemClick}
        as="div"
        className="relative"
      >
        <div className={className}>
      
          <Combobox.Input
         
          style={{
            height,
            fontSize,
            fontWeight,
            color,
            borderColor: borderStyles,
            "--tw-ring-shadow": "none",
            outline:"none",
            transition: "border-color 0.2s ease-in-out",
            borderRadius: `${appState.inputBox.borderRadius}px`,
         
          } as React.CSSProperties}
            // className={`w-full appearance-none rounded border border-gray-300 ${
            //   sizeClasses?.input
            // } ${disabled ? "text-gray-400" : "bg-white text-gray-900"} ${
            //   enableClearOption ? "pr-16" : "pr-10"
            // } placeholder-gray-400 focus:ring-1 focus:border-[#3b82f6] focus:bg-white focus:outline-none focus:ring-[#3b82f6]`}
            className={`form-control ${ sizeClasses?.input } 
              placeholder:capitalize  
             `}
            displayValue={() => inputValue || initial?.label || ""}
            onChange={handleInputChange}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            placeholder={
              t("select") + " " + (label || id?.replaceAll("_", " "))
            }
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}

            ref={comboboxRef}
            autoComplete="off"
            spellCheck={false}
            autoFocus={autoFocus}
            title={initial?.label || ""}
            value={isOpen ? inputValue : initial?.label || ""}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-1">
            {enableClearOption && (initial || inputValue) && !noXMarkIcon && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                  setIsOpen(false);
                }}
                className="p-1 hover:bg-gray-100 rounded-full"
                aria-label="Clear selection"
              >
                <XMarkIcon
                  className={`${sizeClasses?.icons} text-gray-400 hover:text-gray-500`}
                  aria-hidden="true"
                />
              </button>
            )}
            <Combobox.Button
              className="p-1 hover:bg-gray-100 rounded-full"
              onClick={() => !disabled && setIsOpen(!isOpen)}
            >
              <ChevronDownIcon
                className={`${
                  sizeClasses?.icons
                } text-gray-400 hover:text-gray-500 transition-transform duration-200 ${
                  isOpen ? "transform rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
        </div>
        <Transition
          show={isOpen}
          as={React.Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => {
            if (!initial) {
              setQuery("");
              setInputValue("");
              // setActiveIndex(-1);
            }
          }}
        >
          <Combobox.Options
            className={`absolute z-50 mt-2 w-full min-w-[200px] rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden ${sizeClasses.options}`}
            static
          >
            {loading ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
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
              />
            )}
          </Combobox.Options>
        </Transition>
      </Combobox>
      {validation && (
        <div className="mt-1 text-xs text-[#ef4444]">{validation}</div>
      )}
    </div>
  );
}
}