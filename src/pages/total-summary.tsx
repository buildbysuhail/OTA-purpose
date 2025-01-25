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
            alignment: 'left'
        },
        {
            dataField: 'CustomerStoreCity',
            caption: 'City',
            dataType: 'string',
            allowSorting: true,
            allowFiltering: true,
            alignment: 'left'
        },
        {
            dataField: 'CustomerStoreState',
            caption: 'State',
            dataType: 'string',
            allowSorting: true,
            allowFiltering: true,
            alignment: 'left'
        },
        {
            dataField: 'SaleAmount',
            caption: 'Sale Amount',
            dataType: 'number',
            allowSorting: true,
            allowFiltering: true,
            alignment: 'right',
            cellRender: (cellInfo) => `$${cellInfo.value.toLocaleString('en-UK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        }
    ];
    const summaryItems: SummaryConfig[] = [
        {
            column: 'OrderNumber',
            summaryType: 'count',
            customizeText: (itemInfo) =>`Total Orders: ${itemInfo.value || 0}`,
        },
        {
            column: 'OrderDate',
            summaryType: 'min',
            customizeText: (itemInfo) => {
                if (itemInfo.value) {
                    const dateValue = new Date(itemInfo.value);
                    return `First Order: ${formatDate(dateValue, 'MMM dd, yyyy')}`;
                }
                return 'No orders found';
            }
        },
        {
            column: 'SaleAmount',
            summaryType: 'sum',
            customizeText: (itemInfo) => {
                const totalSales = itemInfo.value || 0;
                return `Total Sales: $${totalSales.toLocaleString('en-UK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
        }
    ];

    return (
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
    );
};

export default TotalSummary;