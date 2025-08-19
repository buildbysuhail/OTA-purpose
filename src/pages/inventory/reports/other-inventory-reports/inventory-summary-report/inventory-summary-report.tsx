import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, {
  DrillDownCellTemplate,
  SummaryConfig,
} from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import { useMemo, useState } from "react";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import InventorySummaryReportFilter, {
  InventorySummaryReportFilterInitialState,
} from "./inventory-summary-report-filter";
import Urls from "../../../../../redux/urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import InventorySummaryReportMonthwise from "./inventory-summary-report-monthwise";

const InventorySummaryReport = () => {
   const[filter, setFilter] = useState<any>(InventorySummaryReportFilterInitialState);
  const userSession = useSelector((state: RootState) => state.UserSession);
  const clientSession = useSelector((state: RootState) => state.ClientSession);
  const { t } = useTranslation("accountsReport");
  const columns: DevGridColumn[] = useMemo(() => {
    const baseColumns: DevGridColumn[] = [
      {
        dataField: "voucherTypeName",
        caption: t("voucher_name"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 250,
        showInPdf: true,
         cellRender: (cellElement: any, cellInfo: any) => {
          return (
            <DrillDownCellTemplate
              data={cellElement}
              field="voucherTypeName"
            ></DrillDownCellTemplate>
          );
        },
      },
      {
        dataField: "formType",
        caption: t("form_type"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,

        visible:true,
      },
      {
        dataField: "voucherForm",
        caption: t("form_type"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
        visible:true,
      },
      {
        dataField: "branchName",
        caption: t("branch"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        //   visible: false,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "amount",
        caption: t("amount"),
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
              cellElement.data?.amount == null
                ? 0
                : getFormattedValue(cellElement.data.amount, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.amount == null
              ? 0
              : getFormattedValue(cellElement.data.amount, false, 4);
          }
        },
      },
      {
        dataField: "branchID",
        caption: t("branch_id"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        visible: false,
        width: 100,
      },
      {
        dataField: "voucherType",
        caption: t("voucher_type"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        visible: false,
        width: 100,
      },
    ];
    return baseColumns
      .filter((column) => {
        if (column.dataField == "formType"&&clientSession.isAppGlobal) {
          return false;
        }
         if (column.dataField == "voucherForm"&&!clientSession.isAppGlobal) {
          return false;
        }
        return true;
      })
      .map((column) => {
        if (column.dataField == "branchName") {
          return {
            ...column,
            visible: userSession.userTypeCode == "CA",
          };
        }
        // if (column.dataField == "formType") {
        //   return {
        //     ...column,
        //     dataField: clientSession.isAppGlobal ? "voucherForm" : "formType",
        //   };
        // }
        return column;
      });
  }, [t, userSession.userTypeCode]);
  const { getFormattedValue } = useNumberFormat();
  //   const customizeSummaryRow = useMemo(() => {
  //     return (itemInfo: { value: any }) => {
  //       const value = itemInfo.value;
  //       if (
  //         value === null ||
  //         value === undefined ||
  //         value === "" ||
  //         isNaN(value)
  //       ) {
  //         return "0";
  //       }
  //       return getFormattedValue(value) || "0";
  //     };
  //   }, [getFormattedValue]);

  //   const summaryItems: SummaryConfig[] = [
  //     {
  //       column: "amount",
  //       summaryType: "sum",
  //       valueFormat: "currency",
  //       customizeText: customizeSummaryRow,
  //     },
  //   ];

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              {/* {userSession.userTypeCode} */}
              {/* {clientSession.isAppGlobal.toString()} */}
              <ErpDevGrid
                // summaryItems={summaryItems}
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                columns={columns}
                
                filterText="{branchID > 0 &&   Branch : [branch]} 
                            {branchID <= 0 &&   of All Branch}"
                gridHeader={t("inventory_summary_report")}
                dataUrl={Urls.inventory_summary_report}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<InventorySummaryReportFilter />}
                filterWidth={350}
                filterHeight={150}
                filterInitialData={{
                  ...InventorySummaryReportFilterInitialState,
                  branchID:
                    userSession.userTypeCode == "CA"
                      ? -1
                      : userSession.currentBranchId,
                }}
                reload={true}
                                onFilterChanged={(filter: any) => {
                  setFilter(filter);
                }}
                gridId="grd_inventory_summary_report"
                 childPopupProps={{
                  content: <InventorySummaryReportMonthwise />,
                  title: "Inventory Report (Month View)",
                  isForm: false,
                  width: 1000,
                  drillDownCells: "voucherTypeName",
                  bodyProps: "voucherType,branchID,formType,voucherTypeName,branchName",
                }}
                postData={{
                  ...filter,
                  toDate: filter.asonDate,
                  fromDate:userSession.finFrom
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default InventorySummaryReport;
