import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import { useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import VoidReportFilter, { VoidReportFilterInitialState } from "./void-report-filter";

interface VoidReport {
  counter: string;
  user: string;
  date: string;
  barcode: string;
  product: string;
  qty: number;
  total: number;
  status: string;
  systemDate: Date;
  systemName: string;
  shiftName: string;
  voucherNo: string;
  prefix: string;
}

const VoidReport = () => {
  const { t } = useTranslation('accountsReport');
  const columns: DevGridColumn[] = [
    {
      dataField: "counter",
      caption: t("counter"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 75,
    },
    {
      dataField: "user",
      caption: t("user"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 50,
    },
    {
      dataField: "date",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 75,
    },
    {
      dataField: "barcode",
      caption: t("barcode"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 67,
    },
    {
      dataField: "product",
      caption: t("product"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 350,
    },
    {
      dataField: "qty",
      caption: t("quantity"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 60,
    },
    {
      dataField: "total",
      caption: t("total"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 80,
    },
    {
      dataField: "status",
      caption: t("status"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 80,
    },
    {
      dataField: "systemDate",
      caption: t("system_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 110,
    },
    {
      dataField: "systemName",
      caption: t("system_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 105,
    },
    {
      dataField: "shiftName",
      caption: t("shift_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 75,
    },
    {
      dataField: "voucherNo",
      caption: t("voucher_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 100,
    },
    {
      dataField: "prefix",
      caption: t("prefix"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      width: 100,
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
      column: "total",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "qty",
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
                gridHeader={t("void_report")}
                dataUrl={Urls.void_report}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<VoidReportFilter />}
                filterWidth={600}
                filterHeight={340}
                filterInitialData={VoidReportFilterInitialState}
                reload={true}
                gridId="grd_void_report"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default VoidReport;