import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';

// Types
interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectEvent {
  value: string | number;
  option: Option;
}

interface ERPSimpleComboboxProps {
  options: Option[];
  value?: string | number;
  onSelectItem?: (event: SelectEvent) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onInput?: (event: React.FormEvent<HTMLInputElement>) => void;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  noLabel?: boolean;
  noBorder?: boolean;
  readOnly?: boolean;
  tabIndex?: number;
  placeholder?: string;
  disabled?: boolean;
}

export interface ERPSimpleComboboxRef {
  focus: () => void;
  select: () => void;
  blur: () => void;
  getValue: () => string | number | undefined;
  setValue: (value: string | number) => void;
}

const ERPSimpleCombobox = forwardRef<ERPSimpleComboboxRef, ERPSimpleComboboxProps>(
  (
    {
      options = [],
      value,
      onSelectItem,
      onFocus,
      onBlur,
      onKeyDown,
      onInput,
      id,
      className = '',
      style,
      noLabel = false,
      noBorder = false,
      readOnly = false,
      tabIndex = 0,
      placeholder = 'Select an option...',
      disabled = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [internalValue, setInternalValue] = useState<string | number | undefined>(value);
    
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      select: () => inputRef.current?.select(),
      blur: () => inputRef.current?.blur(),
      getValue: () => internalValue,
      setValue: (newValue: string | number) => setInternalValue(newValue),
    }));

    // Update internal value when prop changes
    useEffect(() => {
      setInternalValue(value);
    }, [value]);

    // Filter options based on search term
    const filteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get display value
    const getDisplayValue = () => {
      if (internalValue !== undefined) {
        const selectedOption = options.find(opt => opt.value === internalValue);
        return selectedOption?.label || '';
      }
      return searchTerm;
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchTerm = e.target.value;
      setSearchTerm(newSearchTerm);
      setIsOpen(true);
      setHighlightedIndex(-1);
      
      if (onInput) {
        onInput(e);
      }
    };

    // Handle option selection
    const handleSelectOption = (option: Option) => {
      if (option.disabled) return;
      
      setInternalValue(option.value);
      setSearchTerm('');
      setIsOpen(false);
      setHighlightedIndex(-1);
      
      if (onSelectItem) {
        onSelectItem({
          value: option.value,
          option
        });
      }
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (onKeyDown) {
        onKeyDown(e);
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex(prev => 
              prev < filteredOptions.length - 1 ? prev + 1 : prev
            );
          }
          break;
        
        case 'ArrowUp':
          e.preventDefault();
          if (isOpen) {
            setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
          }
          break;
        
        case 'Enter':
          e.preventDefault();
          if (isOpen && highlightedIndex >= 0) {
            handleSelectOption(filteredOptions[highlightedIndex]);
          } else if (!isOpen) {
            setIsOpen(true);
          }
          break;
        
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setHighlightedIndex(-1);
          setSearchTerm('');
          break;
        
        case 'Tab':
          setIsOpen(false);
          break;
      }
    };

    // Handle focus
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!readOnly && !disabled) {
        setIsOpen(true);
      }
      
      if (onFocus) {
        onFocus(e);
      }
    };

    // Handle blur
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Delay hiding to allow for option clicks
      setTimeout(() => {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }, 150);
      
      if (onBlur) {
        onBlur(e);
      }
    };

    // Base input classes
    const inputClasses = [
      'w-full',
      'px-3 py-2',
      'text-sm',
      'focus:outline-none focus:ring-2 focus:ring-blue-500',
      !noBorder && 'border border-gray-300 rounded-md',
      disabled && 'bg-gray-100 cursor-not-allowed',
      readOnly && 'bg-gray-50',
      className
    ].filter(Boolean).join(' ');

    return (
      <div ref={containerRef} className="relative">
        <input
          ref={inputRef}
          type="text"
          id={id}
          value={isOpen ? searchTerm : getDisplayValue()}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={inputClasses}
          style={style}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          tabIndex={tabIndex}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />
        
        {/* Dropdown arrow */}
        {!readOnly && !disabled && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}

        {/* Options dropdown */}
        {isOpen && !readOnly && !disabled && (
          <ul
            ref={listRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            role="listbox"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500">No options found</li>
            ) : (
              filteredOptions.map((option, index) => (
                <li
                  key={`${option.value}-${index}`}
                  className={[
                    'px-3 py-2 text-sm cursor-pointer',
                    'hover:bg-blue-50',
                    highlightedIndex === index && 'bg-blue-100',
                    option.disabled && 'text-gray-400 cursor-not-allowed bg-gray-50',
                    internalValue === option.value && 'bg-blue-500 text-white hover:bg-blue-600'
                  ].filter(Boolean).join(' ')}
                  onClick={() => !option.disabled && handleSelectOption(option)}
                  role="option"
                  aria-selected={internalValue === option.value}
                >
                  {option.label}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    );
  }
);

ERPSimpleCombobox.displayName = 'ERPSimpleCombobox';

export default ERPSimpleCombobox;