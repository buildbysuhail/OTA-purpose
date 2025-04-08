"use client"

import { useState, Fragment } from "react"

import { Listbox, Transition } from "@headlessui/react"
// import { format } from "date-fns"
import ERPButton from "../../../../components/ERPComponents/erp-button"
import ERPInput from "../../../../components/ERPComponents/erp-input"
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input"
import { Check, X, ChevronDown } from "lucide-react"
import { dateTrimmer } from "../../../../utilities/Utils"
import type { User1 } from "./test-inv-master-"

interface DataGridProps {
  data: User1[]
  onUpdateData: (user: User1) => void
}

export default function DataGrid({ data, onUpdateData }: DataGridProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Partial<User1>>({})

  const startEditing = (user: User1) => {
    setEditingId(user.id)
    setEditValues({ ...user })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditValues({})
  }

  const saveEditing = () => {
    if (editingId && editValues) {
      onUpdateData({ ...(editValues as User1) })
      setEditingId(null)
      setEditValues({})
    }
  }

  const handleEditChange = (key: keyof User1, value: string) => {
    setEditValues((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="border border-gray-100 rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f9f9fa]">
              <th className="text-left py-3 px-4 font-medium text-gray-700 border-b border-r border-gray-100 text-sm whitespace-nowrap">
                Name
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 border-b border-r border-gray-100 text-sm whitespace-nowrap">
                Email
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 border-b border-r border-gray-100 text-sm whitespace-nowrap">
                Role
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 border-b border-r border-gray-100 text-sm whitespace-nowrap">
                Status
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 border-b border-r border-gray-100 text-sm whitespace-nowrap">
                Last Login
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 border-b border-gray-100 text-sm whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4 border-b border-gray-100">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="p-3 px-4 border-b border-r border-gray-100">
                    {editingId === user.id ? (
                      <ERPInput
                        noLabel
                        id="name"
                        type="text"
                        className="h-8"
                        value={editValues.name || ""}
                        onChange={(e) => handleEditChange("name", e.target.value)}
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="p-3 px-4 border-b border-r border-gray-100">
                    {editingId === user.id ? (
                      <ERPInput
                        noLabel
                        id="email"
                        type="text"
                        className="h-8"
                        value={editValues.email || ""}
                        onChange={(e) => handleEditChange("email", e.target.value)}
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="p-3 px-4 border-b border-r border-gray-100">
                    {editingId === user.id ? (
                      <Listbox value={editValues.role || ""} onChange={(value) => handleEditChange("role", value)}>
                        <div className="relative">
                          <Listbox.Button className="relative w-full h-8 cursor-default rounded-md bg-background py-1.5 pl-3 pr-10 text-left text-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none">
                            <span className="block truncate">{editValues.role}</span>
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
                              {["Admin", "User", "Editor", "Viewer"].map((role) => (
                                <Listbox.Option
                                  key={role}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                      active ? "bg-muted text-primary" : "text-gray-900"
                                    }`
                                  }
                                  value={role}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                        {role}
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
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className="p-3 px-4 border-b border-r border-gray-100">
                    {editingId === user.id ? (
                      <Listbox value={editValues.status || ""} onChange={(value) => handleEditChange("status", value)}>
                        <div className="relative">
                          <Listbox.Button className="relative w-full h-8 cursor-default rounded-md bg-background py-1.5 pl-3 pr-10 text-left text-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none">
                            <span className="block truncate">{editValues.status}</span>
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
                              {["Active", "Inactive", "Pending"].map((status) => (
                                <Listbox.Option
                                  key={status}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                      active ? "bg-muted text-primary" : "text-gray-900"
                                    }`
                                  }
                                  value={status}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                        {status}
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
                    ) : (
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-[oklch(87.1% 0.15 154.449)] text-green-800"
                            : user.status === "Inactive"
                              ? "bg-[oklch(80.8% 0.114 19.571)] text-red-800"
                              : "bg-[oklch(90.5% 0.182 98.111)] text-yellow-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    )}
                  </td>
                  <td className="p-3 px-4 border-b border-r border-gray-100">
                    {editingId === user.id ? (
                      <ERPDateInput
                        noLabel
                        className="h-8"
                        onChange={(e) => handleEditChange("lastLogin", e.target.value)}
                        value={editValues.lastLogin ? new Date(editValues.lastLogin).toISOString().slice(0, 16) : ""}
                        id="date"
                        type="date"
                      />
                    ) : (
                      dateTrimmer(`${user.lastLogin}`)
                    )}
                  </td>
                  <td className="p-3 px-4 border-b border-gray-100">
                    {editingId === user.id ? (
                      <div className="flex space-x-2">
                        <ERPButton
                          type="button"
                          variant="primary"
                          className="h-8 w-8 p-0"
                          startIcon={<Check className="h-4 w-4" />}
                          onClick={saveEditing}
                        />
                        <ERPButton
                          type="button"
                          className="h-8 w-8 p-0"
                          startIcon={<X className="h-4 w-4" />}
                          onClick={cancelEditing}
                        />
                      </div>
                    ) : (
                      <ERPButton type="button" className="h-8" title="Edit" onClick={() => startEditing(user)} />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

