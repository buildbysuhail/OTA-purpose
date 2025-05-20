import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import { useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import InventoryStatusFilter, { InventoryStatusFilterInitialState } from "./inventory-status-filter";

interface InventoryStatus {
  si: number;
  date: string;
  vchNo: number;
  form: string;
  party: string;
  address1: string;
  address2: string;
  gross: number;
  disc: number;
  billDiscount: number;
  vat: number;
  grandTotal: number;
  converted: number;
  isLocked: number;
  refNo: string;
  refDate: Date;
  salesmanName: string;
  warehouseName: string;
  refNo2: string;
  financialYearID: number;
  mInvoiceNo: string;
  masterID: string;
  branch: string;
  remarks: string;
  branchID: number;
  ledgerID: number;
  routeName: string;
  party_Name: string;
}

const InventoryStatusReport = () => {
  const { t } = useTranslation('accountsReport');
  const columns: DevGridColumn[] = [
    {
      dataField: "si",
      caption: t("si"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 60,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "date",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "vchNo",
      caption: t("vch_no"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "party",
      caption: t("party"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "party_Name",
      caption: t("party_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "address1",
      caption: t("address1"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      visible: false,
      showInPdf: true,
    },
    {
      dataField: "address2",
      caption: t("address2"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      visible: false,
      showInPdf: true,
    },
    {
      dataField: "gross",
      caption: t("gross"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "disc",
      caption: t("disc"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "billDiscount",
      caption: t("bill_discount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "vat",
      caption: t("vat"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "grandTotal",
      caption: t("grand_total"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "converted",
      caption: t("converted"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: false,
      showInPdf: true,
    },
    {
      dataField: "isLocked",
      caption: t("is_locked"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: false,
      showInPdf: true,
    },
    {
      dataField: "refNo",
      caption: t("ref_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "refDate",
      caption: t("ref_date"),
      dataType: "datetime",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "salesmanName",
      caption: t("salesman_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "warehouseName",
      caption: t("warehouse_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "refNo2",
      caption: t("ref_no2"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: false,
      showInPdf: true,
    },
    {
      dataField: "financialYearID",
      caption: t("financial_year_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: false,
      showInPdf: true,
    },
    {
      dataField: "mInvoiceNo",
      caption: t("m_invoice_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: false,
      showInPdf: true,
    },
    {
      dataField: "masterID",
      caption: t("master_id"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: false,
      showInPdf: true,
    },
    {
      dataField: "branch",
      caption: t("branch"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "remarks",
      caption: t("remarks"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "branchID",
      caption: t("branch_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: false,
      showInPdf: true,
    },
    {
      dataField: "ledgerID",
      caption: t("ledger_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: false,
      showInPdf: true,
    },
    {
      dataField: "routeName",
      caption: t("route_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      visible: true,
      showInPdf: true,
    }
  ];
  const { getFormattedValue } = useNumberFormat();
  const customizeSummaryRow = useMemo(() => {
    return (itemInfo: { value: any }) => {
      const value = itemInfo.value;
      if (value === null || value === undefined || value === "" || isNaN(value)) {
        return "0";
      }
      return getFormattedValue(value) || "0";
    };
  }, [getFormattedValue]);

  const summaryItems: SummaryConfig[] = [
    {
      column: "gross",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "disc",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "billDiscount",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "vat",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "grandTotal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    }
  ];

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                summaryItems={summaryItems}
                remoteOperations={{ filtering: false, paging: false, sorting: false }}
                columns={columns}
                moreOption={true}
                gridHeader={t("inventory_status_report")}
                dataUrl={Urls.inventory_status}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<InventoryStatusFilter />}
                filterWidth={500}
                filterHeight={220}
                filterInitialData={InventoryStatusFilterInitialState}
                reload={true}
                gridId="grd_inventory_status"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default InventoryStatusReport;