"use client"

import React from "react"

import { useState, useEffect } from "react"
import  ERPButton  from "../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { Loader2, Plus, Search } from "lucide-react"

export interface User {
    id: string
    name: string
    email: string
    role: string
    status: string
    lastLogin: Date
  }
// DevExtreme imports
import DataGrid, {
  Column,
  Editing,
  Paging,
  FilterRow,
  SearchPanel,
  Selection,
  Lookup,
} from "devextreme-react/data-grid"
import "devextreme/dist/css/dx.light.css"

// Generate dummy data
const generateDummyData = (count: number): User[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${Date.now()}-${i}`,
    name: `User ${Math.floor(Math.random() * 1000)}`,
    email: `user${Math.floor(Math.random() * 1000)}@example.com`,
    role: ["Admin", "User", "Editor", "Viewer"][Math.floor(Math.random() * 4)],
    status: ["Active", "Inactive", "Pending"][Math.floor(Math.random() * 3)],
    lastLogin: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
  }))
}

const roles = ["Admin", "User", "Editor", "Viewer"]
const statuses = ["Active", "Inactive", "Pending"]

const TestInvDataGridMaster=()=> {
  const [data, setData] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchValue, setSearchValue] = useState("")

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

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  // Filter data based on search term
  const filteredData = searchValue
    ? data.filter((user) =>
        Object.values(user).some(
          (value) => value && value.toString().toLowerCase().includes(searchValue.toLowerCase()),
        ),
      )
    : data

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
    
             <ERPInput
                id="Search"
                     type="text"
                     placeholder="Search..."
                     className="pl-8"
                     value={searchValue}
                     onChange={handleSearchChange}
                  />
        </div>
        <ERPButton
            type="button"
            className="primary shrink-0"
            loading={isLoading}
            startIcon={ <Plus className="h-4 w-4 mr-2" />}
            onClick={handleAddData}
            title="Add Record"
          />
        {/* <Button onClick={handleAddData} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button> */}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="dx-viewport">
          <DataGrid
            dataSource={filteredData}
            showBorders={true}
            columnAutoWidth={true}
            rowAlternationEnabled={true}
            onRowUpdated={(e) => {
              // Handle row update without reloading the grid
              const updatedData = [...data]
              const index = updatedData.findIndex((item) => item.id === e.key.id)
              if (index !== -1) {
                updatedData[index] = { ...updatedData[index], ...e.data }
                setData(updatedData)
              }
            }}
          >
            <Paging enabled={true} pageSize={10} />
            <FilterRow visible={true} />
            <SearchPanel visible={false} /> {/* We're using our custom search */}
            <Selection mode="single" />
            <Editing mode="cell" allowUpdating={true} allowAdding={false} allowDeleting={false} />
            <Column dataField="name" caption="Name" />
            <Column dataField="email" caption="Email" />
            <Column dataField="role" caption="Role">
              <Lookup dataSource={roles} />
            </Column>
            <Column dataField="status" caption="Status">
              <Lookup dataSource={statuses} />
            </Column>
            <Column dataField="lastLogin" caption="Last Login" dataType="datetime" format="MMM d, yyyy h:mm a" />
          </DataGrid>
        </div>
      )}
    </div>
  )
}


export default React.memo(TestInvDataGridMaster);