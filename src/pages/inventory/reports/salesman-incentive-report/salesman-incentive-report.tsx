import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import { useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import SalesmanIncentiveReportFilter, { SalesmanIncentiveReportFilterInitialState } from "./salesman-incentive-report-filter";
import Urls from "../../../../redux/urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import moment from "moment";

const SalesmanIncentiveReport = () => {
    const { t } = useTranslation('accountsReport');
     const userSession = useSelector((state: RootState) => state.UserSession);
    const columns: DevGridColumn[] = [
        {
            dataField: "billNo",
            caption: t("bill_no"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 75,
            showInPdf:true,
        },
        {
            dataField: "date",
            caption: t("date"),
            dataType: "date",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            showInPdf:true,
            format:"dd-MMM-yyyy"
        },
        {
            dataField: "billAmount",
            caption: t("bill_amount"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            showInPdf:true,
        cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.billAmount == null
              ? ""
              : getFormattedValue(cellElement.data.billAmount, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.billAmount == null
            ? ""
            : getFormattedValue(cellElement.data.billAmount, false, 4);
        }
      },
    },
        {
            dataField: "smIncentive",
            caption: t("sm_incentive"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            showInPdf:true,
       cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.smIncentive == null
              ? ""
              : getFormattedValue(cellElement.data.smIncentive, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.smIncentive == null
            ? ""
            : getFormattedValue(cellElement.data.smIncentive, false, 4);
        }
      },
    },
    ];
const customizeTotal = (itemInfo: any) => `TOTAL`;
    const { getFormattedValue } = useNumberFormat();
    const customizeSummaryRow = useMemo(() => {
        return (itemInfo: { value: any }) => {
            const value = itemInfo.value;
            if (value === null || value === undefined || value === "" || isNaN(value)) {
                return "0";
            }
            return getFormattedValue(value,false,2) || "0";
        };
    }, [getFormattedValue]);

    const summaryItems: SummaryConfig[] = [
        {
            column: "billNo",
            summaryType: "max",
            customizeText: customizeTotal,
        },
        {
            column: "smIncentive",
            summaryType: "sum",
            valueFormat: "currency",
            customizeText: customizeSummaryRow,
        }
    ];

    return (
        <Fragment>
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
                    <div className="px-4 pt-4 pb-2">
                        <div className="grid grid-cols-1 gap-3">
                            <ErpDevGrid
                                summaryItems={summaryItems}
                                remoteOperations={{ filtering: false, paging: false, sorting: false }}
                                columns={columns}
                                 filterText="{employee > 0 && : [employeeName]} {employee <= 0 && : All} From {fromDate} To {toDate}"
                                gridHeader={t("salesman_incentive_report_of_salesman")}
                                dataUrl={Urls.salesman_incentive_report}
                                hideGridAddButton={true}
                                enablefilter={true}
                                method={ActionType.POST}
                                filterContent={<SalesmanIncentiveReportFilter />}
                                filterWidth={600}
                                filterHeight={250}
                                filterInitialData={{...SalesmanIncentiveReportFilterInitialState,
                                    fromDate:moment(userSession.finFrom).local().startOf("day"),
                                }}
                                reload={true}
                                gridId="grd_salesman_incentive_report"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default SalesmanIncentiveReport;