import { useState, useEffect, useRef } from 'react';
import ERPInput from "../../components/ERPComponents/erp-input";
import ERPCheckbox from "../../components/ERPComponents/erp-checkbox";

// Define TypeScript interfaces
interface OptionItem {
  id: string | number;
  name: string;
  [key: string]: any; // Additional properties are allowed
}

type SelectedValueInput =
  | OptionItem[]
  | (string | number)[]
  | string
  | null
  | undefined;

interface ERPMultiSelectProps {
  label?: string;
  icon?: React.ComponentType<{ className?: string }>;
  options: OptionItem[];
  selectedValues?: SelectedValueInput;
  onChange: (value: any) => void;
  placeholder?: string;
  displayFormatter?: (items: OptionItem[]) => string;
  searchPlaceholder?: string;
  maxHeight?: string;
  outputFormat?: 'array' | 'string';
  className?: string;
  id?: string;
  disabled?: boolean;
}

export default function ERPMultiSelect({
  label,
  icon: Icon,
  options = [],
  selectedValues = [],
  onChange,
  placeholder = "Select items",
  displayFormatter = (items) => items.map(item => item.name).join(', '),
  searchPlaceholder = "Search...",
  maxHeight = "max-h-60",
  outputFormat = "array",
  className = "",
  id,
  disabled = false
}: ERPMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<any>(null);

  // Process input selectedValues to standardized format (array of objects)
  const normalizedSelectedValues = useRef<(OptionItem | undefined)[]>([]);

  useEffect(() => {
    // Convert input value (string or array) to normalized array of objects
    if (!selectedValues) {
      normalizedSelectedValues.current = [];
    } else if (typeof selectedValues === 'string') {
      // Convert comma-separated string to array of IDs
      const ids = selectedValues
        .split(',')
        .map(id => id.trim())
        .filter(id => id);

      // Find matching options by ID or name
      normalizedSelectedValues.current = ids
        .map(id => {
          // Try to find option by ID (string or number)
          return options.find(opt =>
            String(opt.id) === id ||
            opt.name === id
          );
        })
        .filter(item => item); // Remove undefined values
    } else if (Array.isArray(selectedValues)) {
      // If already array, normalize to ensure all items have id and name
      normalizedSelectedValues.current = selectedValues
        .map(val => {
          if (typeof val === 'object' && val !== null) {
            return val;
          } else {
            // If primitive value, try to find matching option
            return options.find(opt =>
              String(opt.id) === String(val) ||
              opt.name === val
            );
          }
        })
        .filter(item => item); // Remove undefined values
    }
  }, [selectedValues, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: any) => {
    let newSelectedValues;

    if (normalizedSelectedValues.current.some((item: any) => item.id === option.id)) {
      newSelectedValues = normalizedSelectedValues.current.filter((item: any) => item.id !== option.id);
    } else {
      newSelectedValues = [...normalizedSelectedValues.current, option];
    }

    // Format output according to outputFormat preference
    if (outputFormat === 'string') {
      onChange(newSelectedValues.map(item => item.id).join(','));
    } else {
      onChange(newSelectedValues);
    }

    // Update the ref for local state
    normalizedSelectedValues.current = newSelectedValues;
  };

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayValue = normalizedSelectedValues.current.length > 0
    ? displayFormatter(normalizedSelectedValues.current.filter((item): item is OptionItem => item !== undefined))
    : placeholder;

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      <ERPInput
        label={label}
        value={displayValue}
        placeholder={placeholder}
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        id={''}
      />

      {isOpen && (
        <div className={`absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg ${maxHeight} overflow-y-auto`}>
          <div className="p-2 sticky top-0 bg-white border-b">
            <ERPInput
              noLabel={true}
              value={searchTerm}
              placeholder={searchPlaceholder}
              disabled={disabled}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setSearchTerm(e.target.value)}
              id={''}
            />
            {/* <input
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            /> */}
          </div>
          <div className="option-list">
            {filteredOptions.map((option) => (
              <div
                key={option.id}
                className={`px-4 py-2 cursor-pointer hover:bg-[#EFF6FF] ${Array.isArray(selectedValues) &&
                  selectedValues.some((item: any) => item.id === option.id)
                  ? "bg-[#DBEAFE] font-medium"
                  : ""
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(option);
                }}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 text-[#2563EB] rounded border-gray-300 focus:ring-[#3B82F6]"
                    checked={Array.isArray(selectedValues) && selectedValues.some((item: any) => item.id === option.id)}
                    onChange={() => { }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  {option.name}
                </div>
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No matching options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}