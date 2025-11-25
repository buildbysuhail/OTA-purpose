/**
 * Reports Tab - Service Transaction Reports
 */

import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ERPDatePicker from "../../../../../components/ERPComponents/erp-datepicker";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { Search, FileSpreadsheet } from "lucide-react";
import { statusOptions } from "../service-transaction-data";
import { ServiceStatus, ServiceReportFilter } from "../service-transaction-types";
import Urls from "../../../../../redux/urls";
import moment from "moment";
import { ActionType } from "../../../../../redux/types";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";

const ReportsTab: React.FC = () => {
  const { t } = useTranslation("accountsReport");
  const { getFormattedValue } = useNumberFormat();

  const [filter, setFilter] = useState<ServiceReportFilter>({
    fromDate: moment().startOf("month").format("YYYY-MM-DD"),
    toDate: moment().format("YYYY-MM-DD"),
    status: "",
    serviceID: 0,
    isWarrantyService: "",
  });

  const [reload, setReload] = useState(false);

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
      cellRender: (cellElement: any) => {
        return cellElement.data?.orderDate
          ? moment(cellElement.data.orderDate, "DD-MM-YYYY").format("DD-MMM-YYYY")
          : "";
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
      cellRender: (cellElement: any) => {
        return cellElement.data?.invoiceDate
          ? moment(cellElement.data.invoiceDate, "DD-MM-YYYY").format("DD-MMM-YYYY")
          : "";
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
      cellRender: (cellElement: any) => {
        return cellElement.data?.serviceDoneDate
          ? moment(cellElement.data.serviceDoneDate, "DD-MM-YYYY").format("DD-MMM-YYYY")
          : "";
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
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        const value = cellElement.data?.billedRate;
        if (exportCell !== undefined) {
          return {
            ...exportCell,
            text: value == null ? "" : getFormattedValue(value, false, 2),
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        }
        return value == null ? "" : getFormattedValue(value, false, 2);
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
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        const value = cellElement.data?.invSpareTotal;
        if (exportCell !== undefined) {
          return {
            ...exportCell,
            text: value == null ? "" : getFormattedValue(value, false, 2),
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        }
        return value == null ? "" : getFormattedValue(value, false, 2);
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
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        const value = cellElement.data?.profit;
        if (exportCell !== undefined) {
          return {
            ...exportCell,
            text: value == null ? "" : getFormattedValue(value, false, 2),
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        }
        return value == null ? "" : getFormattedValue(value, false, 2);
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

  const customizeSummaryRow = useMemo(() => {
    return (itemInfo: { value: any }) => {
      const value = itemInfo.value;
      if (value === null || value === undefined || value === "" || isNaN(value)) {
        return "0";
      }
      return getFormattedValue(value) || "0";
    };
  }, [getFormattedValue]);

  const customizeDate = () => `TOTAL`;

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

  const handleShow = () => {
    setReload((prev) => !prev);
  };

  const FilterComponent = () => (
    <div className="flex flex-wrap gap-4 items-center mb-4 p-4 bg-gray-50 dark:bg-dark-bg-card rounded-lg">
      <div className="flex items-center gap-2">
        <label className="text-sm">{t("from")}</label>
        <ERPDatePicker
          id="fromDate"
          value={moment(filter.fromDate).toDate()}
          onChange={(date) =>
            setFilter({ ...filter, fromDate: moment(date).format("YYYY-MM-DD") })
          }
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm">{t("to")}</label>
        <ERPDatePicker
          id="toDate"
          value={moment(filter.toDate).toDate()}
          onChange={(date) =>
            setFilter({ ...filter, toDate: moment(date).format("YYYY-MM-DD") })
          }
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm">{t("status")}</label>
        <select
          value={filter.status}
          onChange={(e) =>
            setFilter({ ...filter, status: e.target.value as ServiceStatus | "" })
          }
          className="border rounded px-2 py-1 text-sm w-32"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <ERPButton
        title={t("show")}
        onClick={handleShow}
        startIcon={<Search size={16} />}
        variant="primary"
      />
      <ERPButton
        title=""
        onClick={() => {}}
        startIcon={<FileSpreadsheet size={16} />}
        variant="secondary"
        className="ml-auto"
      />
    </div>
  );

  return (
    <div className="p-4">
      <FilterComponent />
      <div className="border rounded">
        <ErpDevGrid
          summaryItems={summaryItems}
          remoteOperations={{
            filtering: false,
            paging: false,
            sorting: false,
          }}
          filterText={`Between : ${filter.fromDate} - ${filter.toDate}`}
          columns={columns}
          gridHeader={t("service_report")}
          dataUrl={Urls.service_report}
          hideGridAddButton={true}
          enablefilter={false}
          method={ActionType.POST}
          filterInitialData={{
            ...filter,
            fromDate: moment(filter.fromDate).format("DD/MM/YYYY"),
            toDate: moment(filter.toDate).format("DD/MM/YYYY"),
          }}
          reload={reload}
          gridId="grd_service_transaction_report"
        />
      </div>
    </div>
  );
};

export default ReportsTab;
