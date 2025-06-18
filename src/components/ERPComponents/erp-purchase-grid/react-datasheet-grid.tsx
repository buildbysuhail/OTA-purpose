import React from 'react';
import {
  DataSheetGrid,
  checkboxColumn,
  textColumn,
  keyColumn,
  Column
} from 'react-datasheet-grid';
import 'react-datasheet-grid/dist/style.css';

// Define your row type (generic)
export interface ERPReactDataGridRow {
  [key: string]: any;
}

interface ERPReactDataGridProps<T extends ERPReactDataGridRow> {
  data: T[];
  setData: (data: T[]) => void;
  columns: Column<T>[];
  rowHeight?: number;
  headerHeight?: number;
  className?: string;
  disabled?: boolean;
}

function ERPReactDataGrid<T extends ERPReactDataGridRow>({
  data,
  setData,
  columns,
  rowHeight = 40,
  headerHeight = 40,
  className = '',
  disabled = false
}: ERPReactDataGridProps<T>) {
  return (
    <div className={`erp-data-grid ${className}`}>
      <DataSheetGrid
        value={data}
        onChange={setData}
        columns={columns}
        rowHeight={rowHeight}
        headerRowHeight={headerHeight}
        lockRows={disabled}
      />
    </div>
  );
}

export default ERPReactDataGrid;

// =====

// import ERPReactDataGrid, { ERPReactDataGridRow } from "../../../../components/ERPComponents/erp-purchase-grid/react-datasheet-grid";
// import { checkboxColumn, keyColumn, textColumn } from "react-datasheet-grid";

// interface MyRow {
//   active: boolean;
//   name: string | null; // allow null
// }

// const [data, setData] = useState<MyRow[]>([
    // { active: true, name: 'Alice' },
    // { active: false, name: 'Bob' },
    // { active: true, name: 'Alice' },
    // { active: false, name: 'Bob' },
    // { active: true, name: 'Alice' },
    // { active: false, name: 'Bob' },
    // { active: true, name: 'Alice' },
    // { active: false, name: 'Bob' },
    // { active: true, name: 'Alice' },
    // { active: false, name: 'Bob' },
    // { active: true, name: 'Alice' },
    // { active: false, name: 'Bob' },
    // { active: true, name: 'Alice' },
    // { active: false, name: 'Bob' },
    // { active: true, name: 'Alice' },
    // { active: false, name: 'Bob' },
    // { active: true, name: 'Alice' },
    // { active: false, name: 'Bob' },
  // ]);

  // const columns = [
  //   keyColumn<MyRow, 'active'>('active', {
  //     title: 'Active',
  //     ...checkboxColumn,
  //   }),
  //   keyColumn<MyRow, 'name'>('name', {
  //     title: 'Name',
  //     ...textColumn,
  //   }),
  //   keyColumn<MyRow, 'name'>('name', {
  //     title: 'Name',
  //     ...textColumn,
  //   }),
  //   keyColumn<MyRow, 'name'>('name', {
  //     title: 'Name',
  //     ...textColumn,
  //   }),
  //   keyColumn<MyRow, 'name'>('name', {
  //     title: 'Name',
  //     ...textColumn,
  //   }),
  //   keyColumn<MyRow, 'name'>('name', {
  //     title: 'Name',
  //     ...textColumn,
  //   }),
  //   keyColumn<MyRow, 'name'>('name', {
  //     title: 'Name',
  //     ...textColumn,
  //   }),
  //   keyColumn<MyRow, 'name'>('name', {
  //     title: 'Name',
  //     ...textColumn,
  //   }),
  //   keyColumn<MyRow, 'name'>('name', {
  //     title: 'Name',
  //     ...textColumn,
  //   }),
  //   keyColumn<MyRow, 'name'>('name', {
  //     title: 'Name',
  //     ...textColumn,
  //   }),
  //   keyColumn<MyRow, 'name'>('name', {
  //     title: 'Name',
  //     ...textColumn,
  //   }),
  //   keyColumn<MyRow, 'name'>('name', {
  //     title: 'Name',
  //     ...textColumn,
  //   }),
  //   keyColumn<MyRow, 'name'>('name', {
  //     title: 'Name',
  //     ...textColumn,
  //   }),
  //   keyColumn<MyRow, 'name'>('name', {
  //     title: 'Name',
  //     ...textColumn,
  //   }),
  //   keyColumn<MyRow, 'name'>('name', {
  //     title: 'last23',
  //     ...textColumn,
  //   }),
  // ];


                {/* <div style={{ height: '400px', overflow: 'auto' }}> */}
                  // <ERPReactDataGrid<MyRow> data={data} setData={setData} columns={columns} />
                {/* </div> */}
