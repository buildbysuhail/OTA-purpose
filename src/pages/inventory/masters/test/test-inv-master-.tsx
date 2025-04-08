"use client"

import ERPButton from "../../../../components/ERPComponents/erp-button"
import ERPInput from "../../../../components/ERPComponents/erp-input"
import { useState, useEffect, useMemo } from "react"
import { Loader2, Plus, Search } from "lucide-react"
import React from "react"
import DataGrid, { ColumnDefinition } from "./dataGrid"


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

  // Initial data load simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setData(generateDummyData(10))
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
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

  // Column definitions with proper typing
  const columns: ColumnDefinition<User1>[] = [
    {
      field: "name",
      header: "Name",
      type: "text",
      editable: true,
    },
    {
      field: "email",
      header: "Email",
      type: "text",
      editable: true,
    },
    {
      field: "role",
      header: "Role",
      type: "select",
      options: ["Admin", "User", "Editor", "Viewer"],
      editable: true,
    },
    {
      field: "status",
      header: "Status",
      type: "select",
      options: ["Active", "Inactive", "Pending"],
      editable: true,
      formatter: (value:any) => (
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
    },
  ]

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
        <ERPButton
          type="button"
          className="primary shrink-0"
          loading={isLoading}
          startIcon={<Plus className="h-4 w-4 mr-2" />}
          onClick={handleAddData}
          title="Add Record"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataGrid data={filteredData} columns={columns} keyField="id" onUpdateData={handleUpdateData} />
      )}
    </div>
  )
}

export default React.memo(TestInvMaster)
