import { useTranslation } from "react-i18next"
import { FC, Fragment, useMemo } from "react"
import PartyMonthwisePurchaseSummaryReportFilter, { PartyMonthwisePurchaseSummaryReportFilterInitialState } from "./Party-monthwise-purchase-summary-report-filter"
import { DevGridColumn } from "../../../../components/types/dev-grid-column"
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid"
import { ActionType } from "../../../../redux/types"
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format"

interface PartyMonthwiseSummaryReportProps {
  gridHeader: string;
  dataUrl: string;
  gridId: string;
}

const PartyMonthwiseSummaryReport: FC<PartyMonthwiseSummaryReportProps> = ({ gridHeader, dataUrl, gridId }) => {
  const { t } = useTranslation("accountsReport")
  const { getFormattedValue } = useNumberFormat()

  const columns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
      format:'dd-MMM-yyyy'
    },
    {
      dataField: "voucherNumber",
      caption: t("voucher_number"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "partyType",
      caption: t("party_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "partyCode",
      caption: t("party_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "partyName",
      caption: t("party_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      // width: 150,
      showInPdf: true,
    },
    {
      dataField: "branch",
      caption: t("branch"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "warehouse",
      caption: t("warehouse"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "brand",
      caption: t("brand"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "month",
      caption: t("month"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "year",
      caption: t("year"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
      showInPdf: true,
    },
   
    {
      dataField: "addressStreet",
      caption: t("address_street"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf: true,
    },
    {
      dataField: "addressCity",
      caption: t("address_city"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "addressDistrict",
      caption: t("address_district"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "route",
      caption: t("route"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
   
  
   
    {
      dataField: "total",
      caption: t("total"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.total == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.total))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (cellElement.data?.total == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.total)))
        }
      },
    },
    {
      dataField: "salesMan",
      caption: t("sales_man"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "grandTotal",
      caption: t("grand_total"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      showInPdf: true,
      alignment: "right",
      format: "fixedPoint",
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.grandTotal == null
              ? ""
              : getFormattedValue(Number.parseFloat(cellElement.data.grandTotal))
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          }
        } else {
          return (cellElement.data?.grandTotal == null ? "" : getFormattedValue(Number.parseFloat(cellElement.data.grandTotal)))
        }
      },
    },
  ];
   
    const customizeSummaryRow = useMemo(() => {
        return (itemInfo: { value: any }) => {
          const value = itemInfo.value;
          if (
            value === null ||
            value === undefined ||
            value === "" ||
            isNaN(value)
          ) {
            return "0"; // Ensure "0" is displayed when value is missing
          }
          return getFormattedValue(value) || "0"; // Ensure formatted output or fallback to "0"
        };
      }, []);
    const summaryItems: SummaryConfig[] = [
        {
          column: "partyType",
          summaryType: "custom",
          valueFormat: "string",
          displayFormat: "TOTAL",
        },
        {
          column: "total",
          summaryType: "sum",
          valueFormat: "currency",
          customizeText: customizeSummaryRow,
        },
         {
          column: "grandTotal",
          summaryType: "sum",
          valueFormat: "currency",
          customizeText: customizeSummaryRow,
        },
      ];
  

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                summaryItems={summaryItems}
                   remoteOperations={{ filtering: true, paging: true, sorting: true,summary:true }}
                  columns={columns}
                  filterText="from {fromDate} to {toDate}"
                  gridHeader={t(gridHeader)}
                  dataUrl={dataUrl}
                  method={ActionType.POST}
                  gridId={gridId}
                  enablefilter={true}
                  showFilterInitially={true}
                  filterWidth={450}
                  filterHeight={150}
                  filterContent={<PartyMonthwisePurchaseSummaryReportFilter />}
                  filterInitialData={PartyMonthwisePurchaseSummaryReportFilterInitialState}
                  hideGridAddButton={true}
                  reload={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default PartyMonthwiseSummaryReport

