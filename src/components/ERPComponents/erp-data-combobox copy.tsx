import React, { useState, useEffect, useCallback } from "react";
import {
  TextField,
  Autocomplete,
  CircularProgress,
  InputAdornment,
  Theme,
  SxProps
} from "@mui/material";
import { APIClient } from "../../helpers/api-client";

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
  multiple?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  initialValue?: any;
  isPaginated?: boolean;
  disabledApiCall?: boolean;
  validation?: string;
  customSize?: "sm" | "md" | "lg" | "auto";
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  variant?: "filled" | "outlined" | "standard";
}

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

export default function MUIERPDataCombobox({
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
  customSize = "sm",
  color = "primary",
  variant = "outlined",
}: ERPDataComboboxProps) {
  const [items, setItems] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [initial, setInitial] = useState<Option | null>(initialValue);

  // Get size-specific styles
  const getSizeStyles = () => {
    switch (customSize) {
      case "sm":
        return {
          "& .MuiInputBase-root": {
            height: "2rem",
            fontSize: "12px",
            margin:"0"
          },
          "& .MuiInputLabel-root": {
            fontSize: "12px",
            transform: variant === "filled"
              ? "translate(8px, 10px) scale(0.8)"
              : variant === "standard"
                ? "translate(0, 10px) scale(0.8)"
                : "translate(8px, 10px) scale(0.8)"
          },  
          "& .MuiInputLabel-shrink": {
            transform: variant === "filled"
              ? "translate(8px, -10px) scale(0.75)"
              : variant === "standard"
                ? "translate(0, -6px) scale(0.75)"
                : "translate(16px, -6px) scale(0.75)"
          }
        } as SxProps<Theme>;
      case "md":
        return {
          "& .MuiInputBase-root": {
            height: "2.5rem",
            fontSize: "14px",
            margin:"0"
          },
          "& .MuiInputLabel-root": {
            fontSize: "14px",
            transform: variant === "filled"
              ? "translate(10px, 13px) scale(0.9)"
              : variant === "standard"
                ? "translate(0, 13px) scale(0.9)"
                : "translate(10px, 13px) scale(0.9)"
          },
          "& .MuiInputLabel-shrink": {
            transform: variant === "filled"
              ? "translate(8px, -11px) scale(0.75)"
              : variant === "standard"
                ? "translate(0, -4px) scale(0.75)"
                : "translate(16px, -6px) scale(0.75)"
          }
        } as SxProps<Theme>;
      case "lg":
        return {
          "& .MuiInputBase-root": {
            height: "3rem",
            fontSize: "16px",
            margin:"0"
          },
          "& .MuiInputLabel-root": {
            fontSize: "14px",
            transform: variant === "filled"
              ? "translate(10px, 15px) scale(1)"
              : variant === "standard"
                ? "translate(0, 15px) scale(1)"
                : "translate(10px, 15px) scale(1)"
          },
          "& .MuiInputLabel-shrink": {
            transform: variant === "filled"
              ? "translate(8px, -12px) scale(0.88)"
              : variant === "standard"
                ? "translate(0, -3px) scale(0.88)"
                : "translate(14px, -7px) scale(0.88)"
          }
        } as SxProps<Theme>;
      default:
        return {};
    }
  };

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
      default:
        return {};
    }
  };

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
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleItemSelect = (event: any, value: Option | null) => {
    setInitial(value);
    onChange?.(value);
    onChangeData?.(value && data ? { ...data, [id]: value?.value } : null);
    handleChange?.(field?.id, value?.value);
    handleChangeData?.(field?.id, value?.value);
    onSelectItem?.(value);
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
            label={!noLabel ? (label || id?.replaceAll("_", " ")) : undefined}
            required={required}
            variant={variant}
            color={color}
            sx={getSizeStyles()}
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
            }}
          >
            {option.label}
          </li>
        )}
      />
      {validation && (
        <div className="mt-1 text-xs text-[#ef4444]">{validation}</div>
      )}
    </div>
  );
}