"use client";

import { useState, useEffect } from "react";
import DataGridTest from "./dataGrid";
import React from "react";
import type { DevGridColumn } from "../../../../components/types/dev-grid-column";

export interface User1 {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

// Generate dummy data
const generateDummyData = (count: number): User1[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${Date.now()}-${i}`,
    name: `User ${Math.floor(Math.random() * 1000)}`,
    email: `user${Math.floor(Math.random() * 1000)}@example.com`,
    role: ["Admin", "User", "Editor", "Viewer"][Math.floor(Math.random() * 4)],
    status: ["Active", "Inactive", "Pending"][Math.floor(Math.random() * 3)],
    lastLogin: new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    ).toISOString(),
  }));
};

const TestInvMaster = () => {
  const [data, setData] = useState<User1[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Column definitions aligned with DevGridColumn
  const columns: DevGridColumn[] = [
    {
      dataField: "name",
      caption: "Name",
      dataType: "string",
      allowEditing: true,
      width: 150,
    },
    {
      dataField: "email",
      caption: "Email",
      dataType: "string",
      allowEditing: true,
      width: 200,
    },
    {
      dataField: "role",
      caption: "Role",
      dataType: "string",
      allowEditing: true,
      width: 120,
      // Optional: Add custom rendering for select-like behavior
      cellRender: (value: string) => (
        <select
          value={value}
          disabled // Controlled by allowEditing in DataGridTest
          className="w-full h-full bg-transparent"
        >
          {["Admin", "User", "Editor", "Viewer"].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ),
    },
    {
      dataField: "status",
      caption: "Status",
      dataType: "string",
      allowEditing: true,
      width: 120,
      cellRender: (value: string) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            value === "Active"
              ? "bg-[oklch(87.1%_0.15_154.449)] text-green-800"
              : value === "Inactive"
              ? "bg-[oklch(80.8%_0.114_19.571)] text-red-800"
              : "bg-[oklch(90.5%_0.182_98.111)] text-yellow-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      dataField: "lastLogin",
      caption: "Last Login",
      dataType: "date",
      allowEditing: true,
      width: 150,
    },
  ];

  // Initial data load simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setData(generateDummyData(100000));
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Custom add data handler
  const handleAddData = (newItem: User1) => {
    setData((prevData) => [newItem, ...prevData]);
  };

  return (
    <div className="m-4">
      <DataGridTest<User1>
        data={data}
        columns={columns}
        keyField="id"
        gridId="test-inv-master"
        onAddData={handleAddData}
        isLoading={isLoading}
      />
    </div>
  );
};

export default React.memo(TestInvMaster);