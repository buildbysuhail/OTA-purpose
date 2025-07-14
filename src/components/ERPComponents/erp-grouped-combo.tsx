"use client"
import { Combobox, Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import { Fragment, useState, useMemo } from "react"

export interface Option {
  id: any
  label: string
}

export interface OptionGroup {
  groupName: string
  options: Option[]
}

export interface GroupedComboboxProps {
  options: OptionGroup[]
  value?: string | null // Changed to string instead of Option
  onChange: (id: string | null) => void // Changed to return only id
  placeholder?: string
  label?: string
  className?: string
  disabled?: boolean
}


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export default function ERPGroupedCombobox({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  label,
  className = "",
  disabled = false,
}: GroupedComboboxProps) {
  const [query, setQuery] = useState("")

  // Flatten all options for easy lookup
  const allOptions = useMemo(() => options.flatMap((group) => group.options), [options])

  // Find the selected option based on the string value
  const selectedOption = useMemo(() => {
    return value ? allOptions.find((option) => option.id === value) || null : null
  }, [value, allOptions])

  // Handle internal option selection and convert back to string id
  const handleSelectionChange = (option: Option | null) => {
    onChange(option?.id || null)
  }

  const filteredOptions =
    query === ""
      ? options
      : options
          .map((group) => ({
            ...group,
            options: group.options.filter(
              (option) =>
                option.label.toLowerCase().includes(query.toLowerCase()) ||
                option.id.toLowerCase().includes(query.toLowerCase()),
            ),
          }))
          .filter((group) => group.options.length > 0)

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">{label}</label>}
      <Combobox value={selectedOption} onChange={handleSelectionChange} disabled={disabled}>
        <div className="relative">
          <Combobox.Input
            className="w-full rounded-md border-1 border-black bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(option: Option | null) => option?.label ?? ""}
            placeholder={placeholder}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-sm bg-white pb-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredOptions.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">Nothing found.</div>
              ) : (
                filteredOptions.map((group) => (
                  <div key={group.groupName}>
                    <div className="sticky top-0 z-20 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-900 border-b border-gray-200">
                      {group.groupName}
                    </div>
                    {group.options.map((option) => (
                      <Combobox.Option
                        key={option.id}
                        className={({ active }) =>
                          classNames(
                            "relative cursor-default select-none py-2 pl-3 pr-9 text-center",
                            active ? "bg-sky-500/50  text-white" : "text-gray-900",
                          )
                        }
                        value={option}
                      >
                        {({ selected, active }) => (
                          <>
                            <div className="flex items-center">
                              <span
                                className={classNames("block truncate", selected ? "font-semibold" : "font-normal")}
                              >
                                {option.label}
                              </span>
                            </div>

                            {selected ? (
                              <span
                                className={classNames(
                                  "absolute inset-y-0 right-0 flex items-center pr-4",
                                  active ? "text-white" : "text-indigo-600",
                                )}
                              >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </div>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}

