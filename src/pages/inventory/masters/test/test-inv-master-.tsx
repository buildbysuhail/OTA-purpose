"use client"

import ERPButton from "../../../../components/ERPComponents/erp-button"
import ERPInput from "../../../../components/ERPComponents/erp-input"
import { useState, useEffect, useMemo } from "react"
import { Loader2, Plus, Search } from "lucide-react"
import React from "react"
import DataGrid, { type ColumnDefinition } from "./dataGrid"
import GridPreferenceChooser from "../../../../components/ERPComponents/erp-gridpreference"
import type { DevGridColumn, GridPreference, ColumnPreference } from "../../../../components/types/dev-grid-column"

export interface User1 {
  id: string
  name: string
  email: string
  role: string
  status: string
  lastLogin: string
}

// Generate dummy data
const generateDummyData = (count: number): User1[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${Date.now()}-${i}`,
    name: `User ${Math.floor(Math.random() * 1000)}`,
    email: `user${Math.floor(Math.random() * 1000)}@example.com`,
    role: ["Admin", "User", "Editor", "Viewer"][Math.floor(Math.random() * 4)],
    status: ["Active", "Inactive", "Pending"][Math.floor(Math.random() * 3)],
    lastLogin: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
  }))
}

const TestInvMaster = () => {
  const [data, setData] = useState<User1[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [gridPreferences, setGridPreferences] = useState<GridPreference | null>(null)

  // Column definitions with proper typing
  const allColumns: ColumnDefinition<User1>[] = [
    {
      field: "name",
      header: "Name",
      type: "text",
      editable: true,
      width: "150px",
    },
    {
      field: "email",
      header: "Email",
      type: "text",
      editable: true,
      width: "200px",
    },
    {
      field: "role",
      header: "Role",
      type: "select",
      options: ["Admin", "User", "Editor", "Viewer"],
      editable: true,
      width: "120px",
    },
    {
      field: "status",
      header: "Status",
      type: "select",
      options: ["Active", "Inactive", "Pending"],
      editable: true,
      width: "120px",
      formatter: (value: any) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            value === "Active"
              ? "bg-[oklch(87.1% 0.15 154.449)] text-green-800"
              : value === "Inactive"
                ? "bg-[oklch(80.8% 0.114 19.571)] text-red-800"
                : "bg-[oklch(90.5% 0.182 98.111)] text-yellow-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      field: "lastLogin",
      header: "Last Login",
      type: "date",
      editable: true,
      width: "150px",
    },
  ]

  // Convert ColumnDefinition to DevGridColumn for GridPreferenceChooser
  const gridColumns: DevGridColumn[] = allColumns.map((col) => ({
    dataField: col.field as string,
    caption: col.header,
    width: col.width ? Number.parseInt(col.width.replace("px", "")) : 150,
    dataType: mapColumnTypeToDataType(col.type),
    alignment: "left" as "left" | "center" | "right", // Explicitly type as union
    isLocked: !col.editable,
    showInPdf: true,
    allowEditing: col.editable,
    allowSorting: true,
    allowResizing: true,
    allowFiltering: true,
    visible: true,
  }))

  // Helper function to map column types
  function mapColumnTypeToDataType(type: string | undefined): DevGridColumn["dataType"] {
    switch (type) {
      case "number":
        return "number"
      case "date":
        return "date"
      case "select":
      case "text":
      default:
        return "string"
    }
  }

  // Initial data load simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setData(generateDummyData(100))
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Load preferences from localStorage on component mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem(`gridPreferences_test-inv-master`)
    if (savedPreferences) {
      try {
        setGridPreferences(JSON.parse(savedPreferences))
      } catch (error) {
        console.error("Error parsing saved grid preferences:", error)
      }
    }
  }, [])

  // Add new dummy data
  const handleAddData = () => {
    const newData = generateDummyData(1)[0]
    setData((prevData) => [newData, ...prevData])
  }

  // Update data (for inline editing)
  const handleUpdateData = (updatedUser: User1) => {
    setData((prevData) => prevData.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
  }

  // Handle grid preference changes
  const handleApplyPreferences = (preferences: GridPreference) => {
    setGridPreferences(preferences)
    // Save preferences to localStorage
    localStorage.setItem(`gridPreferences_test-inv-master`, JSON.stringify(preferences))
  }

  // Filter data based on search term
  const filteredData = useMemo(() => {
    return data.filter((user) => {
      const searchTermLower = searchTerm.toLowerCase()
      return (
        user.name.toLowerCase().includes(searchTermLower) ||
        user.email.toLowerCase().includes(searchTermLower) ||
        user.role.toLowerCase().includes(searchTermLower) ||
        user.status.toLowerCase().includes(searchTermLower)
      )
    })
  }, [data, searchTerm])

  // Apply preferences to columns
  const visibleColumns = useMemo(() => {
    if (!gridPreferences || !gridPreferences.columnPreferences) {
      return allColumns
    }

    // Create a map for quick lookup
    const prefMap = new Map<string, ColumnPreference>()
    gridPreferences.columnPreferences.forEach((pref) => {
      prefMap.set(pref.dataField, pref)
    })

    // Filter out hidden columns and apply width
    const visibleCols = allColumns
      .filter((col) => {
        const pref = prefMap.get(col.field as string)
        return !pref || pref.visible !== false
      })
      .map((col) => {
        const pref = prefMap.get(col.field as string)
        if (pref) {
          return {
            ...col,
            width: pref.width ? `${pref.width}px` : col.width,
            editable: pref.readOnly ? false : col.editable, // Apply readOnly from preferences
            // You could map other properties here if needed
          }
        }
        return col
      })

    // Sort columns based on displayOrder
    return visibleCols.sort((a, b) => {
      const prefA = prefMap.get(a.field as string)
      const prefB = prefMap.get(b.field as string)

      const orderA = prefA ? prefA.displayOrder : 999
      const orderB = prefB ? prefB.displayOrder : 999

      return orderA - orderB
    })
  }, [gridPreferences])

  return (
    <div className="m-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-2">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-0.3 h-4 w-4 text-muted-foreground" />
          <ERPInput
            id="Search"
            type="text"
            placeholder="Search..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <GridPreferenceChooser
            gridId="test-inv-master"
            columns={gridColumns}
            onApplyPreferences={handleApplyPreferences}
          />
          <ERPButton
            type="button"
            className="primary shrink-0"
            loading={isLoading}
            startIcon={<Plus className="h-4 w-4 mr-2" />}
            onClick={handleAddData}
            title="Add Record"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataGrid data={filteredData} columns={visibleColumns} keyField="id" onUpdateData={handleUpdateData} />
      )}
    </div>
  )
}

export default React.memo(TestInvMaster)
