"use client"

import { useState, Fragment, useRef, type KeyboardEvent, useEffect, type ReactNode } from "react"
import { Listbox, Transition } from "@headlessui/react"
import ERPInput from "../../../../components/ERPComponents/erp-input"
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input"
import { Check, ChevronDown } from "lucide-react"
import { dateTrimmer } from "../../../../utilities/Utils"

// Generic type for any data object
type DataItem = Record<string, any>

// Column definition type
export interface ColumnDefinition<T extends DataItem> {
  field: keyof T
  header: string
  width?: string
  editable?: boolean
  type?: "text" | "number" | "date" | "select" | "custom"
  options?: string[] | { value: string; label: string }[]
  formatter?: (value: any) => ReactNode
  editor?: (props: {
    value: any
    onChange: (value: any) => void
    onKeyDown: (e: KeyboardEvent) => void
    onBlur: () => void
    ref: (el: HTMLElement | null) => void
  }) => ReactNode
}

interface DataGridProps<T extends DataItem> {
  data: T[]
  columns: ColumnDefinition<T>[]
  keyField: keyof T
  onUpdateData: (item: T) => void
  className?: string
}

type CellPosition = {
  rowId: string | number
  field: string
}

export default function DataGrid<T extends DataItem>({
  data,
  columns,
  keyField,
  onUpdateData,
  className = "",
}: DataGridProps<T>) {
  const [editingCell, setEditingCell] = useState<CellPosition | null>(null)
  const [editValues, setEditValues] = useState<Record<string, Partial<T>>>({})
  const inputRefs = useRef<Record<string, HTMLElement | null>>({})

  // Start editing a specific cell
  const startEditing = (rowId: string | number, field: string) => {
    const column = columns.find((col) => col.field === field)
    if (column && column.editable !== false) {
      // If we don't have edit values for this row yet, initialize them
      if (!editValues[rowId]) {
        const item = data.find((item) => item[keyField] === rowId)
        if (item) {
          setEditValues((prev) => ({
            ...prev,
            [rowId]: { ...item },
          }))
        }
      }

      setEditingCell({ rowId, field })
    }
  }

  // Save the current cell and optionally move to the next cell
  const saveCell = (rowId: string | number, moveToNext = true) => {
    const item = data.find((item) => item[keyField] === rowId)
    if (item && editValues[rowId]) {
      // Update the data through the parent component
      onUpdateData({ ...item, ...editValues[rowId] })

      // Clear the edit values for this row to ensure we're using the updated data
      setEditValues((prev) => {
        const newValues = { ...prev }
        delete newValues[rowId]
        return newValues
      })

      if (moveToNext) {
        moveToNextCell()
      } else {
        setEditingCell(null)
      }
    }
  }

  // Move to the next cell in the grid
  const moveToNextCell = () => {
    if (!editingCell) return

    const { rowId, field } = editingCell
    const editableColumns = columns.filter((col) => col.editable !== false).map((col) => String(col.field))
    const currentColIndex = editableColumns.indexOf(field)

    // If we're at the last column, move to the first column of the next row
    if (currentColIndex === editableColumns.length - 1) {
      const currentRowIndex = data.findIndex((item) => item[keyField] === rowId)

      // If there's a next row, move to it
      if (currentRowIndex < data.length - 1) {
        const nextRowId = data[currentRowIndex + 1][keyField]
        setEditingCell({ rowId: nextRowId, field: editableColumns[0] })
      } else {
        // We're at the last cell of the last row
        setEditingCell(null)
      }
    } else {
      // Move to the next column in the same row
      setEditingCell({ rowId, field: editableColumns[currentColIndex + 1] })
    }
  }

  // Handle value changes
  const handleEditChange = (rowId: string | number, field: string, value: any) => {
    setEditValues((prev) => ({
      ...prev,
      [rowId]: { ...(prev[rowId] || {}), [field]: value },
    }))
  }

  // Handle keyboard events
  const handleKeyDown = (e: KeyboardEvent, rowId: string | number) => {
    if (e.key === "Enter") {
      e.preventDefault()
      e.stopPropagation()
      saveCell(rowId, true)
    } else if (e.key === "Escape") {
      e.preventDefault()
      setEditingCell(null)
    } else if (e.key === "Tab") {
      e.preventDefault()
      saveCell(rowId, true)
    }
  }

  // Focus the input when editing starts
  useEffect(() => {
    if (editingCell) {
      const refKey = `${editingCell.rowId}-${editingCell.field}`
      setTimeout(() => {
        const element = inputRefs.current[refKey]
        if (element) {
          element.focus()
        }
      }, 10)
    }
  }, [editingCell])

  // Add a blur handler to save changes when clicking outside
  const handleBlur = (rowId: string | number) => {
    // Small timeout to allow for click events on dropdowns
    setTimeout(() => {
      if (editingCell?.rowId === rowId) {
        saveCell(rowId, false)
      }
    }, 100)
  }

  // Default cell renderers based on type
  const renderDefaultCell = (item: T, column: ColumnDefinition<T>) => {
    const field = String(column.field)
    const value = item[column.field]
    const rowId = item[keyField]
    const isEditing = editingCell?.rowId === rowId && editingCell?.field === field
    const refKey = `${rowId}-${field}`

    // If column has a custom editor and we're editing, use it
    if (isEditing && column.editor) {
      return column.editor({
        value: editValues[rowId]?.[column.field] ?? value,
        onChange: (newValue) => handleEditChange(rowId, field, newValue),
        onKeyDown: (e) => handleKeyDown(e, rowId),
        onBlur: () => handleBlur(rowId),
        ref: (el) => (inputRefs.current[refKey] = el),
      })
    }

    // Otherwise use default editors based on type
    if (isEditing) {
      switch (column.type) {
        case "text":
        case "number":
          return (
            <ERPInput
              noLabel
              id={`${field}-${rowId}`}
              type={column.type === "number" ? "number" : "text"}
              className="h-8"
              value={editValues[rowId]?.[column.field] ?? value}
              onChange={(e) =>
                handleEditChange(rowId, field, column.type === "number" ? Number(e.target.value) : e.target.value)
              }
              onKeyDown={(e) => handleKeyDown(e, rowId)}
              onBlur={() => handleBlur(rowId)}
              ref={(el) => (inputRefs.current[refKey] = el)}
              autoFocus
            />
          )

        case "date":
          return (
            <ERPDateInput
              noLabel
              className="h-8"
              onChange={(e) => handleEditChange(rowId, field, e.target.value)}
              value={
                editValues[rowId]?.[column.field]
                  ? new Date(editValues[rowId]?.[column.field] as string).toISOString().slice(0, 16)
                  : value
                    ? new Date(value as string).toISOString().slice(0, 16)
                    : ""
              }
              id={`date-${rowId}`}
              type="date"
              onBlur={() => handleBlur(rowId)}
              onKeyDown={(e) => handleKeyDown(e, rowId)}
              ref={(el) => (inputRefs.current[refKey] = el)}
            />
          )

        case "select":
          if (!column.options) return value

          const options = column.options.map((opt) => (typeof opt === "string" ? { value: opt, label: opt } : opt))

          return (
            <Listbox
              value={editValues[rowId]?.[column.field] ?? value}
              onChange={(newValue) => handleEditChange(rowId, field, newValue)}
            >
              <div className="relative">
                <Listbox.Button
                  className="relative w-full h-8 cursor-default rounded-md bg-background py-1.5 pl-3 pr-10 text-left text-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none"
                  ref={(el) => (inputRefs.current[refKey] = el)}
                  onKeyDown={(e) => handleKeyDown(e, rowId)}
                  onBlur={() => handleBlur(rowId)}
                >
                  <span className="block truncate">
                    {options.find((opt) => opt.value === (editValues[rowId]?.[column.field] ?? value))?.label || value}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-background py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {options.map((option) => (
                      <Listbox.Option
                        key={option.value}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? "bg-muted text-primary" : "text-gray-900"
                          }`
                        }
                        value={option.value}
                      >
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                              {option.label}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                <Check className="h-4 w-4" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          )

        default:
          return value
      }
    }

    // Display mode (not editing)
    const isEditable = column.editable !== false
    const displayValue = column.formatter
      ? column.formatter(value)
      : column.type === "date"
        ? dateTrimmer(`${value}`)
        : value

    return (
      <div
        className={`w-full h-full py-2 ${isEditable ? "cursor-pointer" : ""}`}
        onClick={() => isEditable && startEditing(rowId, field)}
      >
        {displayValue}
      </div>
    )
  }

  return (
    <div
      className={`border border-gray-100 rounded-md overflow-hidden ${className}`}
      onClick={(e) => {
        // If we click on the table container but not on an input or cell, exit edit mode
        if ((e.target as HTMLElement).classList.contains("border-gray-100")) {
          setEditingCell(null)
        }
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f9f9fa]">
              {columns.map((column) => (
                <th
                  key={String(column.field)}
                  className="text-left py-3 px-4 font-medium text-gray-700 border-b border-r border-gray-100 text-sm whitespace-nowrap"
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center p-4 border-b border-gray-100">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={String(item[keyField])} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <td
                    key={`${String(item[keyField])}-${String(column.field)}`}
                      className={`p-3 px-4 border-b ${colIndex < columns.length - 1 ? "border-r" : ""} border-gray-100`}
                    >
                      {renderDefaultCell(item, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
