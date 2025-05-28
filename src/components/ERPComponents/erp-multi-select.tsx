
import { useState, useEffect, useRef } from 'react';
import ERPInput from '../../components/ERPComponents/erp-input';
import ERPCheckbox from '../../components/ERPComponents/erp-checkbox';
import { APIClient } from '../../helpers/api-client';
import ReactDOM from 'react-dom';

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
  options?: OptionItem[];
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
  optionUrl?: string;
}

const api = new APIClient();

export default function ERPMultiSelect({
  label,
  icon: Icon,
  options = [],
  selectedValues = [],
  onChange,
  placeholder = 'Select items',
  displayFormatter = (items) => items.map((item) => item.name).join(', '),
  searchPlaceholder = 'Search...',
  maxHeight = 'max-h-60',
  outputFormat = 'array',
  className = '',
  id,
  disabled = false,
  optionUrl = '',
}: ERPMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [branchOptions, setBranchOptions] = useState<OptionItem[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  // Process input selectedValues to standardized format (array of objects)
  const normalizedSelectedValues = useRef<(OptionItem | undefined)[]>([]);

  // Set branchOptions based on options prop or optionUrl
  useEffect(() => {
    if (options.length > 0) {
      setBranchOptions(options);
    } else if (optionUrl) {
      const fetchBranchOptions = async () => {
        try {
          const branchData = await api.getAsync(optionUrl);
          setBranchOptions(branchData);
        } catch (error) {
          console.error('Error fetching branches:', error);
          setBranchOptions([]);
        }
      };
      fetchBranchOptions();
    } else {
      // Fallback to empty array if neither options nor optionUrl is provided
      setBranchOptions([]);
    }
  }, []);

  // Normalize selectedValues based on branchOptions
  useEffect(() => {
    if (!selectedValues) {
      normalizedSelectedValues.current = [];
    } else if (typeof selectedValues === 'string') {
      // Convert comma-separated string to array of IDs
      const ids = selectedValues
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id);

      // Find matching options by ID or name
      normalizedSelectedValues.current = ids
        .map((id) => {
          return branchOptions.find(
            (opt) => String(opt.id) === id || opt.name === id
          );
        })
        .filter((item) => item); // Remove undefined values
    } else if (Array.isArray(selectedValues)) {
      // If already array, normalize to ensure all items have id and name
      normalizedSelectedValues.current = selectedValues
        .map((val) => {
          if (typeof val === 'object' && val !== null) {
            return val;
          } else {
            // If primitive value, try to find matching option
            return branchOptions.find(
              (opt) => String(opt.id) === String(val) || opt.name === val
            );
          }
        })
        .filter((item) => item); // Remove undefined values
    }

    // Update isAllSelected based on whether all branchOptions are selected
    setIsAllSelected(
      branchOptions.length > 0 &&
        normalizedSelectedValues.current.length === branchOptions.length &&
        branchOptions.every((opt) =>
          normalizedSelectedValues.current.some(
            (item) => item?.id === opt.id
          )
        )
    );
  }, [selectedValues, branchOptions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: OptionItem) => {
    let newSelectedValues: (OptionItem | undefined)[];

    if (
      normalizedSelectedValues.current.some(
        (item: any) => item?.id === option.id
      )
    ) {
      newSelectedValues = normalizedSelectedValues.current.filter(
        (item: any) => item?.id !== option.id
      );
    } else {
      newSelectedValues = [...normalizedSelectedValues.current, option];
    }

    // Format output according to outputFormat preference
    if (outputFormat === 'string') {
      onChange(newSelectedValues.map((item) => item!.id).join(','));
    } else {
      onChange(newSelectedValues);
    }

    // Update the ref for local state
    normalizedSelectedValues.current = newSelectedValues;

    // Update isAllSelected
    setIsAllSelected(
      branchOptions.length > 0 &&
        newSelectedValues.length === branchOptions.length &&
        branchOptions.every((opt) =>
          newSelectedValues.some((item) => item?.id === opt.id)
        )
    );
  };

  const handleSelectAll = () => {
    let newSelectedValues: (OptionItem | undefined)[];
    if (!isAllSelected) {
      // Select all filtered options
      newSelectedValues = [...branchOptions];
    } else {
      // Deselect all
      newSelectedValues = [];
    }

    // Format output according to outputFormat preference
    if (outputFormat === 'string') {
      onChange(newSelectedValues.map((item) => item!.id).join(','));
    } else {
      onChange(newSelectedValues);
    }

    // Update the ref for local state
    normalizedSelectedValues.current = newSelectedValues;

    // Toggle isAllSelected
    setIsAllSelected(!isAllSelected);
  };

  const filteredOptions = branchOptions.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayValue =
    normalizedSelectedValues.current.length > 0
      ? displayFormatter(
          normalizedSelectedValues.current.filter(
            (item): item is OptionItem => item !== undefined
          )
        )
      : placeholder;

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <ERPInput
        label={label}
        value={
          displayValue.length > 77
            ? displayValue.substring(0, 77) + '...'
            : displayValue
        }
        placeholder={placeholder}
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        id={id || ''}
      />

      {isOpen &&
        ReactDOM.createPortal(
          <div
            style={{
              position: 'absolute',
              top: dropdownRef.current
                ? dropdownRef.current.getBoundingClientRect().top +
                  window.scrollY +
                  dropdownRef.current.offsetHeight +
                  'px'
                : '0',
              left: dropdownRef.current
                ? dropdownRef.current.getBoundingClientRect().left +
                  window.scrollX +
                  'px'
                : '0',
              width: dropdownRef.current
                ? dropdownRef.current.offsetWidth + 'px'
                : 'auto',
              zIndex: 1000,
            }}
            className="mt-1 h-auto bg-slate-50 border border-gray-200 rounded-lg shadow-lg"
          >
            <div className="p-2 sticky top-0 bg-white border-b">
              <ERPInput
                noLabel={true}
                value={searchTerm}
                placeholder={searchPlaceholder}
                disabled={disabled}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setSearchTerm(e.target.value)}
                id={id || ''}
              />
            </div>
            <div className="p-2 border-b">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 text-[#2563EB] rounded border-gray-300 focus:ring-[#3B82F6]"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  onClick={(e) => e.stopPropagation()}
                />
                <span>Select All</span>
              </div>
            </div>
            <div className={`option-list ${maxHeight} ${className} overflow-y-auto`}>
              {filteredOptions.map((option) => (
                <div
                  key={option.id}
                  className={`px-4 py-2 cursor-pointer hover:bg-[#EFF6FF] ${
                    Array.isArray(selectedValues) &&
                    selectedValues.some((item: any) => item?.id === option.id)
                      ? 'bg-[#DBEAFE] font-medium'
                      : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                 
                  }}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 h-4 w-4 text-[#2563EB] rounded border-gray-300 focus:ring-[#3B82F6]"
                      checked={
                        Array.isArray(selectedValues) &&
                        selectedValues.some((item: any) => item?.id === option.id)
                      }
                      onChange={()=>  handleSelect(option)}
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
          </div>,
          document.body
        )}
    </div>
  );
}
