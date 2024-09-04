import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

interface SBSelectProps {
  id: string;
  label?: string;
  options?: any[];
  value?: any;
  defaultValue?: any;
  handleChange?: (id: string, value: any) => void;
  field?: any;
  defaultData?: any;
  data?: any;
  required?: boolean;
  className?: string;
  noLabel?: boolean;
}

export default function SBSelect({
  id,
  label,
  handleChange,
  field,
  defaultValue,
  defaultData,
  data,
  options,
  required,
  noLabel = false,
}: SBSelectProps) {
  const [selected, setSelected] = useState();
  const [query, setQuery] = useState("");
  const [localValue, setLocalValue] = useState<any>();

  let value = field?.getter ? defaultData?.[field?.id]?.[field?.getter] : defaultData?.[field?.id];

  if (data !== undefined && data?.[field?.id] !== undefined) {
    value = data?.[field?.id] === undefined ? value : localValue?.label;
  }

  const filteredPeople =
    query === ""
      ? options
      : options?.filter((person: any) => person.label.toLowerCase().replace(/\s+/g, "").includes(query.toLowerCase().replace(/\s+/g, "")));
  const iLabel = label || id?.replaceAll("_", " ");

  const defualtValue = options?.find((option) => option?.value === defaultValue);
  return (
    <div className=" relative">
      <Combobox
        // defaultValue={options?.[0]}0
        value={selected || defualtValue}
        onChange={(value) => {
          setSelected(value);
          handleChange && handleChange(field?.id || id, value);
        }}
      >
        <div className="relative">
          <div className="">
            <Combobox.Button className=" w-full inset-y-0 top-[30px] right-0 flex items-center">
              <div className=" relative flex flex-col w-full">
                {!noLabel && (
                  <label className="text-left capitalize mb-1 block text-xs  text-gray-700">
                    {iLabel}
                    {required && "*"}
                  </label>
                )}
                <Combobox.Input
                  className="w-full appearance-none placeholder:text-xs rounded border border-gray-300 h-9 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-1 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-xs"
                  displayValue={(person: any) => person?.label}
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                  placeholder={"Select " + iLabel}
                  required={required}
                  autoComplete="off"
                />
              </div>
              <div className={`flex absolute right-2 ${noLabel ? "top-[8px]" : "top-[28px]"} gap-2 justify-between items-center`}>
                <div className="border-l-2 pr-1 pl-2 group">
                  <ChevronDownIcon className={`h-5 aspect-square text-gray-400 group-hover:text-gray-500`} aria-hidden="true" />
                </div>
              </div>
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute z-50 mt-1 max-h-60 min-w-full w-fit overflow-auto rounded-md bg-white py-1 text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredPeople?.length === 0 && query !== "" ? (
                <div className="relative text-xs cursor-default select-none py-2 px-4 text-gray-700">No data found</div>
              ) : (
                filteredPeople?.map((person: any, index: number) => (
                  <Combobox.Option
                    key={`cb_${person?.value}-${index}`}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-4 pr-4 text-xs ${active ? "bg-primary text-white" : "text-gray-900"}`
                    }
                    value={person}
                    defaultValue={"company"}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>{person?.label}</span>
                        {selected ? (
                          <span className={`absolute inset-y-0 right-0 flex items-center pr-3 ${active ? "text-white" : "text-teal-600"}`}>
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
