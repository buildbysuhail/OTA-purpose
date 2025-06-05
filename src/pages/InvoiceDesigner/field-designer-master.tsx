import React, { useState } from "react";

interface LabelProps {
  show: boolean;
  text: string;
  fontSize: number;
  fontColor: string;
  fontBgColor: string;
  textDecoration: string;
}

interface ValueProps {
  show: boolean;
  mergeField: string;
  fontSize: number;
  fontColor: string;
  fontBgColor: string;
  textDecoration: string;
}

interface Child {
  id: string;
  type: "field" | "row";
  labelProps: LabelProps;
  valueProps: ValueProps;
}

interface Column {
  id: string;
  width: string;
  bgColor?: string;
  showBorder?: boolean;
  align?: string;
  children: Child[];
}

interface Row {
  id: string;
  type: string;
  columns: Column[];
}

const defaultColumn: Column = {
  id: "",
  width: "100%",
  bgColor: "transparent",
  showBorder: false,
  align: "left",
  children: [],
};

interface RowDesignerProps {
  row: Row;
  onUpdate: (updated: Row) => void;
  onDelete: () => void;
}
const RowDesigner: React.FC<RowDesignerProps> = ({ row, onUpdate, onDelete }) => {
  return (
    <div className="mb-4 p-2 border rounded">
      {/* TODO: build your actual row‐designer UI here */}
      <p className="font-semibold">Row Designer (ID: {row.id})</p>
      <button
        onClick={() => onDelete()}
        className="mt-1 text-red-600 hover:underline"
      >
        Delete this row
      </button>
    </div>
  );
};

const FieldDesignerMaster = () => {
  const [rows, setRows] = useState<Row[]>([]);

  // 2) Change mergeData's type from a fixed object to Record<string,string>:
  const [mergeData, setMergeData] = useState<Record<string, string>>({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    address: "123 Main St",
  });

  const addRow = () => {
    const newRow: Row = {
      id: `row-${Date.now()}`,
      type: "row",
      columns: [
        {
          ...defaultColumn,
          id: `col-${Date.now()}`,
          width: "100%",
          children: [],
        },
      ],
    };
    setRows([...rows, newRow]);
  };

  const updateRow = (rowId: string, updatedRow: Row) => {
    setRows(rows.map((r) => (r.id === rowId ? updatedRow : r)));
  };

  const deleteRow = (rowId: string) => {
    setRows(rows.filter((r) => r.id !== rowId));
  };

  return (
    <div className="flex h-screen">
      {/* ===== Designer Panel ===== */}
      <div className="w-1/2 p-4 overflow-y-auto border-r">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-4">PDF Designer</h2>
          <button
            onClick={addRow}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Row
          </button>
        </div>

        {rows.map((row) => (
          <RowDesigner
            key={row.id}
            row={row}
            onUpdate={(updated) => updateRow(row.id, updated)}
            onDelete={() => deleteRow(row.id)}
          />
        ))}

        {/* ===== Merge Data Editor ===== */}
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-3">Test Data</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(mergeData).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium">{key}:</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    setMergeData({ ...mergeData, [key]: e.target.value })
                  }
                  className="w-full px-2 py-1 border rounded"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Preview Panel ===== */}
      <div className="w-1/2 p-4 overflow-y-auto bg-gray-50">
        <h2 className="text-xl font-bold mb-4">PDF Preview</h2>
        <div
          className="bg-white p-6 shadow-lg"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          {rows.map((row) => (
            <div
              key={row.id}
              style={{ display: "flex", marginBottom: 8 }}
            >
              {row.columns.map((column) => (
                <div
                  key={column.id}
                  style={{
                    width: column.width,
                    backgroundColor:
                      column.bgColor !== "transparent"
                        ? column.bgColor
                        : undefined,
                    border: column.showBorder ? "1px solid #000" : undefined,
                    padding: column.showBorder ? 4 : 0,
                    textAlign: column.align as
                      | "left"
                      | "center"
                      | "right",
                  }}
                >
                  {/* 3) Explicitly type `child` as `Child` so TS knows it has .labelProps/.valueProps */}
                  {column.children.map((child: Child) =>
                    child.type === "field" ? (
                      <div
                        key={child.id}
                        style={{ marginBottom: 4 }}
                      >
                        {child.labelProps.show && (
                          <span
                            style={{
                              fontSize: `${child.labelProps.fontSize}px`,
                              color: child.labelProps.fontColor,
                              backgroundColor:
                                child.labelProps.fontBgColor !==
                                "transparent"
                                  ? child.labelProps.fontBgColor
                                  : undefined,
                              textDecoration:
                                child.labelProps.textDecoration !==
                                "none"
                                  ? child.labelProps.textDecoration
                                  : undefined,
                            }}
                          >
                            {child.labelProps.text}:
                          </span>
                        )}
                        {child.valueProps.show && (
                          <span
                            style={{
                              fontSize: `${child.valueProps.fontSize}px`,
                              color: child.valueProps.fontColor,
                              backgroundColor:
                                child.valueProps.fontBgColor !==
                                "transparent"
                                  ? child.valueProps.fontBgColor
                                  : undefined,
                              textDecoration:
                                child.valueProps.textDecoration !==
                                "none"
                                  ? child.valueProps.textDecoration
                                  : undefined,
                              marginLeft: child.labelProps.show
                                ? "8px"
                                : "0",
                            }}
                          >
                            {
                              // safely index mergeData because mergeData is now Record<string,string>
                              mergeData[
                                child.valueProps.mergeField.replace(
                                  /[{}]/g,
                                  ""
                                )
                              ] || child.valueProps.mergeField
                            }
                          </span>
                        )}
                      </div>
                    ) : (
                      <div key={child.id}>Nested Row</div>
                    )
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FieldDesignerMaster;
