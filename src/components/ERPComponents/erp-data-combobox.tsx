"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Combobox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import { APIClient } from "../../helpers/api-client";
import ERPElementValidationMessage from "./erp-element-validation-message";

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
  noXMarkIcon?: boolean;
  multiple?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  initialValue?: any;
  isPaginated?: boolean;
  disabledApiCall?: boolean;
  validation?: string;
  enableClearOption?: boolean;
}

const ITEMS_PER_PAGE = 50;
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

  // Create temporary span to measure text width
  const tempSpan = document.createElement("span");
  tempSpan.style.visibility = "hidden";
  tempSpan.style.position = "absolute";
  tempSpan.style.whiteSpace = "nowrap";

  // Copy input styles for accurate measurement
  const inputStyle = window.getComputedStyle(inputRef.current);
  tempSpan.style.font = inputStyle.font;
  document.body.appendChild(tempSpan);

  // Calculate available width (input width minus padding and button space)
  const availableWidth = inputRef.current.offsetWidth - 60; // Adjusted for padding and buttons

  // Check if text needs truncation
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

export default function ImprovedERPDataCombobox({
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
  enableClearOption = true,
}: ERPDataComboboxProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [initial, setInitial] = useState<Option | null>(initialValue);
  const [filteredItems, setFilteredItems] = useState<Option[]>([]);
  const [visibleItems, setVisibleItems] = useState<Option[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [displayValue, setDisplayValue] = useState(""); // New state for truncated display value
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const comboboxRef = useRef<HTMLInputElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  // Update display value when initial value changes
  useEffect(() => {
    if (initial?.label) {
      setDisplayValue(truncateText(initial.label, comboboxRef));
    } else {
      setDisplayValue("");
    }
  }, [initial]);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

      // Filter out excluded options
      _options = _options?.filter(
        (option) => !excludeOptions?.includes(option.value)
      );

      // Add included options at the beginning if they exist
      _options = includeOptions ? [...includeOptions, ..._options] : _options;

      setItems(_options);
      setFilteredItems(_options);
      setVisibleItems(_options?.slice(0, ITEMS_PER_PAGE));
      setHasMore(_options.length > ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true);
          const nextPage = page + 1;
          const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
          const endIndex = startIndex + ITEMS_PER_PAGE;

          // Add delay to prevent rapid scrolling
          await new Promise((resolve) => setTimeout(resolve, 100));

          setVisibleItems((prev) => {
            const newItems = [
              ...prev,
              ...filteredItems.slice(startIndex, endIndex),
            ];
            setHasMore(newItems.length < filteredItems.length);
            return newItems;
          });

          setPage(nextPage);
          setIsLoadingMore(false);
        }
      },
      {
        threshold: 0.1,
        root: containerRef.current,
        rootMargin: "20px",
      }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef && hasMore) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [filteredItems, page, hasMore, isLoadingMore]);

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
    setInitial(_selected || _default || _exceptional || initialValue || null);
  }, [items, data, defaultData, field, initialValue]);

  const filterItems = useCallback(
    (inputValue: string) => {
      const words = inputValue?.toLowerCase()?.split(/\s+/);
      const filtered = items?.filter((item) => {
        const itemWords = item?.label?.toLowerCase()?.split(/\s+/);
        return words.every((word) =>
          itemWords?.some((itemWord) => itemWord?.startsWith(word))
        );
      });

      setPage(1);
      setVisibleItems(filtered?.slice(0, ITEMS_PER_PAGE));
      setHasMore(filtered?.length > ITEMS_PER_PAGE);
      return filtered;
    },
    [items]
  );

  useEffect(() => {
    setFilteredItems(filterItems(query));
  }, [query, filterItems]);

  const clearSelection = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setQuery("");
    setInitial(null);
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
    onChange?.(value);
    onChangeData?.(value && data && { ...data, [id]: value?.value });
    handleChange?.(field?.id, value?.value);
    handleChangeData?.(field?.id, value?.value);
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative" ref={componentRef}>
      {!noLabel && (
        <label
          htmlFor={id}
          className="block text-[12px] font-medium text-gray-700 mb-1"
        >
          {label || id?.replaceAll("_", " ")}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <Combobox
        disabled={disabled}
        value={initial}
        onChange={handleItemClick}
        as="div"
        className="relative"
      >
        <div className={className}>
          {/* <Combobox.Input
            className={`w-full appearance-none rounded border border-gray-300 h-9 pr-[50px] ${
              disabled ? "text-gray-400" : "bg-white text-gray-900"
            } px-3 py-2 ${
              enableClearOption ? "pr-2" : "pr-20"
            } placeholder-gray-400 focus:ring-1 text-xs focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500`}
            displayValue={(item: Option) => item?.label || ""}
            onChange={(event) => {
              setQuery(event?.target?.value);
              setIsOpen(true); // Always open when typing
            }}
            onClick={handleInputClick}
            placeholder={
              t("select") + " " + (label || id?.replaceAll("_", " "))
            }
            ref={comboboxRef}
          /> */}
          <Combobox.Input
            className={`w-full appearance-none rounded border border-gray-300 h-9 pr-[47px] ${
              disabled ? "text-gray-400" : "bg-white text-gray-900"
            } px-3 py-2 ${
              enableClearOption ? "pr-2" : "pr-20"
            } placeholder-gray-400 focus:ring-1 text-xs focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500`}
            displayValue={(item: Option) =>
              isOpen ? item?.label || "" : displayValue
            }
            onChange={(event) => {
              setQuery(event?.target?.value);
              setIsOpen(true);
            }}
            onClick={handleInputClick}
            placeholder={
              t("select") + " " + (label || id?.replaceAll("_", " "))
            }
            ref={comboboxRef}
            title={initial?.label || ""} // Add tooltip for full text
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-0 bg-[#ffffff4d] border-l">
            {enableClearOption && initial && !noXMarkIcon && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                  setIsOpen(false);
                }}
                className="p-0 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon
                  className="h-5 w-5 text-gray-400 hover:text-gray-500"
                  aria-hidden="true"
                />
              </button>
            )}
            <Combobox.Button
              className="p-1 hover:bg-gray-100 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
            >
              <ChevronDownIcon
                className={`h-5 w-5 text-gray-400 hover:text-gray-500 transition-transform duration-200 ${
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
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options
            className="absolute z-50 mt-2 w-full min-w-[200px] rounded-md bg-white text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto"
            ref={containerRef}
          >
            {loading ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Loading...
              </div>
            ) : visibleItems?.length === 0 ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                No data found
              </div>
            ) : (
              <>
                {visibleItems?.map((item, index) => (
                  <Combobox.Option
                    key={`${item?.value}-${index}`}
                    className={({ active }) =>
                      `${
                        item.is_active === false ? "hidden" : "relative"
                      } cursor-pointer  select-none py-2 pl-10 pr-4 ${
                        active ? "bg-primary text-white" : "text-gray-900"
                      }`
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {item.label}
                        </span>
                        {selected && (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-accent"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))}
                {hasMore && (
                  <div
                    ref={observerRef}
                    className="h-4 flex items-center justify-center"
                  >
                    {isLoadingMore && (
                      <div className="text-xs text-gray-500">
                        Loading more...
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </Combobox.Options>
        </Transition>
      </Combobox>
      <ERPElementValidationMessage validation={validation} />
    </div>
  );
}
