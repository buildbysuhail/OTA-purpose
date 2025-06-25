import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import { FC, useMemo } from "react";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import ServiceReportFilter, {
  ServiceReportFilterInitialState,
} from "./service-report-filter";
import Urls from "../../../../../redux/urls";
import moment from "moment";

const ServiceReport = () => {
  const { t } = useTranslation("accountsReport");
  const columns: DevGridColumn[] = [
    {
      dataField: "jobCardNo",
      caption: t("job_card_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "orderDate",
      caption: t("order_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        return cellElement.data.orderDate == null ||
          cellElement.data.orderDate == ""
          ? ""
          : moment(cellElement.data.orderDate, "DD-MM-YYYY").format(
              "DD-MMM-YYYY"
            );
      },
    },
    {
      dataField: "invoiceDate",
      caption: t("invoice_date"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        return cellElement.data.invoiceDate == null ||
          cellElement.data.invoiceDate == ""
          ? ""
          : moment(cellElement.data.invoiceDate, "DD-MM-YYYY").format(
              "DD-MMM-YYYY"
            );
      },
    },
    {
      dataField: "customerName",
      caption: t("customer_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      showInPdf: true,
    },
    {
      dataField: "address1",
      caption: t("address"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      showInPdf: true,
    },
    {
      dataField: "mobile",
      caption: t("mobile"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "serviceName",
      caption: t("service_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      showInPdf: true,
    },
    {
      dataField: "isWarranty",
      caption: t("warranty"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
    },
    {
      dataField: "serviceDoneDate",
      caption: t("service_done_date"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        return cellElement.data.serviceDoneDate == null ||
          cellElement.data.serviceDoneDate == ""
          ? ""
          : moment(cellElement.data.serviceDoneDate, "DD-MM-YYYY").format(
              "DD-MMM-YYYY"
            );
      },
    },
    {
      dataField: "status",
      caption: t("status"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "closingRemarks",
      caption: t("closing_remarks"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      showInPdf: true,
    },
    {
      dataField: "billedRate",
      caption: t("billed_rate"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.billedRate == null
              ? ""
              : getFormattedValue(cellElement.data.billedRate, false, 2);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.billedRate == null
            ? ""
            : getFormattedValue(cellElement.data.billedRate, false, 2);
        }
      },
    },
    {
      dataField: "invSpareTotal",
      caption: t("inv_spare_total"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.invSpareTotal == null
              ? ""
              : getFormattedValue(cellElement.data.invSpareTotal, false, 2);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.invSpareTotal == null
            ? ""
            : getFormattedValue(cellElement.data.invSpareTotal, false, 2);
        }
      },
    },
    {
      dataField: "profit",
      caption: t("profit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.profit == null
              ? ""
              : getFormattedValue(cellElement.data.profit, false, 2);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.profit == null
            ? ""
            : getFormattedValue(cellElement.data.profit, false, 2);
        }
      },
    },
    {
      dataField: "branchName",
      caption: t("branch_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
  ];

  const { getFormattedValue } = useNumberFormat();
  const customizeSummaryRow = useMemo(() => {
    return (itemInfo: { value: any }) => {
      const value = itemInfo.value;
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        isNaN(value)
      ) {
        return "0";
      }
      return getFormattedValue(value) || "0";
    };
  }, [getFormattedValue]);
  const customizeDate = (itemInfo: any) => `TOTAL`;
  const summaryItems: SummaryConfig[] = [
    {
      column: "serviceName",
      summaryType: "max",
      customizeText: customizeDate,
    },
    {
      column: "billedRate",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "invSpareTotal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "profit",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
  ];

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                summaryItems={summaryItems}
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                  filterText="Between : {fromDate} - {toDate} {serviceID > 0 &&  Service : [service]} {isWarrantyService=='Y' &&  Warranty Only} {isWarrantyService=='N' && Non Warranty Only}"
                columns={columns}
                
                gridHeader={t("service_report")}
                dataUrl={Urls.service_report}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<ServiceReportFilter />}
                filterWidth={600}
                filterHeight={320}
                filterInitialData={ServiceReportFilterInitialState}
                reload={true}
                gridId="grd_service_report"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ServiceReport;
