// TestInvMaster.tsx
"use client";

import { useState, useEffect } from "react";
import DataGrid, { type ColumnDefinition } from "./dataGrid";
import React from "react";

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
    lastLogin: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

const TestInvMaster = () => {
  const [data, setData] = useState<User1[]>([]);

  // Column definitions
  const allColumns: ColumnDefinition<User1>[] = [
    { field: "name", header: "Name", type: "text", editable: true, width: "150px" },
    { field: "email", header: "Email", type: "text", editable: true, width: "200px" },
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
    { field: "lastLogin", header: "Last Login", type: "date", editable: true, width: "150px" },
  ];

  // Initial data load simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setData(generateDummyData(100000));
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Custom add data handler
  const handleAddData = (newItem: User1) => {
    setData((prevData) => [newItem, ...prevData]);
  };

  return (
    <div className="m-4">
      <DataGrid
        data={data}
        columns={allColumns}
        keyField="id"
        gridId="test-inv-master" // Unique identifier for this table instance
        onAddData={handleAddData}
      />
    </div>
  );
};

export default React.memo(TestInvMaster);