"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Combobox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import { FixedSizeList as List } from "react-window";
import { APIClient } from "../../helpers/api-client";
import { setFgAccordingToBgPrimary } from "../../utilities/Utils";

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
  // value?: any;
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
}

interface RowProps {
  data: {
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

const Row = ({ data, index, style }: RowProps) => {

  const { items, selectedValue, handleSelect, activeIndex } = data;
  const item = items[index];
  const isSelected = selectedValue?.value === item.value;
  const isActive = activeIndex === index;

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
        }`
      }
      value={item}
      disabled={!item.is_active}
    >
      {({ active }) => (
        <div
          className={`flex items-center px-3 py-2 ${isSelected ? "bg-primary" : ""
            }`}
          onClick={() => handleSelect(item)}
        >
          <div className="flex-shrink-0 w-5">
            {isSelected && (
              <CheckIcon
                className={`h-5 w-5 ${setFgAccordingToBgPrimary()}`}
                aria-hidden="true"
              />
            )}
          </div>
          <span
            className={`block truncate flex-grow ${isSelected ? "font-medium" : "font-normal"
              } ${isSelected ? setFgAccordingToBgPrimary() : ''}`}
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
  }
>((props, ref) => {
  const { items, selectedValue, onSelect, activeIndex } = props;

  const itemData = {
    items,
    selectedValue,
    handleSelect: onSelect,
    activeIndex,
  };

  return (
    <List
      height={LIST_HEIGHT}
      itemCount={items?.length}
      itemSize={ITEM_HEIGHT}
      width="100%"
      ref={ref}
      itemData={itemData}
      className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
    >
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
  options,
  field,
  defaultData,
  data,
  noLabel,
  noXMarkIcon,
  required,
  excludeOptions,
  includeOptions,
  multiple,
  autoFocus,
  disabled = false,
  initialValue,
  className,
  disabledApiCall = false,
  validation,
  skip,
  jumpTo,      
  jumpTarget, 
  enableClearOption = true,
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

  useEffect(() => {
    if (initial?.label) {
      setDisplayValue(truncateText(initial.label, comboboxRef));
    } else {
      setDisplayValue("");
    }
  }, [initial]);
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
    if (!disabledApiCall && field?.freezeDataLoad !== true) {
      loadData();
    }
  }, [field?.getListUrl, field?.freezeDataLoad, disabledApiCall]);

  const loadData = async () => {
    setLoading(true);
    try {
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
      (option) => option.value === data?.[field?.id]
    );
    const _exceptional =
      (defaultData && fieldKey === "payment_terms" && items[0]) ||
      fieldKey === "currency";
    const final = _selected || _default || _exceptional || initialValue || null;
    setInitial(final);

    setActiveIndex(final != null ? filteredItems.findIndex(item => item.value === final.value) : -1);
  }, [items, data, defaultData, field, initialValue, filteredItems]);

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
      const inputs = Array.from(document.querySelectorAll('input:not([disabled])'));
      const currentIndex = inputs.indexOf(e.target as HTMLInputElement);
      let nextIndex = currentIndex + 1;

      // Skip elements with skip={true}
      while (nextIndex < inputs.length) {
        const nextElement = inputs[nextIndex] as HTMLInputElement;
        const skipAttr = nextElement.getAttribute('data-skip');
        if (skipAttr !== 'true') {
          break;
        }
        nextIndex++;
      }

      if (nextIndex < inputs.length) {
        (inputs[nextIndex] as HTMLInputElement).focus();
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



  return (
    <div className="relative" ref={componentRef}>
      {!noLabel && (
        <label
          htmlFor={id}
          className="block text-[12px] font-medium text-gray-700 mb-1"
        >
          {/* {activeIndex}: {initial?.value} : {filteredItems[activeIndex]?.value}: {filteredItems[activeIndex]?.label} */}
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
            className={`w-full appearance-none rounded border border-gray-300 h-9 ${disabled ? "text-gray-400" : "bg-white text-gray-900"
              } px-3 py-2 ${enableClearOption ? "pr-16" : "pr-10"
              } placeholder-gray-400 focus:ring-1 text-xs focus:border-[#3b82f6] focus:bg-white focus:outline-none focus:ring-[#3b82f6]`}
            displayValue={() => inputValue || initial?.label || ""}
            onChange={handleInputChange}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            placeholder={
              t("select") + " " + (label || id?.replaceAll("_", " "))
            }
            ref={comboboxRef} autoComplete="off"
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
                  className="h-5 w-5 text-gray-400 hover:text-gray-500"
                  aria-hidden="true"
                />
              </button>
            )}
            <Combobox.Button
              className="p-1 hover:bg-gray-100 rounded-full"
              onClick={() => !disabled && setIsOpen(!isOpen)}
            >
              <ChevronDownIcon
                className={`h-5 w-5 text-gray-400 hover:text-gray-500 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""
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
            className="absolute z-50 mt-2 w-full min-w-[200px] rounded-md bg-white text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
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
