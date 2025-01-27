import React from 'react';
import { DevGridColumn } from '../components/types/dev-grid-column';
import { formatDate } from 'devextreme/localization';
import ERPDevGrid, { SummaryConfig } from '../components/ERPComponents/erp-dev-grid';

const TotalSummary: React.FC = () => {
    const orders = [
        {
            ID: 1,
            OrderNumber: 35703,
            OrderDate: '2014-04-10',
            SaleAmount: 11800,
            Terms: '15 Days',
            TotalAmount: 12175,
            CustomerStoreState: 'California',
            CustomerStoreCity: 'Los Angeles',
            Employee: 'Harv Mudd',
            
        },
        {
            ID: 4,
            OrderNumber: 35711,
            OrderDate: '2014-01-12',
            SaleAmount: 16050,
            Terms: '15 Days',
            TotalAmount: 16550,
            CustomerStoreState: 'California',
            CustomerStoreCity: 'San Jose',
            Employee: 'Jim Packard',
        },
        {
            ID: 4,
            OrderNumber: 35711,
            OrderDate: '2014-01-12',
            SaleAmount: 16050,
            Terms: '15 Days',
            TotalAmount: 16550,
            CustomerStoreState: 'California',
            CustomerStoreCity: 'San Jose',
            Employee: 'Jim Packard',
        },
    ];

    const columns: DevGridColumn[] = [
        {
            dataField: 'OrderNumber',
            caption: 'Invoice Number',
            dataType: 'number',
            allowSorting: true,
            allowFiltering: true,
            width: 150,
            alignment: 'left'
        },
        {
            dataField: 'OrderDate',
            caption: 'Order Date',
            dataType: 'date',
            allowSorting: true,
            allowFiltering: true,
            width: 150,
            alignment: 'left',
            cellRender: (cellInfo) => {
                return cellInfo.value ? formatDate(new Date(cellInfo.value), 'MMM dd, yyyy') : '';
            }
        },
        {
            dataField: 'Employee',
            caption: 'Employee',
            dataType: 'string',
            allowSorting: true,
            allowFiltering: true,
            alignment: 'left' ,
            width: 150,
        },
        {
            dataField: 'CustomerStoreCity',
            caption: 'City',
            dataType: 'string',
            allowSorting: true,
            allowFiltering: true,
            alignment: 'left', width: 150,
        },
        {
            dataField: 'TotalAmount',
            caption: 'TotalAmount',
            dataType: 'number',
            allowSorting: true,
            allowFiltering: true,
             width: 150,
        },
        {
            dataField: 'CustomerStoreState',
            caption: 'State',
            dataType: 'string',
            allowSorting: true,
            allowFiltering: true,
            alignment: 'left', width: 150,
        },

        {
            dataField: 'SaleAmount',
            caption: 'Sale Amount',
            dataType: 'number',
            allowSorting: true,
            allowFiltering: true,
            alignment: 'right',
             width: 150,
            cellRender: (cellInfo) => `$${cellInfo.value.toLocaleString('en-UK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        }
    ];
const summaryItems: SummaryConfig[] = [
  {
    column: 'TotalAmount',
    summaryType: "sum",
    valueFormat: "currency",
    customizeText: (itemInfo) => `Total: $${itemInfo.value.toFixed(2)}`
  },
  {
    column: 'SaleAmount',
    summaryType: "sum",
    valueFormat: "currency",
    customizeText: (itemInfo) => `Sales Total: $${itemInfo.value.toFixed(2)}`
  },
  {
    column: 'OrderDate',
    summaryType: "min",
    valueFormat: "longDate",
    customizeText: (itemInfo) => `Earliest Order: ${formatDate(new Date(itemInfo.value), 'MMMM dd, yyyy')}`
  },
  {
    column: 'OrderDate',
    summaryType: "max",
    valueFormat: "longDate",
    customizeText: (itemInfo) => `Latest Order: ${formatDate(new Date(itemInfo.value), 'MMMM dd, yyyy')}`
  },
  {
    column: 'CustomerStoreState',
    summaryType: "count",
    customizeText: (itemInfo) => `Total States: ${itemInfo.value}`
  }
];

    return (
        <div className='p-10'>
     <ERPDevGrid
            columns={columns}
            data={orders}
            gridId="order-summary-grid"
            summaryItems={summaryItems}
            allowPaging={true}
            pageSize={10}
            allowExport={true}
            remoteOperations={false}
            className="w-full"
            hideGridAddButton={true}
        />
        </div>
    
    );
};

export default TotalSummary;