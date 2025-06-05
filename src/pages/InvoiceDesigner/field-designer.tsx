import React, { useState } from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

// Types for our data structures

interface FieldDesignerProps {
  field: Field;
  onUpdate: (field: Field) => void;
  onDelete: (id: string) => void;
}

interface ColumnDesignerProps {
  column: Column;
  onUpdate: (column: Column) => void;
  onDelete: (id: string) => void;
  onAddField: (columnId: string) => void;
  onAddRow: (columnId: string) => void;
}

interface RowDesignerProps {
  row: Row;
  onUpdate: (row: Row) => void;
  onDelete: (id: string) => void;
}

interface LabelProps {
  show: boolean;
  fontSize: number;
  fontColor: string;
  fontBgColor: string;
  align: 'left' | 'center' | 'right';
  textDecoration: 'none' | 'underline' | 'line-through';
  text: string;
}

interface ValueProps extends LabelProps {
  mergeField: string;
}

interface Field {
  id: string;
  type: 'field';
  labelProps: LabelProps;
  valueProps: ValueProps;
}

interface Column {
  id: string;
  width: string;
  showBorder: boolean;
  align: 'left' | 'center' | 'right';
  bgColor: string;
  children: (Field | Row)[];
}

interface Row {
  id: string;
  type: 'row';
  columns: Column[];
}

// Default values
const defaultLabelProps: LabelProps = {
  show: true,
  fontSize: 12,
  fontColor: '#000000',
  fontBgColor: 'transparent',
  align: 'left',
  textDecoration: 'none',
  text: 'Label'
};

const defaultValueProps: ValueProps = {
  show: true,
  fontSize: 12,
  fontColor: '#333333',
  fontBgColor: 'transparent',
  align: 'left',
  textDecoration: 'none',
  text: 'Value',
  mergeField: '{{field}}'
};

const defaultColumn: Column = {
  id: '',
  width: '100%',
  showBorder: false,
  align: 'left',
  bgColor: 'transparent',
  children: []
};

// Designer Components
const FieldDesigner: React.FC<FieldDesignerProps> = ({ field, onUpdate, onDelete }) => {
  const updateLabelProps = (updates: any) => {
    onUpdate({
      ...field,
      labelProps: { ...field.labelProps, ...updates }
    });
  };

  const updateValueProps = (updates: any) => {
    onUpdate({
      ...field,
      valueProps: { ...field.valueProps, ...updates }
    });
  };

  return (
    <div className="border p-4 mb-2 bg-gray-50 rounded">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold">Field</h4>
        <button
          onClick={() => onDelete(field.id)}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>

      {/* Label Properties */}
      <div className="mb-4">
        <h5 className="font-medium mb-2">Label Properties</h5>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={field.labelProps.show}
              onChange={(e) => updateLabelProps({ show: e.target.checked })}
              className="mr-2"
            />
            Show Label
          </label>
          <input
            type="text"
            placeholder="Label text"
            value={field.labelProps.text}
            onChange={(e) => updateLabelProps({ text: e.target.value })}
            className="px-2 py-1 border rounded"
          />
          <input
            type="number"
            placeholder="Font Size"
            value={field.labelProps.fontSize}
            onChange={(e) => updateLabelProps({ fontSize: parseInt(e.target.value) || 12 })}
            className="px-2 py-1 border rounded"
          />
          <input
            type="color"
            value={field.labelProps.fontColor}
            onChange={(e) => updateLabelProps({ fontColor: e.target.value })}
            className="px-2 py-1 border rounded"
          />
          <select
            value={field.labelProps.align}
            onChange={(e) => updateLabelProps({ align: e.target.value })}
            className="px-2 py-1 border rounded"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
          <select
            value={field.labelProps.textDecoration}
            onChange={(e) => updateLabelProps({ textDecoration: e.target.value })}
            className="px-2 py-1 border rounded"
          >
            <option value="none">None</option>
            <option value="underline">Underline</option>
            <option value="line-through">Strike</option>
          </select>
        </div>
      </div>

      {/* Value Properties */}
      <div>
        <h5 className="font-medium mb-2">Value Properties</h5>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={field.valueProps.show}
              onChange={(e) => updateValueProps({ show: e.target.checked })}
              className="mr-2"
            />
            Show Value
          </label>
          <input
            type="text"
            placeholder="Merge field"
            value={field.valueProps.mergeField}
            onChange={(e) => updateValueProps({ mergeField: e.target.value })}
            className="px-2 py-1 border rounded"
          />
          <input
            type="number"
            placeholder="Font Size"
            value={field.valueProps.fontSize}
            onChange={(e) => updateValueProps({ fontSize: parseInt(e.target.value) || 12 })}
            className="px-2 py-1 border rounded"
          />
          <input
            type="color"
            value={field.valueProps.fontColor}
            onChange={(e) => updateValueProps({ fontColor: e.target.value })}
            className="px-2 py-1 border rounded"
          />
          <select
            value={field.valueProps.align}
            onChange={(e) => updateValueProps({ align: e.target.value })}
            className="px-2 py-1 border rounded"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
          <select
            value={field.valueProps.textDecoration}
            onChange={(e) => updateValueProps({ textDecoration: e.target.value })}
            className="px-2 py-1 border rounded"
          >
            <option value="none">None</option>
            <option value="underline">Underline</option>
            <option value="line-through">Strike</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const ColumnDesigner: React.FC<ColumnDesignerProps> = ({ column, onUpdate, onDelete, onAddField, onAddRow }) => {
  const updateColumn = (updates: any) => {
    onUpdate({ ...column, ...updates });
  };

  const updateChild = (childId: any, updatedChild: any) => {
    const newChildren = column.children.map((child: { id: any; }) =>
      child.id === childId ? updatedChild : child
    );
    updateColumn({ children: newChildren });
  };

  const deleteChild = (childId: any) => {
    const newChildren = column.children.filter((child: { id: any; }) => child.id !== childId);
    updateColumn({ children: newChildren });
  };

  return (
    <div className="border p-3 mb-2 bg-blue-50 rounded">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold">Column</h4>
        <button
          onClick={() => onDelete(column.id)}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>

      {/* Column Properties */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <input
          type="text"
          placeholder="Width (%, px)"
          value={column.width}
          onChange={(e) => updateColumn({ width: e.target.value })}
          className="px-2 py-1 border rounded"
        />
        <input
          type="color"
          value={column.bgColor}
          onChange={(e) => updateColumn({ bgColor: e.target.value })}
          className="px-2 py-1 border rounded"
        />
        <select
          value={column.align}
          onChange={(e) => updateColumn({ align: e.target.value })}
          className="px-2 py-1 border rounded"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
        <label className="flex items-center col-span-3">
          <input
            type="checkbox"
            checked={column.showBorder}
            onChange={(e) => updateColumn({ showBorder: e.target.checked })}
            className="mr-2"
          />
          Show Border
        </label>
      </div>

      {/* Add buttons */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => onAddField(column.id)}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Field
        </button>
        <button
          onClick={() => onAddRow(column.id)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Row
        </button>
      </div>

      {/* Children */}
      {column.children.map((child: any) => (
        child.type === 'field' ? (
          <FieldDesigner
            key={child.id}
            field={child}
            onUpdate={(updated: any) => updateChild(child.id, updated)}
            onDelete={() => deleteChild(child.id)}
          />
        ) : (
          <RowDesigner
            key={child.id}
            row={child}
            onUpdate={(updated: any) => updateChild(child.id, updated)}
            onDelete={() => deleteChild(child.id)}
          />
        )
      ))}
    </div>
  );
};

const RowDesigner: React.FC<RowDesignerProps> = ({ row, onUpdate, onDelete }) => {
  const [numColumns, setNumColumns] = useState(row.columns.length);

  const updateColumns = (newNumColumns: number) => {
    const currentColumns = [...row.columns];

    if (newNumColumns > currentColumns.length) {
      // Add new columns
      for (let i = currentColumns.length; i < newNumColumns; i++) {
        currentColumns.push({
          ...defaultColumn,
          id: `col-${Date.now()}-${i}`,
          width: `${100 / newNumColumns}%`
        });
      }
    } else if (newNumColumns < currentColumns.length) {
      // Remove columns
      currentColumns.splice(newNumColumns);
    }

    // Update width for all columns
    currentColumns.forEach(col => {
      col.width = `${100 / newNumColumns}%`;
    });

    onUpdate({ ...row, columns: currentColumns });
    setNumColumns(newNumColumns);
  };

  const updateColumn = (columnId: any, updatedColumn: any) => {
    const newColumns = row.columns.map((col: { id: any; }) =>
      col.id === columnId ? updatedColumn : col
    );
    onUpdate({ ...row, columns: newColumns });
  };

  const deleteColumn = (columnId: any) => {
    const newColumns = row.columns.filter((col: { id: any; }) => col.id !== columnId);
    onUpdate({ ...row, columns: newColumns });
    setNumColumns(newColumns.length);
  };

  const addField = (columnId: string) => {
    const newField: Field = {
      id: `field-${Date.now()}`,
      type: 'field',
      labelProps: { ...defaultLabelProps },
      valueProps: { ...defaultValueProps }
    };

    const newColumns = row.columns.map((col: Column) =>
      col.id === columnId
        ? { ...col, children: [...col.children, newField] }
        : col
    );

    onUpdate({ ...row, columns: newColumns });
  };

  const addRow = (columnId: string) => {
    const newRow: Row = {
      id: `row-${Date.now()}`,
      type: 'row',
      columns: [{
        ...defaultColumn,
        id: `col-${Date.now()}`,
        width: '100%',
        showBorder: false,
        align: 'left',
        bgColor: 'transparent',
        children: []
      }]
    };

    const newColumns = row.columns.map((col) =>
      col.id === columnId
        ? { ...col, children: [...col.children, newRow] }
        : col
    );
    onUpdate({ ...row, columns: newColumns });
  };

  return (
    <div className="border-2 border-blue-300 p-4 mb-4 bg-white rounded">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Row</h3>
        <button
          onClick={() => onDelete(row.id)}
          className="text-red-500 hover:text-red-700"
        >
          Delete Row
        </button>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Number of Columns:</label>
        <input
          type="number"
          min="1"
          max="12"
          value={numColumns}
          onChange={(e) => updateColumns(parseInt(e.target.value) || 1)}
          className="px-3 py-2 border rounded"
        />
      </div>

      <div className="space-y-4">
        {row.columns.map((column: any) => (
          <ColumnDesigner
            key={column.id}
            column={column}
            onUpdate={(updated: any) => updateColumn(column.id, updated)}
            onDelete={() => deleteColumn(column.id)}
            onAddField={addField}
            onAddRow={addRow}
          />
        ))}
      </div>
    </div>
  );
};
